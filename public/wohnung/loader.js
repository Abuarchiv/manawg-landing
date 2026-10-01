// Ladebildschirm: 0,00 € zählt auf 100,00 €, teilt sich durch vier, die Teile werden zum Logo (acht Körper, Goo-Filter).
const BODIES = [
	[200, 198, 80],
	[77, 105, 52],
	[142, 302, 33],
	[274, 297, 44],
	[194, 32, 29],
	[288, 70, 42],
	[360, 177, 56],
	[42, 239, 44],
];
const NAMES = ['Lea', 'Mika', 'Jona', 'Sami'];
const el = document.createElement('div');
el.className = 'loader';
el.innerHTML = `
	<div class="l-top mono"><span>ManaWG</span><span>Weserstraße 12 · 3. OG links</span></div>
	<div class="l-sum"><span class="l-val">0,00</span><span class="l-cur">€</span></div>
	<div class="l-parts">${NAMES.map((n) => `<div class="l-part"><b>25,00 €</b><span class="mono">${n}</span></div>`).join('')}</div>
	<svg class="l-logo" viewBox="0 0 416 346" aria-hidden="true"><defs>
		<filter id="l-goo" x="-12%" y="-12%" width="124%" height="124%"><feGaussianBlur stdDeviation="19"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 26 -11"/></filter>
		<mask id="l-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="416" height="346"><g filter="url(#l-goo)" fill="#fff">${BODIES.map(([x, y, r], i) => `<circle class="l-b" style="--i:${i}" cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><circle cx="207" cy="175" r="22" fill="#000"/></mask>
	</defs><rect width="416" height="346" fill="currentColor" mask="url(#l-mask)"/></svg>
	<div class="l-bot mono"><span class="l-line">// Geld, Putzplan, Einkauf</span><span class="l-pct">000</span></div>`;
document.body.prepend(el);
document.documentElement.classList.add('loading');

let target = 0;
let shown = 0;
const t0 = performance.now();
let resolveDone;
const val = el.querySelector('.l-val');
const pct = el.querySelector('.l-pct');
const finished = new Promise((r) => {
	resolveDone = r;
});
const MIN_MS = 2200;
function tick(now) {
	// Anzeige folgt dem echten Ladefortschritt, aber nie schneller als MIN_MS
	const cap = Math.min(1, (now - t0) / MIN_MS);
	shown += (Math.min(target, cap) - shown) * 0.12;
	if (target >= 1 && cap >= 1 && 1 - shown < 0.002) shown = 1;
	val.textContent = (shown * 100).toFixed(2).replace('.', ',');
	pct.textContent = String(Math.round(shown * 100)).padStart(3, '0');
	if (shown < 1) return requestAnimationFrame(tick);
	el.classList.add('split'); // 100,00 € → 4 × 25,00 €
	setTimeout(() => el.classList.add('logo'), 1100); // Teile → Logo
	setTimeout(() => {
		el.classList.add('out');
		document.documentElement.classList.remove('loading');
		resolveDone();
	}, 2500);
	setTimeout(() => el.remove(), 4000);
}
requestAnimationFrame(tick);

export const loader = {
	progress: (x) => {
		target = Math.max(target, x);
	},
	done: () => finished,
};
