// English build of the player (derived from ../app-demo/demo.js: Intl en-GB, English relative times, toasts and control labels).
// ManaWG demo: a framework-free state machine over the recorded states of the real app.
// All states (pages and overlays) sit as <script type="text/plain"> in index.html (raw text, no DOM built on load), the graph (click chains, worlds) in
// <script id="model">. Every element comes from a recording of the app (landing-konzept/werkzeuge/app-demo). Built by
// landing-konzept/werkzeuge/app-demo/build-demo.mjs. Nothing here invents content: demo.js swaps recordings and animates
// the transitions with the durations and curves of the app (REF §7) through the app's own CSS (data-open, data-ending-style).
(() => {
	'use strict';
	const M = JSON.parse(document.getElementById('model').textContent);
	const Q = new URLSearchParams(location.search);
	const REF = Q.get('ref') === '1';
	const FRAMED = !REF && window.parent !== window;
	const root = document.documentElement;
	const app = document.getElementById('app');
	const layer = document.getElementById('layer');
	// Light or dark like the landing page around it (html[data-theme], src/lib/theme.ts); on its own via ?theme= or the system
	const theme = () => {
		let light = null;
		try {
			if (FRAMED) light = window.parent.document.documentElement.dataset.theme === 'light';
		} catch {}
		if (light === null) light = Q.get('theme') ? Q.get('theme') === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
		root.classList.toggle('dark', !light);
		root.style.colorScheme = light ? 'light' : 'dark';
	};
	theme();
	if (FRAMED) new MutationObserver(theme).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	// Transition between pages: a short cross-fade with the curve of the app
	document.head.insertAdjacentHTML('beforeend', '<style>::view-transition-old(root),::view-transition-new(root){animation-duration:200ms;animation-timing-function:cubic-bezier(.2,0,0,1)}</style>');

	// ---------------------------------------------------------------- Clock and dates
	// Fixed clock Tue 06 Oct 2026 17:43 Europe/Berlin (time of the original recordings): all date and
	// time texts of the preview are fixed, nothing follows the system time (at night "Pizza tonight?" at 00:14 would not be believable).
	const REF_NOW = Date.parse('2026-10-06T15:43:00Z');
	const clock = () => REF_NOW;
	const T0 = clock();
	const TZ = 'Europe/Berlin';
	const dtf = (o) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o });
	const FMT = {
		kurz: dtf({ weekday: 'short', day: 'numeric', month: 'short' }), // Thu 8 Oct
		wd0: { format: (u) => dtf({ weekday: 'short' }).format(u) }, // Wed
		d: dtf({ day: 'numeric' }), // 7
		mon0: { format: (u) => dtf({ month: 'short' }).format(u) }, // Oct
		wdlm: dtf({ weekday: 'long', day: 'numeric', month: 'long' }), // Thursday 8 October
		tm: dtf({ day: 'numeric', month: 'short' }), // 13 Oct
		dmy: dtf({ day: 'numeric', month: 'numeric', year: 'numeric' }), // 6/10/2026
		lang: dtf({ weekday: 'long', day: '2-digit', month: 'long' }), // Tuesday 06 October
		voll: dtf({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), // Wednesday, 7 October 2026
		my: dtf({ month: 'long', year: 'numeric' }), // October 2026
		dm: dtf({ day: '2-digit', month: '2-digit', year: 'numeric' }), // 06/10/2026
	};
	const berlin = (ms) => {
		const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(ms).map((x) => [x.type, x.value]));
		return { y: +p.year, m: +p.month, d: +p.day, hh: p.hour, mm: p.minute };
	};
	/** Calendar day in Berlin + k days as UTC noon (only used for formatting). */
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
	/** Format of the app (formatRelativeTime, core/utils/time.ts, English catalogue common.time) for "n min ago". */
	const ago = (min) => {
		const diff = min * 60000;
		if (diff < 60000) return 'just now';
		if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
		if (diff < 86400000) return `${Math.floor(diff / 3600000)} h ago`;
		const d = Math.floor(diff / 86400000);
		return d === 1 ? 'yesterday' : `${d} days ago`;
	};
	/** Title of a <time> element: "5 Oct 2026, 15:51" (day, short month, year, Berlin time). */
	const stamp = (b) => `${dtf({ day: 'numeric', month: 'short', year: 'numeric' }).format(Date.UTC(b.y, b.m - 1, b.d, 12))}, ${b.hh}:${b.mm}`;
	const nextMonth3 = (n) => {
		// n-th booking "on the 3rd" of the following month: value for {{M:n|tm}} (fixed costs run on the 3rd of every month)
		const b = berlin(clock());
		return Date.UTC(b.y, b.m - 1 + n, 3, 12);
	};
	const S = { sent: null }; // time the chat reply was sent
	// Tokens: {{D:k:fmt}} day + k, {{F:fmt}} next Friday, {{M:n:fmt}} the 3rd of the n-th following month, {{A:min}} "n ago",
	// {{CT:n}} chat time n (minutes before T0 from CHAT_AGO in history order, n = length: the reply), {{CD:n}} datetime/title
	const CHAT_AGO = [1560, 1540, 1530, 95, 62, 41, 30, 14]; // Seed in landing-konzept/werkzeuge/app-demo/demo-server.mjs
	const TOK = (s) =>
		s.replace(/\{\{([^}]+)\}\}/g, (_, t) => {
			const a = t.split(':');
			switch (a[0]) {
				case 'D':
					return FMT[a[2]].format(day(+a[1]));
				case 'F':
					return FMT[a[1]].format(day(nextFriday()));
				case 'TF': {
					return stamp(berlin(T0 - +a[1] * 60000));
				}
				case 'MO':
					return FMT.my.format(Date.UTC(berlin(clock()).y, berlin(clock()).m - 1 + +a[1], 1, 12));
				case 'M':
					return FMT[a[2]].format(nextMonth3(+a[1]));
				case 'A':
					return ago(+a[1] + (clock() - T0) / 60000);
				case 'CT': {
					const ms = +a[1] >= CHAT_AGO.length ? (S.sent ?? clock()) : T0 - CHAT_AGO[+a[1]] * 60000;
					return hhmm(ms);
				}
				case 'CD': {
					const ms = +a[1] >= CHAT_AGO.length ? (S.sent ?? clock()) : T0 - CHAT_AGO[+a[1]] * 60000;
					return stamp(berlin(ms));
				}
				default:
					return '';
			}
		});

	// ---------------------------------------------------------------- Templates
	const tpl = (id) => {
		const t = document.getElementById(`t-${id}`);
		if (!t) return '';
		return TOK(t.textContent.replace(/<x-s i="(\d+)"><\/x-s>/g, (_, i) => M.s[i]).replace(/ class="~(\d+)"/g, (_, i) => ` class="${M.c[i]}"`));
	};

	// ---------------------------------------------------------------- State
	const st = { w: '-', id: null, busy: false, timer: 0, over: null /* Element des Overlays */, overKey: null };
	const node = (w, id) => {
		let n = M.nodes[w]?.[id];
		const base = M.nodes['-'][id];
		if (!n && !base) return null;
		if (!n) {
			// World without its own recording of this state: page of the world, overlay and edges of the base world
			const rt = id.split('|')[0];
			const rel = M.rel[rt] || '';
			const set = w === '-' ? [] : w.split('+');
			const sub = M.flags.filter((f) => rel.includes(f) && set.includes(f)).join('+') || '-';
			n = { ...base, p: base.v ? base.p : (M.pg[`${rt}|${sub}`] ?? base.p) };
		}
		// End state of a recording (depth reached, no edges of its own): behaves like the state of the last step, otherwise like the route
		if (n.v && !n.x && !n.o && !Object.keys(n.e).length) {
			const rt = id.split('|')[0];
			const alt = `${rt}|${id.split('>').pop()}`;
			const x = alt !== id && M.nodes['-'][alt] ? alt : `${rt}|`;
			if (x !== id) n = { ...n, x };
		}
		if (n.x) n = { ...n, e: { ...(node(w, n.x)?.e ?? {}), ...n.e } }; // state right after a change: controls like the route
		return n;
	};
	const cur = () => node(st.w, st.id);
	const hasOver = (n) => !!(n && n.o);

	// Focus: the state remembers the focused element (data-k), the input fields are read-only
	// (tapping types the recorded text, there is no on-screen keyboard on the phone).
	const prep = (rootEl) => {
		for (const i of rootEl.querySelectorAll('input,textarea')) {
			i.readOnly = true;
			i.setAttribute('inputmode', 'none');
			i.removeAttribute('autofocus');
		}
		for (const a of rootEl.querySelectorAll('a[href]')) a.setAttribute('href', '#');
	};

	/** Recalculate the month grid to the current month (numbers, labels, today, event dots). */
	const gridFix = (rootEl) => {
		for (const tb of rootEl.querySelectorAll('table[role=grid]')) {
			let g;
			try {
				g = JSON.parse(tb.getAttribute('data-g') || '');
			} catch {
				continue;
			}
			const b0 = berlin(clock());
			const first = Date.UTC(b0.y, b0.m - 1 + g.m, 1, 12);
			const lead = (new Date(first).getUTCDay() + 6) % 7;
			const today = day(0);
			const ev = new Map(Object.entries(g.ev).map(([k, suf]) => [k === 'F' ? nextFriday() : +k, suf]));
			const P = M.grid;
			tb.querySelectorAll('td button[data-day-cell]').forEach((btn, i) => {
				const u = first + (i - lead) * 86400000;
				const k = Math.round((u - today) / 86400000);
				const inMonth = new Date(u).getUTCMonth() === new Date(first).getUTCMonth();
				const suf = ev.get(k);
				const kind = k === 0 ? 'today' : suf !== undefined ? 'ev' : inMonth ? 'in' : 'out';
				if (P && [P.out, P.in, P.today, P.ev].includes(btn.className)) btn.className = P[kind];
				if (kind === 'today') btn.setAttribute('aria-current', 'date');
				else btn.removeAttribute('aria-current');
				btn.setAttribute('tabindex', kind === 'today' ? '0' : '-1');
				btn.setAttribute('aria-label', FMT.voll.format(u) + (suf ?? ''));
				btn.setAttribute('data-day-date', new Date(u - 14 * 3600000).toISOString());
				const num = btn.querySelector('span');
				if (num) {
					num.textContent = String(new Date(u).getUTCDate());
					if (P?.sp && Object.values(P.sp).includes(num.className)) num.className = P.sp[kind];
				}
				const dot = btn.querySelector('span[aria-hidden]');
				if (suf !== undefined && !dot && P) btn.insertAdjacentHTML('beforeend', P.dot);
				if (suf === undefined && dot) dot.remove();
				if (g.keys[i]) btn.setAttribute('data-k', g.keys[i]);
			});
		}
	};

	const masse = new Map(); // measured heights (tab bar per window size, chat per window size and page)
	// Like the app: the tab bar measures itself (with a bottom inset of 84 px instead of the recorded 57 px) so that the content
	// and the chat input end above it instead of behind it. Measured only once per window size (and page):
	// every measurement right after the swap forced a layout of its own, a stutter while the landing scrolls.
	// The chat measures its height in the app by script (down to the tab bar); the recording has it hard-coded
	// without insets, otherwise the input line would sit behind the tab bar.
	const messe = (el, p, vp) => {
		const nav = el.querySelector('nav[data-app-chrome]');
		const shell = el.querySelector('[style*="--app-nav-height"]');
		if (nav && shell) {
			if (!masse.has(vp)) masse.set(vp, nav.offsetHeight);
			shell.style.setProperty('--app-nav-height', `${masse.get(vp)}px`);
		}
		const chat = el.querySelector('[data-chat-frame]');
		const ck = `${vp}|${p}`;
		if (chat && nav) {
			if (!masse.has(ck)) masse.set(ck, nav.getBoundingClientRect().top - chat.getBoundingClientRect().top);
			chat.style.height = `${masse.get(ck)}px`;
		}
	};
	const setPage = (n, morph) => {
		// Tab bar and SubNav stay in place in the app, only the active entry changes (120 ms and 150 ms background).
		// When the page is swapped the new entries start in the old state and glide into the new one.
		const old = morph ? [...app.querySelectorAll('nav')].map((nv) => [...nv.querySelectorAll('a')].map((a) => [a.className, a.getAttribute('aria-current')])) : [];
		// Read the window size before the swap while the layout is still valid
		const vp = `${innerWidth}x${innerHeight}`;
		app.innerHTML = tpl(`p-${n.p}`);
		prep(app);
		gridFix(app);
		messe(app, n.p, vp);
		document.body.setAttribute('style', n.b || '');
		const next = [];
		[...app.querySelectorAll('nav')].forEach((nv, i) => {
			const links = [...nv.querySelectorAll('a')];
			const o = old.find((x, j) => x.length === links.length && !next.includes(j) && next.push(j));
			if (!o) return;
			links.forEach((a, k) => {
				const to = [a.className, a.getAttribute('aria-current')];
				if (to[0] === o[k][0]) return;
				a.className = o[k][0];
				requestAnimationFrame(() => requestAnimationFrame(() => { a.className = to[0]; }));
			});
		});
	};

	/** Insert an overlay and animate it with the CSS of the app (start via data-starting-style). */
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
	/** Close an overlay: sheets via data-ending-style (400 ms), dialogs via data-closed (animate-out, 220 ms). */
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
		const morph = !!prev && !opts.instant && !opts.force;
		// Page changes cross-fade softly (View Transition, 200 ms like a tab change in the app) instead of jumping hard.
		// The browser keeps a picture of the old page meanwhile, the new one is built in the same go. Only for taps of its own:
		// while the landing scrolls it switches without a cross-fade (vt: false), the still picture would cost a frame otherwise.
		if (pageChanged && morph && opts.vt !== false && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			document.startViewTransition(() => wechsel(n, prev, w, opts, pageChanged, morph));
			return true;
		}
		return wechsel(n, prev, w, opts, pageChanged, morph);
	};

	const wechsel = (n, prev, w, opts, pageChanged, morph) => {
		const y0 = scrollY; // read before the swap: reading afterwards forces a layout
		if (pageChanged) setPage(n, morph);
		else document.body.setAttribute('style', n.b || '');
		const wasOver = !!st.over;
		if (prev && prev.o && prev.o !== n.o && !n.o) hideOver(opts.instant);
		else if (!n.o) hideOver(true);
		if (n.o && st.overKey !== n.o) {
			hideOver(true);
			// Overlay -> overlay (e.g. after typing in the form): swap without fading in again
			showOver(n, wasOver || opts.instant);
		}
		if (n.t) root.style.setProperty('--thumb-action-space', '52px');
		else root.style.removeProperty('--thumb-action-space');
		focusKey(n);
		if (n.a) st.timer = setTimeout(() => enter(w, n.a[1]), n.a[0]);
		if (pageChanged && y0) window.scrollTo(0, 0);
		// Like in the app the chat sits at the end of the history (the recording stores no scroll position). It is set
		// after the next layout, before painting (ResizeObserver): setting it at once forced a layout of its own.
		const vp = app.querySelector('[data-slot="message-scroller-viewport"]');
		if (vp) {
			const ro = new ResizeObserver(() => {
				ro.disconnect();
				vp.scrollTop = vp.scrollHeight;
			});
			ro.observe(vp);
		}
		document.dispatchEvent(new CustomEvent('demo:state', { detail: { w, id: st.id } }));
		return true;
	};

	// ---------------------------------------------------------------- Input
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const typeInto = async (el, text, per) => {
		el.focus({ preventScroll: true });
		el.value = '';
		for (const c of text) {
			el.value += c;
			await sleep(per);
		}
	};

	/** Path over input/click edges to an edge with key k (for fields tapped before their row). */
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

	/** Apply an edge: switch world (data change), enter the target state. */
	const apply = (e) => {
		let w = st.w;
		if (e.add) {
			const set = new Set(w === '-' ? [] : w.split('+'));
			set.add(e.add);
			w = M.flags.filter((f) => set.has(f)).join('+') || '-';
		}
		if (e.msg === 'C') S.sent = clock();
		// Target without a recorded state (a page of its own in the app): a short notice instead of a dead button
		if (!enter(w, e.t, { force: !!e.add })) toast('This opens in the real app.');
	};

	const click = async (target) => {
		if (st.busy) return;
		const n = cur();
		if (!n) return;
		const el = target.closest('[data-k]');
		// A click outside the sheet/dialog closes it (dialogs that require an answer excepted)
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
		// Input field tapped before its row: type the missing fields in order
		if (/^(input|textarea)\|/.test(k)) {
			const path = pathTo(st.w, st.id, k);
			// Field without recorded input: a short notice instead of a dead field (the demo only types what was recorded)
			if (!path) toast('Typing works in the real app.');
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
		if (!/^(input|textarea)\|/.test(k)) micro(el);
	};

	// ---------------------------------------------------------------- Controls without a recorded state
	// Not everything in the app was recorded as a state. So that nothing feels dead: switches, counters and
	// collapsibles behave like in the app (in the picture only, nothing is saved); targets that open a page of their own
	// in the app (reminders, import, calendar feed) show a short notice.
	let toastEl = null;
	let toastT = 0;
	const toast = (text) => {
		if (!toastEl) {
			toastEl = document.createElement('div');
			toastEl.setAttribute('role', 'status');
			toastEl.style.cssText = 'position:fixed;left:50%;bottom:calc(var(--sai-bottom,34px) + 92px);transform:translate(-50%,8px);max-width:calc(100% - 48px);padding:10px 14px;border-radius:12px;background:#0a0a0a;color:#fafafa;font:500 13px/1.3 Inter,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:0;pointer-events:none;z-index:80;text-align:center;transition:opacity .18s ease,transform .18s ease';
			document.body.appendChild(toastEl);
		}
		toastEl.textContent = text;
		void toastEl.offsetWidth;
		toastEl.style.opacity = '1';
		toastEl.style.transform = 'translate(-50%,0)';
		clearTimeout(toastT);
		toastT = setTimeout(() => {
			toastEl.style.opacity = '0';
			toastEl.style.transform = 'translate(-50%,8px)';
		}, 2200);
	};
	const micro = (el) => {
		const lab = el.getAttribute('aria-label') || el.textContent.trim();
		if (el.disabled || el.hasAttribute('data-disabled') || el.getAttribute('aria-disabled') === 'true') return true;
		if (/^(Skip to main|Scroll to the end)/.test(lab)) return true;
		// Tick off (shopping list)
		if (el.getAttribute('role') === 'checkbox' && el.hasAttribute('aria-checked')) {
			const on = el.getAttribute('aria-checked') !== 'true';
			el.setAttribute('aria-checked', String(on));
			el.toggleAttribute('data-checked', on);
			el.toggleAttribute('data-unchecked', !on);
			const row = el.closest('[data-slot=item]');
			const title = row?.querySelector('[data-slot=item-title]');
			if (title) title.style.textDecoration = on ? 'line-through' : '';
			if (row) row.style.opacity = on ? '0.6' : '';
			return true;
		}
		// Increase or decrease a supply
		const v = /^(Increase|Decrease) .* by one$/.exec(lab);
		if (v) {
			const d = el.closest('[data-slot=item]')?.querySelector('[data-slot=item-description]');
			const m = d && /^(\d+)/.exec(d.textContent);
			if (m) {
				const n = Math.max(0, +m[1] + (v[1] === 'Increase' ? 1 : -1));
				d.textContent = d.textContent.replace(/^\d+/, String(n));
			}
			return true;
		}
		// Set or remove a reaction: chat chips ("Add reaction 🍕 (2, from Lina) on message from Mika") flip their label,
		// pinboard buttons ("Reaction “Seen”: …") only toggle aria-pressed
		const r = /^(Add|Remove) reaction /.exec(lab) ?? /^Reaction “/.exec(lab);
		if (r && el.hasAttribute('aria-pressed')) {
			const on = el.getAttribute('aria-pressed') !== 'true';
			el.setAttribute('aria-pressed', String(on));
			if (r[1]) el.setAttribute('aria-label', lab.replace(/^(Add|Remove)/, on ? 'Remove' : 'Add'));
			el.style.background = on ? 'var(--secondary)' : '';
			let c = el.querySelector('span.tabular-nums');
			if (on && !c) {
				c = document.createElement('span');
				c.className = 'tabular-nums';
				c.textContent = '0';
				el.appendChild(c);
			}
			if (c) {
				const n = Math.max(0, (+c.textContent || 0) + (on ? 1 : -1));
				c.textContent = String(n);
				c.hidden = n === 0;
			}
			return true;
		}
		// Expand and collapse replies
		const pid = el.getAttribute('aria-controls');
		const panel = pid && document.getElementById(pid);
		if (panel && el.hasAttribute('aria-expanded')) {
			const open = el.getAttribute('aria-expanded') !== 'true';
			el.setAttribute('aria-expanded', String(open));
			panel.toggleAttribute('data-open', open);
			panel.toggleAttribute('data-closed', !open);
			panel.toggleAttribute('inert', !open);
			panel.style.setProperty('--collapsible-panel-height', open ? `${panel.scrollHeight}px` : '0px');
			return true;
		}
		// current tab, heading or selection: nothing to do
		if (el.getAttribute('aria-current') || el.getAttribute('aria-selected') === 'true' || el.getAttribute('aria-pressed') === 'true') return true;
		toast('This opens in the real app.');
		return true;
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

	// ---------------------------------------------------------------- Pointer and scroll towards the landing
	if (FRAMED) {
		const fe = window.frameElement;
		const send = (type, e) => {
			if (!fe) return;
			const r = fe.getBoundingClientRect();
			const s = r.width / fe.clientWidth;
			const o = { bubbles: true, cancelable: false, composed: true, clientX: r.left + e.clientX * s, clientY: r.top + e.clientY * s, pointerType: e.pointerType || 'mouse', pointerId: e.pointerId || 1, isPrimary: true, buttons: e.buttons, button: e.button };
			fe.dispatchEvent(new (window.parent.PointerEvent || PointerEvent)(type, o));
		};
		// Mouse and pen are reported by Phone.tsx (marked as direct); only touch here, otherwise every click would reach the stage twice
		for (const t of ['pointermove', 'pointerdown', 'pointerup', 'pointercancel']) addEventListener(t, (e) => { if (e.pointerType === 'touch') send(t, e); }, { passive: true, capture: true });
		document.addEventListener('pointerleave', (e) => send('pointerleave', e));
		root.addEventListener('mouseleave', (e) => send('pointerleave', e));
		// Wheel: after the first click into the app the app scrolls first (the list under the pointer or the screen),
		// at its edge and before the click the landing page does. When the pointer leaves the phone the page scrolls again.
		// While the page glides (html.lenis) the wheel goes to the landing as a wheel event so that it runs as smoothly as outside.
		let bedient = false;
		addEventListener('pointerdown', (e) => { if (e.pointerType !== 'touch') bedient = true; }, { capture: true, passive: true });
		root.addEventListener('mouseleave', () => { bedient = false; });
		const scroller = (t) => {
			for (let el = t instanceof Element ? t : null; el && el !== document.body; el = el.parentElement) {
				const oy = getComputedStyle(el).overflowY;
				if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el;
			}
			return document.scrollingElement;
		};
		addEventListener('wheel', (e) => {
			e.preventDefault();
			const el = scroller(e.target);
			const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
			const max = el.scrollHeight - el.clientHeight;
			if (bedient && !e.ctrlKey && (dy > 0 ? el.scrollTop < max - 0.5 : el.scrollTop > 0.5)) {
				el.scrollBy({ top: dy, behavior: Math.abs(dy) >= 50 ? 'smooth' : 'instant' });
				return;
			}
			const P = window.parent;
			if (P.document.documentElement.classList.contains('lenis')) P.dispatchEvent(new P.WheelEvent('wheel', { deltaX: e.deltaX, deltaY: e.deltaY, deltaMode: e.deltaMode, ctrlKey: e.ctrlKey, cancelable: true, bubbles: true }));
			else P.scrollBy({ left: e.deltaX, top: e.deltaY, behavior: 'instant' });
		}, { passive: false });
		// Swipe: the screen of the app does not scroll, so a vertical swipe scrolls the landing page (with momentum)
		let ty = 0;
		let v = 0;
		let raf = 0;
		const fscale = () => (fe ? fe.getBoundingClientRect().width / fe.clientWidth : 1);
		addEventListener('touchstart', (e) => {
			cancelAnimationFrame(raf);
			ty = e.touches[0].clientY;
			v = 0;
		}, { passive: true });
		addEventListener('touchmove', (e) => {
			const y = e.touches[0].clientY;
			const dy = (ty - y) * fscale();
			ty = y;
			v = dy;
			window.parent.scrollBy({ top: dy, behavior: 'instant' });
			if (e.cancelable) e.preventDefault();
		}, { passive: false });
		addEventListener('touchend', () => {
			const step = () => {
				v *= 0.95;
				if (Math.abs(v) < 0.4) return;
				window.parent.scrollBy({ top: v, behavior: 'instant' });
				raf = window.parent.requestAnimationFrame(step);
			};
			raf = window.parent.requestAnimationFrame(step);
		}, { passive: true });
		root.classList.add('framed');
	}

	/**
	 * Build pages invisibly (one per idle pause): the first build of a page costs the style and layout caches
	 * of the browser, while the landing scrolled that was the stutter on the first tab change. Afterwards it is discarded.
	 */
	const vorwaermen = (ids) => {
		const liste = ids.map((id) => node('-', id)?.p).filter((p, i, a) => p && a.indexOf(p) === i && p !== cur()?.p);
		const schritt = () => {
			const p = liste.shift();
			if (!p) return;
			// almost transparent instead of invisible: that way the browser paints the page once (font, emoji, gradients)
			const box = document.createElement('div');
			box.setAttribute('aria-hidden', 'true');
			box.inert = true;
			box.style.cssText = `position:fixed;left:0;top:0;width:${app.clientWidth}px;height:${app.clientHeight}px;overflow:hidden;opacity:.001;pointer-events:none;z-index:-1`;
			box.innerHTML = tpl(`p-${p}`);
			document.body.appendChild(box);
			messe(box, p, `${innerWidth}x${innerHeight}`);
			requestAnimationFrame(() => requestAnimationFrame(() => {
				box.remove();
				later(schritt);
			}));
		};
		later(schritt);
	};
	const later = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 3000 }) : setTimeout(fn, 200));

	// ---------------------------------------------------------------- Start
	const start = () => {
		root.style.setProperty('--sai-top', REF ? '0px' : '47px');
		root.style.setProperty('--sai-bottom', REF ? '0px' : '34px');
		const ns = Q.get('state');
		let w = '-';
		let id = M.start;
		if (ns && M.ref[ns]) [w, id] = M.ref[ns];
		enter(w, id, { force: true, instant: true });
		window.__demo = { state: () => ({ w: st.w, id: st.id }), enter, node, vorwaermen, model: M, ref: M.ref, now: clock };
		document.documentElement.setAttribute('data-bereit', '1');
	};
	if (document.fonts?.ready) document.fonts.ready.then(start);
	else start();
})();
