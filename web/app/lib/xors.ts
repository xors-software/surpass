/**
 * XORS centralized identity service integration.
 *
 * Surpass defers authentication to api.xors.xyz (the apis/ repo). The flow
 * mirrors the other consumer apps (slopless, seeker, contractor-tracker):
 *
 *   1. /login button → redirects browser to:
 *        https://api.xors.xyz/authenticate-google?domain=REDIRECT_MAGISTER
 *   2. api.xors.xyz handles Google OAuth, finds-or-creates the user in its
 *      own users table, AES-encrypts the user's session key.
 *   3. api.xors.xyz redirects browser back to:
 *        https://surpass.xors.xyz/oauth?key=<aes-encrypted-hex>
 *   4. /oauth route handler (web/app/oauth/route.ts) calls
 *      `decryptOAuthPayload` with the shared API_AES_KEY + API_IV_KEY,
 *      sets the `xors_session` cookie containing the decrypted session key.
 *   5. Subsequent authenticated requests include the cookie. The Surpass
 *      API forwards the cookie value as `X-API-KEY` to
 *      api.xors.xyz/api/users/viewer to resolve the current user.
 *
 * The shared crypto bytes are formatted exactly the same way as the other
 * consumer apps (see contractor-tracker/web/app/lib/decrypt-xors.ts):
 *   - API_AES_KEY: utf-8 string used directly as 32-byte AES key
 *   - API_IV_KEY:  base64 → hex → 16 bytes, AES-CTR IV
 */

import crypto from "node:crypto";

export const XORS_SESSION_COOKIE = "xors_session";

export function getXorsApiUrl(): string {
	// Server-side env var, optionally overridable from the client by
	// NEXT_PUBLIC_XORS_API_URL — but the only place we hit api.xors.xyz
	// directly from the browser is the /authenticate-google redirect link
	// on /login, so the public default is fine.
	return (
		process.env.XORS_API_URL ||
		process.env.NEXT_PUBLIC_XORS_API_URL ||
		"https://api.xors.xyz"
	);
}

// Match the convention slopless/seeker/contractor-tracker use: the source
// is the consumer app's domain. api.xors.xyz tags the user with this so
// it knows which apps a given user has signed in to.
export function getXorsAuthSource(): string {
	return process.env.XORS_AUTH_SOURCE || "surpass.xors.xyz";
}

// Domain key registered in apis/common/constants.ts (REDIRECT_OPTIONS).
// api.xors.xyz uses this to decide where to bounce the user back to after
// Google consent.
export function getOauthDomainKey(): string {
	return process.env.NEXT_PUBLIC_XORS_OAUTH_DOMAIN || "REDIRECT_MAGISTER";
}

// Build the link the "Sign in with Google" button on /login points at.
// Server-side helper so the page can render a real `<a href>` instead of
// going through a fetch (avoids the third-party-cookie dance entirely —
// it's just a top-level navigation).
export function buildXorsSignInUrl(nextPath?: string): string {
	const base = getXorsApiUrl();
	const domain = getOauthDomainKey();
	const params = new URLSearchParams({ domain });
	// The `next` round-trip isn't supported by api.xors.xyz's
	// /authenticate-google flow today (it only carries `redirect_key` in
	// state). We stash `next` in a cookie before redirect and read it on
	// the way back; see web/app/login/page.tsx and /oauth route handler.
	if (nextPath) params.set("next_hint", nextPath);
	return `${base}/authenticate-google?${params.toString()}`;
}

const OAUTH_V2_PREFIX = "v2.";

/**
 * Decrypt the v2 (AES-256-GCM) session payload. Matches apis/common/server.ts
 * `encryptV2` + @xors/identity: GCM key HKDF-derived from API_AES_KEY, wire
 * format `v2.` + base64url(nonce ‖ ct ‖ tag). Throws on a bad auth tag.
 */
function decryptOAuthPayloadV2(payload: string): string {
	const apiAes = process.env.API_AES_KEY;
	if (!apiAes) throw new Error("API_AES_KEY is not set");
	const aesKey = Buffer.from(apiAes, "utf8");
	if (aesKey.length !== 32) {
		throw new Error(`API_AES_KEY must be 32 utf-8 bytes (got ${aesKey.length})`);
	}
	const gcmKey = Buffer.from(
		crypto.hkdfSync("sha256", aesKey, Buffer.alloc(0), "xors-oauth-gcm-v2", 32),
	);
	const raw = Buffer.from(payload.slice(OAUTH_V2_PREFIX.length), "base64url");
	if (raw.length < 12 + 16) throw new Error("v2 payload too short");
	const nonce = raw.subarray(0, 12);
	const tag = raw.subarray(raw.length - 16);
	const ct = raw.subarray(12, raw.length - 16);
	const decipher = crypto.createDecipheriv("aes-256-gcm", gcmKey, nonce);
	decipher.setAuthTag(tag);
	return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

/**
 * Decrypt the session key api.xors.xyz hands us on the /oauth?key=... callback.
 * Auto-detects the format: `v2.` → AES-256-GCM (secure), otherwise the legacy
 * AES-256-CTR hex. The legacy path stays for sessions minted before api.xors.xyz
 * cuts surpass.xors.xyz over to v2.
 *
 * Throws if a required env var is missing or the input is malformed; callers
 * should treat that as "couldn't sign in" and bounce back to /login.
 */
export function decryptOAuthPayload(payload: string): string {
	if (payload.startsWith(OAUTH_V2_PREFIX)) return decryptOAuthPayloadV2(payload);

	const apiAes = process.env.API_AES_KEY;
	const apiIv = process.env.API_IV_KEY;
	if (!apiAes) throw new Error("API_AES_KEY is not set");
	if (!apiIv) throw new Error("API_IV_KEY is not set");

	// Legacy AES-256-CTR. Key/IV byte derivation matches the other XORS apps so a
	// user signed in on one app gets a session key that decrypts here too.
	const keyBytes = Buffer.from(apiAes, "utf8");
	const ivBytes = Buffer.from(apiIv, "base64");
	const ciphertext = Buffer.from(payload, "hex");
	if (keyBytes.length !== 32) {
		throw new Error(`API_AES_KEY must be 32 utf-8 bytes (got ${keyBytes.length})`);
	}
	if (ivBytes.length !== 16) {
		throw new Error(`API_IV_KEY must decode to 16 bytes (got ${ivBytes.length})`);
	}
	const decipher = crypto.createDecipheriv("aes-256-ctr", keyBytes, ivBytes);
	const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
	return decrypted.toString("utf8");
}

export interface XorsViewer {
	id: string;
	email: string;
	username: string | null;
	level: string | number | null;
	verified: number | null;
	data: Record<string, unknown> | null;
	createdAt: string;
	updatedAt: string;
}

/**
 * Resolve the current user from a session key by hitting api.xors.xyz.
 * Returns null on any failure (bad key, network, malformed response) —
 * the caller should treat that as "not authenticated" and clear the
 * cookie.
 */
export async function fetchXorsViewer(sessionKey: string): Promise<XorsViewer | null> {
	if (!sessionKey) return null;
	let key: string;
	try {
		key = decodeURIComponent(sessionKey);
	} catch {
		key = sessionKey;
	}
	try {
		const res = await fetch(`${getXorsApiUrl()}/api/users/viewer`, {
			method: "GET",
			headers: { "X-API-KEY": key, "Content-Type": "application/json" },
			cache: "no-store",
		});
		if (!res.ok) return null;
		const body = (await res.json()) as { viewer?: XorsViewer };
		return body.viewer ?? null;
	} catch {
		return null;
	}
}

/**
 * Email + password sign-in via api.xors.xyz/api/users/authenticate. The
 * xors endpoint also auto-creates the account if the email is new — same
 * find-or-create behavior as the OAuth flow — so this serves as both
 * sign-in and sign-up.
 *
 * Returns the user's xors session key on success. Caller is responsible
 * for setting the `xors_session` cookie with that value.
 */
export async function authenticateEmailPassword(
	email: string,
	password: string,
): Promise<{ key: string } | { error: string }> {
	const res = await fetch(`${getXorsApiUrl()}/api/users/authenticate`, {
		method: "POST",
		headers: { Accept: "application/json", "Content-Type": "application/json" },
		body: JSON.stringify({ email, password, source: getXorsAuthSource() }),
		cache: "no-store",
	});
	let body: { user?: { key?: string }; error?: boolean; message?: string };
	try {
		body = await res.json();
	} catch {
		return { error: "Couldn't reach the auth service. Try again." };
	}
	if (!res.ok || !body.user?.key) {
		return { error: body.message || "Invalid email or password." };
	}
	return { key: body.user.key };
}
