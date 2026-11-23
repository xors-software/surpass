import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

/**
 * The /oauth callback (@xors-software/identity-next >= 0.2.1) after the XORS API
 * moved to better-auth: `?token=` is a one-time token exchanged server-side for
 * the session token; `?key=` (v2 payload) still works for the old API and a
 * rollback.
 */
describe("/oauth", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		delete process.env.XORS_API_URL;
	});

	it("exchanges ?token= with the API and sets xors_session (httpOnly) on a redirect", async () => {
		process.env.XORS_API_URL = "https://api.test";
		const fetchMock = vi.fn(async () =>
			new Response(JSON.stringify({ session: { token: "session-token" } }), {
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const res = await GET(new NextRequest("https://surpass.xors.xyz/oauth?token=one-time&authProvider=google"));

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
		expect(url).toBe("https://api.test/api/auth/one-time-token/verify");
		expect(JSON.parse(String(init.body))).toEqual({ token: "one-time" });

		const location = new URL(res.headers.get("location") as string);
		expect(location.pathname).toBe("/claude-code/quiz");
		expect(location.searchParams.get("token")).toBeNull();
		const cookie = res.cookies.get("xors_session");
		expect(cookie?.value).toBe("session-token");
		expect(cookie?.httpOnly).toBe(true);
	});

	it("a refused token sends the user to /login without a cookie", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 400 })));
		const res = await GET(new NextRequest("https://surpass.xors.xyz/oauth?token=used"));
		expect(res.headers.get("location")).toContain("/login?error=oauth_token");
		expect(res.cookies.get("xors_session")).toBeUndefined();
	});

	it("without ?token= or ?key= it still bounces to /login (oauth_no_key)", async () => {
		const res = await GET(new NextRequest("https://surpass.xors.xyz/oauth"));
		expect(res.headers.get("location")).toContain("/login?error=oauth_no_key");
	});
});
