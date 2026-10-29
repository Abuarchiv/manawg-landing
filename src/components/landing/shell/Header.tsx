import { appUrl } from '@/lib/app-origin';
import { css } from '../core/dc';
import { useDict } from '../dict';

// Header: logo on the left, button on the right, fixed to the window. While the end layer of the intro covers the
// header area, --header-off fades it out (stage.ts). Safe-area insets for notch and corners. Always dark tokens,
// in light mode set by difference (globals.css).

export function Header() {
	const dict = useDict();
	return (
		<header
			data-kopf="1"
			data-dunkel="differenz"
			style={css(
				'position:fixed;z-index:20;color:var(--ink);top:var(--header-top);left:calc(var(--margin) + env(safe-area-inset-left));right:calc(var(--margin) + env(safe-area-inset-right));display:flex;align-items:center;justify-content:space-between;pointer-events:none;opacity:calc(1 - var(--header-off,0))',
			)}
		>
			<div data-loch="logo" style={css('display:flex;align-items:center;gap:var(--sp-10)')}>
				<img
					src="/manawg-mark-weiss-80.webp"
					data-invert=""
					alt=""
					width={416}
					height={346}
					style={css('height:22px;width:auto')}
				/>
				<span
					style={css(
						"font-family:'Inter Tight','Inter Tight Fallback',sans-serif;font-weight:600;font-size:var(--t-20);letter-spacing:-0.03em",
					)}
				>
					ManaWG
				</span>
			</div>
			<a
				data-loch="cta"
				href={appUrl(dict.links.create)}
				className="cta cta--voll"
				style={css('pointer-events:auto;opacity:calc(1 - var(--header-cta-out,0))')}
			>
				{dict.header.cta}
			</a>
		</header>
	);
}
