import { cleaningRotaTemplateCsv } from '@/topics/de/guides';

export const dynamic = 'force-static';

// Dieselben Vorlagendaten wie die Tabelle auf /putzplan-vorlage:
// Semikolon, CRLF, UTF-8 mit BOM, als Datei-Download.
export function GET() {
	return new Response(cleaningRotaTemplateCsv(), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="putzplan-vorlage.csv"',
		},
	});
}
