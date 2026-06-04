import { ImageResponse } from "next/og"

export const alt = "Surpass — AI certification prep by XORS"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const ICONMARK_PATH =
	"M111.82 0C134.94 0.0001693 153.71 18.7699 153.71 41.8896V181.69C153.71 204.81 134.94 223.58 111.82 223.58H41.8896C18.77 223.58 0.000231268 204.81 0 181.69V153.68C0.000165171 130.56 18.7699 111.79 41.8896 111.79C18.7699 111.79 0.00021062 93.0201 0 69.9004V41.8896C0.000189946 18.7699 18.7699 0.000189971 41.8896 0H111.82ZM265.54 111.79C288.66 111.79 307.43 130.56 307.43 153.68V181.69C307.429 204.81 288.66 223.58 265.54 223.58H195.61C172.49 223.58 153.72 204.81 153.72 181.69V41.8896C153.72 18.7698 172.49 0 195.61 0H265.54C288.66 2.47758e-05 307.429 18.7698 307.43 41.8896V69.9004C307.429 93.0202 288.66 111.79 265.54 111.79Z"

// Brandbook display serif for the wordmark. Network-loaded at render; falls back
// to a mark-only image if the font CDN is unreachable (so the route never 500s).
async function loadInstrumentSerif(): Promise<ArrayBuffer | null> {
	try {
		const css = await fetch("https://fonts.googleapis.com/css2?family=Instrument+Serif").then((r) =>
			r.text(),
		)
		const url = css.match(/src:\s*url\(([^)]+)\)\s*format/)?.[1]
		if (!url) return null
		return await fetch(url).then((r) => r.arrayBuffer())
	} catch {
		return null
	}
}

const Mark = ({ w, h }: { w: number; h: number }) => (
	<svg width={w} height={h} viewBox="0 0 307.43 223.58" fill="#E85328">
		<path d={ICONMARK_PATH} />
	</svg>
)

export default async function Image() {
	const font = await loadInstrumentSerif()

	if (!font) {
		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#1C1C1A",
				}}
			>
				<Mark w={360} h={262} />
			</div>,
			size,
		)
	}

	return new ImageResponse(
		<div
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				background: "#1C1C1A",
				padding: "72px 80px",
				fontFamily: "Instrument Serif",
			}}
		>
			<Mark w={132} h={96} />
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ fontSize: 128, color: "#FAF8EA", lineHeight: 1 }}>Surpass</div>
				<div style={{ fontSize: 36, color: "#E85328", marginTop: 20 }}>
					AI certification prep · by XORS
				</div>
			</div>
			<div style={{ fontSize: 28, color: "rgba(250,248,234,0.55)" }}>surpass.xors.xyz</div>
		</div>,
		{ ...size, fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }] },
	)
}
