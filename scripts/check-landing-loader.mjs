import assert from 'node:assert/strict';

const fields = new Map();
const classList = { add() {}, remove() {} };
globalThis.document = {
	createElement: () => ({
		classList,
		querySelector: (key) => {
			const field = { textContent: '' };
			fields.set(key, field);
			return field;
		},
	}),
	body: { prepend() {} },
	documentElement: { classList },
};
let tick;
globalThis.requestAnimationFrame = (callback) => {
	tick = callback;
};

// A frame timestamp can precede the performance.now() taken during module setup.
for (const reduced of [false, true]) {
	globalThis.matchMedia = () => ({ matches: reduced });
	await import(`../public/wohnung/loader.js?reduced=${reduced}`);
	tick(-1);
	assert.equal(fields.get('.l-val').textContent, '0,00');
	assert.equal(fields.get('.l-pct').textContent, '000');
}
process.stdout.write('PASS: no negative loading amount, including reduced motion.\n');
