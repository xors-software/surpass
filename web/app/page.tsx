import { BrandMark } from "@/components/brand/BrandMark"
import type { Metadata } from "next"
import Link from "next/link"
import { APP_CONFIG } from "@/config"

export const metadata: Metadata = {
	title: `${APP_CONFIG.NAME} by XORS — AI-Powered Certification Prep`,
	description: APP_CONFIG.DESCRIPTION,
}

const CERTIFICATIONS = [
	{
		name: "Claude Code Cert",
		accent: "#E85328",
		price: "$200",
		tagline: "Pass the Anthropic Claude Code certification",
		description: "Full MC question bank, 50-question mock exam with timer, per-domain dashboard, scenario reader, and adaptive question generation that targets your weak spots.",
		topics: ["Agentic Architecture", "Tool Design & MCP", "Claude Code Workflows", "Prompt Engineering", "Context Management", "6 Scenarios", "5 Domains"],
		stat: "5 domains · 6 scenarios",
		cta: "Drill the exam",
		level: "claude-cert" as const,
		href: "/claude-code",
		badge: "Full prep platform",
	},
	{
		name: "CISSP",
		accent: "#3B7FD4",
		price: "$749",
		tagline: "Think like a security manager, not a test-taker",
		description: "Socratic tutoring across all 8 CISSP domains. The AI tutor forces you to reason through real security decisions. Mock exam and dashboard not yet wired up for this cert.",
		topics: ["Risk Management", "Asset Security", "Architecture", "Network Security", "IAM", "Assessment", "Operations", "Software Security"],
		stat: "8 domains",
		cta: "Practice CISSP",
		level: "cissp" as const,
		href: "/demo/classic?level=cissp",
		badge: "Tutor only",
	},
	{
		name: "OSCP",
		accent: "#D6342E",
		price: "$1,749",
		tagline: "Hack boxes, write reports, pass the exam",
		description: "Socratic pentesting practice with AI-guided scenarios. Enumeration, exploitation, privilege escalation — specific commands. VM labs and mock exam not yet wired up.",
		topics: ["Enumeration", "Exploitation", "Privilege Escalation", "Pivoting", "Active Directory", "Web Attacks", "Report Writing"],
		stat: "7 skill areas",
		cta: "Practice OSCP",
		level: "oscp" as const,
		href: "/demo/classic?level=oscp",
		badge: "Tutor only",
	},
]

const BROKEN_THINGS = [
	{
		stat: "$200–$1,749",
		title: "Per exam attempt",
		description: "Fail once and you're paying again. Most prep tools are another $50–300/mo on top of that.",
	},
	{
		stat: "72%",
		title: "First-time fail rate (OSCP)",
		description: "The pass rate is abysmal because people memorize instead of understanding. Flashcards don't teach you to think.",
	},
	{
		stat: "0",
		title: "Adaptive AI tutors on the market",
		description: "Every cert prep tool is static: question banks, video lectures, practice tests. None of them adapt to what YOU don't understand.",
	},
	{
		stat: "Closed",
		title: "Source exam content",
		description: "ISC2, OffSec, and Anthropic control the content pipeline. We're building the open, AI-native alternative.",
	},
]

const HOW_IT_WORKS = [
	{
		step: "01",
		title: "Pick your certification",
		description: "CISSP, OSCP, or the Anthropic Claude Code cert. Choose a specific domain or skill area to drill.",
	},
	{
		step: "02",
		title: "Face real scenarios",
		description: "Realistic scenarios where you reason through your answer — like the real exam, with the gotchas and trick distractors baked in.",
	},
	{
		step: "03",
		title: "Get Socratic feedback",
		description: "The AI tutor pushes you deeper. It asks WHY, probes edge cases, and teaches when you're stuck — not before.",
	},
	{
		step: "04",
		title: "See your knowledge map",
		description: "Every session produces a per-domain breakdown showing your gaps, misconceptions, and exactly what to study next.",
	},
]

const REPO_URL = "https://github.com/xors-software/surpass"

function GitHubMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
		</svg>
	)
}

export default function Home() {
	return (
		<main className="min-h-dvh bg-[#FAF8EA] text-[#1C1C1A]">
			{/* Nav */}
			<nav className="fixed top-0 w-full z-50 bg-[#FAF8EA]/85 backdrop-blur-md border-b border-[#E8DDC4]">
				<div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<BrandMark variant="light" />
					</div>
					<div className="flex items-center gap-4">
						<Link href="/ai-fundamentals" className="hidden sm:block font-sans text-sm text-[#6B665C] hover:text-[#1C1C1A] transition-colors">AI Fundamentals</Link>
						<Link href="/claude-code/scenarios" className="hidden sm:block font-sans text-sm text-[#6B665C] hover:text-[#1C1C1A] transition-colors">Scenarios</Link>
						<Link href="/claude-code/dashboard" className="hidden sm:block font-sans text-sm text-[#6B665C] hover:text-[#1C1C1A] transition-colors">Dashboard</Link>
						<Link
							href="/claude-code/quiz"
							className="font-sans text-sm font-medium px-4 py-1.5 rounded-lg bg-[#E85328] text-white hover:bg-[#C7401C] transition-colors"
						>
							Try the demo
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="pt-36 pb-24 px-6">
				<div className="max-w-[720px] mx-auto text-center">
					<div className="inline-flex gap-2 mb-8">
						<span className="px-2.5 py-1 rounded-full bg-[#3B7FD4]/10 border border-[#3B7FD4]/35 font-sans text-xs font-medium text-[#2F6BB8]">CISSP</span>
						<span className="px-2.5 py-1 rounded-full bg-[#D6342E]/10 border border-[#D6342E]/35 font-sans text-xs font-medium text-[#C0291F]">OSCP</span>
						<span className="px-2.5 py-1 rounded-full bg-[#E85328]/12 border border-[#E85328]/35 font-sans text-xs font-medium text-[#C7401C]">Claude Code Cert</span>
					</div>
					<h1 className="font-serif text-[48px] sm:text-[64px] font-bold text-[#1C1C1A] leading-[1.05] tracking-[0.01em] mb-6">
						Certification prep<br />is broken.
					</h1>
					<p className="font-serif text-[21px] text-[#4F4A40] leading-[1.6] mb-4 max-w-[560px] mx-auto">
						Exams cost $200–$1,749 per attempt. Prep tools are flashcard apps that teach memorization. Nobody offers adaptive, AI-native tutoring.
					</p>
					<p className="font-serif text-[21px] text-[#1C1C1A] leading-[1.6] mb-10 max-w-[560px] mx-auto">
						Until now.
					</p>
					<Link
						href="/claude-code/quiz"
						className="inline-block px-8 py-4 rounded-xl bg-[#E85328] text-white font-sans text-[15px] font-bold hover:bg-[#C7401C] transition-colors"
					>
						Start a free session
					</Link>
					<p className="mt-4 font-sans text-xs text-[#8A8273]">No signup required. Drill the exam, see your gaps, fix them.</p>
				</div>
			</section>

			{/* The problem — by the numbers */}
			<section className="py-20 px-6 border-t border-[#E8DDC4] bg-[#F4E8CE]">
				<div className="max-w-[1100px] mx-auto">
					<div className="text-center mb-14">
						<h2 className="font-serif text-[36px] font-bold text-[#1C1C1A] tracking-[0.01em] mb-3">The certification industry is a racket</h2>
						<p className="font-sans text-[15px] text-[#6B665C] max-w-[480px] mx-auto">
							Closed-source exams, predatory pricing, and prep tools stuck in 2010.
						</p>
					</div>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{BROKEN_THINGS.map((item) => (
							<div key={item.title} className="rounded-2xl border border-[#E8DDC4] bg-white p-6">
								<div className="font-mono text-[28px] font-bold text-[#E85328] mb-2">{item.stat}</div>
								<h3 className="font-sans text-[14px] font-semibold text-[#1C1C1A] mb-2">{item.title}</h3>
								<p className="font-sans text-[13px] text-[#6B665C] leading-[1.6]">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* What we're building */}
			<section className="py-20 px-6 border-t border-[#E8DDC4]">
				<div className="max-w-[1100px] mx-auto">
					<div className="text-center mb-14">
						<h2 className="font-serif text-[36px] font-bold text-[#1C1C1A] tracking-[0.01em] mb-3">Three certs. One AI tutor.</h2>
						<p className="font-sans text-[15px] text-[#6B665C] max-w-[500px] mx-auto">
							Surpass uses Claude to deliver Socratic, scenario-based prep that adapts to your knowledge gaps in real time.
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-4">
						{CERTIFICATIONS.map((cert) => (
							<div
								key={cert.name}
								className="rounded-2xl border border-[#E8DDC4] bg-white p-6 hover:border-[#D8C9A6] transition-colors group relative"
							>
								{cert.badge && (
									<span
										className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider"
										style={{ backgroundColor: `${cert.accent}1A`, color: cert.accent }}
									>
										{cert.badge}
									</span>
								)}
								<div className="flex items-center gap-3 mb-4">
									<span
										className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-white"
										style={{ backgroundColor: cert.accent }}
									>
										{cert.name.charAt(0)}
									</span>
									<div>
										<h3 className="font-sans text-[15px] font-semibold text-[#1C1C1A]">{cert.name}</h3>
										<span className="font-sans text-xs text-[#8A8273]">{cert.stat} &middot; Exam: {cert.price}</span>
									</div>
								</div>
								<p className="font-serif text-[17px] text-[#1C1C1A] italic mb-2">&ldquo;{cert.tagline}&rdquo;</p>
								<p className="font-sans text-[13px] text-[#5C574C] leading-[1.6] mb-4">{cert.description}</p>
								<div className="flex flex-wrap gap-1.5 mb-5">
									{cert.topics.map((t) => (
										<span
											key={t}
											className="px-2 py-0.5 rounded text-[11px] font-sans font-medium border"
											style={{
												color: cert.accent,
												borderColor: `${cert.accent}40`,
												backgroundColor: `${cert.accent}12`,
											}}
										>
											{t}
										</span>
									))}
								</div>
								<Link
									href={cert.href}
									className="block text-center py-2.5 rounded-lg font-sans text-sm font-semibold transition-all border"
									style={{
										color: cert.accent,
										borderColor: `${cert.accent}59`,
									}}
								>
									{cert.cta} &rarr;
								</Link>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* AI Fundamentals — beginner track */}
			<section className="py-16 px-6 border-t border-[#E8DDC4] bg-[#F4E8CE]">
				<div className="max-w-[720px] mx-auto">
					<div className="rounded-2xl border border-[#D9457F]/30 bg-white p-8">
						<div className="flex items-center gap-3 mb-4">
							<span className="w-10 h-10 rounded-lg bg-[#D9457F] flex items-center justify-center font-mono text-sm font-bold text-white">AI</span>
							<div>
								<h3 className="font-sans text-[17px] font-bold text-[#1C1C1A]">New to AI? Start here.</h3>
								<span className="font-sans text-xs text-[#C53872]">Lazer × Deloitte L&D pilot</span>
							</div>
						</div>
						<p className="font-sans text-[14px] text-[#46423A] leading-[1.7] mb-4">
							A two-week curriculum for engineers and PMs new to working with AI. Twelve printable cheatsheets, eight live-session decks, and two long-form primers — all built around <span className="text-[#1C1C1A] font-semibold">how LLMs actually work</span> and how to be a calibrated user.
						</p>
						<div className="flex flex-wrap gap-3 mb-5">
							<span className="font-mono text-xs text-[#C53872] px-2 py-1 rounded bg-[#D9457F]/10">Tokens · Context · RAG</span>
							<span className="font-mono text-xs text-[#C53872] px-2 py-1 rounded bg-[#D9457F]/10">Prompt patterns · TDD with agent</span>
							<span className="font-mono text-xs text-[#C53872] px-2 py-1 rounded bg-[#D9457F]/10">Cursor modes · Models &amp; spend</span>
						</div>
						<Link
							href="/ai-fundamentals"
							className="inline-block px-5 py-2.5 rounded-lg bg-[#D9457F] text-white font-sans text-sm font-bold hover:bg-[#C53872] transition-colors"
						>
							Open AI Fundamentals →
						</Link>
					</div>
				</div>
			</section>

			{/* OSCP VM Labs callout */}
			<section className="py-16 px-6 border-t border-[#E8DDC4]">
				<div className="max-w-[720px] mx-auto">
					<div className="rounded-2xl border border-[#D6342E]/30 bg-white p-8">
						<div className="flex items-center gap-3 mb-4">
							<span className="w-10 h-10 rounded-lg bg-[#D6342E] flex items-center justify-center font-mono text-sm font-bold text-white">VM</span>
							<div>
								<h3 className="font-sans text-[17px] font-bold text-[#1C1C1A]">Interactive VM Labs for OSCP</h3>
								<span className="font-sans text-xs text-[#C0291F]">Coming soon</span>
							</div>
						</div>
						<p className="font-sans text-[14px] text-[#46423A] leading-[1.7] mb-4">
							Real vulnerable machines, not simulations. Spin up a fresh VM, enumerate services, exploit vulnerabilities, escalate privileges — with an AI tutor guiding your methodology in real time. Each lab auto-destructs after 2 hours.
						</p>
						<div className="flex flex-wrap gap-3">
							<span className="font-mono text-xs text-[#C0291F] px-2 py-1 rounded bg-[#D6342E]/10">nmap &middot; gobuster &middot; Burp Suite</span>
							<span className="font-mono text-xs text-[#C0291F] px-2 py-1 rounded bg-[#D6342E]/10">linpeas &middot; winPEAS &middot; BloodHound</span>
							<span className="font-mono text-xs text-[#C0291F] px-2 py-1 rounded bg-[#D6342E]/10">Impacket &middot; Chisel &middot; Ligolo</span>
						</div>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="py-20 px-6 border-t border-[#E8DDC4]">
				<div className="max-w-[680px] mx-auto">
					<h2 className="font-serif text-[36px] font-bold text-[#1C1C1A] tracking-[0.01em] mb-12 text-center">
						How it works
					</h2>
					<div className="grid gap-8">
						{HOW_IT_WORKS.map((step) => (
							<div key={step.step} className="flex items-start gap-5">
								<span className="font-mono text-[13px] font-bold text-[#E85328] mt-1 shrink-0">{step.step}</span>
								<div>
									<h3 className="font-sans text-[15px] font-semibold text-[#1C1C1A] mb-1">{step.title}</h3>
									<p className="font-sans text-[14px] text-[#5C574C] leading-[1.6]">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Disruption pitch */}
			<section className="py-20 px-6 border-t border-[#E8DDC4] bg-[#F4E8CE]">
				<div className="max-w-[680px] mx-auto">
					<h2 className="font-serif text-[36px] font-bold text-[#1C1C1A] tracking-[0.01em] mb-6 text-center">
						Why this matters
					</h2>
					<div className="space-y-6 font-serif text-[18px] text-[#46423A] leading-[1.7]">
						<p>
							The certification industry charges thousands for exams and offers{" "}
							<span className="text-[#1C1C1A] font-semibold">zero adaptive learning</span>. ISC2 charges $749 for the CISSP. OffSec charges $1,749 for the OSCP. Fail and pay again.
						</p>
						<p>
							Meanwhile, the &ldquo;prep&rdquo; market is stuck in 2010:{" "}
							<span className="text-[#1C1C1A] font-semibold">static question banks, 40-hour video courses, and flashcard apps</span> that teach you to recognize patterns instead of think critically.
						</p>
						<p>
							We&rsquo;re building the first{" "}
							<span className="text-[#C7401C] font-semibold">AI-native certification platform</span>. Surpass doesn&rsquo;t quiz you — it{" "}
							<em>teaches</em> you, using the Socratic method powered by Claude. It adapts to your specific knowledge gaps. It produces diagnostic reports a human tutor would charge $200/hr to create.
						</p>
						<p>
							Three certifications to start. <span className="text-[#1C1C1A] font-semibold">CISSP, OSCP, and the Anthropic Claude Code certification</span> — the credentials that actually matter in security and AI. More coming.
						</p>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-24 px-6 border-t border-[#E8DDC4]">
				<div className="max-w-[680px] mx-auto text-center">
					<h2 className="font-serif text-[44px] font-bold text-[#1C1C1A] tracking-[0.01em] mb-4">
						Stop memorizing.<br />Start understanding.
					</h2>
					<p className="font-sans text-[15px] text-[#5C574C] mb-8 max-w-[420px] mx-auto">
						Pick a cert and try a session. It takes 5 minutes to see why this is different.
					</p>
					<Link
						href="/claude-code/quiz"
						className="inline-block px-10 py-4 rounded-xl bg-[#E85328] text-white font-sans text-[15px] font-bold hover:bg-[#C7401C] transition-colors"
					>
						Start a free session
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-10 px-6 border-t border-[#E8DDC4]">
				<div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<BrandMark variant="light" />
					</div>
					<div className="flex items-center gap-5">
						<a
							href={REPO_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 font-sans text-[12px] text-[#6B665C] hover:text-[#1C1C1A] transition-colors"
						>
							<GitHubMark /> Open source
						</a>
						<span className="font-sans text-[12px] text-[#8A8273]">Software done right multiplies what humans can do</span>
					</div>
				</div>
			</footer>
		</main>
	)
}
