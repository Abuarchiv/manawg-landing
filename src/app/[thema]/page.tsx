import { appUrl } from '@/lib/app-origin';
import { schemaIds } from '@/lib/schema-ids';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { preload } from 'react-dom';
import MieteRechner from './MieteRechner';
import PutzplanGenerator from './PutzplanGenerator';
import { VERGLEICHS_HINWEIS, gruppeVon, verwandte } from './gruppen';
import { Fuss, Kopf, mono, rand } from './rahmen';
import { THEMEN } from './themen';
import type { Thema } from './themen';

export const dynamicParams = false;

// Anker-ID aus einer Überschrift (Umlaute umschrieben), für Inhaltsverzeichnis und Sprunglinks.
const slug = (s: string) =>
	s
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

// Markdown-Verweise für Maschinentext (Schema) wieder auf das Linkwort reduzieren.
const ohneLinks = (text: string) => text.replace(/\[([^\]]+)\]\(\/[a-z0-9-]*\)/g, '$1');

// Verweise im Fließtext als [Wort](/pfad): Ratgeber zeigen im Text aufeinander, nicht nur über die Liste am Ende.
const mitLinks = (text: string) =>
	text.split(/(\[[^\]]+\]\(\/[a-z0-9-]*\))/).map((teil, i) => {
		const m = /^\[([^\]]+)\]\((\/[a-z0-9-]*)\)$/.exec(teil);
		return m?.[1] && m[2] ? (
			<Link key={`${i}-${m[2]}`} href={m[2]}>
				{m[1]}
			</Link>
		) : (
			teil
		);
	});

const zelle = 'px-3 py-2 border-b border-white/10';

type TabelleDaten = NonNullable<Thema['tabellen']>[number];

// Tabelle als Daten: scrollbare, beschriftete Region mit Spaltenköpfen und Zeilenkopf in der ersten Spalte.
function Tabelle({ t }: { t: TabelleDaten }) {
	const id = `tabelle-${slug(t.titel)}`;
	return (
		<section aria-labelledby={id} className="linie pt-10 md:pt-14">
			<h2 id={id} className={`${mono} m-0 mb-8 font-normal`}>
				{t.titel}
			</h2>
			<div
				className="min-w-0 overflow-x-auto"
				// biome-ignore lint/a11y/useSemanticElements: scrollbare Tabelle braucht beschriftete Region statt Section
				role="region"
				aria-label={t.titel}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollbare Region muss per Tastatur erreichbar sein
				tabIndex={0}
			>
				<table className="w-full min-w-[540px] border-collapse text-left">
					<caption className="sr-only">{t.titel}</caption>
					<thead>
						<tr>
							{t.kopf.map((k) => (
								<th key={k} scope="col" className={`${zelle} text-left font-normal`}>
									{k}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{t.zeilen.map((zeile) => (
							<tr key={zeile.join('|')}>
								{zeile.map((feld, j) =>
									j === 0 ? (
										<th key={feld} scope="row" className={`${zelle} text-left font-normal`}>
											{feld}
										</th>
									) : (
										<td key={j} className={zelle}>
											{feld}
										</td>
									),
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{t.hinweis && <p className={`${mono} mt-4 mb-0`}>{t.hinweis}</p>}
		</section>
	);
}

/** Google verlangt Datum mit Uhrzeit und Zeitzone (Rich Results Test: „Zeitzone fehlt“). */
const zeitpunkt = (tag: string) => `${tag}T00:00:00+00:00`;

export function generateStaticParams() {
	return Object.keys(THEMEN).map((thema) => ({ thema }));
}

type Props = { params: Promise<{ thema: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { thema } = await params;
	const t = THEMEN[thema];
	if (!t) return {};
	return {
		title: t.titel,
		description: t.beschreibung,
		// alternates ersetzt das Layout-Objekt komplett (kein tiefes Merge), daher der Feed auch hier.
		alternates: { canonical: `/${thema}`, types: { 'application/atom+xml': '/feed.xml' } },
		openGraph: {
			title: t.titel,
			description: t.beschreibung,
			url: `/${thema}`,
			siteName: 'ManaWG',
			locale: 'de_DE',
			type: 'article',
			publishedTime: zeitpunkt(t.erschienen),
			modifiedTime: zeitpunkt(t.stand),
			images: [{ url: `/${thema}/opengraph-image`, width: 1200, height: 630, alt: t.h1 }],
		},
		twitter: { title: t.titel, description: t.beschreibung, images: [`/${thema}/opengraph-image`] },
	};
}

export default async function ThemaPage({ params }: Props) {
	const { thema } = await params;
	const t = THEMEN[thema];
	if (!t) notFound();
	// Der Fließtext (größtes Element, LCP) steht in Inter; das Layout lädt nur Inter Tight und Mono vor.
	preload('/fonts/inter-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

	const faqSchema = t.fragen && {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: t.fragen.map(([frage, antwort]) => ({
			'@type': 'Question',
			name: frage,
			acceptedAnswer: { '@type': 'Answer', text: ohneLinks(antwort) },
		})),
	};

	const ids = schemaIds();
	const site = ids.site;
	const orgId = ids.organisation;
	const webseiteId = ids.webseite;
	const quellen = (t.quellen ?? []).map(([name, url]): [string, string] => [
		name,
		url.startsWith('/') ? `${site}${url}` : url,
	]);

	const artikel = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${site}/${thema}#artikel`,
		headline: t.h1,
		description: t.beschreibung,
		image: `${site}/${thema}/opengraph-image`,
		inLanguage: 'de-DE',
		datePublished: zeitpunkt(t.erschienen),
		dateModified: zeitpunkt(t.stand),
		mainEntityOfPage: { '@type': 'WebPage', '@id': `${site}/${thema}` },
		isAccessibleForFree: true,
		// Autor ist der Betreiber (Name steht im Impressum); Herausgeber bleibt die Organisation.
		author: { '@type': 'Person', name: 'Abubakar Abditube', url: `${site}/ueber-manawg` },
		// Name und URL direkt mit, damit der Artikel auch ohne aufgelöste @id vollständig ist (Rich Results Test).
		publisher: { '@type': 'Organization', '@id': orgId, name: 'ManaWG', url: site },
		isPartOf: { '@id': webseiteId },
		// Produktseiten und die Umstiegsanleitung handeln von der App; Rechts- und Alltagsratgeber nicht.
		...(gruppeVon(thema)?.name !== 'Ratgeber' || thema === 'splitwise-splid-wechseln'
			? { about: { '@id': ids.app } }
			: {}),
		...(quellen.length > 0 ? { citation: quellen.map(([, url]) => url) } : {}),
	};

	// Ratgeber hängen unter /ratgeber, Vergleiche unter /beste-wg-app, Funktionen unter /wg-app (dreistufige Brotkrume).
	const istRatgeber = gruppeVon(thema)?.name === 'Ratgeber';
	const gruppe = gruppeVon(thema)?.name;
	const eltern: [string, string] | null =
		gruppe === 'Ratgeber'
			? ['Ratgeber', '/ratgeber']
			: gruppe === 'Vergleiche' && thema !== 'beste-wg-app'
				? ['Beste WG-App', '/beste-wg-app']
				: gruppe === 'Funktionen' && thema !== 'wg-app'
					? ['WG-App', '/wg-app']
					: null;
	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'ManaWG', item: `${site}/` },
			...(eltern
				? [{ '@type': 'ListItem', position: 2, name: eltern[0], item: `${site}${eltern[1]}` }]
				: []),
			{
				'@type': 'ListItem',
				position: eltern ? 3 : 2,
				name: t.link,
				item: `${site}/${thema}`,
			},
		],
	};

	// Die FAQ-Seite heißt selbst „Häufige Fragen“; dort bleibt es bei diesem Titel.
	const fragenKopf = t.link.startsWith('Häufige Fragen') ? t.link : `Häufige Fragen zu ${t.link}`;
	const datum = (tag: string) =>
		new Intl.DateTimeFormat('de-DE', {
			timeZone: 'UTC',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(new Date(`${tag}T00:00:00Z`));
	const aktualisiert = datum(t.stand);

	// Anbietervergleich: Hinweis vom Anbieter, oberhalb des Inhalts.
	const istVergleich = gruppeVon(thema)?.name === 'Vergleiche';
	const hinweis = VERGLEICHS_HINWEIS;

	const linie = 'linie';

	return (
		<main
			id="main"
			tabIndex={-1}
			className="thema min-h-screen flex flex-col bg-[#0a0a0a] text-[#fafafa] focus:outline-none"
		>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
				dangerouslySetInnerHTML={{ __html: JSON.stringify(artikel) }}
			/>
			{faqSchema && (
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify statischer Konstanten, kein Nutzerinhalt
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				/>
			)}

			<Kopf />

			<nav aria-label="Brotkrumen" className={`${rand} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href="/" prefetch={false}>
							ManaWG
						</Link>
					</li>
					{eltern && (
						<li>
							/{' '}
							<Link href={eltern[1]} prefetch={false}>
								{eltern[0]}
							</Link>
						</li>
					)}
					<li aria-current="page">/ {t.link}</li>
				</ol>
			</nav>

			<div className={`${rand} flex-1`}>
				<h1 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] hyphens-auto break-words">
					{t.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					{mitLinks(t.einleitung)}
				</p>
				<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
					Von <Link href="/ueber-manawg">Abubakar Abditube (ManaWG)</Link> · Veröffentlicht am{' '}
					<time dateTime={t.erschienen}>{datum(t.erschienen)}</time> · Aktualisiert am{' '}
					<time dateTime={t.stand}>{aktualisiert}</time>
				</p>
				{thema === 'putzplan-vorlage' && (
					<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
						<a href="/putzplan-vorlage.csv" download>
							Als CSV herunterladen
						</a>{' '}
						·{' '}
						<a href="#putzplan-generator-namen-eintragen-plan-drucken">
							Drucken / als PDF speichern
						</a>
					</p>
				)}
				{istVergleich && <p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>{hinweis}</p>}

				{/* Tabellen mit nach: 'einleitung' stehen direkt unter dem Einleitungstext. */}
				{t.tabellen
					?.filter((tab) => tab.nach === 'einleitung')
					.map((tab) => (
						<div key={tab.titel} className="mt-10 md:mt-16">
							<Tabelle t={tab} />
						</div>
					))}

				{t.abschnitte.length >= 4 && (
					<nav aria-labelledby="inhalt" className={`${linie} mt-20 md:mt-32 pt-10`}>
						<h2 id="inhalt" className={`${mono} m-0 mb-6 font-normal`}>
							Inhalt
						</h2>
						<ol className="list-none m-0 p-0">
							{[...t.abschnitte.map(([kopf]) => kopf), ...(t.fragen ? [fragenKopf] : [])].map(
								(kopf) => (
									<li key={kopf} className={`${linie} py-3`}>
										<a href={`#${kopf === fragenKopf ? 'fragen' : slug(kopf)}`}>{kopf}</a>
									</li>
								),
							)}
						</ol>
					</nav>
				)}

				<div className={t.abschnitte.length >= 4 ? 'mt-10 md:mt-16' : 'mt-20 md:mt-32'}>
					{t.abschnitte.map(([kopf, text]) => {
						// Nur Zeilen, die alle mit "1. " beginnen, sind eine Nummerierung; sonst eine Aufzählung.
						const zeilen = text.split('\n');
						const nummeriert = zeilen.length > 1 && zeilen.every((z) => /^\d+\.\s/.test(z));
						const Liste = nummeriert ? 'ol' : 'ul';
						return (
							<Fragment key={kopf}>
								<section
									id={slug(kopf)}
									className={`${linie} py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8 scroll-mt-6`}
								>
									<h2 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
										{kopf}
									</h2>
									{zeilen.length > 1 ? (
										<Liste
											className={`m-0 pl-5 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)] flex flex-col gap-2 ${nummeriert ? '' : 'list-disc'}`}
										>
											{zeilen.map((zeile) => (
												<li key={zeile}>{mitLinks(zeile.replace(/^\d+\.\s*/, ''))}</li>
											))}
										</Liste>
									) : (
										<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)]">
											{mitLinks(text)}
										</p>
									)}
								</section>
								{t.tabellen
									?.filter((tab) => tab.nach === kopf)
									.map((tab) => (
										<Tabelle key={tab.titel} t={tab} />
									))}
								{(thema === 'putzplan-vorlage' || thema === 'putzplan-erstellen') &&
									kopf.startsWith('Putzplan-Generator') && <PutzplanGenerator />}
								{thema === 'wg-miete-rechner' && kopf === 'Rechner' && <MieteRechner />}
							</Fragment>
						);
					})}
				</div>

				{t.fragen && (
					<section aria-labelledby="fragen" className={`${linie} pt-10 md:pt-14`}>
						<h2 id="fragen" className={`${mono} m-0 mb-8 font-normal`}>
							{fragenKopf}
						</h2>
						{t.fragen.map(([frage, antwort]) => (
							<div
								key={frage}
								id={slug(frage)}
								className={`${linie} py-8 scroll-mt-6 md:grid md:grid-cols-12 md:gap-8`}
							>
								<h3 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 mb-3 md:mb-0 md:col-span-4 text-[20px] leading-[1.2] tracking-[-0.02em]">
									{frage}
								</h3>
								<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] leading-[1.65] text-[var(--text-2)]">
									{mitLinks(antwort)}
								</p>
							</div>
						))}
					</section>
				)}

				{quellen.length > 0 && (
					<section aria-labelledby="quellen" className={`${linie} pt-10 md:pt-14`}>
						<h2 id="quellen" className={`${mono} m-0 mb-6 font-normal`}>
							Quellen (Stand {aktualisiert})
						</h2>
						<ul className="list-none m-0 p-0">
							{quellen.map(([name, url]) => (
								<li key={url} className={`${linie} py-3`}>
									<a href={url}>{name}</a>
								</li>
							))}
						</ul>
					</section>
				)}

				{istRatgeber && (
					<aside aria-label="Über diesen Ratgeber" className={`${linie} pt-10 md:pt-14`}>
						<p className={`${mono} m-0`}>
							Geschrieben vom Betreiber von ManaWG. Wir prüfen die Seite bei Änderungen der
							Rechtslage oder der App. Fehler gefunden? Schreibt an{' '}
							<a href="mailto:info@manawg.com">info@manawg.com</a>.
						</p>
					</aside>
				)}

				<div
					className={`${linie} mt-16 md:mt-24 pt-14 md:pt-20 md:grid md:grid-cols-12 md:gap-8 items-end`}
				>
					<p className="m-0 md:col-span-7 font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(30px,4.4vw,64px)] leading-[1] tracking-[-0.045em]">
						Eure WG, an einem Ort.
					</p>
					<div className="mt-8 md:mt-0 md:col-start-9 md:col-span-4">
						<a
							href={appUrl('/registrieren?action=create')}
							className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-full bg-[#fafafa] text-[#0a0a0a] font-semibold no-underline hover:bg-[#d4d4d4] transition-colors"
						>
							WG kostenlos erstellen
						</a>
						<p className={`${mono} mt-4 mb-0`}>Kostenlos, ohne Werbung, im Browser.</p>
					</div>
				</div>

				<nav aria-labelledby="weiter" className={`${linie} mt-20 md:mt-32 pt-10`}>
					<h2 id="weiter" className={`${mono} m-0 mb-6 font-normal`}>
						Weiterlesen
					</h2>
					<ul className="list-none m-0 p-0">
						{verwandte(thema).map((vs) => {
							const v = THEMEN[vs];
							if (!v) return null;
							return (
								<li key={vs} className={`${linie}`}>
									<Link
										href={`/${vs}`}
										prefetch={false}
										className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-6 no-underline"
									>
										<span className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(22px,2.6vw,36px)] leading-[1.1] tracking-[-0.035em] group-hover:text-[var(--text-2)] transition-colors">
											{v.h1}
										</span>{' '}
										<span className={mono}>{gruppeVon(vs)?.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>

			<Fuss aktiv={thema} />
		</main>
	);
}
