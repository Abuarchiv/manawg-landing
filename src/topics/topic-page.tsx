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
import RentCalculator from './RentCalculator';
import RotaGenerator from './RotaGenerator';
import { TopicFooter, TopicHeader, gutter, mono } from './frame';
import { counterpartOf, groupName, groupOf, related, topics, ui } from './registry';
import type { Topic } from './types';

// Anchor id from a heading (umlauts transliterated), for the table of contents and jump links.
const anchorId = (s: string) =>
	s
		.toLowerCase()
		.replace(/ä/g, 'ae')
		.replace(/ö/g, 'oe')
		.replace(/ü/g, 'ue')
		.replace(/ß/g, 'ss')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

// Reduce markdown links back to the link word for machine text (schema).
const stripLinks = (text: string) => text.replace(/\[([^\]]+)\]\(\/[a-z0-9-]*\)/g, '$1');

// Links in running text as [word](/path): guides point at each other in the text, not only via the list at the end.
// Data links are written without the /en prefix; localiseHref adds it for English.
const withLinks = (text: string, locale: Locale) =>
	text.split(/(\[[^\]]+\]\(\/[a-z0-9-]*\))/).map((part, i) => {
		const m = /^\[([^\]]+)\]\((\/[a-z0-9-]*)\)$/.exec(part);
		return m?.[1] && m[2] ? (
			<Link key={`${i}-${m[2]}`} href={localiseHref(locale, m[2])} prefetch={false}>
				{m[1]}
			</Link>
		) : (
			markGerman(part, locale)
		);
	});

// German form names and model sentences quoted inside English prose, marked lang="de" for screen readers.
const GERMAN_QUOTES =
	/(“Wohnung abmelden”|“Befreiung oder Ermäßigung beantragen”|„Hiermit kündige ich[^“”]*[“”])/;
const markGerman = (part: string, locale: Locale) =>
	locale === 'de'
		? part
		: part.split(GERMAN_QUOTES).map((piece, i) =>
				// split with one capture group puts the matches at odd indexes
				i % 2 === 1 ? (
					<span key={i} lang="de">
						{piece}
					</span>
				) : (
					piece
				),
			);

const cellCls = 'px-3 py-2 border-b border-[rgb(var(--ink-rgb)/0.1)]';
// English strings are longer: with up to three short columns the table fits a phone instead of scrolling sideways.
const cellClsEn = 'px-2 md:px-3 py-2 border-b border-[rgb(var(--ink-rgb)/0.1)]';

type TableData = NonNullable<Topic['tables']>[number];

// Table as data: scrollable, labelled region with column headers and a row header in the first column.
function Table({ t, locale }: { t: TableData; locale: Locale }) {
	// Long cells would wrap to one or two words per line on a phone, so those tables keep the scroll region.
	const compact =
		locale === 'en' && t.header.length <= 3 && t.rows.every((z) => z.every((f) => f.length <= 48));
	const cellClass = compact ? cellClsEn : cellCls;
	const id = `tabelle-${anchorId(t.title)}`;
	return (
		<section aria-labelledby={id} className="divider pt-10 md:pt-14">
			<h2 id={id} className={`${mono} m-0 mb-8 font-normal`}>
				{t.title}
			</h2>
			<div
				className="min-w-0 overflow-x-auto"
				// biome-ignore lint/a11y/useSemanticElements: scrollable table needs a labelled region instead of a section
				role="region"
				aria-label={t.title}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be reachable by keyboard
				tabIndex={0}
			>
				<table
					className={`w-full ${compact ? 'min-w-0 md:min-w-[540px]' : 'min-w-[540px]'} border-collapse text-left`}
				>
					<caption className="sr-only">{t.title}</caption>
					<thead>
						<tr>
							{t.header.map((k) => (
								<th key={k} scope="col" className={`${cellClass} text-left font-normal`}>
									{k}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{t.rows.map((row) => (
							<tr key={row.join('|')}>
								{row.map((cell, j) =>
									j === 0 ? (
										<th key={cell} scope="row" className={`${cellClass} text-left font-normal`}>
											{cell}
										</th>
									) : (
										<td key={j} className={cellClass}>
											{cell}
										</td>
									),
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{t.note && <p className={`${mono} mt-4 mb-0`}>{t.note}</p>}
		</section>
	);
}

/** Google requires a date with time and time zone (Rich Results Test: "time zone missing"). */
const isoDateTime = (tag: string) => `${tag}T00:00:00+00:00`;

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
		title: t.title,
		description: t.description,
		// alternates replaces the layout object completely (no deep merge), so the feed is repeated here.
		alternates: {
			canonical: path,
			...(languages ? { languages } : {}),
			types: { 'application/atom+xml': feed },
		},
		openGraph: {
			title: t.title,
			description: t.description,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			alternateLocale: OG_LOCALE[locale === 'de' ? 'en' : 'de'],
			type: 'article',
			publishedTime: isoDateTime(t.published),
			modifiedTime: isoDateTime(t.updated),
			images: [{ url: `${path}/opengraph-image`, width: 1200, height: 630, alt: t.h1 }],
		},
		twitter: { title: t.title, description: t.description, images: [`${path}/opengraph-image`] },
	};
}

export function TopicPage({ locale, slug: topicSlug }: { locale: Locale; slug: string }) {
	const t = topics(locale)[topicSlug];
	if (!t) notFound();
	const txt = ui(locale);
	const deSlug = locale === 'de' ? topicSlug : (toGermanSlug(topicSlug) ?? topicSlug);
	const groupId = groupOf(locale, topicSlug)?.id;
	const path = pathOf(locale, topicSlug);
	// The running text (largest element, LCP) is set in Inter; the layout only preloads Inter Tight and Mono.
	preload('/fonts/inter-latin.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

	const faqSchema = t.faq && {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: t.faq.map(([question, answer]) => ({
			'@type': 'Question',
			name: question,
			acceptedAnswer: { '@type': 'Answer', text: stripLinks(answer) },
		})),
	};

	const ids = schemaIds();
	const site = ids.site;
	const orgId = ids.organisation;
	const websiteId = ids.website;
	const sources = (t.sources ?? []).map(([name, url]): [string, string] => [
		name,
		url.startsWith('/') ? `${site}${url}` : url,
	]);

	const article = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		'@id': `${site}${path}#artikel`,
		headline: t.h1,
		description: t.description,
		image: `${site}${path}/opengraph-image`,
		inLanguage: IN_LANGUAGE[locale],
		datePublished: isoDateTime(t.published),
		dateModified: isoDateTime(t.updated),
		mainEntityOfPage: { '@type': 'WebPage', '@id': `${site}${path}` },
		isAccessibleForFree: true,
		// The author is the operator (name is in the legal notice); the publisher stays the organisation.
		author: {
			'@type': 'Person',
			name: 'Abubakar Abditube',
			url: `${site}${locale === 'de' ? '/ueber-manawg' : '/en/about-manawg'}`,
		},
		// Name and URL included directly so the article is complete even without a resolved @id (Rich Results Test).
		publisher: { '@type': 'Organization', '@id': orgId, name: 'ManaWG', url: site },
		isPartOf: { '@id': websiteId },
		// Product pages and the switching guide are about the app; legal and everyday guides are not.
		...(groupId !== 'guides' || deSlug === 'splitwise-splid-wechseln'
			? { about: { '@id': ids.app } }
			: {}),
		...(sources.length > 0 ? { citation: sources.map(([, url]) => url) } : {}),
	};

	// Guides hang under the guide index, comparisons under the best-app page, features under the app page (three-level breadcrumb).
	const isGuide = groupId === 'guides';
	const parentCrumb: [string, string] | null =
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
			...(parentCrumb
				? [
						{
							'@type': 'ListItem',
							position: 2,
							name: parentCrumb[0],
							item: `${site}${parentCrumb[1]}`,
						},
					]
				: []),
			{
				'@type': 'ListItem',
				position: parentCrumb ? 3 : 2,
				name: t.link,
				item: `${site}${path}`,
			},
		],
	};

	const faqHeading = txt.faqHeading(t.link);
	const formatDate = (tag: string) =>
		new Intl.DateTimeFormat(INTL_LOCALE[locale], {
			timeZone: 'UTC',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(new Date(`${tag}T00:00:00Z`));
	const updatedDate = formatDate(t.updated);

	// Provider comparison: notice from the provider, above the content.
	const isComparison = groupId === 'compare';
	const notice = txt.comparisonNotice;

	const lineCls = 'divider';

	return (
		<main
			id="main"
			tabIndex={-1}
			className="topic-page min-h-screen flex flex-col bg-[var(--paper)] text-[var(--ink)] focus:outline-none"
		>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
				dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
			/>
			{faqSchema && (
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
					dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
				/>
			)}

			<TopicHeader locale={locale} />

			<nav aria-label={txt.breadcrumbLabel} className={`${gutter} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href={localiseHref(locale, '/')} prefetch={false}>
							ManaWG
						</Link>
					</li>
					{parentCrumb && (
						<li>
							/{' '}
							<Link href={parentCrumb[1]} prefetch={false}>
								{parentCrumb[0]}
							</Link>
						</li>
					)}
					<li aria-current="page">/ {t.link}</li>
				</ol>
			</nav>

			<div className={`${gutter} flex-1`}>
				<h1
					className={`font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] ${locale === 'de' ? 'hyphens-auto' : 'hyphens-manual'} break-words`}
				>
					{t.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					{withLinks(t.intro, locale)}
				</p>
				<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
					{txt.by}{' '}
					<Link href={locale === 'de' ? '/ueber-manawg' : '/en/about-manawg'} prefetch={false}>
						{txt.authorName}
					</Link>{' '}
					· {txt.published} <time dateTime={t.published}>{formatDate(t.published)}</time> ·{' '}
					{txt.updated} <time dateTime={t.updated}>{updatedDate}</time>
				</p>
				{t.widget?.csv && (
					<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
						<a href={t.widget.csv} download>
							{txt.csvDownload}
						</a>{' '}
						· <a href={`#${anchorId(t.widget.after)}`}>{txt.printLabel}</a>
					</p>
				)}
				{isComparison && <p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>{notice}</p>}

				{/* Tables with after: 'intro' sit directly below the intro text. */}
				{t.tables
					?.filter((tab) => tab.after === 'intro')
					.map((tab) => (
						<div key={tab.title} className="mt-10 md:mt-16">
							<Table t={tab} locale={locale} />
						</div>
					))}

				{t.sections.length >= 4 && (
					<nav aria-labelledby="contents" className={`${lineCls} mt-20 md:mt-32 pt-10`}>
						<h2 id="contents" className={`${mono} m-0 mb-6 font-normal`}>
							{txt.contents}
						</h2>
						<ol className="list-none m-0 p-0">
							{[...t.sections.map(([heading]) => heading), ...(t.faq ? [faqHeading] : [])].map(
								(heading) => (
									<li key={heading} className={`${lineCls} py-3`}>
										<a href={`#${heading === faqHeading ? 'fragen' : anchorId(heading)}`}>
											{heading}
										</a>
									</li>
								),
							)}
						</ol>
					</nav>
				)}

				<div className={t.sections.length >= 4 ? 'mt-10 md:mt-16' : 'mt-20 md:mt-32'}>
					{t.sections.map(([heading, text]) => {
						// Only lines that all start with "1. " form a numbered list; otherwise it is a bullet list.
						const lines = text.split('\n');
						const numbered = lines.length > 1 && lines.every((z) => /^\d+\.\s/.test(z));
						const ListTag = numbered ? 'ol' : 'ul';
						return (
							<Fragment key={heading}>
								<section
									id={anchorId(heading)}
									className={`${lineCls} py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8 scroll-mt-6`}
								>
									<h2 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
										{heading}
									</h2>
									{lines.length > 1 ? (
										<ListTag
											className={`m-0 pl-5 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)] flex flex-col gap-2 ${numbered ? '' : 'list-disc'}`}
										>
											{lines.map((line) => (
												<li key={line}>{withLinks(line.replace(/^\d+\.\s*/, ''), locale)}</li>
											))}
										</ListTag>
									) : (
										<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)]">
											{withLinks(text, locale)}
										</p>
									)}
								</section>
								{t.tables
									?.filter((tab) => tab.after === heading)
									.map((tab) => (
										<Table key={tab.title} t={tab} locale={locale} />
									))}
								{t.widget?.after === heading &&
									(t.widget.kind === 'rota-generator' ? (
										<RotaGenerator locale={locale} />
									) : (
										<RentCalculator locale={locale} />
									))}
							</Fragment>
						);
					})}
				</div>

				{t.faq && (
					<section aria-labelledby="fragen" className={`${lineCls} pt-10 md:pt-14`}>
						<h2 id="fragen" className={`${mono} m-0 mb-8 font-normal`}>
							{faqHeading}
						</h2>
						{t.faq.map(([question, answer]) => (
							<div
								key={question}
								id={anchorId(question)}
								className={`${lineCls} py-8 scroll-mt-6 md:grid md:grid-cols-12 md:gap-8`}
							>
								<h3 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 mb-3 md:mb-0 md:col-span-4 text-[20px] leading-[1.2] tracking-[-0.02em]">
									{question}
								</h3>
								<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] leading-[1.65] text-[var(--text-2)]">
									{withLinks(answer, locale)}
								</p>
							</div>
						))}
					</section>
				)}

				{sources.length > 0 && (
					<section aria-labelledby="quellen" className={`${lineCls} pt-10 md:pt-14`}>
						<h2 id="quellen" className={`${mono} m-0 mb-6 font-normal`}>
							{txt.sources(updatedDate)}
						</h2>
						<ul className="list-none m-0 p-0">
							{sources.map(([name, url]) => (
								<li key={url} className={`${lineCls} py-3`}>
									<a href={url}>{name}</a>
								</li>
							))}
						</ul>
					</section>
				)}

				{isGuide && (
					<aside aria-label={txt.guideNoteLabel} className={`${lineCls} pt-10 md:pt-14`}>
						<p className={`${mono} m-0`}>
							{txt.guideNote} <a href="mailto:info@manawg.com">info@manawg.com</a>.
						</p>
					</aside>
				)}

				<div
					className={`${lineCls} mt-16 md:mt-24 pt-14 md:pt-20 md:grid md:grid-cols-12 md:gap-8 items-end`}
				>
					<p className="m-0 md:col-span-7 font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(30px,4.4vw,64px)] leading-[1] tracking-[-0.045em]">
						{txt.ctaTagline}
					</p>
					<div className="mt-8 md:mt-0 md:col-start-9 md:col-span-4">
						<a
							href={appUrl(
								locale === 'de' ? '/registrieren?action=create' : '/signup?action=create',
							)}
							className="inline-flex items-center justify-center min-h-[56px] px-8 rounded-full bg-[var(--ink)] text-[var(--paper)] font-semibold no-underline hover:bg-[rgb(var(--ink-rgb)/0.82)] transition-colors"
						>
							{txt.ctaButton}
						</a>
						<p className={`${mono} mt-4 mb-0`}>{txt.ctaNote}</p>
					</div>
				</div>

				<nav aria-labelledby="weiter" className={`${lineCls} mt-20 md:mt-32 pt-10`}>
					<h2 id="weiter" className={`${mono} m-0 mb-6 font-normal`}>
						{txt.readNext}
					</h2>
					<ul className="list-none m-0 p-0">
						{related(locale, topicSlug).map((relSlug) => {
							const rel = topics(locale)[relSlug];
							const relGroup = groupOf(locale, relSlug);
							if (!rel) return null;
							return (
								<li key={relSlug} className={`${lineCls}`}>
									<Link
										href={pathOf(locale, relSlug)}
										prefetch={false}
										className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-6 no-underline"
									>
										<span className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[clamp(22px,2.6vw,36px)] leading-[1.1] tracking-[-0.035em] group-hover:text-[var(--text-2)] transition-colors">
											{rel.h1}
										</span>{' '}
										<span className={mono}>{relGroup && groupName(locale, relGroup.id)}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>

			<TopicFooter
				locale={locale}
				active={topicSlug}
				counterpart={counterpartOf(locale, topicSlug)}
			/>
		</main>
	);
}
