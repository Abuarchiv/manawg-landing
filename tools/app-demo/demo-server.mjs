// Demo-Server für die ManaWG-Landing: die ECHTE App (Fixture-Modus) plus eine Demo-WG im Speicher.
// Start:  APP_PORT=3201 PORT=4177 node demo-server.mjs   (App vorher im Fixture-Modus starten, siehe REF.md)
// Alle Daten und Namen stammen aus der Landing (WG Lindenstraße: Mika, Lina, Jona, Lea; Betrachter = Jona).
// ponytail: Zustand nur im Speicher und für alle Besucher gleich; eine Produktiv-Demo braucht einen echten Demo-Modus in der App.
import http from 'node:http';
import net from 'node:net';
// Feste, fortlaufende IDs (gültiges UUID v4): gleiche Reihenfolge und gleiche Aufnahme bei jedem Zurücksetzen.
let uidCounter = 0;
const randomUUID = () => `5eed0000-0000-4000-8000-${(++uidCounter).toString(16).padStart(12, '0')}`;

const APP_PORT = Number(process.env.APP_PORT || 3201), PORT = Number(process.env.PORT || 4177);
const APP = `http://localhost:${APP_PORT}`, APP_HOST = `localhost:${APP_PORT}`;
const CODE = 'MTE8PZAT', WG = '989ac820-58b7-431f-9c65-28721264f333', WG_NAME = 'WG Lindenstraße';
// Die Fixture-App kennt nur diese zwei Mitglieds-IDs; Jona (Betrachter) und Mika tragen sie, damit ihre Pass-through-Routen erlaubt bleiben.
const JONA = '7d898f9e-5ad7-4f5d-abed-8c3e99a76973', MIKA = '0ab8c8f2-5d03-4a84-aadc-4c5d7e8abf55';
const LINA = '5b1f6a0e-2c4d-4e8f-9a1b-3c5d7e9f1a2b', LEA = '8e2d4c6a-1b3f-4a5c-8d7e-9f0a1b2c3d4e';
const VIEWER = JONA;
const MEMBERS = [
	{ id: MIKA, name: 'Mika', color: '#b08d6a', active: true },
	{ id: LINA, name: 'Lina', color: '#5f8a6e', active: true },
	{ id: JONA, name: 'Jona', color: '#171717', active: true },
	{ id: LEA, name: 'Lea', color: '#c47a62', active: true },
];
const name = (id) => MEMBERS.find((m) => m.id === id)?.name ?? '';
const color = (id) => MEMBERS.find((m) => m.id === id)?.color ?? null;
const DAY = 86_400_000, HOUR = 3_600_000, iso = (ms) => new Date(ms).toISOString();
const sum = (a) => a.reduce((t, e) => t + e.amountCents, 0);

function seed() {
	uidCounter = 0;
	const now = Date.now();
	// Verteilt cents gerecht auf die Teilnehmer (Rest an die ersten).
	const share = (cents, ids) => ids.map((d, i) => ({ id: randomUUID(), debtorMemberId: d, amountCents: Math.floor(cents / ids.length) + (i < cents % ids.length ? 1 : 0), settledAt: null }));
	const exp = (desc, cents, payer, occurredAgo, createdAgo, ids = MEMBERS.map((m) => m.id), settled = true, recurringExpenseId = null) => {
		const splits = share(cents, ids).map((s) => ({ ...s, settledAt: settled ? iso(now - occurredAgo + HOUR) : null }));
		return { id: randomUUID(), wgId: WG, paidByMemberId: payer, createdByMemberId: payer, amountCents: cents, currency: 'EUR', description: desc, imageUrl: null, occurredAt: iso(now - occurredAgo), createdAt: iso(now - createdAgo), updatedAt: iso(now - createdAgo), recurringExpenseId, splits };
	};
	const recurringId = randomUUID();
	// Die App sortiert offene Artikel nach createdAt (älteste zuerst): gestaffelt, sonst entscheidet die ID und die Reihenfolge wechselt.
	const item = (n, by, q = null, bought = false, ageH = 24) => ({ id: randomUUID(), wgId: WG, addedByMemberId: by, name: n, quantity: q, boughtAt: bought ? iso(now - 3 * HOUR) : null, boughtByMemberId: bought ? JONA : null, createdAt: iso(now - ageH * HOUR), updatedAt: iso(now - ageH * HOUR) });
	const chore = (title, who, dueDays, interval = 7) => ({ id: randomUUID(), wgId: WG, title, intervalDays: interval, recurrenceType: 'days', assignedMemberId: who, nextDueAt: iso(now + dueDays * DAY), createdAt: iso(now - 30 * DAY), lastCompletedAt: null, lastCompletedByName: null, openGapCountForAssignee: 0 });
	const nextFriday = () => { const d = new Date(now); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7 || 7)); d.setHours(18, 0, 0, 0); return d; };
	const event = (title, start, hours, who) => { const id = randomUUID(); return { id, eventId: id, occurrenceIndex: 0, wgId: WG, title, startsAt: start.toISOString(), endsAt: new Date(start.getTime() + hours * HOUR).toISOString(), allDay: false, createdByMemberId: who, createdByName: name(who), description: null, location: null }; };
	const inv = (n, q, unit, threshold, category, decrements = 0) => ({ id: randomUUID(), wgId: WG, name: n, quantity: q, unit, threshold, category, lastDecrementedAt: decrements ? iso(now - 2 * DAY) : null, decrementCount30d: decrements, createdAt: iso(now - 20 * DAY), updatedAt: iso(now - 2 * DAY) });
	const msg = (sender, body, agoMin, replyTo = null, id = randomUUID()) => ({ id, wgId: WG, senderMemberId: sender, kind: 'text', body, imageUrl: null, replyToMessageId: replyTo, systemKind: null, systemPayload: null, createdAt: iso(now - agoMin * 60_000), editedAt: null, deletedAt: null });
	const FIX1 = '1c2c9254-5945-4774-9f03-d12e772d3a6f', FIX2 = '8c1bb4a9-4722-42fe-bb86-aebf2e2d5b11'; // IDs der Fixture-Nachrichten im SSR-Chat
	const at = (k, h, min = 0) => { const d = new Date(now); d.setDate(d.getDate() + k); d.setHours(h, min, 0, 0); return d; };
	const done = (choreId, who, agoDays) => ({ id: randomUUID(), choreId, completedByMemberId: who, completedAt: iso(now - agoDays * DAY) });
	const comment = (who, content, agoH) => ({ id: randomUUID(), memberId: who, content, createdAt: iso(now - agoH * HOUR), authorName: name(who), authorColor: color(who) });
	const post = (who, kind, content, agoH, counts = {}, comments = [], mine = []) => {
		const id = randomUUID();
		return { id, authorMemberId: who, content, imageUrl: null, kind, status: 'open', source: 'manual', sourcePath: null, pinnedAt: null, resolvedAt: null, resolvedByMemberId: null, createdAt: iso(now - agoH * HOUR), reactionCounts: counts, myReactions: mine, takers: [], comments: comments.map((c) => ({ ...c, announcementId: id })) };
	};
	const strom = randomUUID(), rundfunk = randomUUID(), musik = randomUUID();
	const fix = (id, desc, cents, payer, ageDays) => ({ id, wgId: WG, createdByMemberId: payer, paidByMemberId: payer, description: desc, amountCents: cents, currency: 'EUR', intervalMonths: 1, nextDueAt: iso(new Date(new Date(now).getFullYear(), new Date(now).getMonth() + 1, 3, 9).getTime()), lastCreatedAt: iso(now - 3 * DAY), pausedAt: null, createdAt: iso(now - ageDays * DAY), splits: share(cents, MEMBERS.map((m) => m.id)).map(({ debtorMemberId, amountCents }) => ({ debtorMemberId, amountCents })) });
	const chores = [chore('Bad putzen', LEA, 0), chore('Küche wischen', MIKA, 1), chore('Müll runterbringen', LINA, 2, 3), chore('Flur saugen', JONA, 4), chore('Pflanzen gießen', LEA, 3, 4), chore('Altglas wegbringen', MIKA, 6, 14)];
	const [bad, kueche, muell, flur, pflanzen] = chores;
	Object.assign(kueche, { lastCompletedAt: iso(now - 6 * DAY), lastCompletedByName: 'Lina' });
	Object.assign(muell, { lastCompletedAt: iso(now - DAY), lastCompletedByName: 'Mika' });
	Object.assign(pflanzen, { lastCompletedAt: iso(now - 2 * DAY), lastCompletedByName: 'Lea' });
	const pizza = msg(MIKA, 'Pizza heute Abend?', 62, null, FIX1), salat = msg(LINA, 'Ich bring Salat mit.', 30);
	const leaMsg = msg(LEA, 'Bin um acht wieder da.', 14);
	const r = (m, who, emoji) => ({ messageId: m.id, memberId: who, emoji, memberName: name(who), memberColor: color(who) });
	return {
		// Schaufenster-Stand: eine lebendige WG mit offenen Salden (Jona bekommt etwas zurück), alles von der echten App gerendert.
		expenses: [
			exp('Blumen für den Balkon', 1890, LEA, 3 * HOUR, 3 * HOUR, undefined, false),
			exp('Pizzaabend', 2840, MIKA, DAY + 2 * HOUR, DAY, undefined, false),
			exp('Wocheneinkauf', 4685, LINA, 2 * DAY, 2 * DAY, undefined, false),
			exp('Internet', 2999, JONA, 3 * DAY, 3 * DAY, undefined, false, recurringId),
			exp('Putzmittel & Schwämme', 1236, JONA, 4 * DAY, 4 * DAY, undefined, false),
			exp('Strom', 8400, MIKA, 5 * DAY, 5 * DAY, undefined, true, strom),
			exp('Wocheneinkauf', 3920, LINA, 9 * DAY, 9 * DAY),
			exp('Rundfunkbeitrag', 1836, LINA, 11 * DAY, 11 * DAY, undefined, true, rundfunk),
		],
		recurring: [fix(recurringId, 'Internet', 2999, JONA, 90), fix(strom, 'Strom', 8400, MIKA, 120), fix(rundfunk, 'Rundfunkbeitrag', 1836, LINA, 200), fix(musik, 'Spotify Family', 1799, LEA, 60)],
		shopping: [
			item('Hafermilch', MIKA, '2 Packungen', false, 30), item('Bananen', LEA, '6 Stück', false, 28), item('Toilettenpapier', LINA, '2 Packungen', false, 24),
			item('Basilikum', LEA, '1 Topf', false, 6), item('Kaffeebohnen', JONA, '500 g', false, 4), item('Parmesan', MIKA, null, false, 2),
			item('Spülmittel', JONA, '1 Flasche', true, 26),
		],
		chores,
		completions: [done(muell.id, MIKA, 1), done(pflanzen.id, LEA, 2), done(bad.id, JONA, 4), done(flur.id, LINA, 5)],
		events: [
			event('Heizungsableser', at(2, 10), 2, JONA),
			event('Putzplan-Check', nextFriday(), 1, MIKA),
			event('Pasta & Filmabend', at((6 - new Date(now).getDay() + 7) % 7 || 7, 19, 30), 3, LINA),
			event('Flohmarkt Mauerpark', at((7 - new Date(now).getDay()) % 7 || 7, 11), 4, LEA),
		],
		inventory: [
			inv('Toilettenpapier', 2, 'Packung', 1, 'bad', 2), inv('Duschgel', 1, 'Flasche', 1, 'bad', 1), inv('Zahnpasta', 2, 'Tube', 1, 'bad'),
			inv('Müllbeutel', 3, 'Rolle', 1, 'kueche'), inv('Kaffee', 1, 'Packung', 1, 'kueche', 3), inv('Olivenöl', 1, 'Flasche', 1, 'kueche', 1), inv('Reis', 2, 'Packung', 1, 'kueche'),
			inv('Spülmittel', 2, 'Stück', 1, 'putzmittel'), inv('Spülmaschinentabs', 24, 'Stück', 10, 'putzmittel', 4),
		],
		announcements: [
			post(JONA, 'info', 'Übergabe am Freitag\nSchlüssel liegen im Flur bereit.', 5, { seen: 2 }),
			post(MIKA, 'problem', 'Die Spülmaschine piept wieder.\nKann sich das jemand ansehen?', 20, { take: 1 }, [comment(LINA, 'Ich schau heute Abend rein.', 18)]),
			post(LINA, 'question', 'Wer kommt Sonntag mit zum Flohmarkt im Mauerpark?', 30, { seen: 3 }, [comment(LEA, 'Ich! Ich brauche noch einen Spiegel.', 28), comment(MIKA, 'Bin dabei, wenn wir um elf los.', 26)]),
			post(LEA, 'decision', 'Ab November kommt Biomüll in den grünen Eimer unter der Spüle.', 72, { ok: 3 }),
		],
		chat: [
			msg(LINA, 'Hat jemand meinen Schirm gesehen?', 26 * 60), msg(MIKA, 'Hängt an der Garderobe.', 25 * 60 + 40), msg(LINA, 'Danke dir!', 25 * 60 + 30),
			msg(LEA, 'Hab Basilikum auf die Liste gesetzt.', 95),
			pizza, msg(JONA, 'Bin dabei.', 41, FIX1, FIX2), salat, leaMsg,
		],
		reactions: [r(pizza, LINA, '🍕'), r(pizza, LEA, '🍕'), r(pizza, JONA, '👍'), r(salat, MIKA, '❤️')],
		absences: [],
	};
}
let S = seed();

// Salden wie in dashboard-data.ts: netto nur über offene Teilbeträge fremder Schuldner.
function balances() {
	const b = Object.fromEntries(MEMBERS.map((m) => [m.id, { paid: 0, owed: 0, net: 0 }]));
	for (const e of S.expenses) {
		b[e.paidByMemberId].paid += e.amountCents;
		for (const s of e.splits) {
			if (s.settledAt) continue;
			b[s.debtorMemberId].owed += s.amountCents;
			if (s.debtorMemberId !== e.paidByMemberId) { b[e.paidByMemberId].net += s.amountCents; b[s.debtorMemberId].net -= s.amountCents; }
		}
	}
	return MEMBERS.map((m) => ({ memberId: m.id, memberName: m.name, color: m.color, currency: 'EUR', paidCents: b[m.id].paid, owedCents: b[m.id].owed, balanceCents: b[m.id].net }))
		.sort((a, c) => Math.abs(c.balanceCents) - Math.abs(a.balanceCents));
}
// Port von getWgHealth (core/reads/dashboard-insights.ts).
function health({ overdue, shopping, debt, announcements, absent, recurring }) {
	const base = `/wg/${CODE}`, pen = Math.min(overdue * 18, 36) + Math.min(shopping * 4, 16) + Math.min(debt > 0 ? Math.ceil(debt / 2500) * 5 : 0, 25) + Math.min(announcements * 6, 18) + Math.min(recurring * 10, 20);
	const score = Math.max(0, 100 - pen), eur = (c) => (c / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
	return { score, label: score >= 80 ? 'ruhig' : score >= 55 ? 'im Blick behalten' : 'braucht Aufmerksamkeit', items: [
		{ label: 'Putzlücken', value: String(overdue), tone: overdue ? 'danger' : 'ok', href: `${base}/putzen?filter=overdue` },
		{ label: 'Offene Schulden', value: eur(debt), tone: debt > 0 ? 'warn' : 'ok', href: `${base}/ausgaben` },
		{ label: 'Einkauf offen', value: String(shopping), tone: shopping > 3 ? 'warn' : 'ok', href: `${base}/einkauf` },
		{ label: 'Pinnwand offen', value: String(announcements), tone: announcements ? 'warn' : 'ok', href: `${base}/pinnwand?status=open` },
		{ label: 'Abwesend', value: String(absent), tone: absent ? 'warn' : 'ok', href: `${base}/putzen?panel=absences` },
		{ label: 'Fixkosten fällig', value: String(recurring), tone: recurring ? 'warn' : 'ok', href: `${base}/ausgaben?filter=recurring` },
	] };
}
function dashboard(orig) {
	const now = Date.now(), open = S.shopping.filter((i) => !i.boughtAt), bal = balances();
	const dueChores = S.chores.filter((c) => Date.parse(c.nextDueAt) - now < 3 * DAY).map((c) => ({ id: c.id, title: c.title, assignedMemberId: c.assignedMemberId, assignedMemberName: name(c.assignedMemberId), assignedColor: color(c.assignedMemberId), nextDueAt: c.nextDueAt, overdue: Date.parse(c.nextDueAt) < now - HOUR }));
	const monthSpend = sum(S.expenses.filter((e) => new Date(e.occurredAt).getMonth() === new Date(now).getMonth()));
	const mine = S.announcements.filter((a) => a.status === 'open' && a.authorMemberId === VIEWER).map((a) => ({ id: a.id, kind: a.kind, content: a.content, createdAt: a.createdAt }));
	const latest = S.announcements.filter((a) => a.source === 'manual')[0];
	const activity = [
		...S.expenses.map((e) => ({ kind: 'expense', timestamp: e.createdAt, memberId: e.paidByMemberId, memberName: name(e.paidByMemberId), text: e.description, amountCents: e.amountCents, currency: 'EUR', href: `/wg/${CODE}/ausgaben` })),
		...S.shopping.filter((i) => i.boughtAt).map((i) => ({ kind: 'shopping', timestamp: i.boughtAt, memberId: i.boughtByMemberId, memberName: name(i.boughtByMemberId), text: `${i.name} gekauft`, href: `/wg/${CODE}/einkauf` })),
		...S.completions.map((c) => ({ kind: 'chore', timestamp: c.completedAt, memberId: c.completedByMemberId, memberName: name(c.completedByMemberId), text: `${S.chores.find((x) => x.id === c.choreId)?.title ?? 'Aufgabe'} erledigt`, href: `/wg/${CODE}/putzen` })),
	].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 6);
	const debt = bal.filter((x) => x.balanceCents < 0).reduce((t, x) => t - x.balanceCents, 0);
	return {
		...orig, balances: bal,
		spendByDay: Array.from({ length: 14 }, (_, i) => { const date = iso(now - (13 - i) * DAY).slice(0, 10); return { date, currency: 'EUR', cents: sum(S.expenses.filter((e) => e.occurredAt.slice(0, 10) === date)) }; }),
		totalSpendByCurrency: { EUR: sum(S.expenses) }, weekSpendByCurrency: { EUR: sum(S.expenses.filter((e) => now - Date.parse(e.occurredAt) < 7 * DAY)) }, monthSpendByCurrency: { EUR: monthSpend },
		totalSpendCents: sum(S.expenses), weekSpendCents: sum(S.expenses.filter((e) => now - Date.parse(e.occurredAt) < 7 * DAY)), monthSpendCents: monthSpend,
		openShoppingCount: open.length, openShoppingTop: open.slice(0, 3).map((i) => i.name), dueChores, activity,
		latestAnnouncement: latest ? { id: latest.id, content: latest.content, authorName: name(latest.authorMemberId), createdAt: latest.createdAt } : null,
		myOpenAnnouncements: mine, dueRecurringExpenses: [], absentMembers: [],
		wgHealth: health({ overdue: dueChores.filter((c) => c.overdue).length, shopping: open.length, debt, announcements: mine.length, absent: 0, recurring: 0 }),
		setup: { choreCount: S.chores.length, hasExpense: true, hasShoppingItem: true, hasAnnouncement: true, notificationsEnabled: true },
	};
}

const json = (res, body, status = 200) => { res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(body)); };
const readBody = async (req) => req.json; // Body wurde in handle() schon gepuffert und geparst
const events = new Set(); // SSE-Kanal: jede Änderung wird gemeldet
const emit = (type, data) => { const msg = `data: ${JSON.stringify({ type, ...data })}\n\n`; for (const r of events) r.write(msg); };
const groupInv = (items) => { const g = { bad: [], kueche: [], putzmittel: [], sonstiges: [] }; for (const i of items) (g[i.category] ??= []).push(i); return g; };

async function api(req, res, path, orig, query) {
	const m = req.method, me = req.headers['x-manawg-member-id'] || VIEWER, now = Date.now(), stamp = iso(now);
	let mm;
	if (path === 'members') return json(res, { members: MEMBERS, viewerIsAdmin: true });
	if (path === 'dashboard') return json(res, dashboard(await orig()));
	// Ausgaben
	if (path === 'expenses' && m === 'GET') return json(res, { expenses: S.expenses, payments: [] });
	if (path === 'expenses' && m === 'POST') {
		const b = await readBody(req);
		const e = { id: randomUUID(), wgId: WG, paidByMemberId: b.paidByMemberId || me, createdByMemberId: me, amountCents: b.amountCents, currency: b.currency || 'EUR', description: b.description, imageUrl: null, occurredAt: b.occurredAt || stamp, createdAt: stamp, updatedAt: stamp, recurringExpenseId: null, splits: (b.splits || []).map((s) => ({ id: randomUUID(), ...s, settledAt: null })) };
		S.expenses.unshift(e); emit('expense', { expense: e }); return json(res, { expense: e, warning: null });
	}
	if ((mm = path.match(/^expenses\/([^/]+)$/)) && m === 'DELETE') { S.expenses = S.expenses.filter((e) => e.id !== mm[1]); return json(res, { deleted: true }); }
	if ((mm = path.match(/^expenses\/([^/]+)\/splits\/([^/]+)\/settle$/))) {
		const s = S.expenses.find((e) => e.id === mm[1])?.splits.find((x) => x.id === mm[2]); if (s) s.settledAt = stamp; return json(res, { settled: true });
	}
	// Ausgleichen: Vorschau (GET) und Bestätigung (POST) wie /expenses/settle-batch der App, nur direkte Teilbeträge
	const direct = (debtor, creditor) => S.expenses.filter((e) => e.paidByMemberId === creditor).flatMap((e) => e.splits.filter((x) => x.debtorMemberId === debtor && debtor !== creditor && !x.settledAt).map((x) => ({ id: x.id, expenseId: e.id, amountCents: x.amountCents })));
	if (path === 'expenses/settle-batch' && m === 'GET') {
		const splits = direct(query.get('fromMemberId'), query.get('toMemberId')), cents = splits.reduce((t, x) => t + x.amountCents, 0);
		return json(res, { currency: 'EUR', netCents: cents, settleableCents: cents, remainingCents: 0, splits });
	}
	if (path === 'expenses/settle-batch' && m === 'POST') {
		const b = await readBody(req), ids = new Set((b.expected?.splits ?? []).map((x) => x.id)); let cents = 0;
		for (const e of S.expenses) for (const x of e.splits) if (ids.has(x.id) && !x.settledAt) { x.settledAt = stamp; cents += x.amountCents; }
		emit('expense', {}); return json(res, { settled: ids.size, settledIds: [...ids], settledCents: cents, currency: 'EUR', remainingCents: 0, creditor: b.toMemberId, debtor: b.fromMemberId });
	}
	if (path === 'recurring-expenses' && m === 'GET') return json(res, { recurringExpenses: S.recurring });
	// Einkauf
	if (path === 'shopping' && m === 'GET') return json(res, { items: [...S.shopping.filter((i) => !i.boughtAt), ...S.shopping.filter((i) => i.boughtAt)] });
	if (path === 'shopping' && m === 'POST') {
		const b = await readBody(req);
		const it = { id: randomUUID(), wgId: WG, addedByMemberId: me, name: b.name, quantity: b.quantity ?? null, boughtAt: null, boughtByMemberId: null, createdAt: stamp, updatedAt: stamp };
		S.shopping.push(it); emit('shopping', { item: it }); return json(res, { item: it });
	}
	if ((mm = path.match(/^shopping\/([^/]+)$/))) {
		const it = S.shopping.find((i) => i.id === mm[1]); if (!it) return json(res, { error: 'item_not_found' }, 404);
		if (m === 'DELETE') { S.shopping = S.shopping.filter((i) => i !== it); return json(res, { deleted: true }); }
		const b = await readBody(req), bought = b.bought ?? b.boughtAt !== null;
		Object.assign(it, { boughtAt: bought ? stamp : null, boughtByMemberId: bought ? me : null, updatedAt: stamp });
		if (b.name) it.name = b.name;
		emit('shopping', { item: it }); return json(res, { item: it });
	}
	// Putzplan
	if (path === 'chores' && m === 'GET') {
		const monthKey = (v) => new Date(v).toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' }).slice(0, 7), cur = monthKey(now), monthCompletions = {};
		for (const c of S.completions) if (monthKey(c.completedAt) === cur) monthCompletions[c.completedByMemberId] = (monthCompletions[c.completedByMemberId] ?? 0) + 1;
		return json(res, { chores: S.chores, monthCompletions });
	}
	if ((mm = path.match(/^chores\/([^/]+)\/complete$/))) {
		const c = S.chores.find((x) => x.id === mm[1]); if (!c) return json(res, { error: 'chore_not_found' }, 404);
		// Rotation wie chooseNextAvailableMember der App: wenigste Aufgaben (ohne den bisherigen), Gleichstand reihum ab ihm
		const idx = MEMBERS.findIndex((x) => x.id === c.assignedMemberId);
		const load = (id) => S.chores.filter((x) => x.assignedMemberId === id).length;
		const cand = MEMBERS.filter((x) => x.id !== c.assignedMemberId), min = Math.min(...cand.map((x) => load(x.id)));
		const next = MEMBERS.map((_, k) => MEMBERS[(idx + 1 + k) % MEMBERS.length]).find((x) => x.id !== c.assignedMemberId && load(x.id) === min);
		Object.assign(c, { lastCompletedAt: stamp, lastCompletedByName: name(me), nextDueAt: iso(now + c.intervalDays * DAY), assignedMemberId: next.id });
		const completion = { id: randomUUID(), choreId: c.id, completedByMemberId: me, completedAt: stamp };
		S.completions.unshift(completion); emit('chore', { chore: c }); return json(res, { chore: c, completion });
	}
	if ((mm = path.match(/^chores\/([^/]+)$/)) && m === 'PATCH') { const c = S.chores.find((x) => x.id === mm[1]); Object.assign(c, await readBody(req)); emit('chore', { chore: c }); return json(res, { chore: c }); }
	// Kalender
	if (path.startsWith('events') && m === 'GET') return json(res, { events: S.events });
	if (path === 'events' && m === 'POST') {
		const b = await readBody(req), id = randomUUID();
		const e = { id, eventId: id, occurrenceIndex: 0, wgId: WG, title: b.title, startsAt: b.startsAt, endsAt: b.endsAt ?? b.startsAt, allDay: !!b.allDay, createdByMemberId: me, createdByName: name(me), description: b.description ?? null, location: b.location ?? null };
		S.events.push(e); emit('event', { event: e }); return json(res, { event: e });
	}
	// Pinnwand
	if (path === 'announcements' && m === 'GET') return json(res, { announcements: S.announcements });
	if (path === 'announcements' && m === 'POST') {
		const b = await readBody(req);
		const a = { id: randomUUID(), authorMemberId: me, content: b.content, imageUrl: null, kind: b.kind || 'info', status: 'open', source: 'manual', sourcePath: null, pinnedAt: null, resolvedAt: null, resolvedByMemberId: null, createdAt: stamp, reactionCounts: {}, myReactions: [], takers: [], comments: [] };
		S.announcements.unshift(a); emit('announcement', { announcement: a }); return json(res, { announcement: a, warning: null });
	}
	if ((mm = path.match(/^announcements\/([^/]+)\/comments$/)) && m === 'POST') {
		const a = S.announcements.find((x) => x.id === mm[1]); const b = await readBody(req);
		const comment = { id: randomUUID(), announcementId: a.id, memberId: me, content: b.content, createdAt: stamp, authorName: name(me), authorColor: color(me) };
		a.comments.push(comment); emit('announcement', { announcement: a }); return json(res, { comment, warning: null });
	}
	if ((mm = path.match(/^announcements\/([^/]+)\/reactions$/))) {
		const a = S.announcements.find((x) => x.id === mm[1]); const b = m === 'DELETE' ? Object.fromEntries(new URL(req.url, 'http://x').searchParams) : await readBody(req), key = b.reaction ?? b.kind ?? b.key ?? b.emoji;
		if (a && key) { const on = m !== 'DELETE'; a.myReactions = on ? [...new Set([...a.myReactions, key])] : a.myReactions.filter((k) => k !== key); a.reactionCounts[key] = Math.max(0, (a.reactionCounts[key] ?? 0) + (on ? 1 : -1)); }
		return json(res, { ok: true, announcement: a });
	}
	if ((mm = path.match(/^announcements\/([^/]+)$/))) {
		const a = S.announcements.find((x) => x.id === mm[1]); if (!a) return json(res, { error: 'not_found' }, 404);
		if (m === 'DELETE') { S.announcements = S.announcements.filter((x) => x !== a); return json(res, { deleted: true }); }
		Object.assign(a, await readBody(req)); return json(res, { announcement: a, warning: null });
	}
	// Chat
	if (path === 'chat/messages' && m === 'GET') return json(res, { messages: query.get('before') ? [] : S.chat, refreshedMessages: [], reactions: S.reactions, mentions: [] });
	if (path === 'chat/messages' && m === 'POST') {
		const b = await readBody(req);
		const message = { id: randomUUID(), wgId: WG, senderMemberId: me, kind: 'text', body: b.body ?? b.content ?? '', imageUrl: null, replyToMessageId: b.replyToMessageId ?? null, systemKind: null, systemPayload: null, createdAt: stamp, editedAt: null, deletedAt: null };
		S.chat.push(message); emit('chat', { message }); return json(res, { message, mentions: [], warning: null });
	}
	if (path === 'chat/unread-count') return json(res, { count: 0, exactCount: 0, overflow: false });
	if (path === 'chat/read') { await readBody(req); return json(res, { changed: 0 }); }
	if ((mm = path.match(/^chat\/messages\/([^/]+)\/reactions$/))) {
		const emoji = m === 'DELETE' ? new URL(req.url, 'http://x').searchParams.get('emoji') : (await readBody(req)).emoji;
		S.reactions = S.reactions.filter((r) => !(r.messageId === mm[1] && r.memberId === me && r.emoji === emoji));
		if (m !== 'DELETE') S.reactions.push({ messageId: mm[1], memberId: me, emoji, memberName: name(me), memberColor: color(me) });
		return json(res, { ok: true });
	}
	// Vorräte
	if (path === 'inventory' && m === 'GET') return json(res, { items: S.inventory, grouped: groupInv(S.inventory) });
	if (path === 'inventory' && m === 'POST') {
		const b = await readBody(req);
		const it = { id: randomUUID(), wgId: WG, name: b.name, quantity: b.quantity ?? 0, unit: b.unit ?? 'Stück', threshold: b.threshold ?? 0, category: b.category ?? 'sonstiges', lastDecrementedAt: null, decrementCount30d: 0, createdAt: stamp, updatedAt: stamp };
		S.inventory.push(it); return json(res, { item: it });
	}
	if ((mm = path.match(/^inventory\/([^/]+)\/consume$/))) {
		const it = S.inventory.find((x) => x.id === mm[1]); const b = await readBody(req);
		it.quantity = Math.max(0, it.quantity + (b.delta ?? -1)); it.lastDecrementedAt = stamp; it.decrementCount30d += 1; it.updatedAt = stamp;
		return json(res, { item: it, shoppingAdded: false });
	}
	if ((mm = path.match(/^inventory\/([^/]+)$/))) {
		const it = S.inventory.find((x) => x.id === mm[1]); if (!it) return json(res, { error: 'not_found' }, 404);
		if (m === 'DELETE') { S.inventory = S.inventory.filter((x) => x !== it); return json(res, { deleted: true }); }
		Object.assign(it, await readBody(req), { updatedAt: stamp }); return json(res, { item: it });
	}
	if (path === 'activity') return json(res, { items: dashboard({}).activity, reminders: [] });
	return null; // Rest (Erinnerungen, Abwesenheit, Einstellungen …) geht an die Fixture-App
}

const server = http.createServer((req, res) => handle(req, res).catch((e) => { console.error(req.url, e.message); if (!res.headersSent) json(res, { error: 'proxy' }, 502); else res.end(); })).listen(PORT, '127.0.0.1', () => console.log(`Demo: http://127.0.0.1:${PORT}/wg/${CODE}  (App :${APP_PORT})`));

// Fixture-Namen der App durch die Demo-WG ersetzen (nur in HTML/RSC, nie in JS-Dateien).
const rename = (t) => t.replaceAll('"sadf"', JSON.stringify(WG_NAME)).replaceAll('\\"sadf\\"', `\\"${WG_NAME}\\"`).replaceAll('sadf ManaWG', `${WG_NAME} ManaWG`)
	.replaceAll('"dsaf"', '"Jona"').replaceAll('\\"dsaf\\"', '\\"Jona\\"').replaceAll('"Mina"', '"Mika"').replaceAll('\\"Mina\\"', '\\"Mika\\"')
	.replaceAll('Das ist eine ziemlich lange Chat-Nachricht mit einem_sehr_langen_ununterbrochenen_Wort_das_trotzdem_nicht_die_mobile_Ansicht_sprengen_darf.', 'Pizza heute Abend?')
	.replaceAll('Alles klar, ich bringe Hafermilch mit.', 'Bin dabei.');

async function handle(req, res) {
	const url = new URL(req.url, 'http://x');
	if (url.pathname === '/demo-events') { res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' }); res.write(':ok\n\n'); events.add(res); req.on('close', () => events.delete(res)); return; }
	if (url.pathname === '/demo-reset') { S = seed(); return json(res, { ok: true }); }
	const chunks = []; for await (const c of req) chunks.push(c);
	const body = chunks.length ? Buffer.concat(chunks) : undefined;
	const proxy = async (override) => {
		const headers = { ...req.headers, host: APP_HOST, origin: APP, referer: `${APP}${url.pathname}` };
		for (const k of ['connection', 'upgrade', 'keep-alive', 'transfer-encoding', 'accept-encoding', 'content-length']) delete headers[k];
		return fetch(APP + req.url, { method: req.method, headers: { ...headers, ...override }, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body, redirect: 'manual' });
	};
	const apiMatch = url.pathname.match(new RegExp(`^/api/wg/${CODE}/(.+)$`));
	if (apiMatch) {
		// Der Browser-Betrachter ist Jona (= Fixture-Mitglied); Pass-through-Routen laufen mit der Fixture-ID.
		let parsed = {}; try { parsed = JSON.parse(body?.toString() || '{}'); } catch {}
		const handled = await api({ method: req.method, headers: req.headers, url: req.url, json: parsed }, res, apiMatch[1], async () => (await proxy()).json(), url.searchParams);
		if (handled !== null || res.writableEnded) return;
	}
	const r = await proxy();
	const h = {};
	r.headers.forEach((v, k) => { if (['x-frame-options', 'content-encoding', 'content-length', 'transfer-encoding'].includes(k)) return; h[k] = k === 'content-security-policy' ? v.replace(/frame-ancestors[^;]*/g, "frame-ancestors 'self'") : v; });
	res.writeHead(r.status, h);
	const type = r.headers.get('content-type') || '';
	if (/text\/html|text\/x-component/.test(type) && r.body) return res.end(rename(await r.text()));
	if (r.body) for await (const c of r.body) res.write(c);
	res.end();
}

// WebSocket (Next-HMR im Dev-Modus) roh an die App durchreichen
server.on('upgrade', (req, sock, head) => {
	const up = net.connect(APP_PORT, 'localhost', () => {
		up.write(`${req.method} ${req.url} HTTP/1.1\r\n` + Object.entries({ ...req.headers, host: APP_HOST }).map(([k, v]) => `${k}: ${v}`).join('\r\n') + '\r\n\r\n');
		if (head?.length) up.write(head);
		sock.pipe(up).pipe(sock);
	});
	up.on('error', () => sock.destroy()); sock.on('error', () => up.destroy());
});
