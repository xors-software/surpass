import crypto from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";
import { decryptOAuthPayload } from "./xors";

/**
 * Frozen cross-app vectors generated from @xors/identity (the SDK) with the
 * keys below. They pin the on-the-wire OAuth payload format so any drift
 * between api.xors.xyz (mint), the SDK, and this app (decrypt) is caught —
 * all three must agree byte-for-byte or a user can't sign in.
 */
const AES_KEY = "0123456789abcdef0123456789abcdef"; // 32 utf-8 bytes
const IV_KEY = "MDEyMzQ1Njc4OWFiY2RlZg=="; // base64 → 16 bytes
const PLAINTEXT =
	"XORS-11111111-2222-3333-4444-555555555555-KEY-66666666-7777-8888-9999-aaaaaaaaaaaa";
const V2_VECTOR =
	"v2.PRvmMG5Iup1QeCbg6yJr1vwbNYBXUTjO6KYj1DAZlQUuWaGyKF9oD18TwyadyqfwG_QNw3dSpdVZAG1lxeZd2Bu3am5XZOMr7mQ3OaE-mOQus1h7yrf3ZHh3x1RIz4-5wXc8DRylIt1ftlVSmOM";
const LEGACY_VECTOR =
	"a073c833f13deaa910ae48e7e4f6240787ad454e7c51114a481c387ee8297ba8d195b7ca5adde18266e560341985ec2c2b3b0f6565f1b58abc43ad920b3f1dd356dcaac6605d63e452dc40fea0d506b79073";

/**
 * Local AES-256-GCM encrypt — mirrors apis `encryptV2` / SDK
 * `encryptOAuthPayloadV2`. Used only to prove decrypt is its inverse for
 * arbitrary input; the frozen V2_VECTOR above is what pins the exact format.
 */
function encryptV2(message: string): string {
	const gcmKey = Buffer.from(
		crypto.hkdfSync("sha256", Buffer.from(AES_KEY, "utf8"), Buffer.alloc(0), "xors-oauth-gcm-v2", 32),
	);
	const nonce = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv("aes-256-gcm", gcmKey, nonce);
	const ct = Buffer.concat([cipher.update(message, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return `v2.${Buffer.concat([nonce, ct, tag]).toString("base64url")}`;
}

describe("decryptOAuthPayload", () => {
	beforeEach(() => {
		process.env.API_AES_KEY = AES_KEY;
		process.env.API_IV_KEY = IV_KEY;
	});

	it("decrypts a frozen v2 (AES-256-GCM) vector minted by the SDK", () => {
		expect(decryptOAuthPayload(V2_VECTOR)).toBe(PLAINTEXT);
	});

	it("decrypts a frozen legacy (AES-256-CTR) vector for back-compat", () => {
		expect(decryptOAuthPayload(LEGACY_VECTOR)).toBe(PLAINTEXT);
	});

	it("round-trips arbitrary input through v2", () => {
		const msg = "XORS-deadbeef-cafe-f00d-KEY-0123456789ab";
		expect(decryptOAuthPayload(encryptV2(msg))).toBe(msg);
	});

	it("rejects a tampered v2 payload (auth tag mismatch)", () => {
		const raw = Buffer.from(V2_VECTOR.slice(3), "base64url");
		raw[raw.length - 1] ^= 0xff; // corrupt the auth tag
		expect(() => decryptOAuthPayload(`v2.${raw.toString("base64url")}`)).toThrow();
	});

	it("decrypts v2 without API_IV_KEY (apps drop the legacy IV post-migration)", () => {
		delete process.env.API_IV_KEY;
		expect(decryptOAuthPayload(V2_VECTOR)).toBe(PLAINTEXT);
	});

	it("throws when API_AES_KEY is missing", () => {
		delete process.env.API_AES_KEY;
		expect(() => decryptOAuthPayload(V2_VECTOR)).toThrow(/API_AES_KEY/);
	});
});
