import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// craftsman-ignore: TS002
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules/**'],
		setupFiles: ['./src/test-setup.ts'],
	},
});
