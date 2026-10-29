'use client';

import { useEffect, useRef } from 'react';
import { startDecay } from '../decay/glyphs';

// Fixed to the window above the content, below the header: the characters of the phone → How it works transition (glyphs.ts).
export function Decay() {
	const ref = useRef<HTMLCanvasElement>(null);
	useEffect(() => startDecay(ref.current as HTMLCanvasElement), []);
	return (
		<canvas
			ref={ref}
			aria-hidden="true"
			style={{
				position: 'fixed',
				left: '0',
				top: '0',
				width: '100vw',
				height: '100vh',
				pointerEvents: 'none',
				zIndex: '12',
			}}
		/>
	);
}
