import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/topics/**/*.{ts,tsx}',
		'./src/content/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', '"Inter Fallback"', 'system-ui', 'sans-serif'],
				display: ['"Inter Tight"', '"Inter Tight Fallback"', 'sans-serif'],
				mono: ['"JetBrains Mono"', '"JetBrains Mono Fallback"', 'monospace'],
			},
		},
	},
};

export default config;
