import s from './Ueberblick.module.css';

// Szene [08] ÜBERBLICK: statischer Fließtext im Dokumentfluss (kein Scroll-Effekt, kein Canvas), damit
// die Startseite echte Prosa mit Inhaltslinks im Server-HTML hat. Jede Aussage ist im App-Code belegt.
export function Ueberblick() {
	return (
		<section
			id="ueberblick"
			data-sec="ueberblick"
			tabIndex={-1}
			aria-labelledby="ueberblick-titel"
			className={s.sektion}
		>
			<span className={`label ${s.titel}`}>
				<span aria-hidden="true">[ 08 ] </span>ÜBERBLICK
			</span>
			<div className={s.raster}>
				<h2 id="ueberblick-titel" className={s.h2}>
					Die kostenlose WG-App für den ganzen Haushalt
				</h2>
				<div className={s.text}>
					<p>
						ManaWG ist eine kostenlose WG-App auf Deutsch. Sie läuft im Browser und lässt sich wie
						eine App auf den Startbildschirm legen. Sie bündelt, was in einer Wohngemeinschaft sonst
						auf Zettel, Tabellen und den Gruppenchat verteilt ist: Geld, Putzen, Einkauf, Termine
						und Absprachen.
					</p>
					<p>
						In der <a href="/wg-kasse">WG-Kasse</a> tragt ihr Ausgaben ein und teilt sie gleich oder
						mit eigenen Beträgen je Person. ManaWG rechnet die Salden aus und schlägt wenige
						Überweisungen zum Ausgleich vor. Miete, Internet und andere Fixkosten legt ihr einmal
						als Fixkosten an, zum Monatsanfang kommt die Abrechnung für den Vormonat per E-Mail. Wer
						von Splitwise oder Splid kommt, übernimmt alte Ausgaben per{' '}
						<a href="/splitwise-splid-wechseln">CSV-Import</a>.
					</p>
					<p>
						Der <a href="/putzplan">Putzplan</a> wiederholt Aufgaben im festen Rhythmus und verteilt
						sie fair. Wer verreist ist, trägt eine Abwesenheit ein, und der Plan berücksichtigt das.
						Wer dran ist, bekommt eine Erinnerung. Auf der{' '}
						<a href="/einkaufsliste">gemeinsamen Einkaufsliste</a> trägt jede Person ein, was fehlt.
						Fällt ein Vorrat unter seine Grenze, steht er dort von selbst, und nach dem Einkauf
						lässt sich der Beleg direkt als Ausgabe erfassen.
					</p>
					<p>
						Kalender, Pinnwand und Chat halten Termine und Absprachen an einem Ort. Antworten auf
						häufige Fragen stehen in den <a href="/faq">Fragen zu ManaWG</a>, Tipps zu Mietvertrag,
						WG-Casting und Putzplan in den <a href="/ratgeber">WG-Ratgebern</a>.
					</p>
				</div>
			</div>
		</section>
	);
}
