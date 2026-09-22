'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const Hero3D = dynamic(
	() => import('@/components/landing/hero-3d').then((m) => ({ default: m.Hero3D })),
	{
		ssr: false,
		loading: () => (
			<div className="h-[88dvh] bg-gradient-to-b from-[var(--bg-base)] to-[var(--surface)]" />
		),
	},
);

/**
 * Client-only mount point for the WebGL hero.
 *
 * The landing page itself is a server component, so the three.js chunk and
 * the reduced-motion gate live here: nothing of the 3D scene is part of the
 * server-rendered HTML, and visitors who ask for reduced motion never
 * download it at all.
 */
export function Hero3DMount() {
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return;
		setEnabled(!matchMedia(REDUCED_MOTION_QUERY).matches);
	}, []);

	if (!enabled) return null;
	return <Hero3D />;
}
