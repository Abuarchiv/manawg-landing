import s from './FlutBand.module.css';

// Flutband zwischen Ende-Szene und "So geht's", 1:1 aus design/final.dc.html: drei Zeilen zu 40 Zellen,
// # = Wolkenfenster (früher weiß), Ziffer = schwarze Zelle mit Zahl der weißen Nachbarn, "." = schwarze Zelle ohne Ziffer.
// Es steht fest im Fluss und scrollt mit der Ende-Bühne (deren Unterkante es berührt) nach oben, ohne Ein- oder
// Ausblenden. Läuft es unter den Kopf, deckt es KopfMaske wie jeden Inhalt.
const MUSTER = [
	'##5#####5###################4###3#3#####',
	'4#####5########44##5#5##5####45#313##6#4',
	'2#433223#44#43211222122222333#211.1223#2',
];
const ZELLEN = MUSTER.join('').split('');

export function FlutBand() {
	return (
		<div id="flutband" data-sec="flutband" aria-hidden="true" className={s.band}>
			<div className={s.raster}>
				{ZELLEN.map((z, i) => (
					<i key={i} className={z === '#' ? s.w : undefined}>
						{z >= '0' && z <= '9' ? z : null}
					</i>
				))}
			</div>
		</div>
	);
}
