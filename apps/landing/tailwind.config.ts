import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		// @manawg/shared ships raw TSX consumed directly by this app's build —
		// Tailwind needs to scan it too, or utility classes used only inside
		// shared components (InstallButton, ThemeToggle, ...) never get generated.
		'../../packages/shared/src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		// Breakpoints — Tailwind defaults, explicitly declared for clarity
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				accent: {
					DEFAULT: '#84e1bc',
					bright: '#b8f5d8',
					deep: '#0fb083',
				},
				surface: {
					DEFAULT: 'rgba(255, 255, 255, 0.04)',
					strong: 'rgba(255, 255, 255, 0.08)',
				},
			},
			// Use CSS variables emitted by next/font so the loaded font is always used
			fontFamily: {
				sans: ['var(--font-geist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
				serif: ['var(--font-instrument-serif)', 'ui-serif', 'serif'],
			},
			borderRadius: {
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			animation: {
				'slide-up': 'slideUp 300ms ease-out',
				'fade-in': 'fadeIn 200ms ease-out',
				'spin-slow': 'spin 2s linear infinite',
			},
			keyframes: {
				slideUp: {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
		},
		// Native Tailwind container with fluid padding matching container-app
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
			},
		},
	},
	plugins: [
		// Safe-area utilities for iOS notch / home bar
		plugin(({ addUtilities }) => {
			addUtilities({
				'.safe-bottom': {
					paddingBottom: 'env(safe-area-inset-bottom, 0px)',
				},
				'.safe-top': {
					paddingTop: 'env(safe-area-inset-top, 0px)',
				},
				'.safe-left': {
					paddingLeft: 'env(safe-area-inset-left, 0px)',
				},
				'.safe-right': {
					paddingRight: 'env(safe-area-inset-right, 0px)',
				},
			});
		}),
	],
};

// craftsman-ignore: TS002
export default config;
