import { Landing } from '@/components/landing/Landing';

// Erstwert von Skalierung und Klasse "js" vor dem ersten Paint (Landing.fit rechnet bei resize neu).
const FIT =
	"(function(){var d=document.documentElement,w=d.clientWidth,h=innerHeight,k=Math.min(w/1280,h/800);d.classList.add('js');d.style.setProperty('--k',k);d.style.setProperty('--x',(w-1280*k)/2+'px');d.style.setProperty('--y',(h-800*k)/2+'px')})()";

export default function Page() {
	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt */}
			<script dangerouslySetInnerHTML={{ __html: FIT }} />
			<noscript
				// biome-ignore lint/security/noDangerouslySetInnerHtml: statische Zeichenkette, kein Nutzerinhalt
				dangerouslySetInnerHTML={{ __html: '<style>[data-loader]{display:none!important}</style>' }}
			/>
			<Landing />
		</>
	);
}
