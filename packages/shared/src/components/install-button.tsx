'use client';

import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../lib/hooks/useFocusTrap';
import {
	type BeforeInstallEvent,
	isAppInstalled,
	subscribeInstall,
	triggerInstall,
} from '../lib/pwa-install';
import { LogoMark } from './ui/LogoMark';

type Platform = 'desktop' | 'android' | 'ios' | 'unknown';

type Props = {
	/** Visual variant — solid uses the gradient pill button, ghost matches outline buttons. */
	variant?: 'solid' | 'ghost';
	className?: string;
	label?: string;
};

export function InstallButton({
	variant = 'ghost',
	className = '',
	label = 'Auf Homescreen',
}: Props) {
	const [event, setEvent] = useState<BeforeInstallEvent | null>(null);
	const [platform, setPlatform] = useState<Platform>('unknown');
	const [installed, setInstalled] = useState(false);
	const [showFallback, setShowFallback] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		if (isAppInstalled()) {
			setInstalled(true);
			return;
		}

		const ua = window.navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(ua)) setPlatform('ios');
		else if (/android/.test(ua)) setPlatform('android');
		else setPlatform('desktop');

		const unsub = subscribeInstall((ev) => {
			setEvent(ev);
			if (!ev && isAppInstalled()) setInstalled(true);
		});

		return unsub;
	}, []);

	if (installed) return null;

	const click = async () => {
		// iOS hat keine Native-Install-API → Fallback-Modal mit Anleitung
		if (platform === 'ios') {
			setShowFallback(true);
			return;
		}

		if (event) {
			const result = await triggerInstall();
			if (result === 'accepted') {
				setInstalled(true);
			} else if (result === 'unavailable') {
				setShowFallback(true);
			}
			return;
		}

		// Kein Native-Event verfügbar → Anleitung zeigen
		setShowFallback(true);
	};

	const baseClass =
		variant === 'solid' ? `install-home-button ${className}` : `btn-modern-ghost ${className}`;

	return (
		<>
			<button type="button" onClick={click} className={baseClass}>
				<Download className="h-4 w-4" aria-hidden />
				{label}
			</button>

			{showFallback && <FallbackModal platform={platform} onClose={() => setShowFallback(false)} />}
		</>
	);
}

/* ─── Fallback modal — shown when no native prompt available ─── */

function FallbackModal({
	platform,
	onClose,
}: {
	platform: Platform;
	onClose: () => void;
}) {
	const trapRef = useFocusTrap<HTMLDivElement>(true);
	if (typeof document === 'undefined') return null;

	return createPortal(
		<div
			ref={trapRef}
			// biome-ignore lint/a11y/useSemanticElements: native <dialog> UA display:none kills CSS transitions (see native-dialog-css-transition-kill skill)
			role="dialog"
			aria-modal="true"
			aria-labelledby="install-dialog-title"
			className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-2 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200"
			style={{
				paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',
				paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
			}}
		>
			{/* Backdrop — decorative; close via Escape or close button inside panel. */}
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: decorative aria-hidden backdrop; keyboard users close via Escape or the in-panel close button, so no key handler is needed here. */}
			<div
				aria-hidden="true"
				className="absolute inset-0 cursor-default bg-transparent"
				onClick={onClose}
			/>
			<div
				className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-base)] p-5 text-left text-[var(--text-1)] shadow-2xl animate-in zoom-in-95 fade-in duration-200 sm:p-7"
				style={{
					width: 'min(520px, calc(100vw - 24px))',
					boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
				}}
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Installationsdialog schließen"
					className="absolute top-4 right-4 rounded-full bg-[var(--surface)] min-h-11 min-w-11 p-2.5 text-[var(--text-3)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--text-1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
				>
					<X className="h-5 w-5" aria-hidden="true" />
				</button>

				<div className="mb-6 flex items-center gap-3 pr-12">
					<LogoMark size={44} radius={12} className="shrink-0" />
					<div>
						<h2
							id="install-dialog-title"
							className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-1)]"
						>
							ManaWG als App installieren
						</h2>
						<p className="mt-0.5 text-sm text-[var(--text-3)]">
							{platform === 'ios' && 'iOS / Safari'}
							{platform === 'android' && 'Android'}
							{platform === 'desktop' && 'Desktop-Browser'}
							{platform === 'unknown' && 'Anleitung'}
						</p>
					</div>
				</div>

				{platform === 'ios' && <IosSteps />}
				{platform === 'android' && <AndroidSteps />}
				{(platform === 'desktop' || platform === 'unknown') && <DesktopSteps />}

				<div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
					<p className="text-sm leading-relaxed text-[var(--text-2)]">
						Danach startet ManaWG ohne Browser-Leiste, direkt vom Homescreen.
					</p>
				</div>
			</div>
		</div>,
		document.body,
	);
}

function Step({
	num,
	children,
}: {
	num: number;
	children: React.ReactNode;
}) {
	return (
		<li className="grid grid-cols-[2rem_1fr] items-start gap-3">
			<span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-1)]">
				{num}
			</span>
			<div className="min-w-0 text-left text-[15px] leading-relaxed text-[var(--text-2)]">
				{children}
			</div>
		</li>
	);
}

function IosSteps() {
	return (
		<ol className="space-y-3.5">
			<Step num={1}>
				In Safari unten auf <span className="font-semibold text-[var(--text-1)]">Teilen</span>{' '}
				tippen.
			</Step>
			<Step num={2}>
				Nach unten scrollen und{' '}
				<span className="font-semibold text-[var(--text-1)]">„Zum Home-Bildschirm"</span> wählen.
			</Step>
			<Step num={3}>
				Oben rechts auf <span className="font-semibold text-[var(--text-1)]">Hinzufügen</span>{' '}
				tippen.
			</Step>
		</ol>
	);
}

function AndroidSteps() {
	return (
		<ol className="space-y-3.5">
			<Step num={1}>
				In Chrome oben rechts auf <span className="font-semibold text-[var(--text-1)]">⋮ Menü</span>{' '}
				tippen.
			</Step>
			<Step num={2}>
				Wähle <span className="font-semibold text-[var(--text-1)]">„App installieren"</span> oder
				„Zum Startbildschirm".
			</Step>
			<Step num={3}>Bestätigen. ManaWG liegt dann auf dem Homescreen.</Step>
		</ol>
	);
}

function DesktopSteps() {
	return (
		<ol className="space-y-3.5">
			<Step num={1}>
				In der Adressleiste auf{' '}
				<span className="font-semibold text-[var(--text-1)]">Installieren</span> klicken.
			</Step>
			<Step num={2}>
				Alternativ: <span className="font-semibold text-[var(--text-1)]">⋮ Menü</span> → „ManaWG
				installieren".
			</Step>
			<Step num={3}>Bestätigen. ManaWG startet dann wie eine App.</Step>
		</ol>
	);
}
