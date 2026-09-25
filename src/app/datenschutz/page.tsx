import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Datenschutzerklärung — ManaWG',
	description:
		'ManaWG Datenschutz: kostenlose private WG-App ohne Werbung, ohne Tracking und ohne Personenprofile. Transparente Speicherung, Löschung und eine cookielos betriebene Produktanalyse.',
	alternates: { canonical: '/datenschutz' },
};

// craftsman-ignore: TS002
export default function DatenschutzPage() {
	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
			<div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
					aria-label="Zurück zur Startseite"
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					Zurück
				</Link>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Datenschutzerklärung</h1>
				<p className="text-sm text-[var(--text-3)] mb-8">Stand: 2026-09-25</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					{/* 1. Verantwortlicher */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">1. Verantwortlicher</h2>
						<p>Abubakar Abditube</p>
						<p>Kurt-Schumacher-Strasse 2</p>
						<p>60311 Frankfurt am Main, Deutschland</p>
						<p>
							E-Mail:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
						</p>
					</section>

					{/* 2. Datenschutzbeauftragter */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							2. Datenschutzbeauftragter
						</h2>
						<p>
							ManaWG wird von einer privaten Einzelperson unentgeltlich betrieben. Ein
							Datenschutzbeauftragter ist nicht benannt.
						</p>
					</section>

					{/* 3. Wer wir sind */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">3. Wer wir sind</h2>
						<p>
							ManaWG ist eine kostenlose WG-App für private Wohngemeinschaften. Die App wird
							unentgeltlich betrieben, ohne Werbung, ohne Tracking und ohne Verkauf von Daten.
							Anonyme Produktanalyse wird cookielos über PostHog Cloud EU betrieben und in 4f
							beschrieben. Der Quellcode war früher teilweise offen einsehbar, ist inzwischen aber
							privat und wird nicht veröffentlicht.
						</p>
					</section>

					{/* 4. Verarbeitungstätigkeiten */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							4. Verarbeitungstätigkeiten
						</h2>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4a. Konto, Authentifizierung und lokale Daten
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Zuordnung von Beiträgen zu einer WG-Mitgliedschaft
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
							</li>
							<li>
								<strong>Hinweis zur Identifikation:</strong> Du meldest dich mit deinem Google-Konto
								oder mit E-Mail-Adresse und Passwort an. Bei der Anmeldung mit Google übermittelt
								Google uns deine E-Mail-Adresse und deinen Namen. Bei der Anmeldung per E-Mail
								versendet Supabase Bestätigungs- und Passwort-Reset-E-Mails an deine Adresse. Die
								Authentifizierung erfolgt über Supabase Auth; die Sitzung wird in Cookies verwaltet.
								Im Browser können lokale WG-Zuordnungen und Namensentwürfe im{' '}
								<strong>Local Storage</strong> gespeichert werden.
							</li>
							<li>
								<strong>Speicherdauer:</strong> Kontodaten bis zur Löschung deines Kontos über{' '}
								<em>Einstellungen → Zugang → Konto löschen</em>. Lokale WG-Zuordnungen und
								Namensentwürfe bleiben bis zur manuellen Löschung des Browser-Speichers gespeichert.
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> Supabase (Authentifizierung und
								Datenbankhosting, siehe § 5)
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Nein — die Datenbank wird in der Region
								Frankfurt (EU) betrieben.
							</li>
						</ul>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4b. WG-Daten (WG-Name, Mitgliedschaften, Ausgaben, Fixkosten, Putzplan, Einkaufsliste,
							Vorräte, Kalender, Pinnwand, Chat)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Bereitstellung der WG-Organisationsfunktionen
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
							</li>
							<li>
								<strong>Speicherdauer:</strong> Bis zur Löschung der Mitgliedschaft bzw. WG;
								technische Backups laufen nach max. 30 Tagen aus. Wird eine WG dauerhaft gelöscht,
								werden die zugehörigen WG-Daten aus der aktiven Datenbank entfernt. Löschst du dein
								Konto, während andere Mitglieder in der WG bleiben, bleibt dein Anzeigename an den
								von dir erfassten Ausgaben und Beiträgen stehen, damit die Abrechnung der übrigen
								Mitglieder korrekt bleibt (Art. 6 Abs. 1 lit. f DSGVO); die Verknüpfung zu deinem
								Konto wird entfernt.
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> Supabase (Datenbankhosting)
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Nein (Verarbeitung auf EU-Server)
							</li>
						</ul>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4c. Technische Logs (Serveranfragen, Fehlermeldungen)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Betriebssicherheit, Fehlerdiagnose, Missbrauchsabwehr
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
								an sicherem und stabilem Betrieb)
							</li>
							<li>
								<strong>Speicherdauer:</strong> Vercel-Logs max. 30 Tage
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> Vercel Inc. (USA, AVV, SCCs —
								Hosting, Server- und Fehler-Logs). Ein separater Error-Monitoring-Dienst wird{' '}
								<strong>nicht</strong> eingesetzt; Fehlermeldungen bleiben in den Vercel-Logs.
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Vercel-Logs können US-Server passieren (SCCs
								vorhanden).
							</li>
						</ul>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4d. Foto-Uploads
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Speicherung und Auslieferung von Fotos, die Nutzer in der
								WG-App hochladen (z.B. Pinnwand, Belege)
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
							</li>
							<li>
								<strong>Speicherdauer:</strong> Bis zur Löschung durch Nutzer oder bei Löschung der
								Mitgliedschaft bzw. WG; technische Backups laufen nach max. 30 Tagen aus
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> Supabase (Datei-Speicher, siehe §
								5). Fotos liegen in einem nicht öffentlichen Speicher und werden nur Mitgliedern der
								WG ausgeliefert.
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Nein — der Speicher wird in der Region
								Frankfurt (EU) betrieben.
							</li>
						</ul>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4e. Rate-Limiting (Missbrauchsschutz)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Schutz vor automatisierten Anfragen, Brute-Force und
								Missbrauch (Zähler je IP / Mitgliedskennung)
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
								am Schutz der Infrastruktur)
							</li>
							<li>
								<strong>Speicherdauer:</strong> Kurzlebige Counter (Minuten bis max. 24 Stunden);
								keine dauerhafte Speicherung
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> Vercel KV / Upstash, Inc. (USA,
								Verarbeitung auf EU-Servern, AVV, SCCs) — gespeichert werden ausschließlich
								Rate-Limit-Counter; IP-Adressen werden gekürzt/anonymisiert verarbeitet.
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Verarbeitung primär auf EU-Servern; Betreiber
								mit Sitz USA, SCCs vorhanden.
							</li>
						</ul>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4f. Anonyme Produktanalyse (PostHog)
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Anonyme Produktanalyse — gezählt werden Seitenaufrufe sowie
								die erfolgreiche Erstellung und der erfolgreiche Beitritt zu einer WG, um ManaWG zu
								verbessern
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
								an der Weiterentwicklung des Angebots)
							</li>
							<li>
								<strong>Speicherdauer:</strong> ManaWG speichert selbst keine Analyseprofile; die
								Speicherdauer der Ereignisse bestimmt PostHog Cloud EU als Auftragsverarbeiter.
								Löschungsanfragen an info@manawg.com
							</li>
							<li>
								<strong>Empfänger / Auftragsverarbeiter:</strong> PostHog Inc. — PostHog Cloud EU,
								Region Frankfurt (eu.i.posthog.com). Übertragen werden ausschließlich Seitenaufrufe
								sowie die Ereignisse wg_created und wg_joined; alle anderen Ereignisse und alle
								zusätzlichen Eigenschaften werden vor dem Senden verworfen.
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Nein — Verarbeitung in der EU-Region
								(Frankfurt).
							</li>
						</ul>
						<p className="mb-3">
							Die Analyse läuft <strong>cookielos</strong>: kein Analyse-Cookie, keine Speicherung
							im Local Storage, kein Personenprofil, keine automatische Klickerfassung, keine
							Session-Aufzeichnung und keine Umfragen. Namen, E-Mail-Adressen, WG-Namen, WG-Codes,
							Nachrichten, Einkaufs- und Finanzdaten werden nicht übertragen. Technisch notwendige
							Verbindungsdaten wie die IP-Adresse der Anfrage und die Browser-Kennung erreichen
							PostHog mit der Anfrage. Browser-Schutzfunktionen oder Inhaltsblocker können die
							Analyse verhindern; ManaWG funktioniert dann unverändert weiter.
						</p>

						<h3 className="text-base font-semibold text-[var(--text-1)] mb-2 mt-4">
							4g. Push-Benachrichtigungen
						</h3>
						<ul className="list-disc pl-5 space-y-1 text-sm mb-3">
							<li>
								<strong>Zweck:</strong> Hinweise auf neue WG-Ereignisse (z.B. Ausgaben, Aufgaben,
								Nachrichten), wenn du Benachrichtigungen in der App einschaltest
							</li>
							<li>
								<strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über die
								Browser-Abfrage); jederzeit widerrufbar in den App-Einstellungen oder im Browser
							</li>
							<li>
								<strong>Verarbeitete Daten:</strong> die vom Browser erzeugte Push-Adresse und deren
								Schlüssel sowie der Inhalt der Benachrichtigung
							</li>
							<li>
								<strong>Speicherdauer:</strong> Bis du Benachrichtigungen ausschaltest, die WG
								verlässt oder dein Konto löschst
							</li>
							<li>
								<strong>Empfänger:</strong> der Push-Dienst deines Browser- bzw.
								Betriebssystemherstellers (z.B. Google, Apple, Mozilla), der die Nachricht an dein
								Gerät zustellt
							</li>
							<li>
								<strong>Drittland-Transfer:</strong> Möglich — diese Push-Dienste können Server in
								den USA nutzen.
							</li>
						</ul>
					</section>

					{/* 5. Auftragsverarbeiter */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							5. Auftragsverarbeiter
						</h2>
						<p className="mb-2">Wir setzen folgende Auftragsverarbeiter ein (Art. 28 DSGVO):</p>
						<ul className="list-disc pl-5 space-y-2 text-sm">
							<li>
								<strong>Supabase</strong> — Authentifizierung, Postgres-Datenbankhosting und
								Datei-Speicher für Fotos, Region Frankfurt (EU).
							</li>
							<li>
								<strong>Vercel Inc.</strong> (USA) — Hosting der Web-App, Edge-Netzwerk,
								Server-Logs. AVV, SCCs vorhanden.
							</li>
							<li>
								<strong>Vercel KV / Upstash, Inc.</strong> (USA) — Redis-basiertes Rate-Limiting
								(Counter pro IP/Kennung), Verarbeitung auf EU-Servern. AVV, SCCs vorhanden.
							</li>
							<li>
								<strong>PostHog Inc.</strong> — Anonyme Produktanalyse über PostHog Cloud EU, Region
								Frankfurt (siehe 4f).
							</li>
						</ul>
					</section>

					{/* 6. Keine Werbung, kein Tracking */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							6. Keine Werbung, kein Tracking, keine Personenprofile
						</h2>
						<p>
							ManaWG enthält <strong>keine Werbung</strong>, <strong>kein Google Analytics</strong>,
							keine Social-Media-Tracker, kein Fingerprinting und keine Weitergabe von Daten an
							Dritte zu Werbezwecken. Es findet ausdrücklich{' '}
							<strong>keine Werbe- oder Cross-Site-Verfolgung</strong> statt. Die einzige Ausnahme
							ist die anonyme Produktanalyse über PostHog Cloud EU (4f): cookielos, ohne
							Personenprofile und ohne Weitergabe von Nutzungsdaten an Dritte zu Werbezwecken.
							ManaWG wird unentgeltlich bereitgestellt und richtet sich an private WGs.
						</p>
					</section>

					{/* 7. Cookies & Local Storage */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							7. Cookies &amp; Local Storage
						</h2>
						<p>
							ManaWG verwendet Cookies für die Supabase-Authentifizierung. Zusätzlich können lokale
							WG-Zuordnungen und Namensentwürfe im <strong>Local Storage</strong> des Browsers
							gespeichert werden. Beim Löschen des Browser-Speichers werden diese lokalen Daten
							gelöscht.
						</p>
					</section>

					{/* 8. Betroffenenrechte */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							8. Deine Rechte (Betroffenenrechte)
						</h2>
						<p className="mb-2">Du hast folgende Rechte gegenüber uns:</p>
						<ul className="list-disc pl-5 space-y-1 text-sm">
							<li>
								<strong>Art. 15 DSGVO</strong> — Auskunft über gespeicherte Daten
							</li>
							<li>
								<strong>Art. 16 DSGVO</strong> — Berichtigung unrichtiger Daten
							</li>
							<li>
								<strong>Art. 17 DSGVO</strong> — Löschung. Du kannst dein Konto jederzeit selbst
								über <em>Einstellungen → Zugang → Konto löschen</em> löschen. Dabei werden deine
								Anmeldedaten gelöscht und du verlässt alle WGs; WGs, in denen du allein warst,
								werden vollständig gelöscht. In WGs mit weiteren Mitgliedern bleibt dein Anzeigename
								an deinen bisherigen Beiträgen stehen (siehe 4b). Die Erstellerin oder der Ersteller
								einer WG kann sie über <em>Einstellungen → Zugang → WG dauerhaft löschen</em>{' '}
								unwiderruflich entfernen. Dabei werden alle Mitglieder, Ausgaben, Listen, Aufgaben
								und Pinnwand-Beiträge der WG sowie alle zugehörigen Bilder sofort gelöscht.
								Zusätzlich kann eine weitergehende Löschung per E-Mail an{' '}
								<a href="mailto:info@manawg.com" className="break-all">
									info@manawg.com
								</a>{' '}
								angefordert werden, sie wird binnen 30 Tagen gemäß Art. 12 Abs. 3 DSGVO bearbeitet.
							</li>
							<li>
								<strong>Art. 18 DSGVO</strong> — Einschränkung der Verarbeitung
							</li>
							<li>
								<strong>Art. 20 DSGVO</strong> — Datenübertragbarkeit
							</li>
							<li>
								<strong>Art. 21 DSGVO</strong> — Widerspruch gegen Verarbeitungen auf Grundlage von
								Art. 6 Abs. 1 lit. f (berechtigtes Interesse, z.B. Logs und Rate-Limiting)
							</li>
							<li>
								<strong>Art. 77 DSGVO</strong> — Beschwerde bei der zuständigen Aufsichtsbehörde:
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
					</section>

					{/* 9. Keine automatisierte Entscheidung */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							9. Keine automatisierte Entscheidungsfindung / Profiling
						</h2>
						<p>
							Wir treffen keine automatisierten Entscheidungen im Sinne von Art. 22 DSGVO und
							erstellen kein Profiling. Deine Daten werden ausschließlich für den in dieser
							Erklärung beschriebenen Betrieb des Dienstes verwendet.
						</p>
					</section>

					{/* 10. Pflicht zur Bereitstellung */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							10. Pflicht zur Bereitstellung der Daten
						</h2>
						<p>
							Eine gesetzliche oder vertragliche Pflicht zur Bereitstellung personenbezogener Daten
							besteht nicht (Art. 13 Abs. 2 lit. e DSGVO). Für die Nutzung der App ist die Anmeldung
							mit Google oder mit E-Mail-Adresse und Passwort sowie ein Anzeigename erforderlich.
						</p>
					</section>

					{/* 11. Aktualisierungen */}
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							11. Aktualisierungen dieser Erklärung
						</h2>
						<p>
							Wir können diese Datenschutzerklärung aktualisieren. Bei wesentlichen Änderungen
							informieren wir per E-Mail oder In-App-Hinweis. Das Datum der letzten Aktualisierung
							steht am Kopf dieser Seite.
						</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/impressum" className={TEXT_LINK}>
						Impressum
					</Link>
					{' · '}
					<Link href="/agb" className={TEXT_LINK}>
						AGB
					</Link>
				</p>
			</footer>
		</main>
	);
}
