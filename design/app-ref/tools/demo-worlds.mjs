// Stufe 2b: Crawl in den Welten nach einem Ablauf (E Hafermilch, A Kinoabend, P ausgeglichen, B Bad putzen, C Antwort, V Vorrat).
// Je Welt nur die Routen und Elemente, deren Folgezustand sich von der Ausgangswelt unterscheidet (ONLYKEYS), Tiefe 1.
// Aufruf: BASE=<proxy> OUT=<dir> node design/app-ref/tools/demo-worlds.mjs [E,A,...]
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PLAN = {
	E: { flags: 'E', routes: '/,/einkauf,/putzen,/vorraete', only: 'Neu in deiner WG|^summary\\|Erledigt|^a\\|Ausgabe erfassen|Nicht jetzt' },
	A: { flags: 'A', routes: '/,/ausgaben', only: 'Neu in deiner WG|Details öffnen|Aktionen für|Ausgleichen|Erinnern|Ausgaben importieren|Alle Erinnerungen' },
	AP: { flags: 'A,P', routes: '/,/ausgaben', only: 'Neu in deiner WG|Details öffnen|Aktionen für|Ausgleichen' },
	B: { flags: 'B', routes: '/,/putzen,/kalender', only: 'Neu in deiner WG|Aufgabenaktionen|Als erledigt markieren|So wird verteilt|Putzaufgabe öffnen|Monat' },
	C: { flags: 'C', routes: '/chat', only: 'Aktionen für Nachricht' },
	V: { flags: 'V', routes: '/vorraete', only: 'Schnell nachfüllen|bearbeiten|Einkaufsliste|um eins' },
};
const want = process.argv[2] ? process.argv[2].split(',') : Object.keys(PLAN);
for (const name of want) {
	const p = PLAN[name];
	console.log(`== Welt ${name}`);
	const r = spawnSync('node', [join(here, 'demo-crawl.mjs')], {
		stdio: 'inherit',
		env: { ...process.env, NAME: name, FLAGS: p.flags, ROUTES: p.routes, ONLYKEYS: p.only, MAXD: '1' },
	});
	if (r.status) console.log(`Welt ${name}: Exit ${r.status}`);
}
