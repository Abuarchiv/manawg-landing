import { appUrl } from '@/lib/app-origin';
import { getAppUrl } from '@/lib/app-url';
import { TEXT_LINK } from '@/lib/text-link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
			images: [`/${thema}/opengraph-image`],
		},
		twitter: { title: t.titel, description: t.beschreibung, images: [`/${thema}/opengraph-image`] },
	};
}

export default async function ThemaPage({ params }: Props) {
	const { thema } = await params;
	const t = THEMEN[thema];
	if (!t) notFound();

	const faqSchema = t.fragen && {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: t.fragen.map(([frage, antwort]) => ({
			'@type': 'Question',
			name: frage,
			acceptedAnswer: { '@type': 'Answer', text: antwort },
		})),
	};

	const artikel = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: t.h1,
		description: t.beschreibung,
		inLanguage: 'de-DE',
		dateModified: t.stand,
		mainEntityOfPage: `${getAppUrl()}/${thema}`,
		author: { '@type': 'Organization', name: 'ManaWG', url: getAppUrl() },
		publisher: { '@type': 'Organization', name: 'ManaWG', url: getAppUrl() },
	};

	const breadcrumb = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'ManaWG', item: `${getAppUrl()}/` },
			{ '@type': 'ListItem', position: 2, name: t.link },
		],
	};

	return (
		<main id="main" tabIndex={-1} className="min-h-screen flex flex-col focus:outline-none">
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
			<div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[var(--text-3)] hover:text-[var(--text-2)] mb-8 -ml-2 px-3 py-3 min-h-[44px] rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
					aria-label="Zur Startseite"
				>
					<ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
					Zur Startseite
				</Link>

				<h1 className="text-2xl font-bold text-[var(--text-1)] mb-4">{t.h1}</h1>
				<p className="text-[var(--text-2)] mb-8 leading-relaxed">{t.einleitung}</p>

				<div className="text-[var(--text-2)] space-y-6 leading-relaxed">
					{t.abschnitte.map(([kopf, text]) => (
						<section key={kopf}>
							<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">{kopf}</h2>
							<p>{text}</p>
						</section>
					))}
					{t.fragen?.map(([frage, antwort]) => (
						<section key={frage}>
							<h2 className="text-lg font-semibold text-[var(--text-1)] mb-2">{frage}</h2>
							<p>{antwort}</p>
						</section>
					))}
				</div>

				<p className="mt-10">
					<a
						href={appUrl('/registrieren?action=create')}
						className={`${TEXT_LINK} text-[var(--text-1)]`}
					>
						WG kostenlos erstellen
					</a>
				</p>
			</div>

			<footer className="pb-[max(1.5rem,env(safe-area-inset-bottom))] px-4 text-center">
				<p className="text-xs text-[var(--text-3)]">
					{Object.entries(THEMEN)
						.filter(([slug]) => slug !== thema)
						.map(([slug, andere], i) => (
							<span key={slug}>
								{i > 0 && ' · '}
								<Link href={`/${slug}`} className={`${TEXT_LINK} inline-block px-2 py-3.5`}>
									{andere.link}
								</Link>
							</span>
						))}
				</p>
			</footer>
		</main>
	);
}
