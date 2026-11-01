'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { capture, startTelemetry } from '@/lib/telemetry';

export function Telemetry() {
	const pathname = usePathname();
	useEffect(startTelemetry, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: one page view per route change.
	useEffect(() => capture('$pageview'), [pathname]);
	return null;
}
