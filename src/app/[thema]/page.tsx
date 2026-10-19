import { appUrl } from '@/lib/app-origin';
import { schemaIds } from '@/lib/schema-ids';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { preload } from 'react-dom';
import { GRUPPEN, VERGLEICHS_HINWEIS, gruppeVon, verwandte } from './gruppen';
import { PUTZPLAN_VORLAGE } from './ratgeber';
import { THEMEN } from './themen';

export const dynamicParams = false;

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
		alternates: { canonical: `/${thema}` },
		openGraph: {
			title: t.titel,
			description: t.beschreibung,
			url: `/${thema}`,
			siteName: 'ManaWG',
			locale: 'de_DE',
			type: 'article',
			publishedTime: t.erschienen,
			modifiedTime: t.stand,
			images: [`/${thema}/opengraph-image`],
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
			acceptedAnswer: { '@type': 'Answer', text: antwort },
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
		datePublished: t.erschienen,
		dateModified: t.stand,
		mainEntityOfPage: `${site}/${thema}`,
		author: { '@id': orgId },
		publisher: { '@id': orgId },
		isPartOf: { '@id': webseiteId },
		...(quellen.length > 0 ? { citation: quellen.map(([, url]) => url) } : {}),
	};

	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'ManaWG', item: `${site}/` },
			{
				'@type': 'ListItem',
				position: 2,
				name: t.link,
				item: `${site}/${thema}`,
			},
		],
	};

	const aktualisiert = new Intl.DateTimeFormat('de-DE', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(new Date(`${t.stand}T00:00:00Z`));

	// Anbietervergleich: Hinweis vom Anbieter, oberhalb des Inhalts.
	const istVergleich = gruppeVon(thema)?.name === 'Vergleiche';
	const hinweis = VERGLEICHS_HINWEIS;

	const mono = 'font-mono text-[12px] tracking-[0.02em] text-[var(--text-3)]';
	const rand = 'px-5 md:px-8 lg:px-16 mx-auto w-full max-w-[1440px]';
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

			<header
				className={`${rand} flex items-center justify-between pt-[max(1.25rem,env(safe-area-inset-top))] pb-6`}
			>
				{/* Kein Prefetch: die Startseite bringt ~100 KB Szenen-JS mit, das Textseiten nicht vorladen sollen. */}
				<Link
					href="/"
					prefetch={false}
					aria-label="ManaWG, zur Startseite"
					className="inline-flex items-center gap-3 min-h-[44px] no-underline"
				>
					<img
						src="/manawg-mark-weiss-120.png"
						alt=""
						width={416}
						height={346}
						className="h-5 w-auto"
					/>
					<span className="font-[family-name:'Inter_Tight'] text-[17px] font-semibold tracking-[-0.03em]">
						ManaWG
					</span>
				</Link>
				<a
					href={appUrl('/registrieren?action=create')}
					className="font-mono text-[12px] text-[var(--text-3)] min-h-[44px] inline-flex items-center"
				>
					App öffnen
				</a>
			</header>

			<nav aria-label="Brotkrumen" className={`${rand} ${mono} pb-10 md:pb-16`}>
				<ol className="flex flex-wrap gap-x-2 m-0 p-0 list-none">
					<li>
						<Link href="/" prefetch={false}>
							ManaWG
						</Link>
					</li>
					<li aria-current="page">/ {t.link}</li>
				</ol>
			</nav>

			<div className={`${rand} flex-1`}>
				<h1 className="font-[family-name:'Inter_Tight'] font-semibold m-0 text-[clamp(40px,7.2vw,104px)] leading-[0.95] tracking-[-0.05em] max-w-[16ch] md:max-w-[18ch]">
					{t.h1}
				</h1>
				<p className="mt-10 md:mt-16 md:ml-[33.33%] max-w-[60ch] text-[clamp(18px,1.5vw,22px)] leading-[1.5] text-[var(--text-2)]">
					{t.einleitung}
				</p>
				<p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>
					Von <Link href="/ueber-manawg">ManaWG</Link> · Aktualisiert am{' '}
					<time dateTime={t.stand}>{aktualisiert}</time>
				</p>
				{istVergleich && <p className={`${mono} mt-6 mb-0 md:ml-[33.33%]`}>{hinweis}</p>}

				<div className="mt-20 md:mt-32">
					{t.abschnitte.map(([kopf, text]) => (
						<section
							key={kopf}
							className={`${linie} py-10 md:py-14 md:grid md:grid-cols-12 md:gap-8`}
						>
							<h2 className="font-[family-name:'Inter_Tight'] font-semibold m-0 mb-4 md:mb-0 md:col-span-4 text-[22px] leading-[1.15] tracking-[-0.03em]">
								{kopf}
							</h2>
							<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] md:text-[18px] leading-[1.65] text-[var(--text-2)]">
								{text}
							</p>
						</section>
					))}
				</div>

				{thema === 'putzplan-vorlage' && (
					<section aria-labelledby="vorlage-tabelle" className={`${linie} pt-10 md:pt-14`}>
						<h2 id="vorlage-tabelle" className={`${mono} m-0 mb-8 font-normal`}>
							Vorlage: Vier-Wochen-Rotation für vier Personen
						</h2>
						<div
							className="min-w-0 overflow-x-auto"
							// biome-ignore lint/a11y/useSemanticElements: scrollbare Tabelle braucht beschriftete Region statt Section
							role="region"
							aria-labelledby="vorlage-tabelle"
							// biome-ignore lint/a11y/noNoninteractiveTabindex: scrollbare Region muss per Tastatur erreichbar sein
							tabIndex={0}
						>
							<table className="w-full min-w-[540px] border-collapse text-left">
								<caption className={`${mono} mb-4 text-left`}>
									Vier-Wochen-Rotation: jede Woche rückt jede Person eine Aufgabe weiter
								</caption>
								<thead>
									<tr>
										<th
											scope="col"
											className="px-3 py-2 text-left font-normal border-b border-white/10"
										>
											Woche
										</th>
										{PUTZPLAN_VORLAGE.aufgaben.map((aufgabe) => (
											<th
												key={aufgabe}
												scope="col"
												className="px-3 py-2 text-left font-normal border-b border-white/10"
											>
												{aufgabe}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{PUTZPLAN_VORLAGE.wochen.map((woche, i) => (
										<tr key={`woche-${i + 1}`}>
											<th
												scope="row"
												className="px-3 py-2 text-left font-normal border-b border-white/10"
											>
												Woche {i + 1}
											</th>
											{woche.map((person, j) => (
												<td key={`${i}-${j}`} className="px-3 py-2 border-b border-white/10">
													{person}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<p className={`${mono} mt-4 mb-0`}>A, B, C und D stehen für vier Beispielpersonen.</p>
						<p className={`${mono} mt-4 mb-0`}>
							<a href="/putzplan-vorlage.csv" download>
								Vorlage als CSV herunterladen
							</a>
						</p>
					</section>
				)}

				{t.fragen && (
					<section aria-labelledby="fragen" className={`${linie} pt-10 md:pt-14`}>
						<h2 id="fragen" className={`${mono} m-0 mb-8 font-normal`}>
							Fragen
						</h2>
						{t.fragen.map(([frage, antwort]) => (
							<div key={frage} className={`${linie} py-8 md:grid md:grid-cols-12 md:gap-8`}>
								<h3 className="font-[family-name:'Inter_Tight'] font-semibold m-0 mb-3 md:mb-0 md:col-span-4 text-[20px] leading-[1.2] tracking-[-0.02em]">
									{frage}
								</h3>
								<p className="m-0 md:col-start-6 md:col-span-6 max-w-[62ch] text-[17px] leading-[1.65] text-[var(--text-2)]">
									{antwort}
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

				<div
					className={`${linie} mt-16 md:mt-24 pt-14 md:pt-20 md:grid md:grid-cols-12 md:gap-8 items-end`}
				>
					<p className="m-0 md:col-span-7 font-[family-name:'Inter_Tight'] font-semibold text-[clamp(30px,4.4vw,64px)] leading-[1] tracking-[-0.045em]">
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
						{verwandte(thema).map((slug) => {
							const v = THEMEN[slug];
							if (!v) return null;
							return (
								<li key={slug} className={`${linie}`}>
									<Link
										href={`/${slug}`}
										className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 py-6 no-underline"
									>
										<span className="font-[family-name:'Inter_Tight'] font-semibold text-[clamp(22px,2.6vw,36px)] leading-[1.1] tracking-[-0.035em] group-hover:text-[var(--text-2)] transition-colors">
											{v.h1}
										</span>
										<span className={mono}>{gruppeVon(slug)?.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>

			<footer
				className={`${rand} ${linie} mt-24 md:mt-32 pt-12 pb-[max(2rem,env(safe-area-inset-bottom))]`}
			>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
					{GRUPPEN.map((g) => (
						<nav key={g.name} aria-label={g.name}>
							<p className={`${mono} m-0 mb-4`}>{g.name}</p>
							<ul className="list-none m-0 p-0 flex flex-col">
								{g.slugs.map((slug) => (
									<li key={slug}>
										<Link
											href={`/${slug}`}
											aria-current={slug === thema ? 'page' : undefined}
											className="inline-block py-[7px] text-[14px] text-[var(--text-2)] no-underline hover:text-[#fafafa] aria-[current=page]:text-[#fafafa]"
										>
											{THEMEN[slug]?.link}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				<p className={`${mono} mt-12 mb-0 flex flex-wrap gap-x-5`}>
					<span>ManaWG, 2026</span>
					<Link href="/impressum">Impressum</Link>
					<Link href="/datenschutz">Datenschutz</Link>
					<Link href="/agb">AGB</Link>
				</p>
			</footer>
		</main>
	);
}
