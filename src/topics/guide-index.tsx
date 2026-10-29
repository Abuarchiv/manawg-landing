import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import {
	counterpartPath,
	IN_LANGUAGE,
	type Locale,
	languageAlternates,
	localiseHref,
	PATHS,
	toEnglishSlug,
} from '@/lib/locale';
import { pageMetadata } from '@/lib/page-metadata';
import { schemaIds } from '@/lib/schema-ids';
import { gutter, mono, TopicFooter, TopicHeader } from './frame';
import { GROUPS } from './groups';
import { topics, ui } from './registry';

type ClusterId = 'money' | 'household' | 'together' | 'moving' | 'more';

// Topics of the overview; whatever is missing here lands under "More" so no guide disappears.
const CLUSTERS: Array<[ClusterId, string[]]> = [
	[
		'money',
		[
			'wg-kosten-aufteilen',
			'wg-miete-rechner',
			'wg-nebenkosten',
			'rundfunkbeitrag-wg',
			'wg-kaution',
			'wg-haushaltskasse',
			'schulden-mitbewohner',
			'splitwise-splid-wechseln',
			'splitwise-kostenlos',
		],
	],
	['household', ['putzplan-erstellen', 'putzplan-vorlage', 'wg-einkauf-organisieren']],
	['together', ['wg-regeln', 'wg-streit-loesen', 'mitbewohner-kuendigen', 'wg-abwesenheit-urlaub']],
	[
		'moving',
		[
			'wg-gruenden-checkliste',
			'wg-mietvertrag',
			'wg-abkuerzungen',
			'mitbewohner-finden',
			'wg-casting-fragen',
			'wg-einzug-checkliste',
			'wg-anmeldung',
			'wg-zwischenmiete',
			'wg-zimmer-kuendigen',
			'wg-auszug-checkliste',
		],
	],
];
const allGuides = GROUPS.find((g) => g.id === 'guides')?.slugs ?? [];
const assigned = CLUSTERS.flatMap(([, slugs]) => slugs);
const unassigned = allGuides.filter((slug) => !assigned.includes(slug));
const CLUSTERS_DE: Array<[ClusterId, string[]]> =
	unassigned.length > 0 ? [...CLUSTERS, ['more', unassigned]] : CLUSTERS;

/** Clusters of a language as [name, slugs of that language]; slugs without a page there are dropped. */
function clustersOf(locale: Locale): Array<[string, string[]]> {
	const txt = ui(locale).guideIndex;
	const data = topics(locale);
	return CLUSTERS_DE.map(([id, slugs]): [string, string[]] => [
		txt.clusters[id],
		slugs
			.map((s) => (locale === 'de' ? s : toEnglishSlug(s)))
			.filter((s): s is string => !!s && s in data),
	]).filter(([, slugs]) => slugs.length > 0);
}

export function guideIndexMetadata(locale: Locale): Metadata {
	const txt = ui(locale).guideIndex;
	return pageMetadata({
		locale,
		path: PATHS[locale].guides,
		title: txt.title,
		description: txt.description,
		languages: languageAlternates(PATHS.de.guides, PATHS.en.guides),
	});
}

export function GuideIndex({ locale }: { locale: Locale }) {
	const { site, website } = schemaIds();
	const txt = ui(locale).guideIndex;
	const data = topics(locale);
	const path = PATHS[locale].guides;
	const clusters = clustersOf(locale);
	const slugs = clusters.flatMap(([, s]) => s);
	const collection = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site}${path}#seite`,
		name: txt.collectionName,
		description: txt.description,
		url: `${site}${path}`,
		inLanguage: IN_LANGUAGE[locale],
		isPartOf: { '@id': website },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: slugs.map((slug, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${site}${localiseHref(locale, `/${slug}`)}`,
				name: data[slug]?.h1,
			})),
		},
	};
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
			{ '@type': 'ListItem', position: 2, name: txt.crumb, item: `${site}${path}` },
		],
	};

	return (
		<main
			id="main"
			tabIndex={-1}
			className="topic-page min-h-screen flex flex-col bg-(--paper) text-(--ink) focus:outline-hidden"
		>
			<JsonLd data={breadcrumb} />
			<JsonLd data={collection} />

			<TopicHeader locale={locale} />

			<nav aria-label={ui(locale).breadcrumbLabel} className={`${gutter} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href={localiseHref(locale, '/')} prefetch={false}>
							ManaWG
						</Link>
					</li>
					<li aria-current="page">/ {txt.crumb}</li>
				</ol>
			</nav>

			<div className={`${gutter} flex-1`}>
				<h1
					className={`font-display font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] ${locale === 'de' ? 'hyphens-auto' : 'hyphens-manual'} wrap-break-word`}
				>
					{txt.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-(--text-2)">
					{txt.intro}
				</p>

				<div className="mt-20 md:mt-32">
					{clusters.map(([name, list]) => (
						<section key={name} className="divider py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8">
							<h2 className="font-display font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
								{name}
							</h2>
							<ul className="list-none m-0 p-0 md:col-start-6 md:col-span-7 flex flex-col">
								{list.map((slug) => {
									const t = data[slug];
									if (!t) return null;
									return (
										<li key={slug} className="py-4 first:pt-0">
											<Link
												href={localiseHref(locale, `/${slug}`)}
												prefetch={false}
												className="font-display font-semibold text-[19px] leading-[1.25] tracking-[-0.02em] no-underline hover:text-(--text-2)"
											>
												{t.h1}
											</Link>
											<p className="m-0 mt-2 text-[16px] leading-[1.55] text-(--text-2) max-w-[62ch]">
												{t.description}
											</p>
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</div>
			</div>

			<TopicFooter locale={locale} counterpart={counterpartPath(path)} />
		</main>
	);
}
