// ManaWG-Demo: Zustandsautomat ohne Framework über den aufgenommenen Zuständen der echten App.
// Alle Zustände (Seiten und Overlays) liegen als <template> in index.html, der Graph (Klickfolgen, Welten) im
// <script id="model">. Jedes Element stammt aus einer Aufnahme der App (design/app-ref). Gebaut von
// design/app-ref/tools/build-demo.mjs. Nichts hier erfindet Inhalt: demo.js tauscht Aufnahmen aus und animiert
// die Übergänge mit den Dauern und Kurven der App (REF §7) über deren eigenes CSS (data-open, data-ending-style).
(() => {
	'use strict';
	const M = JSON.parse(document.getElementById('model').textContent);
	const Q = new URLSearchParams(location.search);
	const REF = Q.get('ref') === '1';
	const FRAMED = !REF && window.parent !== window;
	const root = document.documentElement;
	const app = document.getElementById('app');
	const layer = document.getElementById('layer');

	// ---------------------------------------------------------------- Uhr und Datum
	// Ref-Modus: feste Uhr Di, 06.10.2026 17:43 Europe/Berlin (Zeitpunkt der Originalaufnahmen), Insets 0.
	const REF_NOW = Date.parse('2026-10-06T15:43:00Z');
	const clock = () => (REF ? REF_NOW : Date.now());
	const T0 = clock();
	const TZ = 'Europe/Berlin';
	const dtf = (o) => new Intl.DateTimeFormat('de-DE', { timeZone: 'UTC', ...o });
	const FMT = {
		kurz: dtf({ weekday: 'short', day: 'numeric', month: 'short' }), // Do., 8. Okt.
		wd0: { format: (u) => dtf({ weekday: 'short' }).format(u).replace(/\.$/, '') }, // Mi
		d: dtf({ day: 'numeric' }), // 7
		mon0: { format: (u) => dtf({ month: 'short' }).format(u).replace(/\.$/, '') }, // Okt
		wdlm: dtf({ weekday: 'long', day: 'numeric', month: 'long' }), // Donnerstag, 8. Oktober
		tm: dtf({ day: '2-digit', month: '2-digit' }), // 13.10.
		dmy: dtf({ day: 'numeric', month: 'numeric', year: 'numeric' }), // 6.10.2026
		lang: dtf({ weekday: 'long', day: '2-digit', month: 'long' }), // Dienstag, 06. Oktober
		voll: dtf({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), // Mittwoch, 7. Oktober 2026
		my: dtf({ month: 'long', year: 'numeric' }), // Oktober 2026
		dm: dtf({ day: '2-digit', month: '2-digit', year: 'numeric' }), // 06.10.2026
	};
	const berlin = (ms) => {
		const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(ms).map((x) => [x.type, x.value]));
		return { y: +p.year, m: +p.month, d: +p.day, hh: p.hour, mm: p.minute };
	};
	/** Kalendertag in Berlin + k Tage als UTC-Mittag (nur zum Formatieren). */
	const day = (k, ms = clock()) => {
		const b = berlin(ms);
		return Date.UTC(b.y, b.m - 1, b.d + k, 12);
	};
	const dow = (u) => new Date(u).getUTCDay();
	const nextFriday = () => ((5 - dow(day(0)) + 7) % 7) || 7;
	const hhmm = (ms) => {
		const b = berlin(ms);
		return `${b.hh}:${b.mm}`;
	};
	/** Format der App (formatRelativeTime, core/utils/time.ts) für "vor Minuten". */
	const ago = (min) => {
		const diff = min * 60000;
		if (diff < 60000) return 'gerade eben';
		if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min`;
		if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std`;
		const d = Math.floor(diff / 86400000);
		return d === 1 ? 'gestern' : `vor ${d} Tagen`;
	};
	const nextMonth3 = (n) => {
		// n-te Buchung "am 03." des Folgemonats: Wert für {{M:n|tm}} (Fixkosten laufen am 3. jedes Monats)
		const b = berlin(clock());
		return Date.UTC(b.y, b.m - 1 + n, 3, 12);
	};
	const S = { sent: null }; // Zeitpunkt der gesendeten Chat-Antwort
	// Tokens: {{D:k:fmt}} Tag + k, {{F:fmt}} nächster Freitag, {{M:n:fmt}} 3. des n-ten Folgemonats, {{A:min}} "vor n",
	// {{CT:n}} Chat-Uhrzeit n (0..2 = T0 - 62/41/14 min, 3 = Antwort), {{CD:n}} dazugehöriges datetime/title
	const TOK = (s) =>
		s.replace(/\{\{([^}]+)\}\}/g, (_, t) => {
			const a = t.split(':');
			switch (a[0]) {
				case 'D':
					return FMT[a[2]].format(day(+a[1]));
				case 'F':
					return FMT[a[1]].format(day(nextFriday()));
				case 'TF': {
					const b = berlin(T0 - +a[1] * 60000);
					return `${String(b.d).padStart(2, '0')}.${String(b.m).padStart(2, '0')}.${b.y}, ${b.hh}:${b.mm}`;
				}
				case 'M':
					return FMT[a[2]].format(nextMonth3(+a[1]));
				case 'A':
					return ago(+a[1] + (clock() - T0) / 60000);
				case 'CT': {
					const ms = a[1] === '3' ? (S.sent ?? clock()) : T0 - [62, 41, 14][+a[1]] * 60000;
					return hhmm(ms);
				}
				case 'CD': {
					const ms = a[1] === '3' ? (S.sent ?? clock()) : T0 - [62, 41, 14][+a[1]] * 60000;
					const b = berlin(ms);
					return `${String(b.d).padStart(2, '0')}.${String(b.m).padStart(2, '0')}.${b.y}, ${b.hh}:${b.mm}`;
				}
				default:
					return '';
			}
		});

	// ---------------------------------------------------------------- Vorlagen
	const tpl = (id) => {
		const t = document.getElementById(`t-${id}`);
		if (!t) return '';
		return TOK(t.innerHTML.replace(/<x-s i="(\d+)"><\/x-s>/g, (_, i) => M.s[i]).replace(/ class="~(\d+)"/g, (_, i) => ` class="${M.c[i]}"`));
	};

	// ---------------------------------------------------------------- Zustand
	const st = { w: '-', id: null, busy: false, timer: 0, over: null /* Element des Overlays */, overKey: null };
	const node = (w, id) => {
		let n = M.nodes[w]?.[id];
		const base = M.nodes['-'][id];
		if (!n && !base) return null;
		if (!n) {
			// Welt ohne eigene Aufnahme dieses Zustands: Seite der Welt, Overlay und Kanten der Ausgangswelt
			const rt = id.split('|')[0];
			const rel = M.rel[rt] || '';
			const set = w === '-' ? [] : w.split('+');
			const sub = M.flags.filter((f) => rel.includes(f) && set.includes(f)).join('+') || '-';
			n = { ...base, p: base.v ? base.p : (M.pg[`${rt}|${sub}`] ?? base.p) };
		}
		if (n.x) n = { ...n, e: { ...(node(w, n.x)?.e ?? {}), ...n.e } }; // Zustand direkt nach einer Änderung: Bedienung wie die Route
		return n;
	};
	const cur = () => node(st.w, st.id);
	const hasOver = (n) => !!(n && n.o);

	// Fokus: der Zustand merkt sich das fokussierte Element (data-k), die Eingabefelder sind schreibgeschützt
	// (das Antippen tippt den aufgenommenen Text, keine Bildschirmtastatur auf dem Handy).
	const prep = (rootEl) => {
		for (const i of rootEl.querySelectorAll('input,textarea')) {
			i.readOnly = true;
			i.setAttribute('inputmode', 'none');
			i.removeAttribute('autofocus');
		}
		for (const a of rootEl.querySelectorAll('a[href]')) a.setAttribute('href', '#');
	};

	const setPage = (n) => {
		app.innerHTML = tpl(`p-${n.p}`);
		prep(app);
		document.body.setAttribute('style', n.b || '');
	};

	/** Overlay einsetzen und mit dem CSS der App animieren (Beginn über data-starting-style). */
	const showOver = (n, still) => {
		const el = document.createElement('div');
		el.className = still ? 'demo-over demo-still' : 'demo-over';
		el.innerHTML = tpl(`o-${n.o}`);
		prep(el);
		layer.appendChild(el);
		st.over = el;
		st.overKey = n.o;
		const sty = el.querySelectorAll('[data-slot=drawer-overlay],[data-slot=drawer-popup]');
		for (const s of sty) s.setAttribute('data-starting-style', '');
		if (sty.length) {
			void el.offsetWidth;
			requestAnimationFrame(() => requestAnimationFrame(() => { for (const s of sty) s.removeAttribute('data-starting-style'); }));
		}
	};
	/** Overlay schließen: Sheets über data-ending-style (400 ms), Dialoge über data-closed (animate-out, 220 ms). */
	const hideOver = (instant) => {
		const el = st.over;
		if (!el) return;
		st.over = null;
		st.overKey = null;
		if (instant) return el.remove();
		const sty = el.querySelectorAll('[data-slot=drawer-overlay],[data-slot=drawer-popup]');
		let ms = 220;
		if (sty.length) {
			for (const s of sty) {
				s.removeAttribute('data-open');
				s.setAttribute('data-ending-style', '');
			}
			ms = 420;
		} else {
			for (const s of el.querySelectorAll('[data-open]')) {
				s.removeAttribute('data-open');
				s.setAttribute('data-closed', '');
			}
			for (const s of el.querySelectorAll('[role=menu],[data-slot*=popup]')) s.setAttribute('data-closed', '');
		}
		el.style.pointerEvents = 'none';
		setTimeout(() => el.remove(), ms);
	};

	const focusKey = (n) => {
		if (!n.f) return;
		const el = document.querySelector(`[data-k="${CSS.escape(n.f)}"]`);
		if (el) el.focus({ preventScroll: true });
	};

	const enter = (w, id, opts = {}) => {
		const n = node(w, id);
		if (!n) return false;
		const prev = st.id ? cur() : null;
		clearTimeout(st.timer);
		st.w = w;
		st.id = id;
		const pageChanged = !prev || prev.p !== n.p || opts.force;
		if (pageChanged) setPage(n);
		else document.body.setAttribute('style', n.b || '');
		const wasOver = !!st.over;
		if (prev && prev.o && prev.o !== n.o && !n.o) hideOver(opts.instant);
		else if (!n.o) hideOver(true);
		if (n.o && st.overKey !== n.o) {
			hideOver(true);
			// Overlay -> Overlay (z. B. nach dem Tippen im Formular): ohne erneutes Einblenden austauschen
			showOver(n, wasOver || opts.instant);
		}
		if (n.t) root.style.setProperty('--thumb-action-space', '52px');
		else root.style.removeProperty('--thumb-action-space');
		focusKey(n);
		if (n.a) st.timer = setTimeout(() => enter(w, n.a[1]), n.a[0]);
		if (pageChanged) window.scrollTo(0, 0);
		document.dispatchEvent(new CustomEvent('demo:state', { detail: { w, id } }));
		return true;
	};

	// ---------------------------------------------------------------- Eingaben
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const typeInto = async (el, text, per) => {
		el.focus({ preventScroll: true });
		el.value = '';
		for (const c of text) {
			el.value += c;
			await sleep(per);
		}
	};

	/** Weg über Eingabe-/Klick-Kanten bis zu einer Kante mit dem Schlüssel k (für Felder, die vor ihrer Reihe angetippt werden). */
	const pathTo = (w, id, k) => {
		const seen = new Set([id]);
		const q = [[id, []]];
		while (q.length) {
			const [cid, path] = q.shift();
			const n = node(w, cid);
			for (const [key, e] of Object.entries(n?.e ?? {})) {
				if (e.k !== 'y' && e.k !== 'p') continue;
				if (key === k) return [...path, [cid, key, e]];
				if (!seen.has(e.t) && e.k === 'y') {
					seen.add(e.t);
					q.push([e.t, [...path, [cid, key, e]]]);
				}
			}
		}
		return null;
	};

	const runEdge = async (cid, key, e, per) => {
		st.busy = true;
		try {
			if (e.k === 'y') {
				const el = document.querySelector(`[data-k="${CSS.escape(key)}"]`);
				if (el) await typeInto(el, e.x, per);
				await sleep(120);
			}
			apply(e);
		} finally {
			st.busy = false;
		}
	};

	/** Wendet eine Kante an: Welt wechseln (Änderung der Daten), Zielzustand betreten. */
	const apply = (e) => {
		let w = st.w;
		if (e.add) {
			const set = new Set(w === '-' ? [] : w.split('+'));
			set.add(e.add);
			w = M.flags.filter((f) => set.has(f)).join('+') || '-';
		}
		if (e.msg === 'C') S.sent = clock();
		enter(w, e.t, { force: !!e.add });
	};

	const click = async (target) => {
		if (st.busy) return;
		const n = cur();
		if (!n) return;
		const el = target.closest('[data-k]');
		// Klick auf die Fläche außerhalb des Sheets/Dialogs schließt (Dialoge mit Pflichtantwort ausgenommen)
		if (!el) {
			if (n.o && target.closest('[data-slot=drawer-viewport],[data-slot=dialog-viewport],[data-slot=drawer-overlay],[data-slot=dialog-overlay]') && !target.closest('[data-slot=drawer-popup],[data-slot=dialog-content]')) {
				const p = M.parent[st.id];
				if (p) enter(st.w, p);
			}
			return;
		}
		const k = el.getAttribute('data-k');
		const e = n.e?.[k];
		if (e && e.k !== 'm' && e.k !== 'x') {
			if (e.k === 'y') return runEdge(st.id, k, e, 60);
			return apply(e);
		}
		if (e?.k === 'm' && e.t) return apply(e);
		// Eingabefeld vor seiner Reihe angetippt: fehlende Felder der Reihe nach tippen
		if (/^(input|textarea)\|/.test(k)) {
			const path = pathTo(st.w, st.id, k);
			if (path) {
				st.busy = true;
				try {
					for (const [cid, key, ed] of path) {
						if (ed.k === 'y') {
							const f = document.querySelector(`[data-k="${CSS.escape(key)}"]`);
							if (f) await typeInto(f, ed.x, path.length > 1 ? 14 : 60);
							await sleep(60);
						}
						apply(ed);
						await sleep(30);
					}
				} finally {
					st.busy = false;
				}
			}
		}
	};

	document.addEventListener('click', (ev) => {
		const a = ev.target.closest('a');
		if (a) ev.preventDefault();
		if (ev.target.closest('form')) ev.preventDefault();
		click(ev.target);
	});
	document.addEventListener('submit', (ev) => ev.preventDefault());
	document.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape' && cur()?.o && M.parent[st.id]) {
			ev.preventDefault();
			enter(st.w, M.parent[st.id]);
		}
		if ((ev.key === 'Enter' || ev.key === ' ') && ev.target instanceof Element && ev.target.matches('[role=checkbox],[role=menuitem],summary,[data-k]:not(button,a,input,textarea,select)')) {
			ev.preventDefault();
			click(ev.target);
		}
	});

	// ---------------------------------------------------------------- Zeiger und Scroll an die Landing
	if (FRAMED) {
		const fe = window.frameElement;
		const send = (type, e) => {
			if (!fe) return;
			const r = fe.getBoundingClientRect();
			const s = r.width / 390;
			const o = { bubbles: true, cancelable: false, composed: true, clientX: r.left + e.clientX * s, clientY: r.top + e.clientY * s, pointerType: e.pointerType || 'mouse', pointerId: e.pointerId || 1, isPrimary: true, buttons: e.buttons, button: e.button };
			fe.dispatchEvent(new (window.parent.PointerEvent || PointerEvent)(type, o));
		};
		for (const t of ['pointermove', 'pointerdown', 'pointerup', 'pointercancel']) addEventListener(t, (e) => send(t, e), { passive: true, capture: true });
		document.addEventListener('pointerleave', (e) => send('pointerleave', e));
		root.addEventListener('mouseleave', (e) => send('pointerleave', e));
		// Rad: der Bildschirm der App scrollt nicht, die Seite der Landing schon
		addEventListener('wheel', (e) => { e.preventDefault(); window.parent.scrollBy({ left: e.deltaX, top: e.deltaY, behavior: 'instant' }); }, { passive: false });
		root.classList.add('framed');
	}

	// ---------------------------------------------------------------- Start
	const start = () => {
		root.style.setProperty('--sai-top', REF ? '0px' : '47px');
		root.style.setProperty('--sai-bottom', REF ? '0px' : '34px');
		const ns = Q.get('state');
		let w = '-';
		let id = M.start;
		if (ns && M.ref[ns]) [w, id] = M.ref[ns];
		enter(w, id, { force: true, instant: true });
		window.__demo = { state: () => ({ w: st.w, id: st.id }), enter, node, model: M, ref: M.ref, now: clock };
		document.documentElement.setAttribute('data-bereit', '1');
	};
	if (document.fonts?.ready) document.fonts.ready.then(start);
	else start();
})();
