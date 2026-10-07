// Die Zustands-Flags der Demo und ihre Ausführung in der echten App (nur über die Oberfläche, wie ein Nutzer).
// E Hafermilch abgehakt · A Kinoabend gespeichert · P ausgeglichen · C im Chat geantwortet · B Bad putzen erledigt
// V Toilettenpapier −1 (Vorräte) · T Theme dunkel (nur Einstellungen)
import { open, settle } from './demo-lib.mjs';

export const ROUTES = ['/', '/putzen', '/einkauf', '/vorraete', '/ausgaben', '/abos', '/pinnwand', '/chat', '/kalender', '/einstellungen'];
export const FLAGS = ['E', 'A', 'P', 'C', 'B', 'V'];
// Je Route zählen nur diese Flags (belegt durch tools/qa/app/relevance.mjs)
export const REL = { '/': 'EAPB', '/putzen': 'EB', '/einkauf': 'E', '/vorraete': 'EV', '/ausgaben': 'AP', '/chat': 'APC', '/kalender': 'B' };

export const STEPS = {
	async E(pg) {
		await open(pg, '/einkauf');
		await pg.getByRole('checkbox', { name: 'Hafermilch erledigen' }).click();
		await pg.waitForTimeout(1500);
	},
	async A(pg) {
		await open(pg, '/ausgaben');
		await pg.getByRole('button', { name: 'Ausgabe hinzufügen' }).click();
		await pg.getByLabel('Beschreibung').fill('Kinoabend');
		await pg.getByLabel('Betrag').fill('24,00');
		await pg.getByRole('button', { name: 'Aufteilung: Manuell' }).click();
		await pg.getByLabel('Anteil Jona in Euro').fill('12,00');
		await pg.getByLabel('Anteil Lea in Euro').fill('12,00');
		await pg.getByRole('button', { name: 'Ausgabe speichern' }).click();
		await pg.waitForLoadState('networkidle');
		await pg.waitForTimeout(900);
	},
	async P(pg) {
		await open(pg, '/ausgaben');
		await pg.getByRole('button', { name: 'Ausgleichen' }).first().click();
		await pg.waitForTimeout(900);
		await pg.getByRole('button', { name: /als bezahlt eintragen/ }).first().click();
		await pg.waitForLoadState('networkidle');
		await pg.waitForTimeout(1500);
	},
	async C(pg) {
		await open(pg, '/chat');
		await pg.getByText('Bin um acht wieder da.').click();
		await pg.waitForTimeout(600);
		await pg.getByRole('menuitem', { name: 'Antworten' }).click();
		await pg.waitForTimeout(700);
		await pg.getByPlaceholder('Nachricht schreiben').fill('Passt, ich bin auch da.');
		await pg.getByRole('button', { name: 'Nachricht senden' }).click();
		await pg.waitForTimeout(1500);
	},
	async B(pg) {
		await open(pg, '/putzen');
		await pg.getByRole('button', { name: /Bad putzen/ }).first().click();
		await pg.waitForTimeout(600);
		await pg.getByRole('button', { name: 'Erledigt bestätigen' }).click();
		await pg.waitForLoadState('networkidle');
		await pg.waitForTimeout(2200);
	},
	async V(pg) {
		await open(pg, '/vorraete');
		await pg.locator('button[aria-label$="verringern"]').first().click();
		await pg.waitForTimeout(1300);
	},
};

/** Setzt die Flags der Menge `set` (Array) in kanonischer Reihenfolge. */
export async function applyFlags(pg, set) {
	for (const f of FLAGS) if (set.includes(f)) await STEPS[f](pg);
}

/** Alle gültigen Flag-Mengen über `flags` (P nur mit A), kanonisch sortiert. */
export function combos(flags) {
	const out = [];
	for (let m = 0; m < 1 << flags.length; m++) {
		const s = flags.filter((_, k) => m & (1 << k));
		if (s.includes('P') && !s.includes('A')) continue;
		out.push(s);
	}
	return out;
}
export { settle };
