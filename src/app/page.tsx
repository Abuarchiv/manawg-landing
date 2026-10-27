import { Landing } from '@/components/landing/Landing';
import { FRAGEN } from '@/components/landing/scenes/fragen/fragenDaten';
import { APP_ORIGIN } from '@/lib/app-origin';
import { schemaIds } from '@/lib/schema-ids';

const faqSchema = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: FRAGEN.map(([frage, antwort]) => ({
		'@type': 'Question',
		name: frage,
		acceptedAnswer: { '@type': 'Answer', text: antwort },
	})),
};

// Nur auf der Startseite: Die App ist ein eigenes Produkt auf eigener Origin.
const softwareApplicationSchema = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	'@id': schemaIds().app,
	name: 'ManaWG',
	publisher: { '@id': schemaIds().organisation },
	description:
		'Mit ManaWG teilt ihr Ausgaben, organisiert Einkäufe und verteilt Aufgaben im Putzplan. Die App ist kostenlos und läuft im Browser.',
	url: APP_ORIGIN,
	applicationCategory: 'LifestyleApplication',
	operatingSystem: 'Web',
	inLanguage: 'de-DE',
	featureList: ['Ausgaben teilen', 'Einkaufsliste', 'Putzplan', 'Pinnwand', 'Kalender', 'Chat'],
	isAccessibleForFree: true,
	browserRequirements: 'Aktueller Browser, installierbar als PWA',
	screenshot: { '@type': 'ImageObject', url: `${schemaIds().site}/app-demo/start.webp` },
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
};

// Vor dem ersten Paint: Klasse "js" und Modus (hoch/quer) am Dokument, damit das Layout ohne Sprung steht.
const MODUS =
	"(function(){var d=document.documentElement,w=d.clientWidth,h=innerHeight;d.classList.add('js');d.setAttribute('data-mode',w/h<=1||w<700?'hoch':'quer')})()";

export default function Page() {
	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt */}
			<script dangerouslySetInnerHTML={{ __html: MODUS }} />
			{/* hero.ts holt die Fotos per fetch(); der Preload startet den Download schon beim HTML-Parsen (crossOrigin wie bei fetch) */}
			<link rel="preload" as="fetch" href="/hero/berg.webp" crossOrigin="anonymous" />
			<link rel="preload" as="fetch" href="/hero/berg-maske.webp" crossOrigin="anonymous" />
			<noscript
				// biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt
				dangerouslySetInnerHTML={{
					__html:
						'<style>[data-loader]{display:none!important}#intro,[data-buehne]{height:100svh!important}</style>',
				}}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
				dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<Landing />
		</>
	);
}
