import Link from 'next/link';
import { LegalPage } from '@/components/LegalPage';
import { legalMetadata } from '@/lib/page-metadata';

export const metadata = legalMetadata({
	locale: 'de',
	page: 'terms',
	title: 'Nutzungsbedingungen von ManaWG',
	description:
		'Nutzungsbedingungen der kostenlosen WG-App ManaWG: Konto, Nutzung, Inhalte der WG, Haftung, Kündigung und Löschung der Daten.',
});

export default function TermsPage() {
	return (
		<LegalPage locale="de" page="terms" title="Nutzungsbedingungen">
			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">1. Geltungsbereich</h2>
				<p>
					Diese Bedingungen gelten für die Nutzung der Web-App ManaWG zur Organisation von
					Wohngemeinschaften. Betreiber ist Abubakar Abditube. Du erreichst ihn unter{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
					.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">2. Leistungen</h2>
				<p>
					ManaWG bietet eine Ausgabenverwaltung, einen Putzplan, eine Einkaufsliste mit Vorräten,
					einen Kalender, eine Pinnwand und einen Chat. Die Nutzung ist kostenlos. Eine durchgehende
					Verfügbarkeit, die Wiederherstellung von Daten, Support oder bestimmte Funktionen können
					wir nicht zusagen.
				</p>
				<p className="mt-2">
					<strong>Nutzung durch Minderjährige:</strong> Wenn du unter 16 Jahre alt bist, benötigst
					du für die Nutzung die ausdrückliche Einwilligung einer erziehungsberechtigten Person.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					3. Mitgliedschaft und Pflichten
				</h2>
				<p>
					Du meldest dich mit deinem Google-Konto oder mit E-Mail-Adresse und Passwort oder
					E-Mail-Code an. Für Inhalte, die du einstellst, bist du verantwortlich. Schütze dein Gerät
					und den darauf gespeicherten Browserzugang vor unbefugtem Zugriff. Es ist untersagt,
					rechtswidrige Inhalte einzustellen, ManaWG zu missbrauchen oder automatisierte Angriffe
					auszuführen.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">4. Foto-Uploads</h2>
				<p>
					Lade nur Fotos hoch, an denen du die erforderlichen Rechte hast. Achte dabei auf die
					Urheber- und Persönlichkeitsrechte anderer. Fotos speichern wir bei{' '}
					<strong>Supabase</strong> in Frankfurt am Main und stellen sie nur Mitgliedern deiner WG
					bereit. Wie lange das geschieht und wie die Löschung abläuft, steht in Abschnitt{' '}
					<Link href="/datenschutz#4d">4d der Datenschutzerklärung</Link>.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					5. Nutzungsrechte an deinen Inhalten
				</h2>
				<p>
					Du behältst alle Rechte an deinen Inhalten, zum Beispiel an Pinnwand-Beiträgen und Fotos.
					Für den Betrieb der WG räumst du uns eine einfache, nicht übertragbare Erlaubnis ein,
					diese Inhalte zu speichern, zu übertragen, anzuzeigen und technisch zu sichern, soweit das
					für die gemeinsamen Funktionen erforderlich ist. Verlässt du die WG, bleibt diese
					Erlaubnis nur für Inhalte bestehen, die nach Ziffer 10 dieser Bedingungen und den
					Abschnitten <Link href="/datenschutz#4b">4b</Link> und{' '}
					<Link href="/datenschutz#4d">4d der Datenschutzerklärung</Link> für die WG erhalten
					bleiben. Sie endet, sobald der jeweilige Inhalt gelöscht wird. Für die Löschung
					gespeicherter Daten und Fotos gelten die Angaben in den Abschnitten 4b und 4d der
					Datenschutzerklärung.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					6. Kostenlose Nutzung und gesetzliche Rechte
				</h2>
				<p>
					Die Nutzung von ManaWG ist kostenlos. Deine gesetzlichen Verbraucherrechte, einschließlich
					eines gegebenenfalls bestehenden Widerrufsrechts, bleiben bestehen. Du kannst deine
					Mitgliedschaft jederzeit nach Ziffer 10 beenden.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">7. Haftung</h2>
				<p>
					Bei Vorsatz und grober Fahrlässigkeit, bei Schäden an Leben, Körper oder Gesundheit sowie
					nach dem Produkthaftungsgesetz haften wir unbeschränkt. Bei einfacher Fahrlässigkeit
					haften wir nur, wenn wir eine wesentliche Vertragspflicht verletzen; die Haftung ist dann
					auf den vorhersehbaren, für den Vertrag typischen Schaden begrenzt. Soweit das Gesetz es
					erlaubt, ist eine weitergehende Haftung ausgeschlossen. Verlasse dich bei wichtigen
					finanziellen, rechtlichen oder organisatorischen Entscheidungen nicht allein auf die App.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">8. Lizenz / Quellcode</h2>
				<p>
					Der Quellcode von ManaWG ist als Open-Source-Software unter der Apache-Lizenz 2.0
					veröffentlicht. Für Nutzung, Weitergabe und Änderung des Quellcodes gelten die Bedingungen
					dieser Lizenz. Die Nutzung des gehosteten Dienstes richtet sich nach diesen AGB.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">
					9. Meldung rechtswidriger Inhalte (DSA Art. 16)
				</h2>
				<p>
					Melde rechtswidrige Inhalte bitte an{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>
					. Wir prüfen jede Meldung und entfernen rechtswidrige Inhalte unverzüglich.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">10. Kündigung</h2>
				<p>
					Du kannst deine Mitgliedschaft jederzeit über{' '}
					<em>Einstellungen → Zugang → WG verlassen</em> beenden. Deine bisherigen Beiträge bleiben
					für die WG erhalten; dazu findest du mehr in den Abschnitten{' '}
					<Link href="/datenschutz#4b">4b</Link> und{' '}
					<Link href="/datenschutz#4d">4d der Datenschutzerklärung</Link>.
				</p>
				<p className="mt-2">
					Du kannst dein Konto jederzeit über <em>Einstellungen → Zugang → Konto löschen</em>{' '}
					löschen. Was dabei mit deinen Daten geschieht, steht in Abschnitt{' '}
					<Link href="/datenschutz#rechte">8 der Datenschutzerklärung</Link>.
				</p>
				<p className="mt-2">
					Wer in der WG Admin ist, kann sie über{' '}
					<em>Einstellungen → Zugang → WG dauerhaft löschen</em> unwiderruflich entfernen. Die
					WG-Daten werden aus der aktiven Datenbank entfernt. Bilder sind sofort nicht mehr
					abrufbar; zur anschließenden physischen Löschung siehe{' '}
					<Link href="/datenschutz#4d">Abschnitt 4d der Datenschutzerklärung</Link>. Die Admin-Rolle
					kann an ein anderes aktives Mitglied übergeben werden.
				</p>
				<p className="mt-2">
					Du kannst außerdem per E-Mail an{' '}
					<a href="mailto:info@manawg.com" className="break-all">
						info@manawg.com
					</a>{' '}
					die Löschung von Daten beantragen, die dir zugeordnet werden können, etwa deiner
					Mitgliedskennung, deiner Inhalte oder Fotos. Wir beantworten den Antrag ohne unangemessene
					Verzögerung und spätestens innerhalb eines Monats. Bei komplexen Anträgen oder einer
					großen Zahl von Anfragen können wir die Frist um bis zu zwei weitere Monate verlängern;
					die Gründe dafür teilen wir dir innerhalb des ersten Monats mit (Art. 12 Abs. 3 DSGVO;
					siehe auch Abschnitt <Link href="/datenschutz#rechte">8 der Datenschutzerklärung</Link>).
					Diese Antwortfrist garantiert keine physische Löschung von Fotos innerhalb eines Monats;
					dazu Abschnitt <Link href="/datenschutz#4d">4d</Link>. Gesetzliche Löschpflichten bleiben
					unberührt.
				</p>
				<p className="mt-2">
					Bei Verstößen gegen diese Bedingungen können wir Mitgliedschaften oder WGs sperren oder
					löschen.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">11. Änderungen</h2>
				<p>
					Wir können diese Bedingungen aus einem sachlichen Grund ändern, etwa wenn sich Funktionen,
					Hosting oder rechtliche Vorgaben ändern, und nur im gesetzlich zulässigen Rahmen. Über
					wesentliche Änderungen informieren wir in der App oder auf der Website. Wenn eine Änderung
					deine Zustimmung erfordert, bitten wir dich ausdrücklich darum; allein durch die weitere
					Nutzung gilt sie nicht als erteilt. Wenn du einer Änderung nicht zustimmst, kannst du die
					Nutzung beenden und nach Ziffer 10 deine Mitgliedschaft oder WG löschen lassen. Deine
					gesetzlichen Rechte bleiben unberührt.
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">12. Geltendes Recht</h2>
				<p>Es gilt deutsches Recht; das UN-Kaufrecht ist ausgeschlossen.</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">13. Verbraucherschlichtung</h2>
				<p>
					Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
					Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
				</p>
			</section>

			<section>
				<h2 className="text-lg font-semibold text-(--text-1) mb-2">14. Salvatorische Klausel</h2>
				<p>
					Ist eine Bestimmung dieser Bedingungen unwirksam, bleiben die übrigen Bestimmungen
					unberührt. An die Stelle der unwirksamen Bestimmung tritt die gesetzliche Regelung.
				</p>
			</section>
		</LegalPage>
	);
}
