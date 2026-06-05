// Bridge between the centralized XORS identity service (api.xors.xyz) and
// Surpass's local data model.
//
// The find-by-xorsId → find-by-email (legacy) → create ordering and the
// session-cookie + viewer-fetch plumbing now live in the shared SDK
// (`@xors-software/identity`). This module supplies the Surpass-specific
// `IdentityStore` adapter (the SQL against the local `users` table) and keeps
// the legacy `reps_session` fallback for users who predate xors centralization.
//
// Surpass keeps a thin local users row only as the FK target for its own data
// (quizzes, generated_questions, etc.); email + display name are mirrored from
// the viewer and resynced on drift.

import {
	createIdentityBridge,
	type IdentityStore,
} from "@xors-software/identity";
import { getUserBySession, readSessionToken } from "./auth";
import { sql } from "./pg";

const XORS_API_URL =
	process.env.XORS_API_URL ||
	process.env.NEXT_PUBLIC_XORS_API_URL ||
	"https://api.xors.xyz";

export interface SurpassUser {
	// Surpass-internal id used by every FK in the local schema. NEVER the
	// xors viewer.id directly — keeping a stable indirection means we could
	// swap providers later without rewriting every quizzes.user_id.
	id: string;
	email: string;
	displayName: string | null;
	createdAt: string;
	xorsUserId: string;
}

function generateLocalUserId(): string {
	return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

interface LocalUserRow {
	id: string;
	email: string;
	display_name: string | null;
	created_at: string;
	xors_user_id: string | null;
}

function rowToUser(r: LocalUserRow): SurpassUser {
	return {
		id: r.id,
		email: r.email,
		displayName: r.display_name,
		createdAt: r.created_at,
		// Safe: every path returning a SurpassUser has ensured xors_user_id is set.
		xorsUserId: r.xors_user_id as string,
	};
}

/**
 * Maps a XORS viewer onto Surpass's local `users` table. The SDK bridge owns
 * the lookup ordering and calls these in order: findByXorsId → (refreshDrift)
 * → findByEmail → linkExistingByEmail → create. `viewer` is the SDK's
 * NormalizedViewer ({ xorsId, email (lowercased), displayName }).
 */
const surpassUserStore: IdentityStore<SurpassUser> = {
	async findByXorsId(xorsId) {
		const rows = await sql<LocalUserRow[]>`
			SELECT id, email, display_name, created_at, xors_user_id
			FROM users WHERE xors_user_id = ${xorsId}
		`;
		return rows.length > 0 ? rowToUser(rows[0]) : null;
	},

	async refreshDrift(user, viewer) {
		// Lazily resync email/display_name if they changed at the xors level.
		if (
			viewer.email &&
			(user.email !== viewer.email || user.displayName !== viewer.displayName)
		) {
			await sql`
				UPDATE users SET email = ${viewer.email}, display_name = ${viewer.displayName}
				WHERE id = ${user.id}
			`;
			return { ...user, email: viewer.email, displayName: viewer.displayName };
		}
		return user;
	},

	async findByEmail(email) {
		const rows = await sql<LocalUserRow[]>`
			SELECT id, email, display_name, created_at, xors_user_id
			FROM users WHERE email = ${email}
		`;
		return rows.length > 0 ? rowToUser(rows[0]) : null;
	},

	async linkExistingByEmail(user, viewer) {
		// Stamp the xors id onto a legacy row found by email.
		await sql`
			UPDATE users
			SET xors_user_id = ${viewer.xorsId},
			    display_name = COALESCE(${viewer.displayName}, display_name)
			WHERE id = ${user.id}
		`;
		return {
			...user,
			xorsUserId: viewer.xorsId,
			displayName: viewer.displayName ?? user.displayName,
		};
	},

	async create(viewer) {
		const id = generateLocalUserId();
		const inserted = await sql<LocalUserRow[]>`
			INSERT INTO users (id, email, display_name, xors_user_id)
			VALUES (${id}, ${viewer.email}, ${viewer.displayName}, ${viewer.xorsId})
			RETURNING id, email, display_name, created_at, xors_user_id
		`;
		return rowToUser(inserted[0]);
	},
};

const identityBridge = createIdentityBridge(surpassUserStore, {
	apiUrl: XORS_API_URL,
});

/**
 * Resolve the current user. Two paths during the migration window:
 *
 *   1. xors_session cookie → SDK bridge fetches the viewer from api.xors.xyz
 *      and find-or-creates the local row (steady state for post-migration users).
 *   2. reps_session cookie → legacy local auth_sessions lookup (users who
 *      predate xors centralization and haven't been migrated yet).
 *
 * If both are present, xors wins. Returns null if neither resolves.
 */
export async function resolveCurrentUser(
	headers: Headers,
): Promise<SurpassUser | null> {
	// 1. xors path — the bridge returns null when there's no xors_session
	//    cookie or the viewer doesn't resolve, so we fall through to legacy.
	try {
		const user = await identityBridge.resolveUserFromHeaders(headers);
		if (user) return user;
	} catch (err) {
		console.error(
			"[xors] identity bridge failed:",
			err instanceof Error ? err.message : err,
		);
		// Fall through to local — better than 401'ing if local resolves.
	}

	// 2. legacy local path (reps_session)
	const repsToken = readSessionToken(headers);
	if (!repsToken) return null;
	const localUser = await getUserBySession(repsToken);
	if (!localUser) return null;
	return {
		id: localUser.id,
		email: localUser.email,
		displayName: localUser.displayName,
		createdAt: localUser.createdAt,
		// Legacy users have no xors id yet. Empty string is a flag the rest of
		// the app ignores (nothing reads xorsUserId outside this module).
		xorsUserId: "",
	};
}
