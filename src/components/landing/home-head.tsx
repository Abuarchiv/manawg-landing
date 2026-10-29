import { JsonLd } from '@/components/JsonLd';
import { APP_DEMO } from '@/content/app-demo';
import { HOME_DICT } from '@/content/home';
import { APP_ORIGIN } from '@/lib/app-origin';
import type { Locale } from '@/lib/locale';
import { schemaIds } from '@/lib/schema-ids';

// Shared by the German and the English home page: the inline mode script, the noscript style and the JSON-LD.

// Before the first paint: class "js" and mode (portrait/landscape) on the document so the layout does not jump.
const MODE_SCRIPT =
	"(function(){var d=document.documentElement,w=d.clientWidth,h=innerHeight;d.classList.add('js');d.setAttribute('data-mode',w/h<=1||w<700?'portrait':'landscape')})()";

const NOSCRIPT_STYLE =
	'<style>[data-loader]{display:none!important}#intro,[data-stage]{height:100svh!important}</style>';

/** SoftwareApplication and FAQPage of the home page in the given language. */
function homeSchemas(locale: Locale) {
	const dict = HOME_DICT[locale];
	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: dict.faq.map(([question, answer]) => ({
			'@type': 'Question',
			name: question,
			acceptedAnswer: { '@type': 'Answer', text: answer },
		})),
	};
	// Only on the home page: the app is a separate product on its own origin.
	const softwareApplicationSchema = {
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		'@id': schemaIds().app,
		name: 'ManaWG',
		publisher: { '@id': schemaIds().organisation },
		description: dict.schema.description,
		url: APP_ORIGIN,
		applicationCategory: 'LifestyleApplication',
		operatingSystem: 'Web',
		inLanguage: ['de-DE', 'en-GB'],
		featureList: dict.schema.featureList,
		isAccessibleForFree: true,
		browserRequirements: dict.schema.browserRequirements,
		screenshot: { '@type': 'ImageObject', url: `${schemaIds().site}${APP_DEMO[locale].still}` },
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
	};
	return { softwareApplicationSchema, faqSchema };
}

export function HomeHead({ locale }: { locale: Locale }) {
	const { softwareApplicationSchema, faqSchema } = homeSchemas(locale);
	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user content */}
			<script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
			<noscript
				// biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user content
				dangerouslySetInnerHTML={{ __html: NOSCRIPT_STYLE }}
			/>
			<JsonLd data={softwareApplicationSchema} />
			<JsonLd data={faqSchema} />
		</>
	);
}
