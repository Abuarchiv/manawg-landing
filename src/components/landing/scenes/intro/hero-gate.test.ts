// Run with: pnpm test (node test runner, no framework)
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { wantsGL } from './hero-gate.ts';

const desktop = { w: 1440, h: 900, reduced: false };

test('desktop in landscape gets the WebGL hero', () => {
	assert.equal(wantsGL(desktop), true);
	assert.equal(wantsGL({ ...desktop, cores: 8, memory: 8, saveData: false }), true);
});

test('phones and narrow or portrait windows get the static hero', () => {
	assert.equal(wantsGL({ ...desktop, w: 412, h: 823 }), false); // Lighthouse mobile (Moto G Power)
	assert.equal(wantsGL({ ...desktop, w: 699, h: 400 }), false); // below the 700 px breakpoint
	assert.equal(wantsGL({ ...desktop, w: 900, h: 1200 }), false); // tablet in portrait
	assert.equal(wantsGL({ ...desktop, w: 850, h: 390 }), false); // phone in landscape (short)
});

test('reduced motion, data saver and low-power devices get the static hero', () => {
	assert.equal(wantsGL({ ...desktop, reduced: true }), false);
	assert.equal(wantsGL({ ...desktop, saveData: true }), false);
	assert.equal(wantsGL({ ...desktop, cores: 2 }), false);
	assert.equal(wantsGL({ ...desktop, memory: 2 }), false);
});
