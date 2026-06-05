/**
 * OAuth callback handler. api.xors.xyz redirects users here after Google
 * consent with `?key=<encrypted>`; we decrypt it (the user's xors API key),
 * set it as an HttpOnly `xors_session` cookie, and bounce into the app.
 *
 * This is now a thin binding over `@xors-software/identity-next`'s
 * `createOAuthRouteHandler`, which owns the whole flow — forwarded-host
 * resolution (Railway proxies the internal host), v2/legacy auto-detecting
 * decrypt (keys from `API_AES_KEY` / `API_IV_KEY`), the `xors_session` cookie,
 * open-redirect-safe `next_hint` handling, and the `/login?error=…` failure
 * paths (`oauth_no_key` / `oauth_decrypt` / `oauth_empty_key`).
 */

import { createOAuthRouteHandler } from "@xors-software/identity-next";

const handler = createOAuthRouteHandler({
	// Where a successful sign-in lands when there's no same-app `next_hint`.
	defaultDestination: "/claude-code/quiz",
	loginPath: "/login",
	cookieMaxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
	// Read once by the destination page to fire a PostHog `signed_in` event.
	signedInFlag: { param: "signed_in", value: "google" },
});

// Node runtime — the decrypt uses Node's `crypto`, unavailable on Edge.
// Must be a static string literal so Next can parse it at compile time
// (it matches the SDK handler's `runtime: "nodejs"`).
export const runtime = "nodejs";
export const GET = handler.GET;
