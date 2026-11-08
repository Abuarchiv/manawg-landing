/**
 * Builds the printable cleaning rota templates in public/vorlagen/: one A4 PDF and one XLSX
 * per language and per number of people (2 to 5). The rotation comes from cleaningRota(), the
 * same function behind the tables and the generator on the template pages.
 *
 * Run: pnpm templates   (the generated files are committed; run it again after changing the rotation)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import { PDFDocument, type PDFFont, type PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { cleaningRota } from '../src/topics/cleaning-rota.ts';
import { ROTA_TEMPLATES as ROTA_DE } from '../src/topics/de/guides-home.ts';
import { ROTA_TEMPLATES as ROTA_EN } from '../src/topics/en/guides-home.ts';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'vorlagen');
const PEOPLE = [2, 3, 4, 5] as const;
// Fixed dates keep the files byte-identical between runs, so a rebuild shows up as a real diff.
const FIXED_DATE = new Date('2026-11-08T12:00:00Z');

type Lang = 'de' | 'en';

const COPY = {
	de: {
		file: (n: number) => `putzplan-vorlage-${n}-personen`,
		weekLabel: 'Woche',
		dateLabel: 'ab (Datum)',
		sheet: 'Putzplan',
		title: (n: number) => `WG-Putzplan für ${n} Personen`,
		lead: (cycle: number) =>
			`Jede Woche rückt jede Person eine Aufgabe weiter. Nach ${cycle} Wochen beginnt der Plan von vorn.`,
		who: 'Wer ist wer?',
		tasks: 'Was zu den Aufgaben gehört',
		swap: 'Wer in einer Woche nicht kann, tauscht Aufgabe gegen Aufgabe mit einer Person und sagt es vorher in der WG. Das Kästchen in jedem Feld ist zum Abhaken.',
		footer: 'Vorlage von ManaWG · manawg.com/putzplan-vorlage · kostenlos, ohne Konto',
		xlsxHelp: [
			'Tragt in die gelben Felder eure Namen ein, der Plan übernimmt sie.',
			'Ohne Namen zeigt er die Buchstaben A, B, C. Das Datum jeder Woche tragt ihr selbst ein.',
		],
		xlsxNames: 'Eure Namen',
		xlsxPlaceholder: 'Platzhalter',
		xlsxName: 'Name',
		describe: {
			Bad: 'Waschbecken, Dusche, WC, Boden',
			Küche: 'Herd, Arbeitsflächen, Spüle, Boden',
			Böden: 'Wohnzimmer und Gemeinschaftsflächen saugen oder wischen',
			'Müll und Flur': 'Müll und Pfand wegbringen, Flur saugen oder wischen',
			'Böden und Müll': 'Gemeinschaftsflächen saugen oder wischen, Müll und Pfand wegbringen',
			'Wohnzimmer und Balkon': 'Aufräumen, Oberflächen abwischen, Balkon fegen',
		} as Record<string, string>,
		creator: 'ManaWG',
	},
	en: {
		file: (n: number) => `cleaning-rota-template-${n}-people`,
		weekLabel: 'Week',
		dateLabel: 'from (date)',
		sheet: 'Cleaning rota',
		title: (n: number) => `Flat cleaning rota for ${n} people`,
		lead: (cycle: number) =>
			`Every week each person moves on by one task. After ${cycle} weeks the plan starts again from the top.`,
		who: 'Who is who?',
		tasks: 'What the tasks include',
		swap: 'Whoever cannot do their task in a given week swaps task for task with another person and says so in the flat beforehand. The box in each cell is for ticking it off.',
		footer: 'Template by ManaWG · manawg.com/en/cleaning-rota-template · free, no account',
		xlsxHelp: [
			'Enter your names in the yellow cells and the plan picks them up.',
			'Without names it shows the letters A, B, C. You fill in the date of each week yourself.',
		],
		xlsxNames: 'Your names',
		xlsxPlaceholder: 'Placeholder',
		xlsxName: 'Name',
		describe: {
			Bathroom: 'Sink, shower, toilet, floor',
			Kitchen: 'Hob, worktops, sink, floor',
			Floors: 'Hoover or mop the living room and shared areas',
			'Bins and hallway': 'Take out rubbish and deposit bottles, hoover or mop the hallway',
			'Floors and bins': 'Hoover or mop shared areas, take out rubbish and deposit bottles',
			'Living room and balcony': 'Tidy, wipe surfaces, sweep the balcony',
		} as Record<string, string>,
		creator: 'ManaWG',
	},
} as const;

const TEMPLATES = { de: ROTA_DE, en: ROTA_EN } as const;

/** Whole rotations so the sheet ends cleanly: at least eight weeks. */
const weeksFor = (people: number) => people * Math.ceil(8 / people);

interface Plan {
	people: number;
	letters: string[];
	tasks: string[];
	weeks: number;
	rows: string[][];
}

function planFor(lang: Lang, people: (typeof PEOPLE)[number]): Plan {
	const template = TEMPLATES[lang][people];
	const letters = 'ABCDE'.split('').slice(0, people);
	const tasks = template.header.slice(1);
	const weeks = weeksFor(people);
	const { rows } = cleaningRota(letters, tasks, weeks, COPY[lang].weekLabel);
	return { people, letters, tasks, weeks, rows };
}

// ---------------------------------------------------------------- PDF

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 42;
const INK = rgb(0.07, 0.07, 0.07);
const MUTED = rgb(0.36, 0.36, 0.36);
const RULE = rgb(0.7, 0.7, 0.7);
const SHADE = rgb(0.94, 0.94, 0.94);

/** Greedy word wrap to a width in points. */
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const word of text.split(' ')) {
		const next = line ? `${line} ${word}` : word;
		if (line && font.widthOfTextAtSize(next, size) > width) {
			lines.push(line);
			line = word;
		} else line = next;
	}
	if (line) lines.push(line);
	return lines;
}

function paragraph(
	page: PDFPage,
	text: string,
	x: number,
	top: number,
	opts: { font: PDFFont; size: number; width: number; lead: number; color?: typeof INK },
): number {
	let y = top;
	for (const line of wrap(text, opts.font, opts.size, opts.width)) {
		y -= opts.lead;
		page.drawText(line, { x, y, size: opts.size, font: opts.font, color: opts.color ?? INK });
	}
	return y;
}

async function buildPdf(lang: Lang, plan: Plan): Promise<Uint8Array> {
	const t = COPY[lang];
	const doc = await PDFDocument.create();
	const regular = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);
	doc.setTitle(t.title(plan.people));
	doc.setAuthor(t.creator);
	doc.setCreator('ManaWG');
	doc.setProducer('ManaWG (pdf-lib)');
	doc.setLanguage(lang);
	doc.setCreationDate(FIXED_DATE);
	doc.setModificationDate(FIXED_DATE);

	const page = doc.addPage(A4);
	const [pageW, pageH] = A4;
	const inner = pageW - 2 * MARGIN;

	// Heading and lead.
	let y = pageH - MARGIN;
	y -= 24;
	page.drawText(t.title(plan.people), { x: MARGIN, y, size: 24, font: bold, color: INK });
	y = paragraph(page, t.lead(plan.people), MARGIN, y - 4, {
		font: regular,
		size: 10.5,
		width: inner,
		lead: 15,
		color: MUTED,
	});

	// Who is who: one write-in line per letter.
	y -= 22;
	page.drawText(t.who, { x: MARGIN, y, size: 10.5, font: bold, color: INK });
	y -= 8;
	const slot = inner / plan.people;
	plan.letters.forEach((letter, i) => {
		const x = MARGIN + i * slot;
		const base = y - 16;
		page.drawText(letter, { x, y: base + 2, size: 13, font: bold, color: INK });
		page.drawLine({
			start: { x: x + 16, y: base },
			end: { x: x + slot - 12, y: base },
			thickness: 0.7,
			color: RULE,
		});
	});
	y -= 30;

	// Table.
	const weekW = 56;
	const dateW = 66;
	const taskW = (inner - weekW - dateW) / plan.tasks.length;
	const colX = [MARGIN, MARGIN + weekW, MARGIN + weekW + dateW];
	for (let i = 1; i < plan.tasks.length; i++) colX.push((colX[2] ?? 0) + taskW * i);
	colX.push(MARGIN + inner);

	const headSize = 9;
	const headLines = plan.tasks.map((task) => wrap(task, bold, headSize, taskW - 10));
	const headH = Math.max(30, Math.max(...headLines.map((l) => l.length)) * 11 + 14);
	const rowH = 38;
	const tableTop = y - 6;
	page.drawRectangle({
		x: MARGIN,
		y: tableTop - headH,
		width: inner,
		height: headH,
		color: SHADE,
	});
	const headY = (lines: number) => tableTop - headH / 2 + (lines * 11) / 2 - 8;
	for (const [i, label] of [t.weekLabel, t.dateLabel].entries()) {
		page.drawText(label, {
			x: (colX[i] ?? 0) + 6,
			y: headY(1),
			size: headSize,
			font: bold,
			color: INK,
		});
	}
	headLines.forEach((lines, i) => {
		lines.forEach((line, j) => {
			const w = bold.widthOfTextAtSize(line, headSize);
			page.drawText(line, {
				x: (colX[i + 2] ?? 0) + (taskW - w) / 2,
				y: headY(lines.length) - j * 11,
				size: headSize,
				font: bold,
				color: INK,
			});
		});
	});

	const bodyTop = tableTop - headH;
	plan.rows.forEach((row, r) => {
		const top = bodyTop - r * rowH;
		const cycleEnd = (r + 1) % plan.people === 0;
		page.drawLine({
			start: { x: MARGIN, y: top - rowH },
			end: { x: MARGIN + inner, y: top - rowH },
			thickness: cycleEnd ? 1.4 : 0.5,
			color: cycleEnd ? INK : RULE,
		});
		page.drawText(`${t.weekLabel} ${r + 1}`, {
			x: MARGIN + 6,
			y: top - rowH / 2 - 3.5,
			size: 10,
			font: regular,
			color: INK,
		});
		row.slice(1).forEach((letter, i) => {
			const x = colX[i + 2] ?? 0;
			const w = bold.widthOfTextAtSize(letter, 16);
			page.drawText(letter, {
				x: x + (taskW - w) / 2,
				y: top - rowH / 2 - 5.5,
				size: 16,
				font: bold,
				color: INK,
			});
			page.drawRectangle({
				x: x + taskW - 14,
				y: top - 14,
				width: 7,
				height: 7,
				borderColor: MUTED,
				borderWidth: 0.7,
			});
		});
	});
	const tableBottom = bodyTop - plan.rows.length * rowH;
	// Column rules and outer frame.
	for (const x of colX) {
		page.drawLine({
			start: { x, y: tableTop },
			end: { x, y: tableBottom },
			thickness: 0.5,
			color: RULE,
		});
	}
	page.drawLine({
		start: { x: MARGIN, y: tableTop },
		end: { x: MARGIN + inner, y: tableTop },
		thickness: 0.5,
		color: RULE,
	});
	page.drawLine({
		start: { x: MARGIN, y: bodyTop },
		end: { x: MARGIN + inner, y: bodyTop },
		thickness: 0.8,
		color: INK,
	});

	// What the tasks include.
	y = tableBottom - 22;
	page.drawText(t.tasks, { x: MARGIN, y, size: 10.5, font: bold, color: INK });
	for (const task of plan.tasks) {
		const detail = t.describe[task];
		if (!detail) throw new Error(`No description for task "${task}"`);
		y -= 14;
		page.drawText(task, { x: MARGIN, y, size: 9.5, font: bold, color: INK });
		page.drawText(detail, { x: MARGIN + 132, y, size: 9.5, font: regular, color: MUTED });
	}
	y = paragraph(page, t.swap, MARGIN, y - 6, {
		font: regular,
		size: 9.5,
		width: inner,
		lead: 13,
		color: MUTED,
	});

	// Footer.
	page.drawText(t.footer, { x: MARGIN, y: MARGIN - 8, size: 8.5, font: regular, color: MUTED });
	if (y < MARGIN + 4) throw new Error(`PDF content overflows the page (${lang}, ${plan.people})`);
	return doc.save();
}

// ---------------------------------------------------------------- XLSX

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const col = (i: number) => String.fromCharCode(65 + i);

// Style ids, see STYLES below.
const S = { title: 1, head: 2, input: 3, cell: 4, date: 5, note: 6, bold: 7, week: 8 } as const;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="16"/><name val="Calibri"/></font>
<font><sz val="10"/><color rgb="FF595959"/><name val="Calibri"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFF2CC"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF0F0F0"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFB3B3B3"/></left><right style="thin"><color rgb="FFB3B3B3"/></right><top style="thin"><color rgb="FFB3B3B3"/></top><bottom style="thin"><color rgb="FFB3B3B3"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="9">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="2" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="14" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

type Cell = { ref: string; style: number; text?: string; formula?: string; result?: string };

const cellXml = (c: Cell): string => {
	if (c.formula !== undefined)
		return `<c r="${c.ref}" s="${c.style}" t="str"><f>${esc(c.formula)}</f><v>${esc(c.result ?? '')}</v></c>`;
	if (c.text !== undefined)
		return `<c r="${c.ref}" s="${c.style}" t="inlineStr"><is><t xml:space="preserve">${esc(c.text)}</t></is></c>`;
	return `<c r="${c.ref}" s="${c.style}"/>`;
};

function buildXlsx(lang: Lang, plan: Plan): Uint8Array {
	const t = COPY[lang];
	const rows = new Map<number, { cells: Cell[]; height?: number }>();
	const put = (r: number, c: number, cell: Omit<Cell, 'ref'>) => {
		const row = rows.get(r) ?? { cells: [] };
		row.cells.push({ ref: `${col(c)}${r}`, ...cell });
		rows.set(r, row);
	};

	put(1, 0, { style: S.title, text: t.title(plan.people) });
	put(2, 0, { style: S.note, text: t.xlsxHelp[0] });
	put(3, 0, { style: S.note, text: t.xlsxHelp[1] });

	// Names block: placeholder letters in A, the yellow input cells in B.
	const namesTop = 5;
	put(namesTop, 0, { style: S.head, text: t.xlsxPlaceholder });
	put(namesTop, 1, { style: S.head, text: t.xlsxNames });
	const nameRef = (i: number) => `$B$${namesTop + 1 + i}`;
	plan.letters.forEach((letter, i) => {
		put(namesTop + 1 + i, 0, { style: S.cell, text: letter });
		put(namesTop + 1 + i, 1, { style: S.input });
	});

	// Rotation: every cell shows the name of its person, or the letter while the name is empty.
	const head = namesTop + plan.people + 2;
	put(head, 0, { style: S.head, text: t.weekLabel });
	put(head, 1, { style: S.head, text: t.dateLabel });
	plan.tasks.forEach((task, i) => {
		put(head, 2 + i, { style: S.head, text: task });
	});
	const headRow = rows.get(head);
	if (headRow) headRow.height = 34;
	plan.rows.forEach((row, r) => {
		const line = head + 1 + r;
		put(line, 0, { style: S.week, text: row[0] ?? '' });
		put(line, 1, { style: S.date });
		row.slice(1).forEach((letter, i) => {
			const idx = plan.letters.indexOf(letter);
			put(line, 2 + i, {
				style: S.cell,
				formula: `IF(${nameRef(idx)}="",$A$${namesTop + 1 + idx},${nameRef(idx)})`,
				result: letter,
			});
		});
	});

	let line = head + plan.rows.length + 2;
	put(line++, 0, { style: S.bold, text: t.tasks });
	for (const task of plan.tasks) {
		const detail = t.describe[task];
		if (!detail) throw new Error(`No description for task "${task}"`);
		put(line, 0, { style: S.bold, text: task });
		put(line++, 2, { style: S.note, text: detail });
	}
	line++;
	put(line++, 0, { style: S.note, text: t.lead(plan.people) });
	put(line++, 0, { style: S.note, text: t.footer });

	const lastCol = col(1 + plan.tasks.length);
	const last = Math.max(...rows.keys());
	const sheetData = [...rows.entries()]
		.sort(([a], [b]) => a - b)
		.map(([r, { cells, height }]) => {
			const sorted = cells.sort((a, b) => a.ref.localeCompare(b.ref, 'en', { numeric: true }));
			const attrs = height ? ` ht="${height}" customHeight="1"` : '';
			return `<row r="${r}"${attrs}>${sorted.map(cellXml).join('')}</row>`;
		})
		.join('');

	const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<dimension ref="A1:${lastCol}${last}"/>
<sheetViews><sheetView workbookViewId="0" showGridLines="0"/></sheetViews>
<sheetFormatPr defaultRowHeight="20" customHeight="1"/>
<cols><col min="1" max="1" width="16" customWidth="1"/><col min="2" max="2" width="22" customWidth="1"/><col min="3" max="${2 + plan.tasks.length}" width="19" customWidth="1"/></cols>
<sheetData>${sheetData}</sheetData>
<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>
<pageSetup paperSize="9" orientation="portrait" fitToWidth="1" fitToHeight="0"/>
</worksheet>`;

	const files: Record<string, string> = {
		'[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
		'_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
		'docProps/core.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${esc(t.title(plan.people))}</dc:title><dc:creator>${t.creator}</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${FIXED_DATE.toISOString()}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${FIXED_DATE.toISOString()}</dcterms:modified></cp:coreProperties>`,
		'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="${esc(t.sheet)}" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">'${esc(t.sheet)}'!$A$1:$${lastCol}$${last}</definedName></definedNames><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`,
		'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
		'xl/styles.xml': STYLES,
		'xl/worksheets/sheet1.xml': sheet,
	};
	const enc = new TextEncoder();
	return zipSync(
		Object.fromEntries(
			// [Content_Types].xml first, as the format expects.
			Object.entries(files).map(([name, xml]) => [
				name,
				[enc.encode(xml), { level: 9, mtime: FIXED_DATE }] as const,
			]),
		),
	);
}

// ---------------------------------------------------------------- main

mkdirSync(OUT, { recursive: true });
for (const lang of ['de', 'en'] as const) {
	for (const people of PEOPLE) {
		const plan = planFor(lang, people);
		const base = join(OUT, COPY[lang].file(people));
		writeFileSync(`${base}.pdf`, await buildPdf(lang, plan));
		writeFileSync(`${base}.xlsx`, buildXlsx(lang, plan));
		console.warn(`${COPY[lang].file(people)}: pdf + xlsx (${plan.weeks} weeks)`);
	}
}
