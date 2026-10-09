'use client';

import { type CSSProperties, useEffect, useState } from 'react';
import { datumsZeilen } from '../ende/datum';

// Die beiden tagesabhängigen Zeilen des App-Standbilds (Putzplan-Termine), aus derselben Quelle wie das
// Hero-Handy. Das Standbild trägt sie nicht (public/install/app-start.webp). left/top: Ecke des Bildes im Gerät,
// k: Gerätefaktor (Android 411 / 390).
export function AppDatum({ left, top, k = 1 }: { left: number; top: number; k?: number }) {
	const [z, setZ] = useState<[string, string] | null>(null);
	useEffect(() => setZ(datumsZeilen()), []);
	if (!z) return null;
	const st = (y: number): CSSProperties => ({
		position: 'absolute',
		left: left + 65.6 * k,
		top: top + y * k,
		font: `400 ${12 * k}px / ${18 * k}px Inter, sans-serif`,
		color: '#737373',
		whiteSpace: 'nowrap',
		fontFeatureSettings: '"cv11", "kern", "ss01"',
	});
	return (
		<>
			<span style={st(476.375)}>{z[0]}</span>
			<span style={st(526.625)}>{z[1]}</span>
		</>
	);
}
