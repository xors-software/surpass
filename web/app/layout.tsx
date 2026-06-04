import "./globals.css"
import "./custom.css"
import { cn } from "@/utils/cn"
import { APP_CONFIG } from "@/config"
import type { Metadata } from "next"
import { InstrumentSerifFont, DMSansFont, DMMonoFont } from "@/fonts/fonts"
import { Toaster } from "@/components/toasts/Toaster"
import AnalyticsProvider from "./components/AnalyticsProvider"

export const metadata: Metadata = {
	metadataBase: new URL(APP_CONFIG.URL),
	title: `${APP_CONFIG.NAME} — Pass the Anthropic Claude Code certification`,
	description: APP_CONFIG.DESCRIPTION,
	openGraph: {
		title: APP_CONFIG.NAME,
		description: APP_CONFIG.DESCRIPTION,
		url: APP_CONFIG.URL,
		siteName: APP_CONFIG.NAME,
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: APP_CONFIG.NAME,
		description: APP_CONFIG.DESCRIPTION,
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={cn(InstrumentSerifFont.variable, DMSansFont.variable, DMMonoFont.variable)}>
			<body className="font-serif antialiased bg-[#1C1C1A] text-[#FAF8EA]">
				<AnalyticsProvider>
					{children}
					<Toaster />
				</AnalyticsProvider>
			</body>
		</html>
	)
}
