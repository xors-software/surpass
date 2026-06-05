/**
 * XORS centralized identity integration for Surpass.
 *
 * This module is now a thin adapter over `@xors-software/identity` — the shared
 * SDK owns the actual crypto (v2 GCM / legacy CTR auto-detect), viewer
 * resolution, sign-in URL building, and email/password auth. These wrappers
 * keep call sites stable and centralize Surpass's config (api URL, auth source,
 * OAuth domain key). Frozen auth-contract values (REDIRECT_MAGISTER,
 * surpass.xors.xyz, xors_session) are unchanged.
 *
 * Note: the `/oauth` callback route uses `@xors-software/identity-next`'s
 * `createOAuthRouteHandler` directly (see app/oauth/route.ts).
 */

import {
	createXorsClient,
	decryptOAuthPayload as sdkDecryptOAuthPayload,
	XORS_SESSION_COOKIE,
	type XorsAuthError,
	type XorsAuthSuccess,
	type XorsClientConfig,
	type XorsViewer,
} from "@xors-software/identity";

export { XORS_SESSION_COOKIE };
export type { XorsViewer };

export function getXorsApiUrl(): string {
	return (
		process.env.XORS_API_URL ||
		process.env.NEXT_PUBLIC_XORS_API_URL ||
		"https://api.xors.xyz"
	);
}

// api.xors.xyz tags users with this so it knows which apps they've signed in to.
export function getXorsAuthSource(): string {
	return process.env.XORS_AUTH_SOURCE || "surpass.xors.xyz";
}

// Domain key registered in apis/common/constants.ts (REDIRECT_OPTIONS).
export function getOauthDomainKey(): string {
	return process.env.NEXT_PUBLIC_XORS_OAUTH_DOMAIN || "REDIRECT_MAGISTER";
}

function clientConfig(): XorsClientConfig {
	return {
		apiUrl: getXorsApiUrl(),
		source: getXorsAuthSource(),
		domainKey: getOauthDomainKey(),
	};
}

/**
 * Build the link the "Sign in with Google" button points at — a top-level
 * navigation to api.xors.xyz, which runs the OAuth dance and redirects back
 * to this app's `/oauth` route.
 */
export function buildXorsSignInUrl(nextPath?: string): string {
	return createXorsClient(clientConfig()).buildSignInUrl({
		provider: "google",
		nextPath,
	});
}

/** Decrypt the `/oauth?key=…` payload (v2 GCM / legacy CTR auto-detected). */
export function decryptOAuthPayload(payload: string): string {
	return sdkDecryptOAuthPayload(payload);
}

/** Resolve the current user from a session key; null on any failure. */
export async function fetchXorsViewer(
	sessionKey: string,
): Promise<XorsViewer | null> {
	return createXorsClient(clientConfig()).fetchViewer(sessionKey);
}

/**
 * Email + password sign-in via api.xors.xyz (also sign-up — the identity
 * service find-or-creates the account if the email is new). Returns the
 * session key on success; the caller sets the `xors_session` cookie.
 */
export async function authenticateEmailPassword(
	email: string,
	password: string,
): Promise<XorsAuthSuccess | XorsAuthError> {
	return createXorsClient(clientConfig()).authenticateEmailPassword(
		email,
		password,
	);
}
