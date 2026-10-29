import { cleaningRotaTemplateCsv } from '@/topics/en/guides-home';

export const dynamic = 'force-static';

// Same template data as the table on /en/cleaning-rota-template:
// comma separated, CRLF, UTF-8 with BOM, served as a download.
export function GET() {
	return new Response(cleaningRotaTemplateCsv(), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="cleaning-rota-template.csv"',
		},
	});
}
