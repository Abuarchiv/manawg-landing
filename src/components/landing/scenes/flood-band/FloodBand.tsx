import s from './FloodBand.module.css';

// Stretch between the finale scene and "How it works": here the app in the phone dissolves into characters that
// fly to the digits (scenes/decay). The band itself is only space for that.
export function FloodBand() {
	return <div id="flutband" data-sec="flutband" aria-hidden="true" className={s.band} />;
}
