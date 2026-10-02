import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Nutzungsbedingungen — ManaWG',
	description:
		'Nutzungsbedingungen für ManaWG: kostenlose Nutzung, Rechte und Pflichten, Haftung und Kündigung.',
	alternates: { canonical: '/agb' },
};

export default function AgbPage() {
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

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">Nutzungsbedingungen</h1>
				<p className="text-sm text-[var(--text-3)] mb-8">Stand: 2. Oktober 2026</p>

				<div className="prose prose-sm max-w-none text-[var(--text-2)] space-y-6 leading-relaxed [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-[var(--accent)] [&_a:focus-visible]:rounded-sm">
					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">1. Geltungsbereich</h2>
						<p>
							Diese Nutzungsbedingungen regeln die Nutzung von ManaWG — einer kostenlosen Web-App
							für Wohngemeinschaften. ManaWG wird privat und unentgeltlich betrieben und ist kein
							kommerzielles Produkt. Betreiber: Abubakar Abditube, Frankfurt am Main (Kontakt:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
							).
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">2. Leistungen</h2>
						<p>
							ManaWG stellt eine Plattform zur Organisation gemeinsamer Haushalts- und WG-Aufgaben
							bereit (Ausgabenverwaltung, Putzplan, Einkaufsliste, Pinnwand). Die Nutzung ist
							kostenlos. Die App wird nach bestem Bemühen betrieben; es besteht kein Anspruch auf
							Verfügbarkeit, Datenwiederherstellung, Support oder bestimmte Funktionen.
						</p>
						<p className="mt-2">
							<strong>Mindestalter:</strong> Die Nutzung von ManaWG setzt ein Mindestalter von 16
							Jahren voraus (Art. 8 DSGVO). Personen unter 16 Jahren dürfen ManaWG nicht ohne
							ausdrückliche Einwilligung einer erziehungsberechtigten Person nutzen.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							3. Mitgliedschaft und Pflichten
						</h2>
						<p>
							Zur Nutzung meldest du dich mit deinem Google-Konto oder mit E-Mail-Adresse und
							Passwort an. Du bist verantwortlich für die Inhalte, die du einstellst, sowie für den
							Schutz deines Gerätes und Browser-Speichers vor unbefugtem Zugriff. Rechtswidrige
							Inhalte, Missbrauch und automatisierte Angriffe sind untersagt.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">4. Foto-Uploads</h2>
						<p>
							Du darfst nur Fotos hochladen, an denen du die nötigen Rechte hast. Persönlichkeits-
							und Urheberrechte Dritter sind zu wahren. Fotos werden bei unserem Auftragsverarbeiter{' '}
							<strong>Supabase</strong> (Region Frankfurt, EU) gespeichert und nur an Mitglieder der
							WG ausgeliefert. Wie lange Fotos gespeichert werden und wie ihre Löschung erfolgt,
							beschreiben wir in Abschnitt 4d der Datenschutzerklärung.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							5. Nutzungsrechte an deinen Inhalten
						</h2>
						<p>
							Du behältst alle Rechte an deinen Inhalten (Pinnwand-Beiträge, Fotos, sonstige
							Uploads). Du räumst uns für die Dauer deiner Mitgliedschaft eine einfache,
							nicht-übertragbare Lizenz ein, deine Inhalte technisch zu speichern, zu übertragen,
							anzuzeigen und in Backups zu sichern, soweit das für den Betrieb des Dienstes
							erforderlich ist. Mit Löschung deiner WG oder der betroffenen Inhalte erlischt diese
							Lizenz. Für die Löschung gespeicherter Daten und Fotos gelten die Angaben in Abschnitt
							4 der Datenschutzerklärung.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							6. Kostenlose Nutzung und gesetzliche Rechte
						</h2>
						<p>
							Für die Nutzung von ManaWG zahlst du kein Entgelt. Gesetzliche Verbraucherrechte,
							einschließlich eines gegebenenfalls bestehenden Widerrufsrechts, bleiben unberührt. Du
							kannst deine Mitgliedschaft jederzeit nach Ziffer 10 beenden.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">7. Haftung</h2>
						<p>
							Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von
							Leben, Körper oder Gesundheit sowie nach den Vorschriften des Produkthaftungsgesetzes.
							Bei einfacher Fahrlässigkeit haften wir nur für die Verletzung wesentlicher
							Vertragspflichten (Kardinalpflichten); die Haftung ist hierbei der Höhe nach auf den
							vertragstypischen, vorhersehbaren Schaden begrenzt. Eine weitergehende Haftung ist
							ausgeschlossen, soweit gesetzlich zulässig. ManaWG wird unentgeltlich bereitgestellt;
							nutze die App daher nicht als alleinige Grundlage für kritische finanzielle,
							rechtliche oder organisatorische Entscheidungen.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							8. Lizenz / Quellcode
						</h2>
						<p>
							Der Quellcode von ManaWG ist nicht öffentlich einsehbar. Die Nutzung der App erlaubt
							keine Einsichtnahme, Vervielfältigung, Weitergabe oder kommerzielle Verwertung des
							Quellcodes.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							9. Meldung rechtswidriger Inhalte (DSA Art. 16)
						</h2>
						<p>
							Meldungen rechtswidriger Inhalte bitte an:{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>
							. Wir prüfen jede Meldung und entfernen rechtswidrige Inhalte unverzüglich.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">10. Kündigung</h2>
						<p>
							Du kannst deine Mitgliedschaft auf diesem Gerät jederzeit über{' '}
							<em>Einstellungen → Zugang → WG verlassen</em> beenden — deine bisherigen Beiträge
							bleiben für die WG erhalten. Dein Konto kannst du jederzeit über{' '}
							<em>Einstellungen → Zugang → Konto löschen</em> löschen; Details siehe
							Datenschutzerklärung Abschnitt 8. Die WG-Erstellerin oder der WG-Ersteller kann die
							gesamte WG über <em>Einstellungen → Zugang → WG dauerhaft löschen</em> unwiderruflich
							entfernen. Die zugehörigen Daten werden aus der aktiven Datenbank entfernt. Der Abruf
							zugehöriger Bilder wird sofort gesperrt. Ihre anschließende physische Löschung ist in
							Abschnitt 4d der Datenschutzerklärung beschrieben. Eine zusätzliche Löschung von
							Daten, die dir zugeordnet werden können (Mitgliedskennung, von dir erstellte Inhalte,
							Fotos), kann auf Anfrage per E-Mail an{' '}
							<a href="mailto:info@manawg.com" className="break-all">
								info@manawg.com
							</a>{' '}
							angefordert werden und wird binnen 30 Tagen gemäß Art. 12 Abs. 3 DSGVO bearbeitet. Wir
							behalten uns vor, Mitgliedschaften oder WGs bei Verstößen gegen diese Bedingungen zu
							sperren oder zu löschen.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">11. Änderungen</h2>
						<p>
							Diese Bedingungen können angepasst werden, wenn sich Funktionen, Hosting oder
							rechtliche Anforderungen ändern. Wesentliche Änderungen werden in der App oder auf der
							Webseite kenntlich gemacht. Wenn du die Bedingungen nicht akzeptierst, kannst du die
							App nicht weiter nutzen und deine WG bzw. deine Daten löschen lassen.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">12. Geltendes Recht</h2>
						<p>
							Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist
							Frankfurt am Main, soweit gesetzlich zulässig.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							13. Verbraucherschlichtung
						</h2>
						<p>
							Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
							Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
						</p>
					</section>

					<section>
						<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">
							14. Salvatorische Klausel
						</h2>
						<p>
							Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleibt die Wirksamkeit der
							übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt die
							gesetzliche Regelung.
						</p>
					</section>
				</div>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					<Link href="/impressum" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Impressum
					</Link>
					{' · '}
					<Link href="/datenschutz" className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
						Datenschutz
					</Link>
				</p>
			</footer>
		</main>
	);
}
