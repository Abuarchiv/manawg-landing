import { appUrl } from '@/lib/app-origin';
import {
	INTL_LOCALE,
	IN_LANGUAGE,
	type Locale,
	OG_LOCALE,
	languageAlternates,
	localiseHref,
	toGermanSlug,
} from '@/lib/locale';
import { schemaIds } from '@/lib/schema-ids';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';
import { preload } from 'react-dom';
import MieteRechner from './MieteRechner';
import PutzplanGenerator from './PutzplanGenerator';
import { Fuss, Kopf, mono, rand } from './rahmen';
import { counterpartOf, groupName, groupOf, related, topics, ui } from './registry';
import type { Thema } from './themen';

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

// Reduce markdown links back to the link word for machine text (schema).
const ohneLinks = (text: string) => text.replace(/\[([^\]]+)\]\(\/[a-z0-9-]*\)/g, '$1');

// Links in running text as [word](/path): guides point at each other in the text, not only via the list at the end.
// Data links are written without the /en prefix; localiseHref adds it for English.
const mitLinks = (text: string, locale: Locale) =>
	text.split(/(\[[^\]]+\]\(\/[a-z0-9-]*\))/).map((teil, i) => {
		const m = /^\[([^\]]+)\]\((\/[a-z0-9-]*)\)$/.exec(teil);
		return m?.[1] && m[2] ? (
			<Link key={`${i}-${m[2]}`} href={localiseHref(locale, m[2])}>
				{m[1]}
			</Link>
		) : (
			deutsch(teil, locale)
		);
	});

// German form names and model sentences quoted inside English prose, marked lang="de" for screen readers.
const GERMAN_QUOTES =
	/(“Wohnung abmelden”|“Befreiung oder Ermäßigung beantragen”|„Hiermit kündige ich[^“”]*[“”])/;
const deutsch = (teil: string, locale: Locale) =>
	locale === 'de'
		? teil
		: teil.split(GERMAN_QUOTES).map((stueck, i) =>
				// split with one capture group puts the matches at odd indexes
				i % 2 === 1 ? (
					<span key={i} lang="de">
						{stueck}
					</span>
				) : (
					stueck
				),
			);

const zelle = 'px-3 py-2 border-b border-white/10';
// English strings are longer: with up to three columns the table fits a phone instead of scrolling sideways.
const zelleEn = 'px-2 md:px-3 py-2 border-b border-white/10';

type TabelleDaten = NonNullable<Thema['tabellen']>[number];

// Tabelle als Daten: scrollbare, beschriftete Region mit Spaltenköpfen und Zeilenkopf in der ersten Spalte.
function Tabelle({ t, locale }: { t: TabelleDaten; locale: Locale }) {
	const kompakt = locale === 'en' && t.kopf.length <= 3;
	const zelleKlasse = kompakt ? zelleEn : zelle;
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
				<table
					className={`w-full ${kompakt ? 'min-w-0 md:min-w-[540px]' : 'min-w-[540px]'} border-collapse text-left`}
				>
					<caption className="sr-only">{t.titel}</caption>
					<thead>
						<tr>
							{t.kopf.map((k) => (
								<th key={k} scope="col" className={`${zelleKlasse} text-left font-normal`}>
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
										<th key={feld} scope="row" className={`${zelleKlasse} text-left font-normal`}>
											{feld}
										</th>
									) : (
										<td key={j} className={zelleKlasse}>
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

/** Slugs to prerender for a language. */
export const topicStaticParams = (locale: Locale): string[] => Object.keys(topics(locale));

const pathOf = (locale: Locale, slug: string) => localiseHref(locale, `/${slug}`);

/** German and English path of a topic page; undefined while the other language has no such page. */
function alternatesOf(locale: Locale, slug: string) {
	const other = counterpartOf(locale, slug);
	const own = pathOf(locale, slug);
	return locale === 'de' ? languageAlternates(own, other) : other && languageAlternates(other, own);
}

export function topicMetadata(locale: Locale, slug: string): Metadata {
	const t = topics(locale)[slug];
	if (!t) return {};
	const path = pathOf(locale, slug);
	const languages = alternatesOf(locale, slug);
	const feed = locale === 'de' ? '/feed.xml' : '/en/feed.xml';
	return {
		title: t.titel,
		description: t.beschreibung,
		// alternates replaces the layout object completely (no deep merge), so the feed is repeated here.
		alternates: {
			canonical: path,
			...(languages ? { languages } : {}),
			types: { 'application/atom+xml': feed },
		},
		openGraph: {
			title: t.titel,
			description: t.beschreibung,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			type: 'article',
			publishedTime: zeitpunkt(t.erschienen),
			modifiedTime: zeitpunkt(t.stand),
		},
		twitter: { title: t.titel, description: t.beschreibung },
	};
}

export function TopicPage({ locale, slug: thema }: { locale: Locale; slug: string }) {
	const t = topics(locale)[thema];
	if (!t) notFound();
	const txt = ui(locale);
	const deSlug = locale === 'de' ? thema : (toGermanSlug(thema) ?? thema);
	const groupId = groupOf(locale, thema)?.id;
	const path = pathOf(locale, thema);
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
		'@id': `${site}${path}#artikel`,
		headline: t.h1,
		description: t.beschreibung,
		inLanguage: IN_LANGUAGE[locale],
		datePublished: zeitpunkt(t.erschienen),
		dateModified: zeitpunkt(t.stand),
		mainEntityOfPage: { '@type': 'WebPage', '@id': `${site}${path}` },
		isAccessibleForFree: true,
		// Autor ist der Betreiber (Name steht im Impressum); Herausgeber bleibt die Organisation.
		author: {
			'@type': 'Person',
			name: 'Abubakar Abditube',
			url: `${site}${locale === 'de' ? '/ueber-manawg' : '/en/about-manawg'}`,
		},
		// Name und URL direkt mit, damit der Artikel auch ohne aufgelöste @id vollständig ist (Rich Results Test).
		publisher: { '@type': 'Organization', '@id': orgId, name: 'ManaWG', url: site },
		isPartOf: { '@id': webseiteId },
		// Produktseiten und die Umstiegsanleitung handeln von der App; Rechts- und Alltagsratgeber nicht.
		...(groupId !== 'guides' || deSlug === 'splitwise-splid-wechseln'
			? { about: { '@id': ids.app } }
			: {}),
		...(quellen.length > 0 ? { citation: quellen.map(([, url]) => url) } : {}),
	};

	// Guides hang under the guide index, comparisons under the best-app page, features under the app page (three-level breadcrumb).
	const istRatgeber = groupId === 'guides';
	const eltern: [string, string] | null =
		groupId === 'guides'
			? txt.parentCrumbs.guides
			: groupId === 'compare' && deSlug !== 'beste-wg-app'
				? txt.parentCrumbs.compare
				: groupId === 'features' && deSlug !== 'wg-app'
					? txt.parentCrumbs.features
					: null;
	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'ManaWG',
				item: `${site}${localiseHref(locale, '/')}`,
			},
			...(eltern
				? [{ '@type': 'ListItem', position: 2, name: eltern[0], item: `${site}${eltern[1]}` }]
				: []),
			{
				'@type': 'ListItem',
				position: eltern ? 3 : 2,
				name: t.link,
				item: `${site}${path}`,
			},
		],
	};

	const fragenKopf = txt.faqHeading(t.link);
	const datum = (tag: string) =>
		new Intl.DateTimeFormat(INTL_LOCALE[locale], {
			timeZone: 'UTC',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(new Date(`${tag}T00:00:00Z`));
	const aktualisiert = datum(t.stand);

	// Provider comparison: notice from the provider, above the content.
	const istVergleich = groupId === 'compare';
	const hinweis = txt.comparisonNotice;

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

			<Kopf locale={locale} />

			<nav aria-label={txt.breadcrumbLabel} className={`${rand} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href={localiseHref(locale, '/')} prefetch={false}>
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
				<h1
					className={`font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] ${locale === 'de' ? 'hyphens-auto' : 'hyphens-manual'} break-words`}
				>
					{t.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					{mitLinks(t.einleitung, locale)}
				</p>
				<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
					{txt.by}{' '}
					<Link href={locale === 'de' ? '/ueber-manawg' : '/en/about-manawg'}>
						{txt.authorName}
					</Link>{' '}
					· {txt.published} <time dateTime={t.erschienen}>{datum(t.erschienen)}</time> ·{' '}
					{txt.updated} <time dateTime={t.stand}>{aktualisiert}</time>
				</p>
				{t.widget?.csv && (
					<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
						<a href={t.widget.csv} download>
							{txt.csvDownload}
						</a>{' '}
						· <a href={`#${slug(t.widget.after)}`}>{txt.printLabel}</a>
					</p>
				)}
				{istVergleich && <p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>{hinweis}</p>}

				{/* Tabellen mit nach: 'einleitung' stehen direkt unter dem Einleitungstext. */}
				{t.tabellen
					?.filter((tab) => tab.nach === 'einleitung')
					.map((tab) => (
						<div key={tab.titel} className="mt-10 md:mt-16">
							<Tabelle t={tab} locale={locale} />
						</div>
					))}

				{t.abschnitte.length >= 4 && (
					<nav aria-labelledby="inhalt" className={`${linie} mt-20 md:mt-32 pt-10`}>
						<h2 id="inhalt" className={`${mono} m-0 mb-6 font-normal`}>
							{txt.contents}
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
												<li key={zeile}>{mitLinks(zeile.replace(/^\d+\.\s*/, ''), locale)}</li>
											))}
										</Liste>
									) : (
										<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)]">
											{mitLinks(text, locale)}
										</p>
									)}
								</section>
								{t.tabellen
									?.filter((tab) => tab.nach === kopf)
									.map((tab) => (
										<Tabelle key={tab.titel} t={tab} locale={locale} />
									))}
								{t.widget?.after === kopf &&
									(t.widget.kind === 'rota-generator' ? (
										<PutzplanGenerator locale={locale} />
									) : (
										<MieteRechner locale={locale} />
									))}
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
									{mitLinks(antwort, locale)}
								</p>
							</div>
						))}
					</section>
				)}

				{quellen.length > 0 && (
					<section aria-labelledby="quellen" className={`${linie} pt-10 md:pt-14`}>
						<h2 id="quellen" className={`${mono} m-0 mb-6 font-normal`}>
							{txt.sources(aktualisiert)}
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
					<aside aria-label={txt.guideNoteLabel} className={`${linie} pt-10 md:pt-14`}>
						<p className={`${mono} m-0`}>
							{txt.guideNote} <a href="mailto:info@manawg.com">info@manawg.com</a>.
						</p>
					</aside>
				)}

				<div
					className={`${linie} mt-16 md:mt-24 pt-14 md:pt-20 md:grid md:grid-cols-12 md:gap-8 items-end`}
				>
					<p className="m-0 md:col-span-7 font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(30px,4.4vw,64px)] leading-[1] tracking-[-0.045em]">
						{txt.ctaTagline}
					</p>
					<div className="mt-8 md:mt-0 md:col-start-9 md:col-span-4">
						<a
							href={appUrl(
								locale === 'de' ? '/registrieren?action=create' : '/signup?action=create',
							)}
							className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-full bg-[#fafafa] text-[#0a0a0a] font-semibold no-underline hover:bg-[#d4d4d4] transition-colors"
						>
							{txt.ctaButton}
						</a>
						<p className={`${mono} mt-4 mb-0`}>{txt.ctaNote}</p>
					</div>
				</div>

				<nav aria-labelledby="weiter" className={`${linie} mt-20 md:mt-32 pt-10`}>
					<h2 id="weiter" className={`${mono} m-0 mb-6 font-normal`}>
						{txt.readNext}
					</h2>
					<ul className="list-none m-0 p-0">
						{related(locale, thema).map((vs) => {
							const v = topics(locale)[vs];
							const vGroup = groupOf(locale, vs);
							if (!v) return null;
							return (
								<li key={vs} className={`${linie}`}>
									<Link
										href={pathOf(locale, vs)}
										prefetch={false}
										className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-6 no-underline"
									>
										<span className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(22px,2.6vw,36px)] leading-[1.1] tracking-[-0.035em] group-hover:text-[var(--text-2)] transition-colors">
											{v.h1}
										</span>{' '}
										<span className={mono}>{vGroup && groupName(locale, vGroup.id)}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>

			<Fuss locale={locale} aktiv={thema} counterpart={counterpartOf(locale, thema)} />
		</main>
	);
}
