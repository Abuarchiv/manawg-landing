// Echte App-Bildschirme (390 × 797, aufgenommen mit demo/app/screens.mjs) mit den antippbaren Stellen aus hotspots.json.
const BASE = new URL('screens/', import.meta.url).href;
export function start({ app, done }) {
	const screen = app.querySelector('.screen');
	const H = fetch(`${BASE}hotspots.json`).then((r) => r.json());
	const imgs = [0, 1].map(() => {
		const i = document.createElement('img');
		i.className = 'scr';
		i.alt = '';
		i.draggable = false;
		screen.appendChild(i);
		return i;
	});
	const layer = document.createElement('div');
	layer.className = 'hot';
	screen.appendChild(layer);
	const st = { bon: false, milch: false, putz: false, haushalt: 'einkauf' };
	let cur = null;
	let front = 0;
	// Bilder vorladen, damit kein Wechsel aufblitzt
	for (const n of [
		'start',
		'finanzen',
		'finanzen-nach',
		'einkauf',
		'einkauf-nach',
		'putzen',
		'putzen-dialog',
		'putzen-nach',
	])
		new Image().src = `${BASE + n}.jpg`;
	const name = (n) =>
		({
			finanzen: st.bon ? 'finanzen-nach' : 'finanzen',
			einkauf: st.milch ? 'einkauf-nach' : 'einkauf',
			putzen: st.putz ? 'putzen-nach' : 'putzen',
		})[n] ?? n;
	async function show(ziel) {
		const n = name(ziel);
		if (n === cur) return;
		cur = n;
		const next = imgs[1 - front];
		next.src = `${BASE + n}.jpg`;
		await next.decode().catch(() => {});
		next.classList.add('on');
		imgs[front].classList.remove('on');
		front = 1 - front;
		const spots = (await H)[n] ?? {};
		layer.innerHTML = '';
		for (const [k, [x, y, w, h]] of Object.entries(spots)) {
			const b = document.createElement('button');
			b.type = 'button';
			b.dataset.k = k;
			b.setAttribute('aria-label', k);
			// Trefferfläche mindestens 44 px
			const pw = Math.max(0, 44 - w) / 2;
			const ph = Math.max(0, 44 - h) / 2;
			Object.assign(b.style, {
				left: `${x - pw}px`,
				top: `${y - ph}px`,
				width: `${w + 2 * pw}px`,
				height: `${h + 2 * ph}px`,
			});
			b.addEventListener('click', () => tap(k));
			layer.appendChild(b);
		}
	}
	function tap(k) {
		if (k === 'start') return show('start');
		if (k === 'finanzen') return show('finanzen');
		if (k === 'haushalt') return show(st.haushalt);
		if (k === 'einkauf') {
			st.haushalt = 'einkauf';
			return show('einkauf');
		}
		if (k === 'putzplan') {
			st.haushalt = 'putzen';
			return show('putzen');
		}
		if (k === 'milch' && cur === 'start') {
			st.haushalt = 'einkauf';
			return show('einkauf');
		}
		if (k === 'milch') {
			st.milch = true;
			done('milch');
			return show('einkauf');
		}
		if (k === 'bad' && cur === 'start') {
			st.haushalt = 'putzen';
			return show('putzen');
		}
		if (k === 'bad') return show('putzen-dialog');
		if (k === 'abbrechen') return show('putzen');
		if (k === 'ok') {
			st.putz = true;
			done('putz');
			return show('putzen');
		}
	}
	show('start');
	return {
		bon() {
			st.bon = true;
			done('bon');
			show('finanzen');
		},
	};
}
