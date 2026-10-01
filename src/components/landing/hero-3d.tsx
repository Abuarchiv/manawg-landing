'use client';

import {
	Cone,
	Cylinder,
	Float,
	Html,
	Octahedron,
	RoundedBox,
	Sphere,
	Torus,
} from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type React from 'react';
import {
	Component,
	type ErrorInfo,
	type ReactNode,
	Suspense as ReactSuspense,
	useEffect,
	useRef,
	useState,
} from 'react';
import type { Group } from 'three';

// craftsman-ignore: TS001 — R3F Suspense typing workaround; ReactSuspense generic causes JSX compat issues
/* eslint-disable @typescript-eslint/no-explicit-any */
const Suspense = ReactSuspense as unknown as typeof ReactSuspense;

type WGType = 'house' | 'coins' | 'checklist' | 'bag' | 'note' | 'plant';

const TINTS: Record<WGType, string> = {
	house: '#dde8db', // pale moss
	coins: '#f0d894', // honey-cream
	checklist: '#e5ecd9', // soft sage
	bag: '#ede2c8', // warm sand
	note: '#f5e0c8', // cream-clay
	plant: '#c8d8b8', // sage-leaf
};

const LABELS: Record<WGType, string> = {
	house: 'Eure WG',
	coins: 'Ausgaben',
	checklist: 'Putzplan',
	bag: 'Einkauf',
	note: 'Pinnwand',
	plant: 'DSGVO',
};

const SCROLL_TARGETS: Record<WGType, string> = {
	house: '#features',
	coins: '#features',
	checklist: '#features',
	bag: '#features',
	note: '#features',
	plant: '#vergleich',
};

/** Reusable Apple-glass material props for primitives. */
function glassMaterialProps(tint: string) {
	return {
		color: tint,
		transparent: true,
		opacity: 0.82,
		roughness: 0.06,
		metalness: 0.04,
		clearcoat: 1,
		clearcoatRoughness: 0.04,
		reflectivity: 0.9,
	} as const;
}

/* ─── 3D Shape primitives — built from drei meshes ─── */

function HouseShape({ tint }: { tint: string }) {
	return (
		<group>
			{/* base box */}
			<RoundedBox args={[0.95, 0.8, 0.95]} radius={0.06} smoothness={4}>
				<meshPhysicalMaterial {...glassMaterialProps(tint)} />
			</RoundedBox>
			{/* roof cone */}
			<Cone args={[0.78, 0.55, 4]} position={[0, 0.68, 0]} rotation={[0, Math.PI / 4, 0]}>
				<meshPhysicalMaterial {...glassMaterialProps('#a85638')} />
			</Cone>
		</group>
	);
}

function CoinsShape({ tint }: { tint: string }) {
	return (
		<group>
			{[-0.2, 0, 0.2].map((y) => (
				<Cylinder key={y} args={[0.5, 0.5, 0.14, 32]} position={[0, y, 0]}>
					<meshPhysicalMaterial {...glassMaterialProps(tint)} />
				</Cylinder>
			))}
		</group>
	);
}

function ChecklistShape({ tint }: { tint: string }) {
	return (
		<group rotation={[0, 0, 0]}>
			{/* clipboard */}
			<RoundedBox args={[1.0, 1.2, 0.08]} radius={0.05} smoothness={4}>
				<meshPhysicalMaterial {...glassMaterialProps(tint)} />
			</RoundedBox>
			{/* check rows */}
			{[0.32, 0.05, -0.22].map((y) => (
				<RoundedBox key={y} args={[0.6, 0.06, 0.04]} position={[0.05, y, 0.06]} radius={0.02}>
					<meshPhysicalMaterial {...glassMaterialProps('#2f5d4a')} />
				</RoundedBox>
			))}
			{/* check marks (small spheres) */}
			{[0.32, 0.05, -0.22].map((y) => (
				<Sphere key={`dot-${y}`} args={[0.06, 16, 16]} position={[-0.35, y, 0.06]}>
					<meshPhysicalMaterial {...glassMaterialProps('#2f5d4a')} />
				</Sphere>
			))}
		</group>
	);
}

function BagShape({ tint }: { tint: string }) {
	return (
		<group>
			{/* bag body */}
			<RoundedBox args={[0.85, 0.95, 0.45]} radius={0.08} smoothness={4}>
				<meshPhysicalMaterial {...glassMaterialProps(tint)} />
			</RoundedBox>
			{/* handles */}
			<Torus args={[0.18, 0.04, 16, 32, Math.PI]} position={[-0.22, 0.55, 0]}>
				<meshPhysicalMaterial {...glassMaterialProps('#a85638')} />
			</Torus>
			<Torus args={[0.18, 0.04, 16, 32, Math.PI]} position={[0.22, 0.55, 0]}>
				<meshPhysicalMaterial {...glassMaterialProps('#a85638')} />
			</Torus>
		</group>
	);
}

function NoteShape({ tint }: { tint: string }) {
	return (
		<group rotation={[0, 0, 0.08]}>
			<RoundedBox args={[1.0, 1.0, 0.06]} radius={0.04} smoothness={4}>
				<meshPhysicalMaterial {...glassMaterialProps(tint)} />
			</RoundedBox>
			{/* pin */}
			<Sphere args={[0.08, 16, 16]} position={[0, 0.45, 0.05]}>
				<meshPhysicalMaterial {...glassMaterialProps('#a85638')} />
			</Sphere>
			{/* lines */}
			{[0.18, -0.05, -0.28].map((y) => (
				<RoundedBox key={y} args={[0.7, 0.04, 0.02]} position={[0, y, 0.04]} radius={0.01}>
					<meshPhysicalMaterial {...glassMaterialProps('#2f5d4a')} />
				</RoundedBox>
			))}
		</group>
	);
}

function PlantShape({ tint }: { tint: string }) {
	return (
		<group>
			{/* pot */}
			<Cylinder args={[0.4, 0.3, 0.45, 16]} position={[0, -0.35, 0]}>
				<meshPhysicalMaterial {...glassMaterialProps('#a85638')} />
			</Cylinder>
			{/* leaves cluster */}
			<Octahedron args={[0.45]} position={[0.18, 0.18, 0]}>
				<meshPhysicalMaterial {...glassMaterialProps(tint)} />
			</Octahedron>
			<Octahedron args={[0.35]} position={[-0.22, 0.05, 0.1]}>
				<meshPhysicalMaterial {...glassMaterialProps('#6b8e5d')} />
			</Octahedron>
			<Octahedron args={[0.3]} position={[0.05, 0.42, -0.15]}>
				<meshPhysicalMaterial {...glassMaterialProps('#345c47')} />
			</Octahedron>
		</group>
	);
}

const SHAPES: Record<WGType, (tint: string) => React.ReactNode> = {
	house: (t) => <HouseShape tint={t} />,
	coins: (t) => <CoinsShape tint={t} />,
	checklist: (t) => <ChecklistShape tint={t} />,
	bag: (t) => <BagShape tint={t} />,
	note: (t) => <NoteShape tint={t} />,
	plant: (t) => <PlantShape tint={t} />,
};

/**
 * Interactive WG-themed glass object — hover scales it up + reveals label,
 * click scrolls to the relevant section. Built from primitive meshes so
 * shapes load instantly without GLB assets.
 */
type DragState = { active: boolean; lastX: number; lastY: number; moved: number };

function WGObject({
	position,
	type,
	floatIntensity = 1.4,
	speed = 1.0,
	scale = 1,
}: {
	position: [number, number, number];
	type: WGType;
	floatIntensity?: number;
	speed?: number;
	scale?: number;
}) {
	const groupRef = useRef<Group>(null);
	const [hovered, setHovered] = useState(false);
	const [clickCount, setClickCount] = useState(0);
	// Mutable interaction state (refs so they don't trigger re-renders)
	const dragRef = useRef<DragState>({ active: false, lastX: 0, lastY: 0, moved: 0 });
	const velocityRef = useRef({ x: 0, y: 0 });
	const bounceRef = useRef(0);
	const pulseRef = useRef(0);

	useFrame(() => {
		if (!groupRef.current) return;
		// Scale: base + hover pop + click bounce + hover pulse breathing
		const baseTarget = hovered ? 1.2 : 1;
		const pulse = hovered ? Math.sin(pulseRef.current) * 0.025 : 0;
		const target = baseTarget + bounceRef.current + pulse;
		groupRef.current.scale.x += (target - groupRef.current.scale.x) * 0.18;
		groupRef.current.scale.y = groupRef.current.scale.x;
		groupRef.current.scale.z = groupRef.current.scale.x;

		// Rotation: drag overrides, otherwise momentum decay + idle spin
		if (!dragRef.current.active) {
			groupRef.current.rotation.y += velocityRef.current.x;
			groupRef.current.rotation.x += velocityRef.current.y;
			velocityRef.current.x *= 0.94;
			velocityRef.current.y *= 0.94;
			// idle drift — faster when hovered
			groupRef.current.rotation.y += hovered ? 0.011 : 0.003;
		}

		// Decay bounce + advance pulse phase
		bounceRef.current *= 0.86;
		pulseRef.current += 0.12;
	});

	const handleClick = () => {
		const target = SCROLL_TARGETS[type];
		// Prefer the id lookup, fall back to the selector: the section ids are
		// rendered by the page, and a missing target must not throw.
		const el = document.getElementById(target.replace(/^#/, '')) ?? document.querySelector(target);
		el?.scrollIntoView({
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
			block: 'start',
		});
	};

	return (
		<Float floatIntensity={floatIntensity} speed={speed} rotationIntensity={0.2}>
			<group position={position}>
				<group
					ref={groupRef}
					scale={scale}
					onPointerOver={(e) => {
						e.stopPropagation();
						setHovered(true);
						document.body.style.cursor = 'grab';
					}}
					onPointerOut={() => {
						setHovered(false);
						document.body.style.cursor = 'auto';
					}}
					onPointerDown={(e) => {
						e.stopPropagation();
						(e.target as Element).setPointerCapture?.(e.pointerId);
						dragRef.current.active = true;
						dragRef.current.lastX = e.clientX;
						dragRef.current.lastY = e.clientY;
						dragRef.current.moved = 0;
						velocityRef.current.x = 0;
						velocityRef.current.y = 0;
						document.body.style.cursor = 'grabbing';
					}}
					onPointerMove={(e) => {
						if (!dragRef.current.active) return;
						const dx = e.clientX - dragRef.current.lastX;
						const dy = e.clientY - dragRef.current.lastY;
						dragRef.current.moved += Math.abs(dx) + Math.abs(dy);
						dragRef.current.lastX = e.clientX;
						dragRef.current.lastY = e.clientY;
						if (groupRef.current) {
							groupRef.current.rotation.y += dx * 0.012;
							groupRef.current.rotation.x += dy * 0.012;
						}
						velocityRef.current.x = dx * 0.006;
						velocityRef.current.y = dy * 0.006;
					}}
					onPointerUp={(e) => {
						const wasTap = dragRef.current.moved < 6;
						dragRef.current.active = false;
						(e.target as Element).releasePointerCapture?.(e.pointerId);
						document.body.style.cursor = hovered ? 'grab' : 'auto';
						if (wasTap) {
							// click bounce + counter + scroll
							bounceRef.current = 0.22;
							setClickCount((c) => c + 1);
							handleClick();
						}
					}}
				>
					{SHAPES[type](TINTS[type])}
				</group>
				{hovered && (
					<Html
						center
						distanceFactor={6}
						position={[0, 1.0 * scale, 0]}
						style={{ pointerEvents: 'none' }}
					>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 8,
								padding: '6px 12px',
								borderRadius: 999,
								fontFamily: 'Geist, system-ui, sans-serif',
								fontSize: 13,
								fontWeight: 600,
								color: 'var(--text-1)',
								background: 'rgba(255,255,255,0.85)',
								backdropFilter: 'blur(20px) saturate(220%)',
								WebkitBackdropFilter: 'blur(20px) saturate(220%)',
								border: '1px solid rgba(255,255,255,0.7)',
								boxShadow: '0 8px 24px rgba(47,93,74,0.18), 0 1px 0 rgba(255,255,255,0.9) inset',
								whiteSpace: 'nowrap',
								letterSpacing: '-0.005em',
							}}
						>
							<span>{LABELS[type]}</span>
							{clickCount > 0 && (
								<span
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										justifyContent: 'center',
										minWidth: 18,
										height: 18,
										padding: '0 5px',
										borderRadius: 999,
										fontSize: 10,
										fontWeight: 700,
										background: 'var(--accent)',
										color: 'var(--accent-fg)',
									}}
								>
									{clickCount}
								</span>
							)}
							<span
								style={{
									fontSize: 10,
									fontWeight: 500,
									color: 'var(--text-3)',
									letterSpacing: '0.04em',
								}}
							>
								DRAG · KLICK
							</span>
						</div>
					</Html>
				)}
			</group>
		</Float>
	);
}

/**
 * Subtle parallax wrapper — group rotates slightly with mouse position
 * to add depth. Children handle their own interactivity.
 */
function Scene() {
	const group = useRef<Group>(null);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	// Mobile: world-y for the lower pair, centred in the free space below the CTA;
	// null when there is no room (short phones), so nothing covers text or button.
	const [lowerY, setLowerY] = useState<number | null>(null);
	const canvas = useThree((state) => state.gl.domElement);
	const viewportHeight = useThree((state) => state.viewport.height);

	useEffect(() => {
		if (!isMobile) return;
		const place = () => {
			const box = canvas.getBoundingClientRect();
			const cta = canvas.closest('section')?.querySelector('a.btn-modern');
			if (!cta || box.height === 0) return setLowerY(null);
			const free = box.bottom - cta.getBoundingClientRect().bottom;
			if (free < 150) return setLowerY(null);
			const centerPx = box.height - free / 2;
			setLowerY(viewportHeight / 2 - (centerPx / box.height) * viewportHeight);
		};
		place();
		window.addEventListener('resize', place);
		return () => window.removeEventListener('resize', place);
	}, [canvas, isMobile, viewportHeight]);

	useEffect(() => {
		setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
		const mq = window.matchMedia('(max-width: 767px)');
		setIsMobile(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	useFrame((state) => {
		if (!group.current) return;
		if (reducedMotion) return;
		const t = state.clock.elapsedTime;
		group.current.rotation.y = Math.sin(t * 0.12) * 0.06 + state.pointer.x * 0.08;
		group.current.rotation.x = Math.cos(t * 0.1) * 0.03 + -state.pointer.y * 0.04;
	});

	if (isMobile) {
		return (
			<group ref={group}>
				{/* Mobile: four corner objects; the lower pair sits below the CTA so it never covers the subhead */}
				<WGObject
					type="house"
					position={[-2.0, 2.0, -0.5]}
					scale={0.75}
					floatIntensity={1.4}
					speed={0.9}
				/>
				<WGObject
					type="coins"
					position={[2.0, 2.0, -0.5]}
					scale={0.65}
					floatIntensity={1.3}
					speed={1.1}
				/>
				{lowerY !== null && (
					<>
						<WGObject
							type="checklist"
							position={[-1.9, lowerY, -0.5]}
							scale={0.65}
							floatIntensity={1.6}
							speed={1.2}
						/>
						<WGObject
							type="bag"
							position={[1.9, lowerY, -0.5]}
							scale={0.65}
							floatIntensity={1.5}
							speed={1.3}
						/>
					</>
				)}
			</group>
		);
	}

	return (
		<group ref={group}>
			{/* Desktop: six objects pushed to corners around hero text */}
			<WGObject
				type="house"
				position={[-4.6, 2.2, -1]}
				scale={1.1}
				floatIntensity={1.6}
				speed={0.9}
			/>
			<WGObject
				type="coins"
				position={[4.8, 2.0, -1.2]}
				scale={0.85}
				floatIntensity={1.5}
				speed={1.1}
			/>
			<WGObject
				type="checklist"
				position={[-4.4, -2.2, -1]}
				scale={0.85}
				floatIntensity={1.8}
				speed={1.2}
			/>
			<WGObject
				type="bag"
				position={[4.4, -2.0, -1]}
				scale={0.85}
				floatIntensity={1.6}
				speed={1.3}
			/>
			<WGObject
				type="note"
				position={[-2.8, 0.4, 0.5]}
				scale={0.55}
				floatIntensity={1.4}
				speed={1.0}
			/>
			<WGObject
				type="plant"
				position={[3.0, -0.6, 0.4]}
				scale={0.7}
				floatIntensity={1.5}
				speed={1.05}
			/>
		</group>
	);
}

/** Soft pastel gradient shown while the 3D canvas loads — Apple-style. */
function Hero3DFallback() {
	return (
		<div
			className="absolute inset-0 pointer-events-none -z-10"
			aria-hidden
			style={{
				background: [
					'radial-gradient(circle 460px at 15% 25%, rgba(221,232,219,0.6) 0%, transparent 60%)',
					'radial-gradient(circle 520px at 85% 30%, rgba(229,236,217,0.55) 0%, transparent 60%)',
					'radial-gradient(circle 420px at 20% 80%, rgba(240,232,200,0.5) 0%, transparent 55%)',
					'radial-gradient(circle 360px at 85% 80%, rgba(237,226,200,0.5) 0%, transparent 55%)',
				].join(', '),
				filter: 'blur(24px)',
				opacity: 0.9,
			}}
		/>
	);
}

interface CanvasErrorBoundaryProps {
	children: ReactNode;
}

interface CanvasErrorBoundaryState {
	hasError: boolean;
}

class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
	override state: CanvasErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): CanvasErrorBoundaryState {
		return { hasError: true };
	}

	override componentDidCatch(_error: Error, _info: ErrorInfo): void {
		// Hero 3D is decorative — fall back to gradient silently.
	}

	override render(): ReactNode {
		if (this.state.hasError) {
			return null;
		}
		return this.props.children;
	}
}

/** Detect WebGL availability once. Returns null until checked, then bool. */
function useWebGLSupported() {
	const [supported, setSupported] = useState<boolean | null>(null);
	useEffect(() => {
		try {
			const c = document.createElement('canvas');
			const ctx =
				c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl');
			setSupported(!!ctx);
		} catch {
			setSupported(false);
		}
	}, []);
	return supported;
}

/** Detect whether the hero container is on screen; drives the render loop. */
function useInViewport<T extends Element>(): [React.RefObject<T | null>, boolean] {
	const ref = useRef<T>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === 'undefined') {
			// Without IntersectionObserver there is nothing to gate on — keep
			// animating rather than freezing the scene forever.
			setInView(true);
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry) setInView(entry.isIntersecting);
			},
			{ rootMargin: '100px' },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return [ref, inView];
}

export function Hero3D() {
	const webgl = useWebGLSupported();
	const [isMobile, setIsMobile] = useState(false);
	const [containerRef, inView] = useInViewport<HTMLDivElement>();

	useEffect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		setIsMobile(mq.matches);
		const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, []);

	// R3F ResizeObserver doesn't fire on first mount inside next/dynamic (ssr:false).
	// Dispatch multiple resize events at increasing delays to ensure one lands after
	// the observer is registered and the container has a stable layout size.
	useEffect(() => {
		const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
		const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
		const t3 = setTimeout(() => window.dispatchEvent(new Event('resize')), 600);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	}, []);

	// Mobile: smaller center oval so corner objects remain visible on narrow screens
	// Desktop: wide ellipse to clear the headline text
	const maskEllipse = isMobile
		? 'radial-gradient(ellipse 65% 32% at 50% 45%, transparent 0%, transparent 28%, rgba(0,0,0,0.6) 50%, black 72%)'
		: 'radial-gradient(ellipse 50% 42% at 50% 50%, transparent 0%, transparent 32%, rgba(0,0,0,0.7) 55%, black 80%)';

	return (
		<div
			ref={containerRef}
			aria-hidden="true"
			className="absolute inset-0 opacity-95 dark:opacity-[0.78]"
			style={{ maskImage: maskEllipse, WebkitMaskImage: maskEllipse }}
		>
			{webgl !== false ? (
				<CanvasErrorBoundary>
					<Canvas
						// Stop the render loop while the hero is scrolled out of
						// view — an off-screen canvas has nothing to show and
						// otherwise keeps burning GPU/CPU on every frame.
						frameloop={inView ? 'always' : 'never'}
						style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
						camera={{ position: [0, 0, 9], fov: 50 }}
						dpr={[1, 1.5]}
						gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
						resize={{ scroll: true, offsetSize: true }}
						onCreated={({ gl }) => {
							gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault());
						}}
					>
						<ambientLight intensity={1.4} />
						<directionalLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
						<directionalLight position={[-4, -2, -4]} intensity={1.0} color="#f0f4f0" />
						<pointLight position={[0, 0, 6]} intensity={1.2} color="#ffffff" />
						<pointLight position={[-5, 3, 3]} intensity={0.8} color="#e8f5ee" />
						<hemisphereLight args={['#ffffff', '#d8e0d2', 0.8]} />
						<Suspense fallback={null}>
							<Scene />
						</Suspense>
					</Canvas>
				</CanvasErrorBoundary>
			) : null}
			{/* Static gradient — visible until canvas paints, or as full fallback if WebGL fails */}
			<Hero3DFallback />
		</div>
	);
}
