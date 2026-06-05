import type { CSSProperties } from "react"

// Official XORS iconmark (Figma brandbook Assets frame, node 1:17). Single path,
// rendered with fill="currentColor" so the colour is set by the caller.
const ICONMARK_PATH =
	"M111.82 0C134.94 0.0001693 153.71 18.7699 153.71 41.8896V181.69C153.71 204.81 134.94 223.58 111.82 223.58H41.8896C18.77 223.58 0.000231268 204.81 0 181.69V153.68C0.000165171 130.56 18.7699 111.79 41.8896 111.79C18.7699 111.79 0.00021062 93.0201 0 69.9004V41.8896C0.000189946 18.7699 18.7699 0.000189971 41.8896 0H111.82ZM265.54 111.79C288.66 111.79 307.43 130.56 307.43 153.68V181.69C307.429 204.81 288.66 223.58 265.54 223.58H195.61C172.49 223.58 153.72 204.81 153.72 181.69V41.8896C153.72 18.7698 172.49 0 195.61 0H265.54C288.66 2.47758e-05 307.429 18.7698 307.43 41.8896V69.9004C307.429 93.0202 288.66 111.79 265.54 111.79Z"

export function XorsIconmark({ className, style }: { className?: string; style?: CSSProperties }) {
	return (
		<svg
			className={className}
			style={style}
			viewBox="0 0 307.43 223.58"
			fill="currentColor"
			role="img"
			aria-label="XORS"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d={ICONMARK_PATH} />
		</svg>
	)
}

/**
 * Header brand lockup: the official XORS iconmark + the "XORS / Surpass"
 * wordmark, per the brandbook. Drop-in replacement for the old text-only
 * wordmark in page headers.
 */
export function BrandMark({
	className,
	variant = "dark",
}: {
	className?: string
	/** "dark" (default) for ink backgrounds; "light" for paper/cream backgrounds. */
	variant?: "light" | "dark"
}) {
	// Iconmark + "XORS" stay orange in both; only the secondary wordmark grays
	// flip so the lockup reads on either background.
	const slashColor = variant === "light" ? "#A89F8B" : "#5b564d"
	const wordColor = variant === "light" ? "#6B665C" : "#9b9488"
	return (
		<span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
			<XorsIconmark style={{ height: 15, width: "auto", color: "#E85328" }} />
			<span className="font-sans text-[13px] font-bold text-[#E85328] tracking-[0.08em] uppercase">
				XORS
			</span>
			<span className="font-sans text-xs" style={{ color: slashColor }}>
				/
			</span>
			<span
				className="font-sans text-[13px] font-medium tracking-[0.04em]"
				style={{ color: wordColor }}
			>
				Surpass
			</span>
		</span>
	)
}
