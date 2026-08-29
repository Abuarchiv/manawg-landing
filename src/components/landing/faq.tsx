'use client';

import { haptic } from '@/lib/haptics';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';

const faqs = [
	{
		q: 'Ist manawg dauerhaft kostenlos?',
		a: 'Ja. Dauerhaft kostenlos. Kein Werbe-, kein Datenverkaufs-, kein Premium-Plan. ManaWG wird privat betrieben und läuft auf kostenlosen bzw. sehr günstigen Hosting-Angeboten. Sollte sich an dieser Grundlage je etwas ändern müssen, steht das transparent auf der Seite.',
	},
	{
		q: 'Wie viele Mitbewohner kann eine WG haben?',
		a: 'Beliebig viele. Splitwise limitiert dich auf 5 Einträge pro Tag im Free-Plan. Tricount macht nur Geld, keine WG. Bei manawg: füge zwölf Leute hinzu, niemand zuckt.',
	},
	{
		q: 'Was passiert mit meinen Daten, wenn ich aufhöre?',
		a: 'Die App speichert den Gerätezugang lokal im Browser. Gemeinsame WG-Daten werden nur für die Funktionen der WG verarbeitet. Wenn eine WG gelöscht wird, werden die dazugehörigen Daten gelöscht; zusätzliche Löschanfragen kannst du jederzeit per E-Mail stellen (DSGVO-Recht auf Löschung).',
	},
	{
		q: 'Kann ich meine WG-Daten exportieren oder löschen?',
		a: 'Ja. Die WG-Einstellungen enthalten einen Export sämtlicher Daten als JSON sowie eine WG-Löschen-Funktion. Zusätzlich greift dein DSGVO-Recht auf Auskunft, Berichtigung und Löschung — formlos per E-Mail an den Betreiber (siehe Impressum).',
	},
	{
		q: 'Funktioniert manawg auf dem Handy?',
		a: 'Ja. Es ist eine Progressive Web App — installierbar auf iOS und Android über den Browser-Share-Knopf (das Viereck mit Pfeil nach oben → „zum Home-Bildschirm hinzufügen"). Wir bauen keine native App, weil eine PWA für eine WG-Liste völlig reicht und weniger Energie verbraucht.',
	},
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
	const panelId = `faq-panel-${index}`;
	const summaryId = `faq-summary-${index}`;

	return (
		<details className="group animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <summary> is natively keyboard-operable (Enter/Space toggles <details>); onClick only fires a touch-haptic side-effect, not the toggle itself. */}
			<summary
				id={summaryId}
				aria-controls={panelId}
				onClick={() => haptic('light')}
				className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 border-b border-black/[0.08] py-4 text-left transition-colors marker:hidden hover:border-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 dark:border-white/[0.08] dark:hover:border-white/20 [&::-webkit-details-marker]:hidden"
			>
				<span className="text-base font-medium text-[var(--text-1)] tracking-[-0.01em]">{q}</span>
				<span
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.12] bg-black/[0.03] text-[var(--text-2)] transition-transform group-open:rotate-180 group-hover:border-[var(--accent)]/40 group-hover:text-[var(--accent)] dark:border-white/[0.12] dark:bg-white/[0.03]"
					aria-hidden
				>
					<ChevronDown className="h-4 w-4" strokeWidth={2} />
				</span>
			</summary>
			<section id={panelId} aria-labelledby={summaryId}>
				<p className="pb-5 pt-2 text-sm leading-relaxed text-[var(--text-2)]">{a}</p>
			</section>
		</details>
	);
}

const faqPageSchema = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: faqs.map((faq) => ({
		'@type': 'Question',
		name: faq.q,
		acceptedAnswer: {
			'@type': 'Answer',
			text: faq.a,
		},
	})),
};

export function FAQ() {
	return (
		<>
			<Script
				id="manawg-faq-schema"
				type="application/ld+json"
			>{`${JSON.stringify(faqPageSchema)}`}</Script>
			<div className="w-full max-w-3xl mx-auto">
				{faqs.map((f, i) => (
					<FAQItem key={f.q} q={f.q} a={f.a} index={i} />
				))}
			</div>
		</>
	);
}
