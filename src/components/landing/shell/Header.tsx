import { appUrl } from '@/lib/app-origin';
import { useDict } from '../dict';

// Header: logo on the left, button on the right, fixed to the window. While the end layer of the intro covers the
// header area, --header-off fades it out (stage.ts). Safe-area insets for notch and corners.

export function Header() {
	const dict = useDict();
	return (
		<header
			data-header="1"
			style={{
				position: 'fixed',
				zIndex: '20',
				top: 'var(--header-top)',
				left: 'calc(var(--margin) + env(safe-area-inset-left))',
				right: 'calc(var(--margin) + env(safe-area-inset-right))',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				pointerEvents: 'none',
				opacity: 'calc(1 - var(--header-off,0))',
			}}
		>
			{/* Soft paper shadow like the buttons (.cta): the logo stays legible where bright clouds pass behind it
			    (phone in landscape); a filter here and not on the img, which carries the light mode's invert */}
			<div
				data-hole="logo"
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 'var(--sp-10)',
					filter:
						'drop-shadow(0 0 3px rgb(var(--paper-rgb) / 0.9)) drop-shadow(0 0 10px rgb(var(--paper-rgb) / 0.7))',
				}}
			>
				<img
					src="/manawg-mark-white-80.webp"
					data-invert=""
					alt=""
					width={416}
					height={346}
					style={{ height: '22px', width: 'auto' }}
				/>
				<span
					style={{
						fontFamily: "'Inter Tight','Inter Tight Fallback',sans-serif",
						fontWeight: '600',
						fontSize: 'var(--t-20)',
						letterSpacing: '-0.03em',
					}}
				>
					ManaWG
				</span>
			</div>
			<a
				data-hole="cta"
				data-cta="header_create"
				href={appUrl(dict.links.create)}
				className="cta cta--solid"
				style={{ pointerEvents: 'auto', opacity: 'calc(1 - var(--header-cta-out,0))' }}
			>
				{dict.header.cta}
			</a>
		</header>
	);
}
