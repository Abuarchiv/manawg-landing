import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ManaWG — Die WG-App, die einfach funktioniert.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				// The mint glow and the bottom tag are positioned absolutely —
				// they need this box as their positioned ancestor, otherwise
				// both resolve against the SVG viewport instead.
				position: 'relative',
				background: '#07070a',
				fontFamily: 'system-ui, sans-serif',
			}}
		>
			{/* Mint glow blob */}
			<div
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 600,
					height: 400,
					borderRadius: '50%',
					background:
						'radial-gradient(circle, rgba(132,225,188,0.25) 0%, rgba(139,92,246,0.12) 50%, transparent 70%)',
					filter: 'blur(60px)',
				}}
			/>

			{/* manawg wordmark */}
			<div
				style={{
					fontSize: 96,
					fontWeight: 800,
					letterSpacing: '-0.05em',
					color: '#84e1bc',
					lineHeight: 1,
					marginBottom: 24,
				}}
			>
				manawg
			</div>

			{/* Divider */}
			<div
				style={{
					width: 60,
					height: 2,
					background: '#84e1bc',
					marginBottom: 32,
					opacity: 0.6,
				}}
			/>

			{/* Subheadline */}
			<div
				style={{
					fontSize: 32,
					fontWeight: 400,
					color: '#a1a1aa',
					letterSpacing: '-0.02em',
					textAlign: 'center',
					maxWidth: 700,
				}}
			>
				Die WG-App, die einfach funktioniert.
			</div>

			{/* Bottom tag */}
			<div
				style={{
					position: 'absolute',
					bottom: 48,
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					fontSize: 14,
					color: '#52525b',
					letterSpacing: '0.1em',
					textTransform: 'uppercase',
				}}
			>
				In Deutschland gehostet · Ohne Tracking · DSGVO-konform
			</div>
		</div>,
		{
			...size,
		},
	);
}
