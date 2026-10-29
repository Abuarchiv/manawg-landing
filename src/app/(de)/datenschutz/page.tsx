import { LegalPage } from '@/components/LegalPage';
import { legalMetadata } from '@/lib/page-metadata';

export const metadata = legalMetadata({
	locale: 'de',
	page: 'privacy',
	title: 'Datenschutzerklärung von ManaWG',
	description:
		'Welche Daten ManaWG verarbeitet, an wen sie übermittelt werden, wie lange sie gespeichert bleiben und welche Rechte du hast.',
});

export default function PrivacyPage() {
	return (
		<LegalPage locale="de" page="privacy" title="Datenschutzerklärung">
			{/* 1. Controller */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">1. Verantwortlicher</h2>
				<p>Abubakar Abditube</p>
				<p>
					E-Mail:{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
				</p>
			</section>

			{/* 2. Data protection officer */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					2. Datenschutzbeauftragter
				</h2>
				<p>
					ManaWG wird von Abubakar Abditube privat betrieben. Ein Datenschutzbeauftragter ist nicht
					benannt.
				</p>
			</section>

			{/* 3. Who we are */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">3. Wer wir sind</h2>
				<p>
					ManaWG ist eine App für Wohngemeinschaften. Wir verkaufen keine personenbezogenen Daten
					und schalten keine Werbung. Für die Produktanalyse übermitteln wir nur die in Abschnitt 4f
					beschriebenen Angaben an PostHog Cloud EU. Die Konten, die du zur Anmeldung und für deine
					WG-Mitgliedschaft anlegst, sind davon getrennt; dazu steht mehr in Abschnitt 4a. Der
					Quellcode der App ist als Open Source unter der Apache-Lizenz 2.0 veröffentlicht.
				</p>
			</section>

			{/* 4. Processing activities */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					4. Verarbeitungstätigkeiten
				</h2>

				<h3 id="4a" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4a. Konto, Authentifizierung und lokale Daten
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Damit Beiträge deiner WG-Mitgliedschaft zugeordnet werden
						können.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des
						Nutzungsvertrags)
					</li>
					<li>
						<strong>Anmeldung und lokale Daten:</strong> Du kannst dich mit Google oder mit
						E-Mail-Adresse anmelden, entweder mit Passwort oder mit einem Einmalcode, den wir dir
						per E-Mail schicken. Bei der Google-Anmeldung erhalten wir von Google deine
						E-Mail-Adresse und deinen Namen. Bei der Anmeldung per E-Mail versendet Supabase
						Bestätigungs-E-Mails, Anmeldecodes und E-Mails zum Zurücksetzen des Passworts an deine
						Adresse. Resend übernimmt den Versand; als Absender erscheint noreply@manawg.com.
						Supabase Auth verwaltet die Anmeldung, die Sitzung wird in Cookies gespeichert. Außerdem
						können WG-Zuordnungen und Namensentwürfe im lokalen Browserspeicher (Local Storage)
						liegen.
					</li>
					<li>
						<strong>Speicherdauer:</strong> Kontodaten speichern wir, bis du dein Konto über{' '}
						<em>Einstellungen → Zugang → Konto löschen</em> löschst. Lokale WG-Zuordnungen und
						Namensentwürfe bleiben im Browser, bis du dessen Speicher manuell löschst.
					</li>
					<li>
						<strong>Empfänger und Auftragsverarbeiter:</strong> Supabase für Anmeldung und
						Datenbankhosting; Resend für den E-Mail-Versand (siehe Abschnitt 5).
					</li>
					<li>
						<strong>Speicherort und Drittlandübermittlungen:</strong> Supabase speichert Daten in
						Frankfurt am Main (EU). Diese Regionseinstellung schließt weitere Übermittlungen nicht
						aus. Resend, Inc. (USA) erhält beim E-Mail-Versand deine E-Mail-Adresse und den
						Nachrichteninhalt. Die Übermittlung stützt sich auf EU-Standardvertragsklauseln oder das
						EU-US Data Privacy Framework.
					</li>
				</ul>

				<h3 id="4b" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4b. WG-Daten (WG-Name, Mitgliedschaften, Ausgaben, Fixkosten, Putzplan, Einkaufsliste,
					Vorräte, Kalender, Pinnwand, Chat)
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Damit die Organisationsfunktionen deiner WG bereitstehen.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des
						Nutzungsvertrags)
					</li>
					<li>
						<strong>Speicherdauer:</strong> Gemeinsame WG-Daten bleiben erhalten, solange die WG
						besteht. Wenn ein Mitglied die WG verlässt, werden diese Daten nicht deshalb gelöscht.
						Wird die WG dauerhaft gelöscht, entfernen wir die zugehörigen Daten aus der aktiven
						Datenbank. Löschst du dein Konto, während andere in der WG bleiben, bleibt dein
						Anzeigename an den von dir erfassten Ausgaben und Beiträgen stehen, damit die übrigen
						Mitglieder weiter korrekt abrechnen können (Art. 6 Abs. 1 lit. f DSGVO). Die Verknüpfung
						dieser Einträge mit deinem Konto wird entfernt.
					</li>
					<li>
						<strong>Empfänger und Auftragsverarbeiter:</strong> Supabase für das Datenbankhosting.
					</li>
					<li>
						<strong>Speicherort und Drittlandübermittlungen:</strong> Supabase speichert Daten in
						Frankfurt am Main (EU). Diese Regionseinstellung schließt weitere Übermittlungen nicht
						aus.
					</li>
				</ul>

				<h3 id="4c" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4c. Technische Logs und Fehlerdiagnose
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Für einen sicheren, stabilen Betrieb, die Fehlersuche und den
						Schutz vor Missbrauch.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (unser berechtigtes
						Interesse an einem sicheren und stabilen Betrieb).
					</li>
					<li>
						<strong>Speicherdauer:</strong> Vercel-Logs bleiben höchstens 30 Tage gespeichert. Wenn
						Sentry für die jeweilige Bereitstellung aktiviert ist, richtet sich die Löschfrist der
						Fehlerereignisse nach dem geltenden Sentry-Tarif.{' '}
						<a
							href="https://docs.sentry.io/security-legal-pii/security/data-retention-periods/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Sentry nennt die Aufbewahrungsfristen je Tarif.
						</a>
					</li>
					<li>
						<strong>Empfänger:</strong> Vercel Inc. (USA) betreibt das Hosting und verarbeitet
						Server-Logs. Wenn Sentry für eine App-Bereitstellung aktiviert ist, erhält Sentry
						(Functional Software, Inc.) technische Fehlerdaten, etwa Fehlertypen, Stacktraces
						(Abläufe im Code bis zu einem Fehler) und freigegebene Diagnosekennzeichen. Für ManaWG
						ist als Sentry-Speicherregion die EU eingestellt; das schließt weitere Übermittlungen
						nicht aus. Vor dem Versand werden veränderliche Fehlermeldungen, Nutzerangaben, nicht
						freigegebene Kontextdaten sowie Anfrage-Header und -Inhalte entfernt. Anfragepfade
						werden bereinigt; Werte aus URL-Abfragen und Fragmenten, WG-Codes,
						Kalender-Zugriffstokens und signierte Datei-URLs werden unkenntlich gemacht. Die
						Sentry-Einbindung fügt Fehlerereignissen weder Nutzerangaben noch automatisch ermittelte
						IP-Adressen hinzu. Automatisch erfasste Sitzungsdaten und Performance-Traces sendet sie
						nicht.
					</li>
					<li>
						<strong>Drittlandübermittlung:</strong> Vercel-Logs können über Server in den USA
						laufen. EU-Standardvertragsklauseln sind vereinbart.
					</li>
				</ul>

				<h3 id="4d" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4d. Foto-Uploads
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Damit Fotos, die du in der WG-App hochlädst (zum Beispiel für
						die Pinnwand oder als Beleg), gespeichert und angezeigt werden können.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des
						Nutzungsvertrags).
					</li>
					<li>
						<strong>Speicherdauer:</strong> Fotos in geteilten WG-Inhalten bleiben für aktive
						Mitglieder verfügbar, solange diese Inhalte auf sie verweisen. Wenn ein Mitglied die WG
						verlässt, werden die geteilten Fotos deshalb nicht entfernt. Wird der letzte Verweis auf
						ein Foto entfernt oder die WG gelöscht, sperren wir den Abruf sofort. Ein späterer
						Wartungslauf stößt die physische Löschung an. Eine maximale Frist für die endgültige
						Löschung oder für Anbieter-Backups können wir nicht zusichern.
					</li>
					<li>
						<strong>Empfänger und Auftragsverarbeiter:</strong> Supabase speichert die Fotos in
						einem nicht öffentlichen Dateispeicher (siehe Abschnitt 5). Nur Mitglieder der WG können
						sie abrufen.
					</li>
					<li>
						<strong>Speicherort und Drittlandübermittlungen:</strong> Die Fotos liegen in der Region
						Frankfurt am Main (EU). Diese Regionseinstellung schließt weitere Übermittlungen nicht
						aus.
					</li>
				</ul>

				<p className="mb-3 text-sm">
					Wenn du die Belegerkennung (OCR, automatische Texterkennung) startest, lädt die App bei
					Bedarf Tesseract-Worker- und Kerndateien sowie deutsche und englische Sprachmodelle von
					jsDelivr. Die Erkennung läuft in deinem Browser. Das Belegbild und der erkannte Text
					werden nicht an jsDelivr übertragen. Laut der{' '}
					<a
						href="https://www.jsdelivr.com/terms/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
					>
						jsDelivr-Datenschutzerklärung
					</a>{' '}
					können jsDelivr und seine CDN-Dienstleister beim Abruf der Dateien technische Daten wie
					IP-Adresse, Browsertyp und -version, verweisende Domain, angeforderte Datei-URL,
					Abrufzeit, Gerätekennungen und weitere Diagnosedaten erhalten. Wenn du danach die Vorschau
					öffnest oder den Import übernimmst, sendet ManaWG die erkannten Daten an die eigene
					Import-API.
				</p>

				<h3 id="4e" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4e. Rate-Limiting (Missbrauchsschutz)
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Zum Schutz vor automatisierten Anfragen, Erraten von Passwörtern
						(Brute-Force) und anderem Missbrauch. Dafür führen wir Zähler pro IP-Adresse oder
						Mitgliedskennung.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (unser berechtigtes
						Interesse, die Infrastruktur zu schützen).
					</li>
					<li>
						<strong>Zeitfenster:</strong> Die Zähler laufen in gleitenden Zeitfenstern von einer
						Minute oder einer Stunde.
					</li>
					<li>
						<strong>Speicherdauer:</strong> Im Produktivbetrieb ist die zusätzliche Upstash-Analyse
						deaktiviert. Die bis zum 30.09.2026 gespeicherten zusätzlichen Analyse-Metadaten wurden
						an diesem Tag gelöscht; zuvor hatten sie keine automatische Ablaufzeit. Die
						Rate-Limit-Zähler verfallen spätestens 2 Stunden und 1 Sekunde nach ihrer Anlage.
					</li>
					<li>
						<strong>Empfänger und Auftragsverarbeiter:</strong> Vercel KV / Upstash, Inc. (USA). Bei
						IP-basierten Limits erhält der Dienst die ermittelte IP-Adresse ungekürzt und ungehasht
						als Schlüsselwert. Für andere Limits verwenden wir Mitgliedskennungen.
					</li>
				</ul>

				<h3 id="4f" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4f. Produktanalyse ohne Analyse-Cookies (PostHog)
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Um ManaWG weiterzuentwickeln, erfassen wir Seitenaufrufe und
						zählen, wie oft eine WG erstellt wird oder jemand einer WG beitritt.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (unser berechtigtes
						Interesse, ManaWG weiterzuentwickeln).
					</li>
					<li>
						<strong>Speicherdauer:</strong> Im derzeit genutzten kostenlosen PostHog-Tarif werden
						Analyseereignisse für ein Jahr gespeichert. Löschungsanfragen kannst du an
						info@manawg.com richten.
					</li>
					<li>
						<strong>Empfänger und Auftragsverarbeiter:</strong> PostHog Inc. verarbeitet die Daten
						über PostHog Cloud EU in Frankfurt (eu.i.posthog.com). ManaWG sendet nur Seitenaufrufe
						und die Ereignisse wg_created und wg_joined. Andere Ereignisse und zusätzliche Angaben,
						die App-Funktionen übergeben, werden vor dem Senden entfernt. Mitgesendet werden
						außerdem eine Ereigniskennung (UUID), der Zeitpunkt, die Projektkennung, eine technische
						Zuordnungskennung, der Hostname und die Browserkennung. Die IP-Adresse erreicht PostHog
						mit der Anfrage.
					</li>
					<li>
						<strong>Verarbeitungsregion und Drittlandübermittlungen:</strong> PostHog Cloud EU in
						Frankfurt. Diese Regionseinstellung schließt weitere Übermittlungen nicht aus.
					</li>
				</ul>
				<p className="mb-3">
					Die Produktanalyse läuft ohne Analyse-Cookies und speichert dafür nichts im lokalen
					Browserspeicher. ManaWG erstellt keine Analyseprofile; automatische Klickerfassung,
					Sitzungsaufzeichnungen und Umfragen sind nicht aktiviert. Namen, E-Mail-Adressen,
					WG-Namen, WG-Codes, Nachrichten, Einkaufs- und Finanzdaten werden nicht übertragen. Für
					die Auswertung kann PostHog aus IP-Adresse, Browserkennung und Domain eine täglich
					wechselnde Kennung bilden. Schutzfunktionen des Browsers oder Inhaltsblocker können die
					Analyse verhindern; ManaWG funktioniert dann weiter.
				</p>

				<h3 id="4g" className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
					4g. Push-Benachrichtigungen
				</h3>
				<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
					<li>
						<strong>Zweck:</strong> Damit du Hinweise auf neue WG-Ereignisse wie Ausgaben, Aufgaben
						oder Nachrichten erhältst, wenn du Benachrichtigungen einschaltest.
					</li>
					<li>
						<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (deine Einwilligung über
						die Abfrage des Browsers). Du kannst sie jederzeit in den App-Einstellungen oder im
						Browser widerrufen.
					</li>
					<li>
						<strong>Verarbeitete Daten:</strong> Die vom Browser erzeugte Push-Adresse, deren
						Schlüssel und der Text der Benachrichtigung.
					</li>
					<li>
						<strong>Speicherdauer:</strong> Bis du Benachrichtigungen ausschaltest, die WG verlässt
						oder dein Konto löschst.
					</li>
					<li>
						<strong>Empfänger:</strong> Der Push-Dienst des Browser- oder Betriebssystemherstellers
						(z. B. Google, Apple oder Mozilla) stellt die Nachricht an dein Gerät zu.
					</li>
					<li>
						<strong>Drittlandübermittlung:</strong> Möglich, da diese Push-Dienste Server in den USA
						nutzen können.
					</li>
				</ul>
			</section>

			{/* 5. Recipients and processors */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					5. Empfänger und Auftragsverarbeiter
				</h2>
				<p className="mb-2">Folgende Dienste erhalten Daten für die jeweils genannten Zwecke:</p>
				<ul className="list-disc pl-5 space-y-2 text-sm">
					<li>
						<strong>Supabase</strong>: verwaltet Anmeldungen und hostet die Postgres-Datenbank sowie
						den Dateispeicher für Fotos in Frankfurt am Main (EU).
					</li>
					<li>
						<strong>Resend, Inc.</strong> (USA): versendet im Produktivbetrieb die von Supabase Auth
						ausgelösten Bestätigungs-E-Mails, Anmeldecodes und E-Mails zum Zurücksetzen des
						Passworts sowie die eigenen E-Mails der App (Einladungen, Zahlungserinnerungen,
						Monatsabrechnung). Absender ist noreply@manawg.com (siehe Abschnitt 4a). Die
						Übermittlung stützt sich auf EU-Standardvertragsklauseln oder das EU-US Data Privacy
						Framework.
					</li>
					<li>
						<strong>Vercel Inc.</strong> (USA): hostet die Web-App und betreibt das Edge-Netzwerk;
						dabei entstehen Server-Logs. Ein Auftragsverarbeitungsvertrag und
						EU-Standardvertragsklauseln liegen vor.
					</li>
					<li>
						<strong>Vercel KV / Upstash, Inc.</strong> (USA): führt die Redis-basierten Zähler für
						den Missbrauchsschutz (pro IP-Adresse oder Kennung, siehe Abschnitt 4e).
					</li>
					<li>
						<strong>PostHog Inc.</strong>: verarbeitet die Produktanalyse über PostHog Cloud EU in
						Frankfurt am Main (siehe Abschnitt 4f).
					</li>
					<li>
						<strong>Sentry (Functional Software, Inc.)</strong>: untersucht technische Fehler, wenn
						Sentry für die jeweilige App-Bereitstellung aktiviert ist (siehe Abschnitt 4c).{' '}
						<a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
							Datenschutzhinweise von Sentry
						</a>{' '}
						und{' '}
						<a href="https://sentry.io/legal/dpa/" target="_blank" rel="noopener noreferrer">
							offizielles Data Processing Addendum
						</a>
						. Das Data Processing Addendum (Auftragsverarbeitungsvertrag) wurde am 30.09.2026
						abgeschlossen.
					</li>
					<li>
						<strong>jsDelivr und CDN-Dienstleister</strong>: liefern Tesseract-Worker-, Kern- und
						Sprachdateien, wenn du die lokale OCR ausdrücklich startest (siehe Abschnitt 4d).
					</li>
				</ul>
			</section>

			{/* 6. No advertising and no advertising profiles */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					6. Keine Werbung und keine Werbeprofile
				</h2>
				<p>
					ManaWG enthält <strong>keine Werbung</strong>, <strong>kein Google Analytics</strong>
					und keine Social-Media-Tracker. Wir verwenden Daten nicht für Werbung und verfolgen dich
					nicht über verschiedene Websites hinweg. Die in Abschnitt 4f beschriebene Produktanalyse
					ohne Analyse-Cookies dient der Weiterentwicklung von ManaWG; dafür werden keine
					Analyseprofile angelegt. Die Konten für Anmeldung und WG-Mitgliedschaft sind davon
					getrennt; sie sind in Abschnitt 4a beschrieben.
				</p>
			</section>

			{/* 7. Cookies & local storage */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					7. Cookies und lokaler Browser-Speicher
				</h2>
				<p>
					Für die Anmeldung bei Supabase verwendet ManaWG Cookies. Wenn du in der App eine Sprache
					wählst, speichert das Cookie manawg_locale diese Wahl ein Jahr lang; mit „System“ wird es
					entfernt. Außerdem können WG-Zuordnungen und Namensentwürfe im lokalen Browserspeicher (
					<strong>Local Storage</strong>) abgelegt werden. Wenn du den Browser-Speicher löschst,
					werden auch diese lokalen Daten entfernt.
				</p>
			</section>

			{/* 8. Data subject rights */}
			<section>
				<h2 id="rechte" className="text-lg font-semibold text-[var(--text-1)] mb-2">
					8. Deine Rechte (Betroffenenrechte)
				</h2>
				<p className="mb-2">Du kannst folgende Rechte uns gegenüber geltend machen:</p>
				<ul className="list-disc pl-5 space-y-1 text-sm">
					<li>
						<strong>Art. 15 DSGVO</strong>: Auskunft über deine gespeicherten Daten
					</li>
					<li>
						<strong>Art. 16 DSGVO</strong>: Berichtigung unrichtiger Daten
					</li>
					<li>
						<strong>Art. 17 DSGVO</strong>: Löschung. Du kannst dein Konto jederzeit löschen. Wähle
						dazu <em>Einstellungen → Zugang → Konto löschen</em>. Dabei werden deine Anmeldedaten
						entfernt und du verlässt alle WGs. Daten einer WG, in der du allein bist, werden aus der
						aktiven Datenbank entfernt; zugehörige Fotos siehe Abschnitt <a href="#4d">4d</a>.
						Bleiben weitere Mitglieder in einer WG, bleibt dein Anzeigename an deinen bisherigen
						Beiträgen stehen (siehe Abschnitt <a href="#4b">4b</a>). Die Erstellerin oder der
						Ersteller kann eine WG über <em>Einstellungen → Zugang → WG dauerhaft löschen</em>{' '}
						unwiderruflich entfernen. Dann werden alle Mitglieder, Ausgaben, Listen, Aufgaben und
						Pinnwand-Beiträge der WG aus der aktiven Datenbank entfernt. Der Abruf zugehöriger
						Bilder wird sofort gesperrt; die physische Löschung folgt später (siehe Abschnitt{' '}
						<a href="#4d">4d</a>
						). Du kannst eine weitergehende Löschung per E-Mail an{' '}
						<a href="mailto:info@manawg.com" className="break-all">
							info@manawg.com
						</a>{' '}
						beantragen.
					</li>
					<li>
						<strong>Art. 18 DSGVO</strong>: Einschränkung der Verarbeitung
					</li>
					<li>
						<strong>Art. 20 DSGVO</strong>: Datenübertragbarkeit
					</li>
					<li>
						<strong>Art. 21 DSGVO</strong>: Widerspruch gegen Verarbeitungen auf Grundlage von Art.
						6 Abs. 1 lit. f DSGVO aus Gründen, die sich aus deiner besonderen Situation ergeben, zum
						Beispiel bei Logs oder Rate-Limiting
					</li>
					<li>
						<strong>Art. 77 DSGVO</strong>: Beschwerde bei der zuständigen Aufsichtsbehörde:
						<br />
						<strong>
							Der Hessische Beauftragte für Datenschutz und Informationsfreiheit (HBDI)
						</strong>
						<br />
						Gustav-Stresemann-Ring 1, 65189 Wiesbaden
						<br />
						<a
							href="https://datenschutz.hessen.de"
							target="_blank"
							rel="noopener noreferrer"
							className="break-all"
						>
							https://datenschutz.hessen.de
						</a>
					</li>
				</ul>
				<p className="mt-2 text-sm">
					Anfragen an:{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
				</p>
				<p className="mt-2 text-sm">
					Wir beantworten deinen Antrag ohne unangemessene Verzögerung und spätestens binnen eines
					Monats. Bei komplexen Anträgen oder einer großen Zahl von Anfragen können wir diese Frist
					um bis zu zwei weitere Monate verlängern. Über die Verlängerung und ihre Gründe
					informieren wir dich innerhalb des ersten Monats (Art. 12 Abs. 3 DSGVO). Diese
					Antwortfrist ist keine Zusage, dass alle Daten innerhalb eines Monats physisch gelöscht
					werden; bei Fotos gilt insbesondere die Beschreibung in Abschnitt <a href="#4d">4d</a>.
					Gesetzliche Löschpflichten bleiben unberührt.
				</p>
				<p className="mt-2 text-sm">
					Wenn wir Daten auf Grundlage deiner Einwilligung verarbeiten, kannst du deine Einwilligung
					jederzeit mit Wirkung für die Zukunft widerrufen. Der Widerruf berührt die Rechtmäßigkeit
					der Verarbeitung vor dem Widerruf nicht (Art. 7 Abs. 3 DSGVO). Für Push-Benachrichtigungen
					siehe Abschnitt <a href="#4g">4g</a>.
				</p>
			</section>

			{/* 9. No automated decision-making */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					9. Keine automatisierte Entscheidungsfindung / Profiling
				</h2>
				<p>
					Wir treffen keine automatisierten Entscheidungen im Sinne von Art. 22 DSGVO und führen
					kein Profiling durch. Wir verwenden deine Daten für die in dieser Erklärung beschriebenen
					Zwecke.
				</p>
			</section>

			{/* 10. Obligation to provide data */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					10. Pflicht zur Bereitstellung der Daten
				</h2>
				<p>
					Du bist weder gesetzlich noch vertraglich verpflichtet, personenbezogene Daten
					bereitzustellen (Art. 13 Abs. 2 lit. e DSGVO). Ohne Anmeldung (mit Google oder mit
					E-Mail-Adresse und Passwort oder E-Mail-Code) sowie ohne Anzeigenamen kannst du die App
					allerdings nicht nutzen.
				</p>
			</section>

			{/* 11. Updates */}
			<section>
				<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
					11. Aktualisierungen dieser Erklärung
				</h2>
				<p>
					Wenn sich die Datenverarbeitung ändert, können wir diese Datenschutzerklärung
					aktualisieren. Über wesentliche Änderungen informieren wir dich per E-Mail oder in der
					App. Das Datum der letzten Aktualisierung steht oben auf dieser Seite.
				</p>
			</section>
		</LegalPage>
	);
}
