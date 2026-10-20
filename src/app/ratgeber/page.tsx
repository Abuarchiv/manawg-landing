import { schemaIds } from '@/lib/schema-ids';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GRUPPEN } from '../[thema]/gruppen';
import { Fuss, Kopf, mono, rand } from '../[thema]/rahmen';
import { THEMEN } from '../[thema]/themen';

const titel = 'WG-Ratgeber: Geld, Putzplan, Regeln, Ein- und Auszug | ManaWG';
const beschreibung =
	'Alle Ratgeber für das Leben in der WG: Kosten aufteilen, Putzplan, WG-Regeln, Streit, Mietvertrag, Kündigung, Anmeldung, Einzug und Auszug. Kostenlos.';

// Themen der Übersicht; was hier fehlt, landet unter „Weitere“, damit kein Ratgeber verschwindet.
const THEMENKREISE: Array<[string, string[]]> = [
	['Geld', ['wg-kosten-aufteilen', 'wg-nebenkosten', 'wg-haushaltskasse', 'schulden-mitbewohner']],
	['Haushalt', ['putzplan-erstellen', 'putzplan-vorlage', 'wg-einkauf-organisieren']],
	[
		'Zusammenleben',
		['wg-regeln', 'wg-streit-loesen', 'mitbewohner-kuendigen', 'wg-abwesenheit-urlaub'],
	],
	[
		'Gründen, Ein- und Auszug',
		[
			'wg-gruenden-checkliste',
			'wg-mietvertrag',
			'mitbewohner-finden',
			'wg-casting-fragen',
			'wg-einzug-checkliste',
			'wg-anmeldung',
			'wg-zwischenmiete',
			'wg-auszug-checkliste',
		],
	],
];
const alle = GRUPPEN.find((g) => g.name === 'Ratgeber')?.slugs ?? [];
const zugeordnet = THEMENKREISE.flatMap(([, slugs]) => slugs);
const weitere = alle.filter((slug) => !zugeordnet.includes(slug));
const kreise =
	weitere.length > 0 ? [...THEMENKREISE, ['Weitere', weitere] as [string, string[]]] : THEMENKREISE;

export const metadata: Metadata = {
	title: titel,
	description: beschreibung,
	alternates: { canonical: '/ratgeber' },
	openGraph: {
		title: titel,
		description: beschreibung,
		url: '/ratgeber',
		siteName: 'ManaWG',
		locale: 'de_DE',
		type: 'website',
		images: [
			{ url: '/og.png?v=2', width: 1200, height: 630, alt: 'Das ManaWG-Zeichen als 3D-Körper' },
		],
	},
	twitter: { title: titel, description: beschreibung, images: ['/og.png?v=2'] },
};

export default function RatgeberPage() {
	const { site, webseite } = schemaIds();
	const slugs = kreise.flatMap(([, s]) => s);
	const sammlung = {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		'@id': `${site}/ratgeber#seite`,
		name: 'WG-Ratgeber',
		description: beschreibung,
		url: `${site}/ratgeber`,
		inLanguage: 'de-DE',
		isPartOf: { '@id': webseite },
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: slugs.map((slug, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				url: `${site}/${slug}`,
				name: THEMEN[slug]?.h1,
			})),
		},
	};
	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'ManaWG', item: `${site}/` },
			{ '@type': 'ListItem', position: 2, name: 'Ratgeber', item: `${site}/ratgeber` },
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

			<Kopf />

			<nav aria-label="Brotkrumen" className={`${rand} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href="/" prefetch={false}>
							ManaWG
						</Link>
					</li>
					<li aria-current="page">/ Ratgeber</li>
				</ol>
			</nav>

			<div className={`${rand} flex-1`}>
				<h1 className="font-[family-name:'Inter_Tight'] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch] hyphens-auto break-words">
					Ratgeber für das Leben in der WG
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					Von der Gründung über den Alltag bis zum Auszug: Hier stehen alle Ratgeber zu Geld,
					Putzen, Regeln und Verträgen in der WG. Mit Beispielrechnungen, Vorlagen und Checklisten
					zum Übernehmen.
				</p>

				<div className="mt-20 md:mt-32">
					{kreise.map(([name, liste]) => (
						<section key={name} className="linie py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8">
							<h2 className="font-[family-name:'Inter_Tight'] font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
								{name}
							</h2>
							<ul className="list-none m-0 p-0 md:col-start-6 md:col-span-7 flex flex-col">
								{liste.map((slug) => {
									const t = THEMEN[slug];
									if (!t) return null;
									return (
										<li key={slug} className="py-4 first:pt-0">
											<Link
												href={`/${slug}`}
												className="font-[family-name:'Inter_Tight'] font-semibold text-[19px] leading-[1.25] tracking-[-0.02em] no-underline hover:text-[var(--text-2)]"
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

			<Fuss />
		</main>
	);
}
