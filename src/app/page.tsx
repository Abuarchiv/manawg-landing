import { Landing } from '@/components/landing/Landing';

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
			<Landing />
		</>
	);
}
