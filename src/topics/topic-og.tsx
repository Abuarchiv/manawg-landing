import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Locale } from '@/lib/locale';
import { ImageResponse } from 'next/og';
import { topics, ui } from './registry';

export const ogSize = { width: 1200, height: 630 };

// OG image per topic page: dark ground like the page, mark, H1. Font from src/topics.
export async function topicOgImage(locale: Locale, slug: string) {
	const t = topics(locale)[slug];
	const txt = ui(locale);

	const [font, mark] = await Promise.all([
		readFile(join(process.cwd(), 'src/topics/inter-tight.ttf')),
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
					{t?.h1 ?? txt.ogFallback}
				</div>
				<div style={{ fontSize: 28, color: '#a3a3a3' }}>{txt.ogSubtitle}</div>
			</div>
		</div>,
		{ ...ogSize, fonts: [{ name: 'Inter Tight', data: font, weight: 600, style: 'normal' }] },
	);
}
