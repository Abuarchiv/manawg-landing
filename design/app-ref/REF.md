# ManaWG-App-Referenz für die Landing

Zweck: Die Landing zeigt im Handy **genau die echte App**. Diese Referenz ist die Messung dieser App: Bilder, Standalone-HTML mit dem echten CSS, Design-Tokens, Maße, Texte, Icons, Bewegung und die Schrittfolgen der Interaktionen. Nichts davon ist nachgebaut oder geschätzt, alles stammt aus dem laufenden Build.

- **Stand:** `df8677e0` (App-Repo `manawg-app`, Branch main), aufgenommen am 2026-10-06.
- **Aufnahme:** echte Next-15-App im Fixture-Modus (Produktions-Build, Port 3241), davor ein kleiner Demo-Server mit den Landing-Daten. Browser: Chromium (Playwright) mit M3-GPU, 390 × 844 CSS-Pixel, Gerätepixelverhältnis 3, `de-DE`, Zeitzone Europe/Berlin, Service Worker blockiert. Betrachter ist **Jona** („Du“).
- **Abgleich:** Jedes Standalone-HTML wurde im Browser neu gerendert und pixelweise mit der Live-Aufnahme verglichen (siehe §12).
- Die Aufnahme zeigt main **nach** dem Commit „Bottom-Nav: Safe-Area-Abstand greift wieder“: Tabbar und alles, was darüber schwebt (FAB, Hinweise, Install-Karte), sitzen 7,2 px höher als im bis dahin live geschalteten Stand `7c0d50ba`. Sonst ist der Pixelvergleich beider Stände ohne Befund (§12).

## Dateien

| Pfad | Inhalt |
|---|---|
| `REF.md` | dieses Dokument |
| `states.json` | alle 71 Zustände: Titel, Route, Beschreibung, Bild/HTML-Pfad, **Tap-Ziele mit Rechtecken** (81 kB) |
| `texts.md` | exakte sichtbare Texte je Zustand in Lesereihenfolge (29 kB) |
| `motion.json` | Rohdaten der Bewegungsmessung (Übergänge/Animationen je Interaktion) (12 kB) |
| `measurements.md` | Messwerte je Komponente und Bildschirm, Tokens hell/dunkel (36 kB) |
| `img/` | 71 Aufnahmen als WebP (Zweifach 780 px für die wichtigen, 585 px und 390 px für die übrigen), zusammen 1.39 MB |
| `screens/` | 23 Standalone-HTML-Dokumente mit dem echten DOM und `../app.css`, zusammen 852 kB |
| `app.css`, `fonts/` | echtes kompiliertes CSS (160 kB), Inter, Inter Tight, JetBrains Mono (woff2, latin, OFL) |
| `brand/` | Marke (SVG), App-Icon, Manifest |
| `index.html` | Galerie aller Zustände (iframes bzw. Bilder), im Browser öffnen: `python3 -m http.server -d design/app-ref` |
| `tools/` | Skripte, mit denen alles reproduzierbar ist (Demo-Server, Aufnahme, Messung, Bewegung, Build) |

Einbetten: `screens/NN-name.html` lädt `../app.css` (das unveränderte Build-CSS, Tailwind v4 mit Variablen auf `:root`/`.dark`) und die Schriften aus `fonts/`. Für das Handy der Landing am besten als `<iframe>` (390 × 844, dann per `transform: scale()` skalieren, nicht per Re-Layout) oder per Shadow-DOM, weil `app.css` globale Regeln (`html`, `body`, Preflight) enthält. Dunkel: dieselbe Datei mit `class="dark"` am `<html>`; das ist mit `65–72` gegengeprüft.

## 1. Die wichtigsten Befunde (Landing-Mock gegen echte App)

Das Handy der Landing (`src/components/landing/overlays.tsx`, Zeilen 385–634) ist eine generische Erfindung. Die echte App sieht in jedem Punkt anders aus:

| Bereich | Landing heute | Echte App |
|---|---|---|
| Statuszeile | „9:41“, Insel, „100 %“ | gehört zum Gerät, nicht zur App. Die App beginnt darunter (Kopf 40 px hoch). |
| Kopf | Marke 15 px + Tab-Titel | Metaball-Marke **24 px** (8 Körper, `LogoMark`) + „WG Lindenstraße“ auf **jedem** Tab (Inter Tight 600, 18 px, −0,03 em); rechts zwei 32-px-Icon-Buttons (`message-circle` → Chat, `user-round` → Einstellungen). |
| Start | Karte „MÄRZ · 4 PERSONEN“ mit 28-px-Saldo „0,00 €“ | Es gibt **keine Saldo-Kachel** und keine Mono-Versalien. Start = „Für dich“, „Diese Woche“ (+ „Kalender ›“), „Neu in deiner WG“ (Zeile 01). Den Saldo zeigt nur Finanzen: „Du bist ausgeglichen“. |
| Haushalt | „EINKAUF · 3 OFFEN“ in Mono-Versalien, 20-px-Kästchen | Zwei Ebenen: Tabbar „Haushalt“ + SubNav **Putzplan · Einkäufe 3 · Vorräte** (Segmented, 36 px). Checkbox **24 px**, Radius 7,2, Rand `#0a0a0a80`. |
| Finanzen | schwarz umrandeter Button „Ausgabe hinzufügen“ über der Liste | **Kein Button oben.** Runder FAB 44 × 44 (schwarz, Radius 9, `plus`) rechts unten, 64 px über der Unterkante. Darüber die Saldo-Karte und Wochengruppen. |
| Austausch | Pinnwand-Karte, Bubble „Bin um acht wieder da.“, „Antworten …“-Chip | SubNav **Pinnwand · Chat · Kalender**. Antworten = Bubble antippen → Menü → „Antworten“ → Leiste „Antwort an Lea“ → senden (Zeilen 18, 28–30). |
| Tabbar | nur Text, 11 px/600, Radius 16 | Icon 18 px + Label 11 px/500. Hülle 372,8 × 50, Radius 20, Rand 1 px `#e5e5e5`; aktiver Eintrag = weiße Pille mit Innenring + Schatten `0 1px 3px rgba(0,0,0,.12)`; 7,2 px Luft unter der Hülle. |
| Typografie | Mono-Versalien mit 0,08 em, 28-px-Großzahl | Beides gibt es in der App nicht. JetBrains Mono nur für Beträge, „ausgeglichen“, Uhrzeiten und Zahlenfelder (12–20 px). |
| Eingaben | – | Eingabefelder/Select 44 px hoch, Radius 9, Rand `#8f8f8f`; Buttons 32 px hoch (Klickfläche 44). |

Weitere Befunde:

1. **Avatare** sind nach Namen getönt, nicht nach Rolle: `HUES = [25, 60, 95, 145, 190, 240, 285, 330]`, Index = Hash des kleingeschriebenen Namens. Mit den Landing-Namen ergibt das **Mika → Hue 95 (olivgelb)**, **Lina, Jona, Lea → Hue 25 (rosé)**. Das ist echtes Verhalten und in allen Bildern so zu sehen. Initialen: MI, LI, JO, LE.
2. **Beträge stehen rechts in JetBrains Mono**, Status („ausgeglichen“, „beglichen“, „bekommst du“) darunter in Inter 12 px. Positive Beträge grün `#14874e`, negative bleiben schwarz mit „-“.
3. Der Erledigt-Haken im Einkauf ist **sofort** wirksam (optimistisch, keine CSS-Animation): die Zeile springt aus der offenen Liste nach „Erledigt (n)“, das Zähl-Badge im Tab und „n offene Artikel“ auf dem Start ändern sich mit.
4. Alle Texte sind „Sentence case“ mit deutschen Anführungszeichen („…“) und Mittelpunkt `·` als Trenner. Keine Ausrufezeichen, keine Emojis (nur „✓“ in „✓ Ausgeglichen“), Großbuchstaben nur bei Abkürzungen (AGB, PNG).
5. Die App ist bewusst **monochrom**. Farbe gibt es nur für: Grün (du bekommst, Erfolgs-Meldung), Rot (Löschen, Fehler), Avatar-Tönung.

## 2. Stand der Technik und Reproduktion

Next 15.5, React 19, Tailwind 4 (Variablen in OKLCH), Base-UI-Primitives (`@base-ui/react`), `lucide-react` 0.511, `motion` 13. Die Seite ist eine reine Handy-Spalte (`--app-frame-width: 27rem`).

```sh
# 1. Quelle (nur lesen, das App-Repo bleibt unverändert)
git -C ~/Company/manawg-app archive df8677e0 | tar -x -C "$SCR/src" && cd "$SCR/src" && pnpm install --offline --frozen-lockfile
# 2. Fixture-Modus + Produktions-Build + Start (Port 3241). tools/fixture-env.sh setzt CI, E2E_FIXTURE_MODE, NEXT_PUBLIC_DB_DOWN
#    und leert POSTGRES_URL, DATABASE_URL, Supabase, Upstash, PayPal, Sentry, S3 und VERCEL (sonst leitet /wg/* auf /neu um).
source tools/fixture-env.sh && cd apps/web && pnpm exec next build && pnpm exec next start --port 3241
# 3. Demo-Server mit den Landing-Daten (WG Lindenstraße, Betrachter Jona), Zustand im Speicher, GET /demo-reset setzt zurück
APP_PORT=3241 PORT=4241 node tools/demo-server.mjs
# 4. Aufnahme, Messung, Bewegung, Assets
BASE=http://127.0.0.1:4241 node tools/capture.mjs      # 71 Zustände nach shots/final + data/final
BASE=http://127.0.0.1:4241 node tools/probes.mjs       # Tokens und Komponenten -> data/probes.json
BASE=http://127.0.0.1:4241 node tools/motion.mjs       # Übergänge und Animationen -> data/motion.json
python3 tools/build_assets.py design/app-ref           # webp, Standalone-HTML, app.css, Schriften
```

Die Skripte laden Playwright über `createRequire('/Users/abu/Company/manawg-app/apps/web/package.json')` (kein eigenes `node_modules` nötig); Chromium mit `--use-angle=metal --enable-gpu`. Fixture-Fallen: `VERCEL=1` aus `.env.local` schaltet den Fixture-Modus ab (Redirect `/wg/*` → `/neu`). Der Fixture-WG heißt im App-Code „sadf“; der Demo-Server ersetzt das durch „WG Lindenstraße“. `GET /api/wg/mine` antwortet im Fixture-Modus 401, das ist die einzige Konsolenmeldung der Aufnahme und harmlos.

## 3. Landing-Daten in der echten App

WG „WG Lindenstraße“, vier Mitglieder in der Reihenfolge der Landing: **Mika, Lina, Jona (Du), Lea**. Seed (`tools/demo-server.mjs`, Funktion `seed()`), Start = Zustand der Landing („Spülmittel“ ist schon erledigt, Saldo 0,00 €):

| Bereich | Daten | So zeigt es die echte App |
|---|---|---|
| Einkauf | Hafermilch (2 Packungen, Mika), Bananen (6 Stück, Lea), Spülmittel (1 Flasche, Jona, **erledigt**), Toilettenpapier (2 Packungen, Lina) | Zeilen „Hafermilch · 2 Packungen · von Mika“ …; Spülmittel unter „Erledigt (1)“ als „1 Flasche · Gekauft von dir“. Reihenfolge der offenen Artikel: nach Anlagezeit, älteste oben (Hafermilch, Bananen, Toilettenpapier). |
| Ausgaben | Pizzaabend 28,40 € (Mika, durch 4), Internet 29,99 € (Jona, Fixkosten monatlich), Wocheneinkauf 18,90 € (Lina), alle beglichen | Zeile „Pizzaabend · Mika zahlte 28,40 €“, rechts **„7,10 €“ + „beglichen“** (dein Anteil). Zahlst du selbst: „Internet · Du zahltest 29,99 €“, rechts „22,49 €“ (was die anderen dir schulden). Fixkosten teilen 29,99 € als 7,50 / 7,50 / 7,50 / 7,49. |
| Putzplan | Bad putzen (Lea, heute, wöchentlich), Küche wischen (Mika, morgen), Müll runterbringen (Lina, alle 3 T.), Flur saugen (Jona, in 4 T.) | Beschreibungen „heute fällig · wöchentlich“, „morgen · wöchentlich“, „in 2 T. · alle 3 T.“, „in 4 T. · wöchentlich“. Nach „Erledigt bestätigen“ rotiert die Zuständigkeit (Bad putzen → Mika). |
| Pinnwand | „Übergabe am Freitag / Schlüssel liegen im Flur bereit.“ (Jona, Info, vor 5 Std) | Karte mit Avatar JO, „Jona · vor 5 Std · Info“, Text 14 px/21, „Gesehen“, Kommentar-Symbol. Erscheint auch in „Für dich“ auf dem Start. |
| Chat | Mika „Pizza heute Abend?“, Jona „Bin dabei.“ (Antwort darauf), Lea „Bin um acht wieder da.“ | Uhrzeiten = Aufnahmezeit minus 62 / 41 / 14 Minuten (Mono, 12 px). Die eigene Nachricht ist schwarz und rechts. |
| Vorräte | Toilettenpapier 2 Packung (ab 1), Müllbeutel 3 Rolle (ab 1), Spülmittel 2 Stück (ab 1) | Gruppen Bad / Küche / Putzmittel, „2 Packung · Nachkaufen ab 1“. |
| Kalender | „Putzplan-Check“ am nächsten Freitag 18:00–19:00 (Mika) | Agenda-Zeile „Fr 9 · Putzplan-Check · 18:00–19:00“. |

Datums- und Zeittexte („Heute“, „Morgen“, „Do., 8. Okt.“, „vor 25 Min“, „Dienstag, 06. Oktober“, Uhrzeiten im Chat) sind **relativ zur Aufnahmezeit** (Di, 06.10.2026, ca. 17 Uhr). In der Landing müssen sie fest geschrieben werden, z. B. „Heute“, „Morgen“, „Fr., 9. Okt. · 18:00“.

Native Felder (Termin-Beginn/-Ende) zeigen im Chromium-Test US-Format („10/06/2026, 06:00 PM“). Auf iPhone/Android erscheint dort das deutsche Systemformat; für die Landing deshalb „06.10.2026, 18:00“ setzen.

## 4. Rahmen und Grundgerüst

Maße bei 390 px Viewportbreite (Root-Schrift `html { font-size: 90% }` = **14,4 px**, `1rem` = 14,4 px; `body` 12,6 px/18,9 px; Features `"cv11","kern","ss01"`).

| Element | Maße / Stil |
|---|---|
| Rahmen | `--app-frame-width: 27rem` = **388,8 px**, mittig (0,6 px Rand je Seite bei 390). `body` `#ffffff`, `html` `--app-backdrop` `#f5f5f5` (dunkel `#0a0a0a`). Auf breiteren Fenstern bleibt die Spalte stehen. |
| Kopf `header` | sticky, 40 px hoch (Padding oben 4, Zeile 36), Seitenrand 16. Marke 24 × 24 bei x 16,6; Titel `h1` bei x 48,6: Inter Tight 600, 18/25,2 px, Laufweite −0,54 px (−0,03 em). Rechts `a` 32 × 32, Radius 9, Icons 16 px Strich 1,5: Chat bei x 301,4, Konto bei x 341,4. Auf der öffentlichen Startseite statt dessen „ManaWG“ + Text „Anmelden“ (Zeilen 42–53). |
| Inhalt `main` | Padding 12 16, vertikaler Abstand 12 px (`gap`), Inhaltsbreite 356,8 px. Unten `padding-bottom` 64,4 px (Tabbar 57,2 inkl. 7,2 Luft + 7,2 Abstand). |
| SubNav (Segmented) | `ul` 356,8 × 36, Padding 2, Gap 2, Hintergrund `#f5f5f5`, Radius 9. Eintrag 32 hoch, Radius 7,2, Text Inter 12/500, Aktiv: Hintergrund `#fff`, **1-px-Ring** `#e5e5e5` (kein Schatten), Inaktiv Text `#090909bf`. Zähler (Einkäufe „3“) Inter 12/500, `#737373`, tabular. Putzplan·Einkäufe·Vorräte je 116,3 breit; Ausgaben·Fixkosten je 175,4; Pinnwand·Chat·Kalender je 116,3. |
| Tabbar `nav` | fixed unten, 388,8 × 57,2 (50 Hülle + 7,2 Luft), innen Hülle bei x 8,6: 372,8 × 50, Rand 1 px `#e5e5e5`, Radius **20**, Hintergrund `#fff`; Liste Padding 2, Gap 2; Einträge 90,2 × 44, Radius 14, Icon 18 px (Strich 1,5) über Label 11/16, 500, Inaktiv `#0a0a0ab3`. Aktiv: Hintergrund `#fffffff5`, Schatten `inset 0 0 0 1px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.12)`. Icons: `house`, `list-checks`, `receipt`, `megaphone`. |
| FAB | 44 × 44, `#171717`, Text `#fafafa`, Radius 9, Icon `plus` 16 px; rechts 16 px vom Rahmenrand, Unterkante **64,4 px** über dem Bildschirmrand (x 329,4 / y 735,6). Nur auf Listen mit Anlegen-Funktion; auf Start, Chat und Einkäufen nicht. |
| Listenkarte | `ul`/`div` mit Rand 1 px `#e5e5e5`, Radius **12,6**, Zeilen durch 1-px-Linien `#e5e5e5` getrennt. Zeile: Padding 3,6 6 3,6 12 (Item) bzw. 0 8 (Start), Gap 8. Titel Inter 14/500, Beschreibung Inter 12/400 `#737373` (Zeilenhöhe 15–16,2), Chevron `chevron-right` 16 px `#737373`. Zeilenhöhe Einkauf 44,7, Start 49,3. |
| Abschnittstitel | Start: `h2` Inter Tight 600 14,4/18 `#0a0a0a` („Für dich“, „Diese Woche“); Listen: `h2/h3` Inter Tight 500 12,6/18 oder 12/17,1 `#737373` („Diese Woche“, „Letzte Woche“, „Salden“). |
| Buttons | Höhe **32** (sichtbar), Radius 9, Text Inter 12,6/500, Padding 0 10. Primär `#171717`/`#fafafa`, Outline weiß mit Rand `#e5e5e5`, Ghost ohne Rand (`#737373`), Destruktiv Hintergrund `#e2000a1a`, Text `#e7000b`. Dialog-Knöpfe und Eingaben 44 hoch. Runde Haken im Putzplan 32 × 32 (Radius voll). |
| Eingaben | `input`/`textarea` 44 hoch (Formulare 42), Radius 9, Rand 1 px `#8f8f8f`, Schrift 16/24 (iOS ohne Zoom), Padding 4 10; Fokus: 3-px-Ring `ring/50`. Beträge in JetBrains Mono 500 16/24 mit „€“ rechts. Select 358 × 44 mit `chevron-down`. Label Inter 13/500. |
| Dialog (zentriert) | Breite 345,6 (Rahmen − 2 × 1,5 rem), Radius 12,6, Padding 16, Gap 16, Ring `0 0 0 1px oklab(.145 0 0/.1)`, Overlay `#00000066` (schwarz 40 %). Titel Inter Tight 500 14,4/21,6 zentriert, Text Inter 12,6 `#737373`. Zwei volle Buttons 44 hoch untereinander. |
| Sheet (von unten) | Breite 388,8, Radius 12,6 12,6 0 0, Rand oben 1 px `#e5e5e5`, Griff 12 px hoch (Pille), Inhalt Padding 16. Karten-Sheets (Artikelaktionen) 189 px hoch; Formular-Sheets bis fast Vollbild. |
| Vollbild-Formular | Ausgabe hinzufügen: `dialog-content` 390 × 844, Kopf 54,8 (Pfeil `arrow-left`, Titel Inter Tight 600 14,4), Felder je Label (13/500) + Feld, Aufteilung als Segmented (358 × 36), Fuß mit „Speichern“ (358 × 32 schwarz) und „Abbrechen“. |
| Meldungen | `[data-slot=alert]` Radius 9, Padding 8 10, Text Inter 12,6/18. Erfolg: Hintergrund `#e5f0e9`, Rand `#a5c4af`. Hinweiskarte (Beleg erfassen): weiß, Rand `#e5e5e5`, Icon `receipt` 16, Text 12 `#737373`, Links als Outline-Buttons 32 hoch. Fehler: roter Text mit rotem Kreis-X-Icon (z. B. „Prüfung fehlgeschlagen. Versuche es gleich erneut.“) und ×. |
| Chat | Bubble Radius 16,2, Padding 6 12, Text Inter 14/19,25; fremd Hintergrund `#f5f5f5`, Text `#171717` (links), eigen `#171717`/`#fafafa` (rechts); Zitat-Kasten Radius 7,2, Hintergrund `#ffffff0d`, links Strich; Uhrzeit Inter 12 tabular; Absender Inter 12/500 `#737373`; Datumstrenner 12 `#737373` mit Linien. Eingabe 307 × 44 (Pille), Senden 44 × 32 (rund, `#f5f5f5`, aktiv schwarz). |
| Avatar | rund, **28 px** (Putzplan, Ausgaben, Pinnwand, Fixkosten; Initialen Inter 12/500) oder **24 px** (Salden, Aufteilungen; Initialen 11/500), Rand 1 px; Farben `color-mix(in oklab, oklch(.62 .14 H) 24%, var(--background))` (Hintergrund), 40 % (Rand), 60 % mit `--foreground` (Schrift). Mika `#e8e1c8`/`#d8cda4`/`#5e4f09`, Lina/Jona/Lea `#f7d9d6`/`#f0c0bb`/`#773c38` (hell). |
| Skeleton | graue Blöcke `#f5f5f5`, Radius 9, Animation `pulse` 2 s `cubic-bezier(.4,0,.6,1)` unendlich. |

Messwerte je Komponente und Bildschirm (Position, Padding, Gap, Farben, Rand, Radius, Schatten, Schrift): [`measurements.md`](measurements.md). Die Selektoren sind heuristisch, im Zweifel das DOM der Standalone-HTML nehmen.

## 5. Design-Tokens

Variablen auf `:root` (hell) und `.dark`. Alles neutral (OKLCH ohne Chroma), Radius-Basis `--radius: .625rem` (9 px).

| Token | hell | dunkel | OKLCH (hell) | Verwendung |
|---|---|---|---|---|
| `--background` | `#ffffff` | `#0a0a0a` | `oklch(100% 0 0)` | Seitenhintergrund |
| `--foreground` | `#0a0a0a` | `#fafafa` | `oklch(14.5% 0 0)` | Text |
| `--card` | `#ffffff` | `#171717` | `oklch(100% 0 0)` | Karten, Dialoge |
| `--primary` | `#171717` | `#e5e5e5` | `oklch(20.5% 0 0)` | schwarze Buttons, FAB, eigene Chat-Bubble, aktiver Haken |
| `--primary-foreground` | `#fafafa` | `#171717` | `oklch(98.5% 0 0)` | Text auf Primär |
| `--secondary` | `#f5f5f5` | `#262626` | `oklch(97% 0 0)` | Segmented-Grund, Chat-Bubble fremd |
| `--muted` | `#f5f5f5` | `#262626` | `oklch(97% 0 0)` | Skeleton, Segmented, Senden-Knopf |
| `--muted-foreground` | `#737373` | `#a1a1a1` | `oklch(55.6% 0 0)` | Beschreibungen, Labels, Chevrons |
| `--accent` | `#f5f5f5` | `#262626` | `oklch(97% 0 0)` | Hover/aktive Zeilen |
| `--destructive` | `#e7000b` | `#ff6467` | `oklch(57.7% .245 27.325)` | Löschen, Fehler |
| `--border` | `#e5e5e5` | `#f5ffff1a` | `oklch(92.2% 0 0)` | Karten- und Listenlinien, Tabbar-Rand |
| `--input` | `#8f8f8f` | `#ffffff26` | `oklch(65% 0 0)` | Rand von Eingaben/Select |
| `--ring` | `#737373` | `#737373` | `oklch(55.6% 0 0)` | Fokus |
| `--settled` | `#14874e` | `#47b877` | `oklch(55% .13 155)` | Beträge „du bekommst“ (grün) |
| `--text-2` | `#525252` | `#a1a1a1` | `oklch(43.9% 0 0)` | Sekundärtext (selten genutzt) |
| `--border-strong` | `#07070724` | `#f9f9f929` | `oklch(14.5% 0 0/.14)` | stärkerer Rand |
| `--app-backdrop` | `#f5f5f5` | `#0a0a0a` | `oklch(97% 0 0)` | Fläche neben der Handy-Spalte |

Radien: Karten 12,6 px, Buttons/Felder/Segmented 9 px, SubNav-Aktiv 7,2 px, Tabbar-Hülle 20 px, Tabbar-Eintrag 14 px, Chat-Bubble 16,2 px, Pillen (Badge) 23,4 px, Avatare/Haken voll.
Schatten gibt es kaum: Tabbar-Aktiv (s. §4), Ringe als `box-shadow: 0 0 0 1px` (Dialog, Segmented-Aktiv). Karten haben **keinen** Schatten, nur 1-px-Rand.

### Typografie

Schriften (woff2, nur `latin`, SIL OFL, in `fonts/`): **Inter** (variabel 100–900, Fließtext), **Inter Tight** (variabel 100–900, Überschriften, Weight 500–600), **JetBrains Mono** (100–800, Beträge/Zahlen/Status/Uhrzeiten). Features auf `body`: `"cv11", "kern", "ss01"`. Gebrauchte Stufen (Familie Größe/Zeilenhöhe Gewicht Farbe), nach Häufigkeit:

| Familie | Größe / Zeile | Gewicht | Farbe | Laufweite | Beispiele | Häufigkeit |
|---|---|---|---|---|---|---|
| Inter | 12px / 18px | 400 | `#737373` | – | Pinnwand offen · WG · 3 offene Artikel · Heute | 213 |
| Inter | 11px / 16px | 500 | `#0a0a0ab3` | – | Haushalt · Finanzen · Austausch | 148 |
| Inter | 12.6px / 18px | 500 | `#0a0a0a` | – | So wird verteilt · Eintragen · Schnell nachfüllen | 106 |
| Inter | 14px / 19.25px | 500 | `#0a0a0a` | – | Übergabe am Freitag Schlüs · Hafermilch fehlt noch · Bad putzen | 94 |
| Inter | 12px / 15px | 400 | `#737373` | – | heute fällig · wöchentlich · morgen | 94 |
| Inter | 12px / 16.2px | 400 | `#737373` | – | 2 Packungen · von Mika · 6 Stück · von Lea · 2 Packungen · von Lina | 91 |
| Inter | 12px / 17.1429px | 500 | `#090909bf` | – | Einkäufe · Vorräte · Putzplan | 63 |
| Inter | 12px / 17.1429px | 400 | `#737373` | – | Beleg für · Artikel als Ausgabe erfass · beglichen | 59 |
| Inter | 14px / 17.5px | 500 | `#0a0a0a` | – | Bad putzen · Küche wischen · Müll runterbringen | 54 |
| Inter Tight | 12.6px / 18px | 500 | `#737373` | – | Diese Woche · Bad · Küche | 53 |
| Inter | 12.6px / 18px | 400 | `#0a0a0a` | – | Mika · Lina · Lea | 52 |
| Inter Tight | 18px / 25.2px | 600 | `#0a0a0a` | -0.54px | WG Lindenstraße | 49 |
| Inter | 11px / 16px | 500 | `#0a0a0a` | – | Start · Haushalt · Finanzen | 48 |
| Inter | 12.6px / 18px | 500 | `#737373` | – | Kalender · Erledigte entfernen · Ausgabe erfassen | 44 |
| Inter | 12px / 17.1429px | 500 | `#773c38` | – |  | 41 |
| Inter | 12px / 17.1429px | 500 | `#0a0a0a` | – | Putzplan · Einkäufe · Vorräte | 40 |
| Inter | 12.6px / 18px | 400 | `#737373` | – | Danach ist Mika dran. · Lässt sich nicht rückgängi · 2 Packungen · | 35 |
| Inter Tight | 14.4px / 18px | 600 | `#0a0a0a` | – | Für dich · Diese Woche · Neu in deiner WG | 33 |
| JetBrains Mono | 12.6px / 18px | 500 | `#737373` | – | ausgeglichen · 24,00 € | 31 |
| Inter | 11px / 15.7143px | 500 | `#773c38` | – |  | 30 |
| JetBrains Mono | 14px / 19.25px | 500 | `#737373` | – | 7,10 € · 22,49 € · 4,72 € | 28 |
| Inter | 13px / 17.875px | 500 | `#0a0a0a` | – | Beschreibung · Betrag · Bezahlt von | 28 |
| Inter Tight | 12.6px / 18px | 500 | `#0a0a0a` | – | Diesen Monat · Abwesenheiten · Oktober 2026 | 24 |
| Inter Tight | 12px / 18px | 500 | `#737373` | – | Diese Woche · Letzte Woche | 18 |
| Inter | 12px / 17.1429px | 500 | `#5e4f09` | – |  | 16 |
| Inter | 12px / 16px | 400 | `#737373` | – | Dienstag, 06. Oktober · JPG, PNG, WebP, HEIC · max · Bin um acht wieder da. | 16 |
| Inter | 12px / 12px | 500 | `#737373` | – |  | 15 |
| Inter | 12px / 18px | 500 | `#737373` | – | Erledigt ( | 15 |
| Inter | 12.6px / 18px | 500 | `#fafafa` | – | Erledigt · bestätigen · Speichern | 14 |
| Inter Tight | 12px / 17.1429px | 500 | `#737373` | – | Salden · So wird ausgeglichen | 12 |

## 6. Icons

`lucide-react` 0.511, durchgehend **Strichstärke 1,5 px** (nicht der Standard 2), Größe 16 px (Listen, Buttons), 18 px (Tabbar), 14 px (kleine Statusicons), Farbe `currentColor`.

| Icon (lucide) | Größe px | Verwendung |
|---|---|---|
| `chevron-right` | 16 | Zeilen, „Kalender ›“ |
| `ellipsis` | 16 | „…“-Menü an Zeilen |
| `receipt` | 16, 18 | Tabbar „Finanzen“, Beleg-Hinweis, Aktivität |
| `megaphone` | 16, 18 | Tabbar „Austausch“, Pinnwand-Zeile |
| `list-checks` | 16, 18 | Tabbar „Haushalt“, Start „Hafermilch fehlt noch“ |
| `house` | 18 | Tabbar „Start“ |
| `message-circle` | 14, 16 | Kopf rechts (Chat), Kommentar-Knopf |
| `user-round` | 16 | Kopf rechts (Konto/Einstellungen) |
| `plus` | 16 | FAB, Hinzufügen, Stepper + |
| `chevron-down` | 14, 15.2, 16 | Select, Ausklapper (zeigt nach oben, wenn offen) |
| `sparkles` | 16 | Putzplan-Zeile auf dem Start |
| `check` | 14, 16 | Haken (Putzplan, Checkbox) |
| `trash-2` | 16 | Löschen/Entfernen |
| `calendar-days` | 16 | Kalender (Termine, Monat) |
| `pencil` | 16 | Bearbeiten |
| `minus` | 16 | Stepper − |
| `bell` | 14, 16 | Erinnerungen, „Erinnern“ |
| `file-input` | 14 | Ausgaben importieren |
| `send` | 16 | Senden im Chat |
| `x` | 16 | Schließen / Hinweis ausblenden |
| `download` | 16 | „App installieren“ |
| `zap` | 16 | „Schnell nachfüllen“ |
| `repeat-2` | 16 | Fixkosten-Vorlage |
| `eye` | 14 | „Gesehen“ |
| `list` | 16 | Kalender-Umschalter Agenda |
| `arrow-left` | 16 | Zurück im Vollbild-Formular |
| `calendar-clock` | 16 | Termin mit Uhrzeit |
| `image-plus` | 16, 24 | Bild anhängen / Beleg |
| `smile` | 16 | Menü „Reagieren“ |
| `reply` | 16 | Menü „Antworten“ |
| `copy` | 16 | Menü „Kopieren“ |
| `chevron-left` | 16 |  |
| `wallet` | 16 | Finanzen (Hinweis) |
| `circle-check-big` | 16 | Erfolg im Hinweis |
| `package` | 16 | Vorrat (öffentliche Seite) |
| `clock-3` | 16 | Uhrzeit |
| `shopping-basket` | 16 | „Einkaufsliste öffnen“ |
| `sun` | 16 | Theme Hell |
| `moon` | 16 | Theme Dunkel |
| `monitor` | 16 | Theme System |
| `hand` | 16 | „Ich übernehme“ |
| `message-square-more` | 16 | „Tausch auf der Pinnwand anfragen“ |
| `pause` | 16 | „Pausieren“ |
| Google-„G“ | 16 | „Mit Google anmelden“ (eigene SVG, vierfarbig) |

Die Marke (`LogoMark`, Metaball aus 8 Kreisen mit Goo-Filter und Loch) ist in `brand/manawg-mark.svg`. Im Kopf 24 px ohne Kachel (Farbe `currentColor`), im Installationshinweis mit schwarzer Kachel. Ladezustand `loading`: die 7 Satelliten ziehen in 1,2 s (`cubic-bezier(.22,1,.36,1)`, endlos) zum Kern und zurück, der Kern pulsiert 1 → 1,06.

## 7. Bewegung (gemessen)

Gemessen über `transitionrun`/`animationstart` und berechnete Stile (`tools/motion.mjs`, Rohdaten in `motion.json`):

| Interaktion | Element | Eigenschaft | Dauer | Kurve |
|---|---|---|---|---|
| Dialog öffnet | `div[alert-dialog-overlay]` | enter (Deckkraft 0 → 1) | 200 ms | ease |
| Dialog öffnet | `div[alert-dialog-content]` | enter (Deckkraft 0 → 1, 8 px von unten (`translateY`)) | 220 ms | ease |
| Dialog schließt | `div[alert-dialog-content]` | exit (Deckkraft 1 → 0) | 220 ms | ease |
| Vollbild-Formular öffnet | `div[dialog-content]` | enter (Deckkraft 0 → 1, 8 px von unten (`translateY`)) | 220 ms | ease |
| Sheet öffnet | `div[drawer-overlay]` | opacity | 300 ms | `(.32,.72,0,1)` |
| Sheet öffnet | `div[drawer-popup]` | transform | 300 ms | `(.22,1,.36,1)` |
| Sheet schließt | `div[drawer-popup]` | transform | 400 ms | `(.22,1,.36,1)` |
| Sheet schließt | `div[drawer-overlay]` | opacity | 400 ms | `(.32,.72,0,1)` |
| Tabbar-Wechsel | `a` | background-color | 120 ms | Standard `(.4,0,.2,1)` |
| SubNav-Wechsel | `a` | background-color | 150 ms | Standard `(.4,0,.2,1)` |
| Antippen eines Buttons | `button[button]` | background-color | 80 ms | ease-out `(0,0,.2,1)` |
| Fokus in ein Feld | `input[input-group-control]` | border-color | 150 ms | Standard `(.4,0,.2,1)` |
| Ladezustand | `div[skeleton]` | pulse | 2000 ms | `(.4,0,.6,1)` |
| Hinweis im Putzplan („Bad putzen erledigt …“) | Toast mit × | Lebensdauer | 4000 ms (gemessen 4058 ms, `toast-progress` linear) | – |
| Logo-Marke im Ladezustand | `svg.loading` | Satelliten ziehen zum Kern | 1200 ms endlos | `(.22,1,.36,1)` |

Die 80 ms bei Buttons sind `duration-[80ms]` mit ease-out. Druckzustand: nur `active:bg-*` (primär `bg-primary/90`, Ghost `bg-foreground/5`, Sekundär `bg-secondary/80`, destruktiv `bg-destructive/30`), keine Skalierung. Standard-Übergang der App `--default-transition-duration: .15s` mit `(.4,0,.2,1)`.

Weitere Regeln: Elemente zucken beim Tippen **nicht** (keine Skalierung), nur die Hintergrundfarbe wechselt in 80 ms. Das Abhaken im Einkauf hat keine eigene Animation (die Zeile springt sofort nach „Erledigt“). Im Putzplan öffnet zuerst der Dialog; nach „Erledigt bestätigen“ aktualisiert sich die Liste und ein Toast steht 4 s unten. Die Meldung auf der Ausgaben-Seite („Ausgabe gespeichert …“, „Zahlung eingetragen …“) ist eine feste Alert-Zeile oben im Inhalt und bleibt stehen (nach 14 s noch da). Skeleton: `pulse` 2 s (Deckkraft 1 → 0,5 → 1). Seitenwechsel per Tabbar/SubNav hat keine Übergangsanimation (neuer Inhalt ersetzt den alten, beim ersten Besuch eines Tabs kurz Skeleton).

## 8. Zustände (Bilder)

`img/NN-name.webp`: Stufe A (2×, 780 px breit) für die Hauptzustände, 585 px für Nebenzustände, 390 px für die öffentlichen Seiten (42–53). Alle Bilder sind 390 × 844 CSS-px große Ausschnitte der Aufnahme mit DPR 3 (Originale 1170 × 2532; Neuaufnahme mit `tools/capture.mjs`). Spalte HTML: Standalone-Dokument vorhanden. Die genauen Texte jedes Bildes stehen in [`texts.md`](texts.md), die Tap-Ziele (Rechtecke in CSS-px) in [`states.json`](states.json) unter `ziele`.

| Nr | Zustand | Route (`/wg/MTE8PZAT` + …; öffentliche Seiten absolut) | Bild | HTML | Was man sieht |
|---|---|---|---|---|---|
| 01 | Start | `/` | [webp](img/01-start.webp) | [html](screens/01-start.html) | Ausgangszustand der Landing: Spülmittel ist schon erledigt, alle Salden 0,00 €. Blöcke „Für dich“ (Pinnwand-Eintrag, Einkauf), „Diese Woche“ (Putzplan, Termin) und „Neu in deiner WG“ (eingeklappt). |
| 02 | Start, „Neu in deiner WG“ offen | `/` | [webp](img/02-start-neu-in-der-wg.webp) | [html](screens/02-start-neu-in-der-wg.html) | Aktivitätsliste (Wocheneinkauf von Lina, Pizzaabend von Mika, Beträge in JetBrains Mono) und Link „Gesamte Aktivität“. |
| 03 | Haushalt › Putzplan | `/putzen` | [webp](img/03-haushalt-putzplan.webp) | [html](screens/03-haushalt-putzplan.html) | Vier Aufgaben mit Avatar, Beschreibung und rundem 32-px-Haken (schwarz gefüllt = heute fällig). Karte „Diesen Monat · Als Nächstes dran“ mit Ausklapper „So wird verteilt“, Zeile „Abwesenheiten“. |
| 04 | Haushalt › Einkäufe | `/einkauf` | [webp](img/04-haushalt-einkaeufe.webp) | [html](screens/04-haushalt-einkaeufe.html) | Drei offene Artikel (Hafermilch, Bananen, Toilettenpapier), „Erledigt (1)“ zugeklappt (Spülmittel), Karte „Beleg für 1 Artikel als Ausgabe erfassen?“, Eingabezeile „z. B. 2 Hafermilch“ mit +-Knopf am unteren Rand. |
| 05 | Haushalt › Vorräte | `/vorraete` | [webp](img/05-haushalt-vorraete.webp) | [html](screens/05-haushalt-vorraete.html) | Gruppen „Bad (1)“, „Küche (1)“, „Putzmittel (1)“; je Zeile − / + / Stift / Papierkorb; Knopf „Schnell nachfüllen“; FAB. |
| 06 | Finanzen › Ausgaben | `/ausgaben` | [webp](img/06-finanzen-ausgaben.webp) | [html](screens/06-finanzen-ausgaben.html) | Karte „Dein Saldo · Du bist ausgeglichen“ mit Glocke, Salden je Person („ausgeglichen“ in Mono), Gruppen „Diese Woche“ / „Letzte Woche“, Link „Ausgaben importieren“, FAB. |
| 07 | Finanzen › Fixkosten | `/abos` | [webp](img/07-finanzen-fixkosten.webp) | [html](screens/07-finanzen-fixkosten.html) | Kennzahlen „Pro Monat 29,99 €“ und „Dein Anteil 7,50 €“, Zeile „Internet“ (nächste Buchung am 03.11., monatlich, du). |
| 08 | Austausch › Pinnwand | `/pinnwand` | [webp](img/08-austausch-pinnwand.webp) | [html](screens/08-austausch-pinnwand.html) | Beitrag von Jona („vor 5 Std · Info“): „Übergabe am Freitag / Schlüssel liegen im Flur bereit.“ mit „Gesehen“ und Kommentar-Symbol; FAB. |
| 09 | Austausch › Chat | `/chat` | [webp](img/09-austausch-chat.webp) | [html](screens/09-austausch-chat.html) | Datumstrenner, Mika (grau, links, mit Avatar), Jona (schwarz, rechts, mit Zitat), Lea; Eingabe „Nachricht schreiben“ mit Senden-Knopf. Uhrzeiten richten sich nach der Aufnahmezeit. |
| 10 | Austausch › Kalender (Agenda) | `/kalender` | [webp](img/10-austausch-kalender.webp) | [html](screens/10-austausch-kalender.html) | Tagesgruppen mit Datumsspalte, Einträge aus Putzplan und Terminen („Putzplan-Check Fr. 18:00–19:00“), Umschalter Agenda/Monat, „Kalender abonnieren“. |
| 11 | Putzplan, Bestätigungsdialog | `/putzen` | [webp](img/11-putzplan-erledigen-dialog.webp) | [html](screens/11-putzplan-erledigen-dialog.html) | Antippen des runden Hakens bei „Bad putzen“: zentrierter Dialog „„Bad putzen“ erledigt?“ mit „Danach ist Mika dran. Lässt sich nicht rückgängig machen.“, Knöpfe „Erledigt bestätigen“ / „Abbrechen“. |
| 12 | Einkäufe, Eingabe getippt | `/einkauf` | [webp](img/12-einkaeufe-artikel-eingabe.webp) | – | „2 Hafermilch“ im Eingabefeld, Fokusring, +-Knopf wird schwarz. |
| 13 | Einkäufe, Artikelaktionen | `/einkauf` | [webp](img/13-einkaeufe-artikelaktionen.webp) | – | „…“ bei einem Artikel öffnet das Sheet „Hafermilch · 2 Packungen · Hinzugefügt von Mika“ mit „Artikel entfernen“ (rot getönt) und „Schließen“. |
| 14 | Vorräte, Schnell nachfüllen | `/vorraete` | [webp](img/14-vorraete-schnell-nachfuellen.webp) | – | Sheet „Schnell nachfüllen“: häufig verbrauchte Vorräte mit „+1“ (Toilettenpapier, 2× in 30 Tagen). |
| 15 | Ausgabe hinzufügen, leer | `/ausgaben` | [webp](img/15-ausgabe-hinzufuegen-leer.webp) | – | Vollbild-Formular (Pfeil links, Titel): Beschreibung, Betrag (€), Bezahlt von „Jona (du)“, Beteiligte & Aufteilung (Gleichmäßig/Manuell), „Beleg hinzufügen“, „Fixkosten-Vorlage“, „Speichern“ / „Abbrechen“. |
| 16 | Ausgabe hinzufügen, Kinoabend | `/ausgaben` | [webp](img/16-ausgabe-hinzufuegen-kinoabend.webp) | [html](screens/16-ausgabe-hinzufuegen-kinoabend.html) | Ausgefüllt: Kinoabend, 24,00 €, Jona bezahlt, Aufteilung „Manuell“: Mika 0,00, Lina 0,00, Jona 12,00, Lea 12,00; Zeile „Summe: 24,00 € ✓ Ausgeglichen“. |
| 17 | Pinnwand, Beitrag erstellen | `/pinnwand` | [webp](img/17-pinnwand-beitrag-erstellen.webp) | – | Sheet „Neuer Beitrag“: Typ-Chips Info/Frage/Problem/Bitte/Entscheidung, Textfeld „Was gibt es Neues, Jona?“, „Bild anhängen“, „Posten“. |
| 18 | Chat, Nachrichtenmenü | `/chat` | [webp](img/18-chat-nachrichtenmenue.webp) | [html](screens/18-chat-nachrichtenmenue.html) | Antippen von Leas Nachricht: Menü Reagieren / Antworten / Kopieren / Löschen (rot). |
| 19 | Kalender › Monat | `/kalender` | [webp](img/19-kalender-monat.webp) | – | Monatsraster Oktober 2026, heute (6.) markiert, Punkte unter Tagen mit Terminen, „Kalender abonnieren“. |
| 20 | Kalender, Termin erstellen | `/kalender` | [webp](img/20-kalender-termin-erstellen.webp) | – | Sheet „Neuer Termin“: Vorlagen-Chips, Titel, Ganztägig, Beginn/Ende (native Felder), Ort, Wiederholung, Notiz, „Termin speichern“. |
| 21 | Einkäufe nach dem Abhaken | `/einkauf` | [webp](img/21-einkaeufe-nach-abhaken.webp) | [html](screens/21-einkaeufe-nach-abhaken.html) | Hafermilch abgehakt: 2 offen, „Erledigt (2)“ zugeklappt, Karte „Beleg für 2 Artikel als Ausgabe erfassen?“. Die Zeile verschwindet sofort aus der offenen Liste (keine Animation). |
| 22 | Einkäufe, „Erledigt“ offen | `/einkauf` | [webp](img/22-einkaeufe-nach-abhaken-erledigt-offen.webp) | – | „Erledigt (2)“ aufgeklappt: Hafermilch und Spülmittel durchgestrichen mit schwarzem Haken, „Gekauft von dir“, Link „Erledigte entfernen“. |
| 23 | Start nach dem Abhaken | `/` | [webp](img/23-start-nach-abhaken.webp) | [html](screens/23-start-nach-abhaken.html) | „Bananen fehlt noch · WG · 2 offene Artikel“ (vorher Hafermilch, 3 offene Artikel). |
| 24 | Ausgaben nach dem Speichern (mit Meldung) | `/ausgaben` | [webp](img/24-ausgaben-nach-speichern-meldung.webp) | [html](screens/24-ausgaben-nach-speichern-meldung.html) | Grüne Meldung „Ausgabe gespeichert. Hier wird kein Geld überwiesen.“, Saldo „Du bekommst 12,00 €“ (grün, Mono), Lea −12,00 €, „So wird ausgeglichen: Lea schuldet dir 12,00 €“ mit „Ausgleichen“ und „Erinnern“, Kinoabend oben in „Diese Woche“. |
| 26 | Ausgaben nach dem Speichern (neu geladen) | `/ausgaben` | [webp](img/26-ausgaben-nach-speichern.webp) | – | Wie 24, ohne Meldung. |
| 27 | Start nach der Ausgabe | `/` | [webp](img/27-start-nach-ausgabe.webp) | [html](screens/27-start-nach-ausgabe.html) | In „Für dich“ neue Zeile „Von Lea · Du bekommst · +12,00 €“. |
| 28 | Chat, Antwort vorbereitet | `/chat` | [webp](img/28-chat-antwort-vorbereitet.webp) | – | Nach „Antworten“: Leiste „Antwort an Lea · Bin um acht wieder da.“ mit × über der Eingabe. |
| 29 | Chat, Antwort getippt | `/chat` | [webp](img/29-chat-antwort-getippt.webp) | – | „Passt, ich bin auch da.“ im Feld; Senden-Knopf wird schwarz. |
| 30 | Chat nach dem Senden | `/chat` | [webp](img/30-chat-nach-antwort.webp) | [html](screens/30-chat-nach-antwort.html) | Neue schwarze Bubble mit Zitat „↪ Lea · Bin um acht wieder da.“ und Text „Passt, ich bin auch da.“, Uhrzeit rechts. |
| 31 | Putzplan nach dem Erledigen | `/putzen` | [webp](img/31-putzplan-nach-erledigen.webp) | [html](screens/31-putzplan-nach-erledigen.html) | Bad putzen springt auf „in 7 T.“, Mika ist dran, Karte „Diesen Monat“ mit Fortschrittsbalken „Du: 100 % (1)“, Hinweis „Bad putzen erledigt. Nächster Termin: 13.10.; Mika ist dran (Rotation).“ mit ×. |
| 32 | Start nach dem Erledigen | `/` | [webp](img/32-start-nach-erledigen.webp) | [html](screens/32-start-nach-erledigen.html) | „Bad putzen“ ist aus „Diese Woche“ verschwunden; „Küche wischen · Morgen · Mika“ steht oben. |
| 33 | Pinnwand, Kommentarfeld | `/pinnwand` | [webp](img/33-pinnwand-kommentieren.webp) | – | Kommentar-Symbol öffnet das Feld „Antwort schreiben“ unter dem Beitrag. |
| 34 | Start beim Laden | `/` | [webp](img/34-start-laedt.webp) | – | Skeleton-Blöcke (Puls 2 s) statt „Für dich“, Text „Putzplan-Aufgaben werden geladen …“ (Dashboard-Antwort um 8 s verzögert). |
| 35 | Start mit Installationshinweis (iOS) | `/` | [webp](img/35-start-installhinweis-ios.webp) | [html](screens/35-start-installhinweis-ios.html) | Karte „ManaWG als App installieren · Schneller starten, offline-fähig.“ mit Marke, ×, Knopf „So installierst du ManaWG“. Erscheint über der Tabbar, bis sie geschlossen wird. |
| 36 | Start mit Installationshinweis (Android) | `/` | [webp](img/36-start-installhinweis-android.webp) | – | Identisch zu 35. |
| 37 | Installationsanleitung iOS / Safari | `/` | [webp](img/37-installanleitung-ios.webp) | [html](screens/37-installanleitung-ios.html) | Dialog: 1 In Safari auf Teilen tippen. 2 Nach unten scrollen und „Zum Home-Bildschirm“ wählen. 3 Oben rechts auf Hinzufügen tippen. „Danach startet ManaWG ohne Browser-Leiste, direkt vom Homescreen.“ |
| 38 | Installationsanleitung Android | `/` | [webp](img/38-installanleitung-android.webp) | – | Dialog: 1 In Chrome oben rechts auf ⋮ Menü tippen. 2 Wähle „App installieren“ oder „Zum Startbildschirm“. 3 Bestätigen. ManaWG liegt dann auf dem Homescreen. |
| 39 | Installationsanleitung Desktop | `/` | [webp](img/39-installanleitung-desktop.webp) | – | Dialog: 1 In der Adressleiste auf Installieren klicken. 2 Alternativ: ⋮ Menü → „ManaWG installieren“. 3 Bestätigen. ManaWG startet dann wie eine App. |
| 40 | Start, dunkel | `/` | [webp](img/40-start-dunkel.webp) | – | Dunkelmodus (prefers-color-scheme: dark, html.dark). |
| 41 | Ausgaben, dunkel | `/ausgaben` | [webp](img/41-ausgaben-dunkel.webp) | – | Dunkelmodus. |
| 42 | Öffentliche Startseite | `/` | [webp](img/42-einstieg-start.webp) | – | Nicht eingeloggt: Beispiel-Module (Ausgaben, Einkäufe, Pinnwand, Putzplan) und „WG erstellen“; Kopf „ManaWG“ + „Anmelden“. |
| 43 | Anmelden | `/neu` | [webp](img/43-einstieg-neue-wg.webp) | – | Mit Google anmelden, E-Mail-Adresse, Passwort, Anmelden / Konto erstellen. |
| 44 | Entdecken › ausgaben | `/entdecken/ausgaben` | [webp](img/44-entdecken-ausgaben.webp) | – | Öffentliche Beispielseite des Moduls (Karte „Beispiel“, Knopf „WG erstellen“). Quelle der Beispieltexte mit Mika, Lina, Jona, Lea. |
| 45 | Entdecken › einkauf | `/entdecken/einkauf` | [webp](img/45-entdecken-einkauf.webp) | – | wie 44, anderes Modul |
| 46 | Entdecken › putzen | `/entdecken/putzen` | [webp](img/46-entdecken-putzen.webp) | – | wie 44, anderes Modul |
| 47 | Entdecken › pinnwand | `/entdecken/pinnwand` | [webp](img/47-entdecken-pinnwand.webp) | – | wie 44, anderes Modul |
| 48 | Entdecken › fixkosten | `/entdecken/fixkosten` | [webp](img/48-entdecken-fixkosten.webp) | – | wie 44, anderes Modul |
| 49 | Entdecken › vorraete | `/entdecken/vorraete` | [webp](img/49-entdecken-vorraete.webp) | – | wie 44, anderes Modul |
| 50 | Entdecken › kalender | `/entdecken/kalender` | [webp](img/50-entdecken-kalender.webp) | – | wie 44, anderes Modul |
| 51 | Entdecken › chat | `/entdecken/chat` | [webp](img/51-entdecken-chat.webp) | – | wie 44, anderes Modul |
| 52 | Entdecken › aktivitaet | `/entdecken/aktivitaet` | [webp](img/52-entdecken-aktivitaet.webp) | – | wie 44, anderes Modul |
| 53 | Entdecken › mahnungen | `/entdecken/mahnungen` | [webp](img/53-entdecken-mahnungen.webp) | – | wie 44, anderes Modul |
| 54 | Ausgabenformular aus dem Einkauf | `/ausgaben` | [webp](img/54-einkaeufe-ausgabe-erfassen-vorbefuellt.webp) | – | Link „Ausgabe erfassen“ in der Einkaufs-Karte öffnet das Formular mit Beschreibung „Einkauf: Hafermilch, Spülmittel“. |
| 55 | Ausgleichen, Dialog | `/ausgaben` | [webp](img/55-ausgaben-ausgleichen-dialog.webp) | [html](screens/55-ausgaben-ausgleichen-dialog.html) | „Bereits erfolgte Zahlung bestätigen“: „Nur bestätigen, wenn Lea 12,00 € bereits an Jona gezahlt hat. Es wird kein Geld überwiesen.“, Zeile Kinoabend 06.10. 12,00 €, „Abbrechen“ / „12,00 € als bezahlt eintragen“. |
| 56 | Putzplan, „So wird verteilt“ | `/putzen` | [webp](img/56-putzplan-verteilung-offen.webp) | – | Regeln „Wenigste Last zuerst, niemand direkt doppelt“, „Nach Erledigung neu berechnet, Abwesende übersprungen.“ und Aufgabenanzahl je Person. |
| 57 | Vorräte nach „−“ | `/vorraete` | [webp](img/57-vorraete-nach-minus.webp) | – | Toilettenpapier unter „Bald leer (1)“ (1 Packung), Knopf „Einkaufsliste öffnen“. |
| 58 | Ausgaben, Aktionsmenü | `/ausgaben` | [webp](img/58-ausgaben-aktionen-menue.webp) | – | „…“ bei Pizzaabend: Menü „Entfernen“ (rot). |
| 59 | Konto und WG-Einstellungen | `/einstellungen` | [webp](img/59-konto.webp) | – | Kopfsymbol rechts: Tabs Profil/Hinweise/Zugang/Daten, Dein Profil (Jona), Hell/Dunkel/System, „App installieren“, WG-Name, „Fehler per E-Mail melden“. |
| 60 | Vorräte, Neuer Vorrat | `/vorraete` | [webp](img/60-vorraete-hinzufuegen.webp) | – | Sheet „Neuer Vorrat“: Name, Menge, Nachkaufen ab, Einheit, Kategorie. |
| 61 | Putzplan, Aufgabenaktionen | `/putzen` | [webp](img/61-putzplan-aufgabenaktionen.webp) | – | Sheet „Bad putzen“: Zuständig Lea, Fällig 6.10.2026 (heute fällig), Rhythmus wöchentlich, Danach Mika; „Ich übernehme“, „Tausch auf der Pinnwand anfragen“, „Aufgabe entfernen“, „Schließen“. |
| 62 | Putzplan, Neue Putzaufgabe | `/putzen` | [webp](img/62-putzplan-aufgabe-hinzufuegen.webp) | – | Sheet „Neue Putzaufgabe“: Aufgabe, Rhythmus (Tage/Monate, Chips täglich … alle 90 T.), Zuständig, „Hinzufügen“. |
| 63 | Fixkosten, Internet aufgeklappt | `/abos` | [webp](img/63-fixkosten-aufgeklappt.webp) | – | Anteile je Person (7,50 / 7,50 / 7,50 / 7,49 €), „Nächste 3 Buchungen: 03.11., 03.12., 03.01.“, „Pausieren“, Stift, Papierkorb. |
| 64 | Ausgaben nach dem Ausgleichen | `/ausgaben` | [webp](img/64-ausgaben-nach-ausgleichen.webp) | – | Meldung „Zahlung eingetragen: 12,00 € von Lea an Jona.“, alle Salden wieder „ausgeglichen“. |
| 65 | Einkäufe, dunkel | `/einkauf` | [webp](img/65-haushalt-einkaeufe-dunkel.webp) | – | Dunkelmodus-Variante. |
| 66 | Putzplan, dunkel | `/putzen` | [webp](img/66-haushalt-putzplan-dunkel.webp) | – | Dunkelmodus-Variante. |
| 67 | Chat, dunkel | `/chat` | [webp](img/67-austausch-chat-dunkel.webp) | – | Dunkelmodus-Variante. |
| 68 | Pinnwand, dunkel | `/pinnwand` | [webp](img/68-austausch-pinnwand-dunkel.webp) | – | Dunkelmodus-Variante. |
| 69 | Ausgabe hinzufügen (Kinoabend), dunkel | `/ausgaben` | [webp](img/69-ausgabe-hinzufuegen-kinoabend-dunkel.webp) | – | Dunkelmodus-Variante. |
| 70 | Putzplan-Dialog, dunkel | `/putzen` | [webp](img/70-putzplan-erledigen-dialog-dunkel.webp) | – | Dunkelmodus-Variante. |
| 71 | Kalender, dunkel | `/kalender` | [webp](img/71-austausch-kalender-dunkel.webp) | – | Dunkelmodus-Variante. |
| 72 | Vorräte, dunkel | `/vorraete` | [webp](img/72-haushalt-vorraete-dunkel.webp) | – | Dunkelmodus-Variante. |

## 9. Interaktionsfolgen (so läuft es in der App wirklich ab)

Koordinaten sind CSS-Pixel im 390 × 844-Viewport, jeweils Mitte des Ziels und Größe der **sichtbaren** Fläche (die Klickfläche ist mindestens 44 × 44). So wird die Hand/der Finger der Landing richtig platziert.

### A. Einkauf abhaken („Hafermilch“) — Zeilen 04, 21, 22, 23, 54
1. Tabbar **Haushalt** Mitte (148.9 | 811.8), Fläche 90 × 44 → Seite `/putzen` (SubNav aktiv: Putzplan). SubNav **Einkäufe, 3 offen** Mitte (195.1 | 70.0), Fläche 116 × 32 → **04**.
2. Haken setzen: **Checkbox Hafermilch** Mitte (42.6 | 119.6), Fläche 24 × 24 → sofort **21**: Zeile weg, Tab-Zähler 3 → 2, Karte „Beleg für 2 Artikel als Ausgabe erfassen?“ erscheint (Spülmittel zählt mit).
3. Optional **„Erledigt (2)“** Mitte (195.0 | 222.4), Fläche 357 × 44 öffnen → **22** (Hafermilch, Spülmittel durchgestrichen, „Gekauft von dir“).
4. Tabbar „Start“ → **23**: „Bananen fehlt noch · WG · 2 offene Artikel“.
5. **„Ausgabe erfassen“** Mitte (117.4 | 306.5), Fläche 132 × 32 → **54**: Vollbild-Formular, Beschreibung „Einkauf: Hafermilch, Spülmittel“, Betrag leer.

### B. Ausgabe erfassen („Kinoabend“, Jona zahlt 24,00 €, Jona und Lea) — Zeilen 06, 15, 16, 24, 27, 55, 64
1. Tabbar **Finanzen** Mitte (241.1 | 811.8), Fläche 90 × 44 → **06** (SubNav aktiv: Ausgaben).
2. **FAB** Mitte (351.4 | 757.6), Fläche 44 × 44 → Vollbild-Formular **15** (Fokus im Feld Beschreibung).
3. Eintragen: **Beschreibung** Mitte (195.0 | 119.7), Fläche 356 × 42 → „Kinoabend“; **Betrag** Mitte (186.8 | 200.3), Fläche 340 × 42 → „24,00“; „Bezahlt von“ bleibt „Jona (du)“; **Manuell** Mitte (284.0 | 356.4), Fläche 176 × 32; dann **Anteil Jona in Euro** Mitte (186.8 | 599.6), Fläche 340 × 42 → „12,00“ und **Anteil Lea in Euro** Mitte (186.8 | 680.3), Fläche 340 × 42 → „12,00“ → **16** (unten „Summe: 24,00 € ✓ Ausgeglichen“).
4. **Speichern** Mitte (195.0 | 777.2), Fläche 358 × 32 → zurück auf **24**: grüne Meldung „Ausgabe gespeichert. Hier wird kein Geld überwiesen.“, Saldo „Du bekommst 12,00 €“, Lea „-12,00 €“, „Lea schuldet dir 12,00 €“, Zeile Kinoabend oben („Du zahltest 24,00 €“, rechts „12,00 €“ grün + „bekommst du“). Auf dem Start (**27**) kommt „Von Lea · Du bekommst · +12,00 €“ dazu.
5. Optional **„Ausgleichen“** Mitte (129.9 | 402.1), Fläche 97 × 32 → Dialog **55** → „12,00 € als bezahlt eintragen“ → **64** (Meldung „Zahlung eingetragen: 12,00 € von Lea an Jona.“, alle ausgeglichen).

### C. Im Chat antworten („Passt, ich bin auch da.“) — Zeilen 09, 18, 28, 29, 30
1. Tabbar **Austausch** Mitte (333.3 | 811.8), Fläche 90 × 44 → Pinnwand (**08**), SubNav **Chat** Mitte (195.1 | 70.0), Fläche 116 × 32 → **09**. (Der Chat lädt ~1–2 s, bis die Nachrichten stehen.)
2. Leas Nachricht antippen: **Bubble „Bin um acht wieder da.“** Mitte (166.4 | 326.1), Fläche 220 × 33 → Menü **18** (Reagieren · Antworten · Kopieren · Löschen), unter der Bubble, ca. 190 px breit.
3. **„Antworten“** Mitte (152.7 | 416.7), Fläche 184 × 44 → **28**: Leiste „Antwort an Lea · Bin um acht wieder da.“ mit × über dem Eingabefeld, Fokus im Feld **Eingabe** Mitte (171.2 | 755.8), Fläche 307 × 44.
4. Tippen „Passt, ich bin auch da.“ → **29** (Senden-Knopf wird schwarz) → **Senden** Mitte (346.7 | 757.8), Fläche 44 × 32 → **30**: schwarze Bubble rechts mit Zitat „↪ Lea“, Uhrzeit rechts unten, Eingabe leer.

### D. Putzplan erledigen („Bad putzen“) — Zeilen 03, 11, 31, 32, 56, 61
1. Tabbar **Haushalt** Mitte (148.9 | 811.8), Fläche 90 × 44 → **03**.
2. **Runder Haken bei „Bad putzen“** Mitte (305.4 | 148.7), Fläche 32 × 32 → Dialog **11** („„Bad putzen“ erledigt?“): **„Erledigt bestätigen“** Mitte (195.0 | 444.3), Fläche 314 × 32 bzw. **„Abbrechen“** Mitte (195.0 | 490.3), Fläche 314 × 44.
3. Nach der Bestätigung → **31**: Bad putzen springt auf „in 7 T.“, Zuständigkeit wechselt zu Mika, unten Toast „Bad putzen erledigt. Nächster Termin: 13.10.; Mika ist dran (Rotation).“ (4 s, dann weg). Start (**32**): Bad putzen verschwindet aus „Diese Woche“.
4. **„So wird verteilt“** Mitte (185.0 | 366.9), Fläche 337 × 32 klappt die Regeln auf (**56**); **„…“** Mitte (349.4 | 148.7), Fläche 32 × 32 öffnet das Sheet **61**.

### E. Installationshinweis — Zeilen 35, 37, 59
1. Auf dem Start liegt über der Tabbar die Karte „ManaWG als App installieren“ (**35**), Knopf **So installierst du ManaWG** Mitte (195.0 | 750.6), Fläche 348 × 36; **×** Mitte (353.2 | 707.1), Fläche 32 × 32 schließt sie.
2. Der Knopf öffnet den Dialog mit der plattformspezifischen Anleitung (**37** iOS, **38** Android, **39** Desktop), jeweils drei Schritte und die Zeile „Danach startet ManaWG ohne Browser-Leiste, direkt vom Homescreen.“
3. Dauerhaft erreichbar unter Konto-Symbol (Kopf rechts) › Profil › „App installieren“ (**59**).

### F. Weitere Griffe
- Kopf: **Chat-Symbol** Mitte (317.4 | 22.0), Fläche 32 × 32 → `/chat`; **Konto-Symbol** Mitte (357.4 | 22.0), Fläche 32 × 32 → `/einstellungen` (**59**).
- Start: Zeile **„Hafermilch fehlt noch“** Mitte (215.0 | 172.3), Fläche 299 × 49 → Einkäufe; **„Übergabe am Freitag …“** Mitte (215.0 | 112.5), Fläche 299 × 68 → Pinnwand; **„Bad putzen · Heute · Lea“** Mitte (215.0 | 274.8), Fläche 299 × 49 → Putzplan; **„Neu in deiner WG“** Mitte (195.0 | 473.1), Fläche 357 × 32 klappt die Aktivität auf (**02**).
- Tabbar-Mitten (y 811.8): Start x 56.7, Haushalt 148.9, Finanzen 241.1, Austausch 333.3 (je 90,2 × 44).
- Vorräte: **„−“ am Toilettenpapier** Mitte (223.4 | 197.3), Fläche 32 × 32 senkt auf 1 Packung und verschiebt die Zeile nach „Bald leer (1)“ mit Knopf „Einkaufsliste öffnen“ (**57**); „Schnell nachfüllen“ → Sheet **14**; FAB → **60**.

## 10. Abgleich mit den Landing-Texten

| Landing (logic.js) | Echte App |
|---|---|
| „Pizzaabend · Mika bezahlt · durch 4 · 28,40 €“ | Titel „Pizzaabend“, Zeile 2 „Mika zahlte 28,40 €“, rechts „7,10 €“ und „beglichen“ |
| „Internet · Fixkosten · monatlich · 29,99 €“ | Ausgaben-Liste: „Internet · Du zahltest 29,99 €“, rechts „22,49 €“ „beglichen“. Fixkosten-Tab: „Internet · nächste am 03.11. · monatlich · du · 29,99 €“ |
| „Wocheneinkauf · Lina bezahlt · durch 4 · 18,90 €“ | „Wocheneinkauf · Lina zahlte 18,90 €“, rechts „4,72 €“ „beglichen“ |
| „Kinoabend · Jona bezahlt · Jona und Lea · 24,00 €“ | Nach dem Speichern: „Kinoabend · Du zahltest 24,00 €“, rechts „12,00 €“ grün + „bekommst du“; Saldo „Du bekommst 12,00 €“; „Lea schuldet dir 12,00 €“ |
| „Hafermilch · 2 Packungen · von Mika“ | identisch |
| „Bananen · 6 Stück · von Lea“, „Spülmittel · 1 Flasche · von Jona“ | identisch (Spülmittel erledigt: „1 Flasche · Gekauft von dir“) |
| „Toilettenpapier · 2 Packungen · Vorrat 1“ | Einkauf: „2 Packungen · von Lina“; Vorräte: „2 Packung · Nachkaufen ab 1“ |
| Chat „Bin um acht wieder da.“ (Lea) / „Passt, ich bin auch da.“ | identisch, aber als Bubbles mit Zeit; die Antwort trägt das Zitat „↪ Lea · Bin um acht wieder da.“ |
| Pinnwand „Übergabe am Freitag / Schlüssel liegen im Flur bereit.“ | identisch, Beitrag von „Jona · vor 5 Std · Info“ |
| Installation „Zum Home-Bildschirm / App installieren / Hinzufügen / Installieren“ | die App erklärt es selbst (Zeilen 35–39): iOS **Teilen → Zum Home-Bildschirm → Hinzufügen**, Android **Menü ⋮ → App installieren / Zum Startbildschirm → Bestätigen**, Desktop **Installieren in der Adressleiste**. |

## 11. Installation und PWA

`brand/manifest.json`: Name „ManaWG“, `display: standalone`, `start_url: /?source=pwa`, `theme_color #0A0A0A`, `background_color #FFFFFF`, Icons 192/512 (+ maskable), `apple-touch-icon` 180. Das Home-Icon ist die weiße Marke auf schwarzer Kachel (`brand/icon.svg`, 512 × 512, Kachel `#0a0a0a`, Marke 62 % der Kachelbreite). In der App: Installationshinweis auf dem Start (Zeile 35/36), Anleitung als Dialog je Plattform (37–39), außerdem unter Einstellungen › Profil „App installieren“ (59). Im Standalone-Modus verschwindet der Hinweis.

## 12. Prüfung und Grenzen

- **Standalone gegen Live:** 23 HTML-Dateien wurden aus `design/app-ref` über einen lokalen Server neu gerendert (390 × 844, DPR 3, Chromium, Metal) und pixelweise mit der Live-Aufnahme verglichen: höchstens **0,030 %** der Pixel weichen um mehr als 24/255 ab (`05-haushalt-vorraete`), bei Schwelle 64 höchstens 0,019 %. Das sind Kantenglättung und Textrasterung, keine Layoutunterschiede.
- **Dunkel:** dieselben Dateien mit `class="dark"` am `<html>` gegen die Dunkel-Aufnahmen (40, 65, 66, 67, 68, 69, 70, 71, 72): höchstens 0,030 %.
- **Live gegen Produktionsstand:** Pixelvergleich der Aufnahme `df8677e0` mit einer Aufnahme des live geschalteten Stands `7c0d50ba`: Unterschiede nur in der Tabbar-Zone (7,2 px höher), bei Uhrzeiten im Chat und bei der Reihenfolge der Einkaufsliste (im alten Lauf zufällig, jetzt durch gestaffelte Anlagezeiten festgelegt).
- **Konsole:** keine Fehler außer `GET /api/wg/mine` → 401 (Fixture-Artefakt).

Grenzen: Der Zustand liegt nur im Speicher des Demo-Servers; die Standalone-HTML sind statische Abzüge (kein JavaScript). Weitere Zustände entstehen mit `tools/capture.mjs` (neue `step`-Blöcke). Die Install-Animation des Betriebssystems selbst (Safari-Teilen-Menü, Home-Bildschirm) ist **nicht** Teil der App und steht in `design/install-ref/`.

## 13. Demo-Dokument für das Handy der Landing (`public/app-demo/`)

Das Handy der Ende-Szene lädt `public/app-demo/index.html` in ein gleich-originiges `iframe` (390 × 839 CSS-px, `scale(278/390)`). Das Dokument enthält keine Nachbauten: Jede Seite und jedes Overlay ist ein Abzug des echten DOM aus der Aufnahme (`<template>`), `app.css` ist das Build-CSS (nur `env(safe-area-inset-*)` in Werten ist durch `--sai-top/-bottom` ersetzt, weil `env()` im iframe immer 0 ist), `demo.js` tauscht die Abzüge aus und animiert sie mit den eigenen Klassen der App (`data-open`, `data-ending-style`, `animate-in`).

**Aufnahme** (Skripte in `tools/`, nur über die Oberfläche der echten App, Betrachter Jona, Uhr von App und Demo-Server fest auf Di, 06.10.2026 17:43 Europe/Berlin):

| Skript | Ergebnis |
|---|---|
| `demo-crawl.mjs` | klickt jedes Bedienelement jeder Route an (Tiefe 2), speichert Overlays, Seitenvarianten, Navigation, erkennt Änderungen der Daten (POST/PATCH) |
| `demo-worlds.mjs` | derselbe Crawl in den Welten nach einem Ablauf (E Hafermilch, A Kinoabend, P ausgeglichen, B Bad putzen, C Antwort, V Vorrat), nur für Elemente, die sich dort unterscheiden |
| `demo-typing.mjs` | Abläufe mit Eingaben (Ausgabeformular, Chat-Antwort, Artikelfeld) und die Zustände direkt nach dem Speichern (Meldung, Hinweis) |
| `demo-pages.mjs` | jede Route in jeder Welt, die sie verändert (`REL` in `demo-flags.mjs`) |
| `build-demo.mjs` | baut daraus `index.html` (Vorlagen, Graph, Wörterbuch für lange `class`-Werte und Icons) und `app.css` |

**Graph:** Knoten = Route + Klickfolge (`/ausgaben|button|Ausgabe hinzufügen@0`), Kanten = Bedienelement (`tag|Beschriftung@n`, Ziffern als `#`) → Zielknoten. Welten = gesetzte Abläufe (`E+A+P`); fehlt ein Knoten in einer Welt, gilt die Seite der Welt mit dem Overlay und den Kanten der Ausgangswelt. Eingabefelder tippen beim Antippen den aufgenommenen Text mit 60 ms je Zeichen (Reihenfolge der Aufnahme, vorgezogene Felder holen die fehlenden nach).

**Datum und Uhrzeit** stehen als Tokens in den Vorlagen (`{{D:2:kurz}}` Tag + 2, `{{F:kurz}}` nächster Freitag, `{{A:25}}` „vor 25 Min“, `{{CT:n}}` Chat-Uhrzeit = Laden − 62/41/14 Min., `{{MO:n}}` Monat) und werden in `demo.js` mit `Intl` (de-DE, Europe/Berlin) im Format der App berechnet. Das Monatsraster wird je Zelle auf den heutigen Monat umgerechnet. `?ref=1&state=NN` setzt die Uhr auf den Aufnahmezeitpunkt (17:43, wie die Originale) und die Insets auf 0 (Pixelvergleich).

**Prüfung** (`tools/qa/app/`): `pixel.mjs` (alle angebotenen Zustände gegen `shots/final`, höchstens 0,326 % Pixel mit Δ > 24), `flows.mjs` (Abläufe A–D, Tabbar, SubNav, Kopf-Icons, Start-Zeilen, Ausgleichen per Mausklick, je Schritt Pixel und Text), `motion.mjs` (Dauern und Kurven nach §7), `daten.mjs` (anderer Tag, nur Mika/Lina/Jona/Lea), `landing.mjs` (Handy in der Landing).

**Grenzen:** Die Demo bildet die Abläufe A–D samt Folgezuständen ab. Bedienelemente, die direkt Daten ändern, ohne Overlay oder Seite zu öffnen (weitere Artikel abhaken, Vorrat ±, Reaktionen, „Ich übernehme“, Entfernen), haben keinen aufgenommenen Folgezustand und zeigen nur den Druckzustand (80 ms). Am Freitag ist „nächster Freitag“ +7 Tage, die Reihenfolge der Agenda bleibt die der Aufnahme.
