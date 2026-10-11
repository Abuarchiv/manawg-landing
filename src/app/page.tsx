import { Landing } from '@/components/landing/Landing';
import { FRAGEN } from '@/components/landing/scenes/fragen/fragenDaten';

const faqSchema = {
	'@context': 'https://schema.org',
	'@type': 'FAQPage',
	mainEntity: FRAGEN.map(([frage, antwort]) => ({
		'@type': 'Question',
		name: frage,
		acceptedAnswer: { '@type': 'Answer', text: antwort },
	})),
};

// Vor dem ersten Paint: Klasse "js" und Modus (hoch/quer) am Dokument, damit das Layout ohne Sprung steht.
const MODUS =
	"(function(){var d=document.documentElement,w=d.clientWidth,h=innerHeight;d.classList.add('js');d.setAttribute('data-mode',w/h<=1||w<700?'hoch':'quer')})()";

export default function Page() {
	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt */}
			<script dangerouslySetInnerHTML={{ __html: MODUS }} />
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
			<Landing />
		</>
	);
}
