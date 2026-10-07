// Datums- und Zeitangaben der Aufnahmen werden zu Laufzeit-Tokens (demo.js rechnet sie aus dem heutigen Datum im App-Format).
// Bezugstag der Aufnahmen: Di, 06.10.2026. Der nächste Freitag (Putzplan-Check) ist Token F (Seed: nextFriday).
// Formate wie in der App (Intl de-DE, Zeitzone Berlin): kurz "Do., 8. Okt.", lang "Dienstag, 06. Oktober", wdlm "Donnerstag, 8. Oktober",
// voll "Mittwoch, 7. Oktober 2026", dmy "8.10.2026", tm "13.10.", dm "06.10.2026", TF "01.10.2026, 18:06".
const CAP = Date.UTC(2026, 9, 6, 12);
const f = (o) => new Intl.DateTimeFormat('de-DE', { timeZone: 'UTC', ...o });
const FMT = {
	kurz: f({ weekday: 'short', day: 'numeric', month: 'short' }),
	lang: f({ weekday: 'long', day: '2-digit', month: 'long' }),
	wdlm: f({ weekday: 'long', day: 'numeric', month: 'long' }),
	voll: f({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
	dmy: f({ day: 'numeric', month: 'numeric', year: 'numeric' }),
	tm: f({ day: '2-digit', month: '2-digit' }),
	dm: f({ day: '2-digit', month: '2-digit', year: 'numeric' }),
	my: f({ month: 'long', year: 'numeric' }),
};
const at = (k) => CAP + k * 86400000;
// Offset 3 ist der Putzplan-Check (nächster Freitag), alle anderen Daten sind Tage ab heute
const tokenOf = (k, fmt) => (k === 3 ? `{{F:${fmt}}}` : `{{D:${k}:${fmt}}}`);
const KS = Array.from({ length: 70 }, (_, i) => i - 20);
const table = (fmt) => new Map(KS.map((k) => [FMT[fmt].format(at(k)), tokenOf(k, fmt)]));
const T = Object.fromEntries(Object.keys(FMT).map((k) => [k, table(k)]));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rxOf = (m) => new RegExp(`(?<![\\w.])(${[...m.keys()].sort((a, b) => b.length - a.length).map(esc).join('|')})(?![\\d])`, 'g');
const RX = Object.fromEntries(Object.entries(T).map(([k, m]) => [k, rxOf(m)]));
const month3 = new Map([
	['03.11.', '{{M:1:tm}}'],
	['03.12.', '{{M:2:tm}}'],
	['03.01.', '{{M:3:tm}}'],
]);

const WD = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const kOfLong = (s) => KS.find((k) => FMT.wdlm.format(at(k)) === s);

export function tokenize(html, route) {
	let h = html;
	// Agenda-Kopf: <span>[Morgen · ]Mittwoch, 7. Oktober</span><span aria-hidden>Mi</span><span aria-hidden><span>7</span>[<span>Okt</span>]</span>
	h = h.replace(
		/<span>((?:Heute|Morgen) · )?((?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag), \d{1,2}\. [A-Za-zä]+)<\/span><span aria-hidden="true">([A-Z][a-z])<\/span><span aria-hidden="true"><span>(\d{1,2})<\/span>(<span>[A-Za-zä]+<\/span>)?<\/span>/g,
		(m, pre, lang, wd, d, mon) => {
			const k = kOfLong(lang);
			if (k === undefined) return m;
			const tk = (fmt) => tokenOf(k, fmt);
			return `<span>${pre ?? ''}${tk('wdlm')}</span><span aria-hidden="true">${tk('wd0')}</span><span aria-hidden="true"><span>${tk('d')}</span>${mon ? `<span>${tk('mon0')}</span>` : ''}</span>`;
		},
	);
	// <time datetime=".." title="..">Text</time>: Chat-Uhrzeiten der Reihe nach, "vor n Min/Std" und "gestern" aus den Aufnahmen
	let ct = 0;
	h = h.replace(/<time\b([^>]*)>([^<]*)<\/time>/g, (m, attrs, txt) => {
		const a = attrs.replace(/\s*datetime="[^"]*"/, '');
		let mins = null;
		let inner = txt;
		if (/^\d{2}:\d{2}$/.test(txt)) {
			const n = ct++;
			return `<time${a.replace(/title="[^"]*"/, `title="{{CD:${n}}}"`)}>{{CT:${n}}}</time>`;
		}
		let mm = /^vor (\d+) Min$/.exec(txt);
		if (mm) mins = +mm[1];
		mm = /^vor (\d+) Std$/.exec(txt);
		if (mm) mins = +mm[1] * 60;
		if (txt === 'gestern') mins = 1560;
		if (txt === 'gerade eben') mins = 0;
		if (mins === null) return `<time${a}>${txt}</time>`;
		inner = `{{A:${mins}}}`;
		return `<time${a.replace(/title="[^"]*"/, `title="{{TF:${mins}}}"`)}>${inner}</time>`;
	});
	// Datum mit Uhrzeit in den Ausgaben-Details: Minuten seit Anlage aus dem Seed (Pizzaabend 26 h, Internet 3 Tage, Wocheneinkauf 5 Tage)
	if (/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/.test(h)) {
		const mins = /Pizzaabend/.test(h) ? 1560 : /Internet/.test(h) ? 4320 : /Wocheneinkauf/.test(h) ? 7200 : null;
		if (mins !== null) h = h.replace(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/g, `{{TF:${mins}}}`);
	}
	// Fixkosten: nächste Buchungen am 3. der Folgemonate
	h = h.replace(/(?<![\d.])(03\.11\.|03\.12\.|03\.01\.)(?!\d)/g, (m) => month3.get(m));
	// Datumsformate (längere zuerst, damit "10.10.2026" nicht als "10.10." gilt)
	for (const fmt of ['voll', 'dm', 'dmy', 'lang', 'wdlm', 'kurz', 'tm']) h = h.replace(RX[fmt], (m) => T[fmt].get(m));
	h = h.replace(/(?<![\w])(September|Oktober|November) 2026/g, (m, mo) => `{{MO:${{ September: -1, Oktober: 0, November: 1 }[mo]}}}`);
	void route;
	void WD;
	return h;
}
