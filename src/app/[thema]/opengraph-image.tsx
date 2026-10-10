import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { THEMEN } from './themen';

export const alt = 'ManaWG';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
	return Object.keys(THEMEN).map((thema) => ({ thema }));
}

// OG-Bild je Themenseite: dunkler Grund wie die Seite, Marke, H1. Schrift aus public/fonts.
export default async function Image({ params }: { params: Promise<{ thema: string }> }) {
	const { thema } = await params;
	const t = THEMEN[thema];
	const [font, mark] = await Promise.all([
		readFile(join(process.cwd(), 'src/app/[thema]/inter-tight.ttf')),
		readFile(join(process.cwd(), 'public/manawg-mark-weiss.png')),
	]);
	const markSrc = `data:image/png;base64,${mark.toString('base64')}`;
	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: 72,
				background: '#0a0a0a',
				color: '#f5f5f5',
				fontFamily: 'Inter Tight',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
				<img src={markSrc} alt="" width={58} height={48} />
				<span style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em' }}>ManaWG</span>
			</div>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
				<div style={{ fontSize: 68, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
					{t?.h1 ?? 'Die App für den WG-Alltag'}
				</div>
				<div style={{ fontSize: 28, color: '#a3a3a3' }}>Kostenlose WG-App · manawg.com</div>
			</div>
		</div>,
		{ ...size, fonts: [{ name: 'Inter Tight', data: font, weight: 600, style: 'normal' }] },
	);
}
