import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
				serif: ['var(--font-instrument-serif)', 'ui-serif', 'serif'],
			},
		},
	},
};

export default config;
