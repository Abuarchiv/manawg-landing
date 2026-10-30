import { cleaningRotaTemplateCsv } from '@/topics/de/guides-home';

export const dynamic = 'force-static';

// Same template data as the table on /putzplan-vorlage:
// semicolon separated, CRLF, UTF-8 with BOM, served as a download.
export function GET() {
	return new Response(cleaningRotaTemplateCsv(), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="putzplan-vorlage.csv"',
		},
	});
}
