import { Instrument_Serif, DM_Sans, DM_Mono } from "next/font/google"

// Instrument Serif - brandbook display serif (headings, prose, wordmark)
const InstrumentSerifFont = Instrument_Serif({
	subsets: ["latin"],
	variable: "--font-instrument-serif",
	display: "swap",
	weight: ["400"],
	style: ["normal", "italic"],
})

// DM Sans - clean sans-serif for dense UI elements, labels, stats
const DMSansFont = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	display: "swap",
	weight: ["400", "500", "600", "700"],
})

// DM Mono - kept for explicit numeric/technical monospace; the brandbook label
// face is Courier New, set on --font-mono in globals.css.
const DMMonoFont = DM_Mono({
	subsets: ["latin"],
	variable: "--font-dm-mono",
	display: "swap",
	weight: ["400", "500"],
})

export { InstrumentSerifFont, DMSansFont, DMMonoFont }
