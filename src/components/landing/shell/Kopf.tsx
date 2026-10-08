import { appUrl } from '@/lib/app-origin';
import { css } from '../core/dc';

// Kopf: Logo links, Knopf rechts, fest am Fenster. Während die Ende-Ebene der Intro den Kopfbereich deckt,
// blendet --kopf-aus ihn aus (stage.js). Safe-Area-Abstände für Notch und Ecken.

export function Kopf() {
	return (
		<header
			data-kopf="1"
			style={css(
				'position:fixed;z-index:20;top:var(--kopf-oben);left:calc(var(--rand) + env(safe-area-inset-left));right:calc(var(--rand) + env(safe-area-inset-right));display:flex;align-items:center;justify-content:space-between;pointer-events:none;opacity:calc(1 - var(--kopf-aus,0))',
			)}
		>
			<div data-loch="logo" style={css('display:flex;align-items:center;gap:var(--sp-10)')}>
				<img
					src="/manawg-mark-weiss.png"
					alt=""
					width={416}
					height={346}
					style={css('height:22px;width:auto')}
				/>
				<span
					style={css(
						"font-family:'Inter Tight',sans-serif;font-weight:600;font-size:var(--t-20);letter-spacing:-0.03em",
					)}
				>
					ManaWG
				</span>
			</div>
			<a
				data-loch="cta"
				href={appUrl('/neu?action=create')}
				className="cta cta--rand"
				style={css('pointer-events:auto;opacity:calc(1 - var(--kopf-cta-aus,0))')}
			>
				WG erstellen
			</a>
		</header>
	);
}
