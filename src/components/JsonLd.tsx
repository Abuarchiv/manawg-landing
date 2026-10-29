/** Structured data block. Callers pass objects built from static constants, never user input. */
export function JsonLd({ data }: { data: object }) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of static constants, no user content
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
