import {
	IN_LANGUAGE,
	type Locale,
	OG_LOCALE,
	counterpartPath,
	languageAlternates,
	localiseHref,
	toEnglishSlug,
} from '@/lib/locale';
import { schemaIds } from '@/lib/schema-ids';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GRUPPEN } from './gruppen';
import { Fuss, Kopf, mono, rand } from './rahmen';
import { topics, ui } from './registry';

type ClusterId = 'money' | 'household' | 'together' | 'moving' | 'more';

// Themen der Übersicht; was hier fehlt, landet unter „Weitere“, damit kein Ratgeber verschwindet.
const THEMENKREISE: Array<[ClusterId, string[]]> = [
	[
		'money',
		[
			'wg-kosten-aufteilen',
			'wg-miete-rechner',
			'wg-nebenkosten',
			'rundfunkbeitrag-wg',
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
const alle = GRUPPEN.find((g) => g.id === 'guides')?.slugs ?? [];
const zugeordnet = THEMENKREISE.flatMap(([, slugs]) => slugs);
const weitere = alle.filter((slug) => !zugeordnet.includes(slug));
const KREISE_DE: Array<[ClusterId, string[]]> =
	weitere.length > 0 ? [...THEMENKREISE, ['more', weitere]] : THEMENKREISE;

/** Clusters of a language as [name, slugs of that language]; slugs without a page there are dropped. */
function kreise(locale: Locale): Array<[string, string[]]> {
	const txt = ui(locale).guideIndex;
	const data = topics(locale);
	return KREISE_DE.map(([id, slugs]): [string, string[]] => [
		txt.clusters[id],
		slugs
			.map((s) => (locale === 'de' ? s : toEnglishSlug(s)))
			.filter((s): s is string => !!s && s in data),
	]).filter(([, slugs]) => slugs.length > 0);
}

const indexPath = (locale: Locale) => (locale === 'de' ? '/ratgeber' : '/en/guides');

export function guideIndexMetadata(locale: Locale): Metadata {
	const txt = ui(locale).guideIndex;
	const path = indexPath(locale);
	const languages = languageAlternates('/ratgeber', '/en/guides');
	return {
		title: txt.title,
		description: txt.description,
		alternates: {
			canonical: path,
			...(languages ? { languages } : {}),
			types: { 'application/atom+xml': locale === 'de' ? '/feed.xml' : '/en/feed.xml' },
		},
		openGraph: {
			title: txt.title,
			description: txt.description,
			url: path,
			siteName: 'ManaWG',
			locale: OG_LOCALE[locale],
			type: 'website',
			images: [
				{
					url: '/og.png?v=2',
					width: 1200,
					height: 630,
					alt:
						locale === 'de' ? 'Das ManaWG-Zeichen als 3D-Körper' : 'The ManaWG mark as a 3D object',
				},
			],
		},
		twitter: { title: txt.title, description: txt.description, images: ['/og.png?v=2'] },
	};
}

export function GuideIndex({ locale }: { locale: Locale }) {
	const { site, webseite } = schemaIds();
	const txt = ui(locale).guideIndex;
	const data = topics(locale);
	const path = indexPath(locale);
	const gruppen = kreise(locale);
	const slugs = gruppen.flatMap(([, s]) => s);
	const sammlung = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site}${path}#seite`,
		name: txt.collectionName,
		description: txt.description,
		url: `${site}${path}`,
		inLanguage: IN_LANGUAGE[locale],
		isPartOf: { '@id': webseite },
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
				dangerouslySetInnerHTML={{ __html: JSON.stringify(sammlung) }}
			/>

			<Kopf locale={locale} />

			<nav aria-label={ui(locale).breadcrumbLabel} className={`${rand} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href={localiseHref(locale, '/')} prefetch={false}>
							ManaWG
						</Link>
					</li>
					<li aria-current="page">/ {txt.crumb}</li>
				</ol>
			</nav>

			<div className={`${rand} flex-1`}>
				<h1
					className={`font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] ${locale === 'de' ? 'hyphens-auto' : 'hyphens-manual'} break-words`}
				>
					{txt.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					{txt.intro}
				</p>

				<div className="mt-20 md:mt-32">
					{gruppen.map(([name, liste]) => (
						<section key={name} className="linie py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8">
							<h2 className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
								{name}
							</h2>
							<ul className="list-none m-0 p-0 md:col-start-6 md:col-span-7 flex flex-col">
								{liste.map((slug) => {
									const t = data[slug];
									if (!t) return null;
									return (
										<li key={slug} className="py-4 first:pt-0">
											<Link
												href={localiseHref(locale, `/${slug}`)}
												prefetch={false}
												className="font-[family-name:'Inter_Tight','Inter_Tight_Fallback',sans-serif] font-semibold text-[19px] leading-[1.25] tracking-[-0.02em] no-underline hover:text-[var(--text-2)]"
											>
												{t.h1}
											</Link>
											<p className="m-0 mt-2 text-[16px] leading-[1.55] text-[var(--text-2)] max-w-[62ch]">
												{t.beschreibung}
											</p>
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</div>
			</div>

			<Fuss locale={locale} counterpart={counterpartPath(path)} />
		</main>
	);
}
