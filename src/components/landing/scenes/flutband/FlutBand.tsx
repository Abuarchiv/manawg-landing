import s from './FlutBand.module.css';

// Strecke zwischen Ende-Szene und "So geht's": hier zerfällt die App im Handy in Zeichen, die zu den Ziffern
// fliegen (scenes/zerfall). Das Band selbst ist nur Raum dafür.
export function FlutBand() {
	return <div id="flutband" data-sec="flutband" aria-hidden="true" className={s.band} />;
}
