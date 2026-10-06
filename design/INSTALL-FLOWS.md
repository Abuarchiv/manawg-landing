# INSTALL-FLOWS: echte Installationsabläufe von ManaWG

Stand 2026-10-06, zweite Fassung (nach erneuter Prüfung aller Bilder gegen den Text). Referenz für die Install-Szene der Landing (Tabs iPhone, Android, Rechner). Alle Bilder liegen in `design/install-ref/` (Dateinamen siehe Abschnitt 9).

Neu gegenüber der ersten Fassung: Rechner-Teil (Abschnitt 4) mit Belegen aus dem Chromium-Quelltext des hier installierten Chrome 154, Edge-Dialoge mit Originalbildern von Microsoft, echte Meldungstexte der Android-Installation (3.4), gemessene Feder des iOS-Seitenmenüs (2.6), Referenzclip des iPhone-Ablaufs (2.7). Korrigiert: Tooltip des Chrome-Symbols („ManaWG installieren“, nicht „App installieren“), Dialogform (tab-modal, keine Blase am Symbol), Titel „App installieren“ ohne Fragezeichen.

Herkunft der Angaben, jeweils markiert:

- **[REC]** selbst aufgenommen (Simulator, Emulator), Zeiten aus Video-Analyse.
- **[LOC]** exakte deutsche Beschriftung aus den Sprachdateien der installierten Programme (Chrome 154 und Safari auf diesem Mac, Edge 154 aus dem offiziellen Installer, Chromium 157 für Android).
- **[SRC]** Chromium-Quelltext auf dem Tag `154.0.8037.98` (= genau das hier installierte Chrome) bzw. `main` (Version 157.0.8090.0), gelesen über die GitHub-Spiegelung `chromium/chromium`.
- **[DOK]** offizielle Hilfeseite oder Herstellerdoku (Quellen in Abschnitt 7).
- **[?]** nicht belegt, bitte nicht als Tatsache darstellen.

## 1. Befunde auf einen Blick

1. **iPhone hat 5 Tipps, nicht 3.** Der echte iOS-27-Weg: Seitenmenü (≡) → Teilen → Mehr anzeigen → Zum Home-Bildschirm → Hinzufügen. „Teilen“ ist **kein** Symbol in der Safari-Leiste mehr, sondern der erste Eintrag im Seitenmenü. „Zum Home-Bildschirm“ steht im kompakten Share-Sheet nicht, erst nach „Mehr anzeigen“. [REC]
2. Der Dialog hat Icon, bearbeitbares Namensfeld („ManaWG“), URL, Schalter „Als Web-App öffnen“ (standardmäßig an), Tastatur und **Hinzufügen oben rechts** (nicht unten). Nach „Hinzufügen“ springt iOS ohne Rückfrage auf den Home-Bildschirm, das Icon ist sofort da, kein Pop. [REC]
3. **Android (Chrome seit 150, Juli 2026):** Menüpunkt heißt „Installieren und Verknüpfung erstellen“, öffnet ein Sheet mit „Installieren“ / „Verknüpfung erstellen“, dann Dialog „App installieren“ (Namensfeld, Abbrechen, Installieren), danach Toast „„ManaWG“ wird installiert…“. Ältere Chrome (124 im Emulator): „Zum Startbildschirm hinzufügen“ → direkt der Dialog. [REC, LOC, DOK]
4. **Rechner:** Chrome und Edge haben ein Symbol rechts in der Adressleiste; Safari (macOS Sonoma und neuer) hat nur „Ablage → Zum Dock hinzufügen …“ bzw. „Teilen → Zum Dock hinzufügen“. [LOC, DOK]
5. **Die Texte in der Prod-App sind veraltet** (`InstallButton.tsx`, nicht geändert): iOS-Schritt 1 „In Safari auf Teilen tippen“ und Schritt 2 „Nach unten scrollen“ stimmen mit iOS 26/27 nicht mehr (siehe Abschnitt 2). Android nennt „App installieren“ oder „Zum Startbildschirm“, 2026 heißt es „Installieren und Verknüpfung erstellen“.
6. Die aktuelle Landing-Szene (`engine/install.js`, `engine/logic.js`) zeigt eine erfundene Reihenfolge. Konkrete Abweichungen und eine Choreografie mit Zeiten: Abschnitt 8.
7. **Chrome 154 am Rechner:** Symbol „Monitor mit Pfeil nach unten“ plus Chip „Installieren“ (nur zeitweise ausgeklappt) rechts in der Adressleiste, Tooltip „ManaWG installieren“. Der Dialog „App installieren“ ist **tab-modal** (oben mittig im Seitenbereich, ohne Pfeil, nicht an das Symbol geheftet) mit Icon, Name, `app.manawg.com` und den Knöpfen „Abbrechen“ und „Installieren“. Danach wandert der aktuelle Tab in ein eigenes App-Fenster. Der neue mehrstufige Dialog („Installation war erfolgreich“, „Tab in App öffnen“) ist in 154 abgeschaltet, erst in Chromium 157 an. [SRC, LOC]
8. **Android nach „Installieren“ auf einem echten Gerät:** Meldungen „„ManaWG“ wird installiert…“ und danach „App wurde installiert“, bei Fehler „ManaWG konnte nicht installiert werden.“. Der Endzustand auf einem echten Gerät wurde nicht aufgenommen (Emulator ohne Google-Konto kann kein WebAPK anlegen). [LOC]
9. **Edge** nutzt eine eigene Oberfläche (Flyout „Installieren der ManaWG-App“ mit „Installieren“ und „Jetzt nicht“, danach Dialog „App wurde installiert“), Originalbilder von Microsoft in `design/install-ref/desk-edge-*.webp`. [DOK-Bild, LOC]

## 2. iPhone: iOS 27, Safari [REC]

### 2.1 Aufbau der Aufnahme

- Simulator **iPhone 17e, iOS 27.0 (24A434)**. Das vorgegebene Gerät `CF14DEAC…` läuft auf Englisch. Für deutsche Labels wurde ein Zwilling gleichen Typs angelegt: **„ManaWG-Install-DE“** (`B1C61364-54EB-4171-B904-B3765A32D24F`, Sprache `de`, Region `de_DE`). Statusleiste per `simctl status_bar` auf 09:41, volle Batterie.
- Safari im Standardlayout „Kompakt“ (Leiste unten). Seite `https://app.manawg.com` (Prod). Bildschirm 390 × 844 pt, 3×, Video 1170 × 2532.
- Aufnahme `xcrun simctl io <udid> recordVideo --codec h264` (variable Bildrate), Taps per `idb ui tap` in Punkten, Zeiten aus Tippprotokoll und Bildanalyse (60 Hz, Differenzbilder).
- Rohvideo (nicht im Repo): `scratchpad/install/ios-clean-1.mov` (35,5 s) mit `ios-clean-1.log.json`.
- iPhone 17e (englisch) unverändert: ManaWG-Icon auf Seite 2 vorhanden, genau einmal, kein Duplikat. Auf dem Zwilling wurde das Test-Icon nach der Aufnahme wieder gelöscht („Lesezeichen löschen“ → „Löschen“).

### 2.2 Schrittfolge

Positionen in pt (390 × 844, Ursprung links oben). Zeiten `t0` = erste sichtbare Reaktion auf den Tipp. „ruhig“ = Bewegung beendet.

| Nr | Aktion, exakte Beschriftung | Tippziel (pt) | Reaktion und Dauer | Bild |
|----|-----------------------------|---------------|--------------------|------|
| 0 | Ausgang: Safari mit `app.manawg.com`. Nach ≈ 1,2 s erscheint unten das App-Banner „ManaWG als App installieren / Schneller starten, offline-fähig.“ mit Knopf „So installierst du ManaWG“ | Knopf (195, 660) | Banner gleitet ein (≈ 220 ms, Quelltext der App) | ios-01 |
| 0a | optional: Knopf öffnet den App-eigenen Dialog „ManaWG als App installieren · iOS / Safari“ mit 3 Schritten | Schließen X (341, 280) | Dialog blendet ein; Text entspricht nicht dem echten iOS-27-Weg | ios-02 |
| 1 | **≡ Seitenmenü** (links in der Adresspille, Bedienhilfe-Label „Seitenmenü“) | (115, 786) | Menü wächst aus der Taste nach oben, Oberkante 774 → ≈ 265 pt in ≈ 210 ms, Überschwinger ≈ 25 pt (5 %), Ruhelage Oberkante 290 pt bei ≈ 450 ms. Beim Aufgehen unscharfe Glaslinse, Inhalt wird ab ≈ 200 ms scharf | ios-03, anim-1 |
| 2 | **Teilen** (erster Eintrag) | (176, 321) | Menü schrumpft in die Taste zurück (≈ 200 ms), Leiste kehrt wieder, Share-Sheet erscheint bei ≈ 370 ms, ruhig bei ≈ 530 ms | ios-04, anim-2 |
| 3 | **Mehr anzeigen** (Pfeil nach unten, letzte Aktion in Reihe 2) | (323, 733) | Sheet dehnt sich von Oberkante 438 pt bis 48 pt, ease-out, kein Überschwingen, ≈ 350 ms (Start ≈ +65 ms) | ios-05, anim-3 |
| 4 | **Zum Home-Bildschirm** (4. Zeile der ersten Gruppe) | (158, 635) | Neues Sheet (Oberkante 47 pt) fährt von unten hoch (≈ 400 ms), Tastatur schiebt ab ≈ +330 ms ein (ruhig ≈ +530 ms), Icon, Name und Schalter blenden ab ≈ +400 ms ein. Gesamt ≈ 0,8 s | ios-06, anim-4 |
| 5 | **Hinzufügen** (blaue Kapsel oben rechts) | (312, 85) | Tastatur sinkt (≈ 100 ms), Sheet schrumpft zur Karte (+200 ms), Safari-Seite zieht als Miniatur ins Safari-Symbol des Docks (+230 bis +330 ms), Home-Bildschirm entblurrt (+300 bis +430 ms). Das neue Icon steht schon in der Rasterzelle, keine eigene Pop-Animation. Gesamt ≈ 0,45 s | ios-07, ios-08, anim-5 |
| 6 | optional: **Icon „ManaWG“ antippen** | (330, 197) | Zoom aus dem Icon ≈ 400 ms, schwarzes Startbild mit schwach sichtbarem Logo, dann Inhalt (Details 2.5) | ios-09, ios-10, anim-6, anim-7 |

Menü-Eintragsreihenfolge im Seitenmenü: Teilen · Zu Lesezeichen hinzufügen · Lesezeichen hinzufügen zu … · (Trenner) · Auf der Seite suchen · Seitenzoom · Mitteilung an mich · Ablenkende Objekte ausblenden · (Trenner) · Erweiterung beschreiben · … (Liste scrollt).

### 2.3 Oberflächen im Detail (Texte wörtlich)

**Safari-Leiste unten** (alle y ≈ 786 pt): Zurück (58) · Adresspille mit ≡ (115), Text `app.manawg.com` (mittig), Neu laden (277) · Tabs (331). Glaskapseln, Pille x 90–300.

**Seitenmenü:** Panel x 90–340, y 290–810 pt (250 × 520), Radius ≈ 48 pt, Glasmaterial mit Linsenrand, lange Zeilen 2-zeilig umbrochen („Zu Lesezeichen hinzufügen“), Liste scrollt.

**Share-Sheet kompakt:** schwebende Karte x 9–381, y 438–834 pt, Radius ≈ 48 pt.
- Kopf: App-Icon (weiße Kachel mit dem Logo), Titel **„Deine WG-App“**, darunter `app.manawg.com`, Kapsel „Optionen ›“, Schließen-X erscheint erst im erweiterten Zustand.
- Reihe 1 (Apps): News · Erinnerungen · Safari · Mehr.
- Reihe 2 (Aktionen): Kopieren · Zu Lesezeichen hinzufügen · Zur Leseliste hinzufügen · Mehr anzeigen.

**Share-Sheet erweitert:** Vollhöhe, Oberkante y = 48 pt, Schließen-X (352, 80), „Weniger anzeigen“ (327, 347).
- Gruppe 1: Lesezeichen hinzufügen zu … · Als Favoriten sichern · Auf der Seite suchen · **Zum Home-Bildschirm**.
- Gruppe 2: Markierung · Drucken · In Safari öffnen · … (scrollt).

**Dialog „Zum Home-Bildschirm“:** Vollhöhen-Sheet.
- Kopfzeile: X links (38, 85), Titel **„Zum Home-Bildsc…“** (iOS kürzt ihn selbst ab), blaue Kapsel **„Hinzufügen“** rechts (312, 85).
- Karte: Icon 60 pt (schwarze Kachel, weißes Logo), Namensfeld **„ManaWG“** (Cursor aktiv, Löschen-Knopf rechts), darunter grau `https://app.manawg.com/`.
- Zeile **„Als Web-App öffnen“** mit grünem Schalter, standardmäßig **an**. Fußtext: „Für schnellen Zugriff auf diese Website wird auf deinem Home-Bildschirm ein Symbol hinzugefügt.“
- Tastatur (QWERTZ) ab y = 515 pt mit Vorschlag „ManaWG“, Return-Taste blau mit Haken.
- Der Name „ManaWG“ kommt aus `apple-mobile-web-app-title`, nicht aus dem Seitentitel. Der Seitentitel im Share-Sheet erscheint als „Deine WG-App“.

**Home-Bildschirm:** das neue Icon landet in der ersten freien Zelle, Beschriftung „ManaWG“ unter dem Icon (im Test (330, 197) als letzte Zelle der 2. Reihe). Icon = schwarzes Quadrat mit weißer Blob-Marke (`apple-touch-icon.png`, 180 px), von iOS mit Kontinuitätsradius maskiert.

### 2.4 Tempo eines Nutzers

Im Test: Pause 1,8 bis 2,4 s zwischen den Tipps, vom ersten Tipp (2,4 s) bis zum fertigen Home-Bildschirm 12,3 s. Ein Mensch braucht erfahrungsgemäß 15 bis 25 s. Für die Landing reichen etwa 1,2 bis 1,6 s Pause zwischen den Schritten, damit jedes Bild gelesen werden kann.

### 2.5 Start der installierten App [REC, Simulator]

| Zeit ab Tipp auf das Icon | Ereignis |
|---------------------------|----------|
| 0 bis ≈ 420 ms | Karte (schwarz, Logo schwach) wächst aus dem Icon auf Vollbild, Springboard wird unscharf |
| ≈ 0,4 bis 2,6 s | schwarzes Startbild (WebKit-Kaltstart im Simulator, auf echten Geräten kürzer) |
| 2,6 bis 2,9 s | Überblendung schwarz → weiß (≈ 320 ms) |
| ≈ 8,2 s | Seiteninhalt erscheint zuerst als Gerüst, nach ≈ 0,6 s vollständig (Simulator, Netz und Hydration) |

Das sind Simulator-Artefakte; für die Landing nur die ersten 0,4 s (Zoom) und die Überblendung übernehmen. Die Standalone-App zeigt keine Safari-Leisten; die Statusleiste liegt durchsichtig über dem weißen Seitenhintergrund mit schwarzer Schrift (so in iOS 27 beobachtet, obwohl das Meta-Tag `black` setzt). Rückkehr per Home-Taste: App schrumpft in ≈ 660 ms ins Icon.

### 2.6 Messung 2: Feder des Seitenmenüs [REC]

Unabhängige Nachmessung am Rohvideo (60 Hz, Differenzbild gegen das Bild 0,3 s vor dem Tipp, Schwelle 24/255, Spalten 120 bis 330 pt): obere Kante des wachsenden Menüs in pt, Zeit ab Tippbeginn laut Tippprotokoll.

| Zeit | +217 ms | +243 | +262 | +270 | +277 | +290 | +322 | +335 | +357 | +365 | +402 | +422 | +452 | +500 | +563 | +585 | +612 | +648 |
|------|---------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| Kante | 790 | 775 | 734 | 671 | 603 | 532 | 461 | 404 | 359 | 334 | 289 | 268 | **267** | 279 | 284 | 310 | 312 | **314** |

- Erste sichtbare Änderung bei +217 ms nach Tippbeginn (Verzögerung des Tippbefehls inklusive), Maximum bei +452 ms (Dauer bis dahin 235 ms), Ruhelage ab ≈ +612 bis +648 ms (Gesamtdauer 400 bis 430 ms). Weg 476 pt, Überschwinger 47 pt (≈ 10 %), dann Rückfedern in ≈ 160 bis 200 ms. Die gemessene Ruhelage 314 liegt 24 pt unter der sichtbaren Panelkante (290 pt in `ios-03`), weil der obere, fast weiße Rand die Schwelle unterschreitet; Verlauf und Zeiten bleiben davon unberührt.
- Passt auf eine gedämpfte Feder aus der Ruhe: Dämpfungsgrad ζ ≈ 0,59, Eigenfrequenz ωn ≈ 16,6 rad/s (SwiftUI-Schreibweise `response ≈ 0,38 s`, `dampingFraction ≈ 0,59`; als Masse-Feder k ≈ 276, c ≈ 19,7 bei m = 1). Gegenprobe der Feder, gerechnet ab +217 ms: 664 pt bei +270 ms (gemessen 671), 465 pt bei +322 ms (gemessen 461), Maximum 267 pt bei +452 ms (gemessen 267).
- Die Glaslinse, die beim Aufgehen aus der Taste wächst, läuft gleichzeitig: im Filmstreifen `ios-anim-1` (Zeit ab erster Reaktion) unscharf bis +166 ms, Inhalt scharf ab +200 ms.
- Das Aufklappen von „Mehr anzeigen“ (Kante 438 → 48 pt) dauerte in der Nachmessung von +305 ms bis ≈ +690 ms (Kante 51 pt) bzw. +790 ms (48 pt) nach Tippbeginn, also ≈ 400 bis 480 ms, ohne Überschwinger (Minimum 47 pt). Das ist ein Ease-out, kein Federn; die Angabe „≈ 350 ms“ in 2.2 bezieht sich auf die schnelle Hauptbewegung.

### 2.7 Referenzclip [REC]

`design/install-ref/ios-flow-real.webm`: der gesamte iPhone-Ablauf in Echtzeit, 585 × 1266 px (1,5 × pt), 30 Bilder/s, 19,6 s, VP9 ohne Ton, 0,7 MB. Ausschnitt 1,8 bis 21,4 s des Rohvideos. Zeit im Clip = Rohzeit − 1,8 s:

| Clip-Zeit | Ereignis (Tippbeginn laut Protokoll) |
|-----------|--------------------------------------|
| 0,00 s | Safari, Seite mit Banner |
| 0,44 s | Tipp auf ≡ (Reaktion ab 0,66 s) |
| 2,50 s | Tipp auf „Teilen“ |
| 5,26 s | Tipp auf „Mehr anzeigen“ |
| 7,35 s | Tipp auf „Zum Home-Bildschirm“ |
| 11,67 s | Tipp auf „Hinzufügen“ (die 4 s davor wurden zum Betrachten des Dialogs abgewartet) |
| ab ≈ 12,2 s | Home-Bildschirm mit neuem Icon |
| 18,15 s | Tipp auf das Icon, Zoom aus dem Icon, Clip endet im Startbild |

Der Clip ist Referenz für Tempo und Bewegung, keine Vorlage für die Seite (Apple-Oberfläche, Simulator).

## 3. Android: Chrome [REC, LOC, DOK]

### 3.1 Aufbau der Aufnahme

- AVD **ManaWG_InstallRef** (Android 15, API 35, `google_apis_playstore` arm64), 1080 × 2400, 420 dpi = **411 × 914 dp** (px / 2,625). Sprache Deutsch (Deutschland), Statusleiste per Demo-Modus auf 09:41, voller Akku, WLAN und LTE. Das gemeinsam genutzte AVD „ManaWG_Pixel“ wurde nicht angefasst.
- Zwei Chrome-Stände: **Chrome 124.0.6367.219** (Standard im Emulator) und **Chromium 157.0.8090.0** (Snapshot 1712325, nur für die Aufnahme installiert und danach wieder deinstalliert). Grund: Chrome 124 kennt den 2026er Menüpunkt noch nicht.
- Aufnahme `adb shell screenrecord` in Echtzeit und mit 5-fach verlangsamten Systemanimationen (`window/transition/animator_duration_scale = 5`, danach auf 1 zurückgesetzt). Alle ms-Angaben unten sind auf Echtzeit zurückgerechnet.
- Rohvideos (nicht im Repo): `scratchpad/install2/and-take1.mp4` (Echtzeit, Chrome 124), `and-slow1.mp4` (5×, Chrome 124), `and-cr-slow1.mp4` (5×, Chromium 157).
- Aufgeräumt: Chromium deinstalliert, beide Test-Verknüpfungen vom Startbildschirm entfernt („Element entfernt“), Animationsskalen auf 1.

### 3.2 Schrittfolge, aktuelles Chrome (ab 150) [REC mit Chromium 157, LOC, DOK]

Pixel für 1080 × 2400 (dp = px / 2,625).

| Nr | Aktion, Beschriftung | Tippziel (px) | Reaktion und Dauer | Bild |
|----|----------------------|---------------|--------------------|------|
| 1 | **⋮ „Google Chrome anpassen und verwalten“** (in der Aufnahme unten rechts, in Chrome 124 oben rechts) | Chromium: (945, 2258), Chrome 124: (1017, 205) | Popup-Menü, Zeilen fahren gestaffelt ein (≈ 0,45 s), obere Reihe mit ← → ☆ ⬇ ⟳; in Chromium 157 füllt es die rechte Bildschirmseite über dem unteren ⋮ | and-new-01 |
| 2 | **Installieren und Verknüpfung erstellen** | (623, 2053) | Bottom-Sheet fährt von unten hoch, Hintergrund wird abgedunkelt | and-new-01, and-new-02 |
| 3 | im Sheet **Installieren** (Zeile mit Pfeil ›). Daneben „Verknüpfung erstellen“ mit Hinweis „Verknüpfungen werden in Chrome geöffnet“ | (339, 2000) | Sheet schließt, Dialog blendet ein | and-new-02 |
| 4 | Dialog **App installieren** | Installieren (895, 1415), Abbrechen (643, 1415) | Dialog blendet in ≈ 0,2 s ein (Chrome 124 gemessen), Namensfeld mit blinkendem Cursor | and-new-03 |
| 5 | Toast **„ManaWG“ wird installiert…** | — | unten mittig, ≈ 2 s sichtbar | and-04 |
| 6 | Ergebnis: Symbol „ManaWG“ auf dem Startbildschirm (Beschreibung 3.4) | — | — | and-06 |

Aufnahme-Hinweis: Die Schritte 5 und 6 zeigen den **Fallback** des Emulators (siehe 3.4). Der Weg bis einschließlich Dialog ist in beiden Chrome-Ständen gleich.

### 3.3 Schrittfolge, Chrome 124 (zum Vergleich) [REC]

| Nr | Aktion | Tippziel (px) | Reaktion und Dauer | Bild |
|----|--------|---------------|--------------------|------|
| 1 | ⋮ oben rechts | (1017, 205) | Popup, 14 Einträge, Zeilen gestaffelt, ≈ 0,65 s | and-02, anim-1 |
| 2 | **Zum Startbildschirm hinzufügen** | (758, 1683) | Menü blendet in ≈ 70 ms aus, Dialog „App installieren“ erscheint in ≈ 130 bis 230 ms, Abdunkelung auf ≈ 65 % | and-03, anim-2 |
| 3 | **Installieren** | (895, 1476) | Dialog verschwindet in ≈ 190 ms, Toast erscheint | and-04, anim-3 |
| 4 | Sheet des Launchers „Chrome: Widget „ManaWG“ 1 × 1“, Knopf **Zum Startbildschirm hinzufügen** | (746, 2253) | Sheet fährt ≈ 3,5 bis 4,5 s nach Schritt 3 hoch (≈ 300 ms), schließt nach dem Tipp in ≈ 350 ms | and-05, anim-4, anim-5 |
| 5 | Home-Taste | — | Chrome schrumpft in ≈ 540 ms ins Home; Icon erscheint als Kreis (weiß) mit Marke und kleinem Chrome-Abzeichen, Beschriftung „ManaWG“ | and-06, anim-6 |
| 6 | Icon antippen | (170, 270) | Karte wächst in ≈ 400 ms aus dem Icon auf Vollbild, Splash, nach ≈ 0,7 s Überblendung (≈ 250 ms) in die App. Gesamt ≈ 0,9 s (Emulator-Kaltstart real ≈ 2,9 s) | and-07, and-08, anim-7 |

Elemente (px, 1080 × 2400):
- **Dialog „App installieren“:** Karte x 27–1052, y 992–1580 (≈ 390 × 224 dp, Radius ≈ 28 dp), Fläche `#FAF8FF`, Abdunkelung der Seite auf 35 % Helligkeit (≈ 65 % Schwarz). Titel „App installieren“ (x 90, y 1039–1124), App-Icon 95 px (x 90, y 1228), Namensfeld „ManaWG“ mit Unterstrich (x 216–990, y 1184–1302), darunter `app.manawg.com` (grau). Textknöpfe **Abbrechen** (525–759, y 1413–1539) und **Installieren** (780–1011), keine gefüllten Knöpfe.
- **Launcher-Sheet:** Titel „Chrome“, Text „Wenn du das Widget auf dem Startbildschirm verschieben möchtest, halte es gedrückt“, Vorschau mit Icon, „ManaWG“, „1 × 1“; Knöpfe Abbrechen (159–421, y 2190–2316) und Zum Startbildschirm hinzufügen (442–1051).
- **Splash:** Hintergrund `#F4F6F6`, schwarzes Logo-Quadrat 72 dp mittig, „ManaWG“ unten mittig. Standalone-Statusleiste schwarz (`#080808`, theme_color `#0A0A0A`).

### 3.4 WebAPK oder Verknüpfung

Auf einem echten Gerät mit Google Play Services erzeugt Chrome beim „Installieren“ ein **WebAPK**: eigene App im Launcher und unter Einstellungen → Apps, Symbol ohne Browser-Rückfrage auf dem Startbildschirm [DOK web.dev]. Der Emulator ohne Google-Konto lehnt die Installation ab (Log `installapi … not allowed`) und Chrome fällt auf eine **Verknüpfung** zurück; deshalb erschien das Launcher-Sheet und das Icon trägt ein Chrome-Abzeichen. Der Weg bis zum Dialog ist identisch. Der Endzustand auf einem echten Gerät wurde **nicht aufgenommen** [?]; nur der Toast „„ManaWG“ wird installiert…“ wurde im Emulator gesehen.

Meldungstexte rund um die echte Installation, aus den Ressourcen des Chromium-157-APK (`aapt2 dump resources`, Wert `de` neben dem englischen Standardwert) und den Quelltext-Namen auf Tag 154 [LOC, SRC]:

| Zeitpunkt | Deutscher Text | Englischer Standardtext | Quelltext-Name |
|-----------|----------------|-------------------------|----------------|
| während der Installation | „ManaWG“ wird installiert… | Installing %1$s… | `NOTIFICATION_WEBAPK_INSTALL_IN_PROGRESS` |
| nach Erfolg | App wurde installiert | App installed | `NOTIFICATION_WEBAPK_INSTALLED` |
| nach dem Anlegen einer Verknüpfung | ManaWG wurde deinem Startbildschirm hinzugefügt. | %1$s was added to your Home screen | `ADDED_TO_HOMESCREEN` |
| bei Fehler | ManaWG konnte nicht installiert werden. | Couldn’t install %1$s. | `NOTIFICATION_WEBAPK_INSTALL_FAILED` |

Im Quelltext sind „wird installiert…“ und „App wurde installiert“ Benachrichtigungen (Statusleiste und Mitteilungsfeld); im Emulator erschien derselbe Text zusätzlich als Toast. Ob Chrome 154 auf einem echten Gerät Toast, Benachrichtigung oder beides zeigt und wie lange, ist nicht gemessen [?]. Die In-App-Karte der Seite („ManaWG als App installieren“ mit Knopf „Jetzt installieren“) erscheint auf Android nur, wenn Chrome das Ereignis `beforeinstallprompt` sendet; im Emulator (ohne Google-Konto) tat es das weder in Chrome 124 noch in Chromium 157, deshalb fehlt dieser Weg in den Aufnahmen. Auf einem echten Gerät wäre er der kürzeste Weg: Karte → „Jetzt installieren“ → derselbe Dialog „App installieren“ [?]. Splash der echten WebAPK-App: Chrome nimmt `background_color` `#FFFFFF` und das Icon aus dem Manifest; der graue Splash `#F4F6F6` in `and-07` gehört zur Verknüpfung im Emulator [?].

Google-Hilfe (de): Dreipunkt-Menü → „Installieren und Verknüpfung erstellen“ → „Installieren“ [DOK]; die Oberfläche bestätigt das [REC]. Verknüpfung ohne Installation: „Verknüpfung erstellen“ → Name → „Hinzufügen“ [DOK].

## 4. Rechner [SRC, LOC, DOK]

Hier wurde **nicht** live aufgenommen. Auf dem Mac des Nutzers läuft eine aktive Sitzung (eigener Chrome, Musik); Aufnahmen und Klicks in fremden Programmfenstern würden Fokus und Eingaben stören, und eine Installation im Chrome-Profil des Nutzers wäre ein Eingriff außerhalb der Aufgabe. Der Ablauf ist stattdessen aus drei Quellen belegt, die sich gegenseitig stützen: (1) Chromium-Quelltext auf dem Tag des hier installierten Chrome 154.0.8037.98, (2) die deutschen Sprachdateien der installierten Programme (Chrome 154, Edge 154), (3) Herstellerseiten mit Originalbildern (Microsoft) bzw. Beschreibung (Google, Apple). Reihenfolge, Beschriftungen und Aufbau sind belegt; Pixelmaße, Farben im Detail und Bewegungsdauern sind **nicht gemessen** [?].

Anrede: Chrome und Safari sprechen auf Deutsch mit „du“, Edge mit „Sie“.

### 4.1 Chrome 154 (Windows, macOS, Linux)

| Nr | Aktion | Beschriftung und Aussehen | Beleg |
|----|--------|---------------------------|-------|
| 1 | Seite `app.manawg.com` ist offen. Sobald Chrome sie als installierbar erkennt, erscheint rechts in der Adressleiste, links vom Lesezeichen-Stern, ein Symbol **Monitor mit Pfeil nach unten** (Material „install_desktop“). Beim ersten Aufruf klappt daneben kurz der Chip **„Installieren“** aus; danach frühestens nach 1 Tag, dann nach 2, 4, 8 … bis höchstens 90 Tagen wieder, sonst bleibt das Symbol allein. | Tooltip und Vorlesename: **„ManaWG installieren“** | [SRC] `pwa_install_page_action.cc` (Label, Tooltip, Chip), `components/vector_icons/install_desktop.icon`, `app_banner_settings_helper.cc` (Abstände); [LOC] Chrome 154 `de`: „Installieren“, „$1 installieren“ |
| 2 | Klick auf Symbol oder Chip | Alternativ: ⋮ → **„Streamen, speichern und teilen“** → **„ManaWG installieren…“** (für beliebige Seiten heißt der Eintrag „Seite als App installieren…“) | [DOK] Google-Hilfe (de); [LOC] `$1 &installieren…` |
| 3 | Der Dialog erscheint | Titel **„App installieren“**. Darunter eine Zeile: App-Icon (macOS mit Icon-Maske), Name **ManaWG**, darunter `app.manawg.com` in Sekundärfarbe. Darunter zwei Knöpfe **„Abbrechen“** und **„Installieren“**. Kein Namensfeld (das gibt es nur bei „Seite als App installieren“ für Seiten ohne Manifest). | [SRC] `web_app_simple_install_dialog.cc`, `web_app_icon_name_and_origin_view.cc`; [LOC] `App installieren`, `Abbrechen`, `Installieren` |
| 4 | Klick auf **„Installieren“** | Der Dialog schließt. | [SRC] |
| 5 | Ergebnis | Der aktuelle Tab wandert sofort in ein eigenes App-Fenster (Chrome nennt das Reparenting). Das Fenster hat keine Adressleiste, den Namen „ManaWG“ und oben rechts ein ⋮-Menü mit „ManaWG deinstallieren…“. Die Titelleiste kann die `theme_color` `#0A0A0A` annehmen. macOS: die App liegt unter `~/Applications/Chrome Apps.localized/ManaWG.app`, das Fenster erscheint erst, nachdem diese Verknüpfung angelegt wurde. Windows: Eintrag im Startmenü unter „Chrome-Apps“, anheftbar an die Taskleiste. | [SRC] `web_app_ui_manager_impl.cc` (`ReparentAppTabToWindow`, macOS nur mit angelegter Verknüpfung); [DOK] Google-Hilfe (de): „Mehr → [App-Name] deinstallieren → Entfernen“ |

Dialog genauer [SRC]:

- **Form:** tab-modaler Dialog. `BubbleDialogModelHost::CreateModal` setzt `BubbleBorder::Arrow::NONE` und keinen Anker; gezeigt wird er über `ShowWebModalDialogViews`. Das heißt: **kein Pfeil auf das Symbol, keine Blase unter der Adressleiste**, sondern ein Kasten mit gerundeten Ecken, horizontal mittig an der Unterkante der Symbolleiste (oberer Rand des Seitenbereichs, leicht in die Symbolleiste hineinragend). Ob die Seite abgedunkelt wird, ist nicht belegt [?].
- **Knopfreihenfolge:** macOS und Linux: Abbrechen links, Installieren rechts; Windows umgekehrt (`PlatformStyle::kIsOkButtonLeading = BUILDFLAG(IS_WIN)`).
- **Standardknopf:** „Abbrechen“ (`OverrideDefaultButton(kCancel)`), absichtlich gegen versehentliches Installieren per Eingabetaste. Wie dieser Standardknopf optisch hervorgehoben wird, ist nicht belegt [?].

Neuer Dialog (nicht in 154): Der Schalter `kWebAppInstallDialog` ist in `154.0.8037.98` **aus** (`FEATURE_DISABLED_BY_DEFAULT`) und in `main` (157.0.8090.0) **an** (`FEATURE_ENABLED_BY_DEFAULT`). Dann läuft die Installation als mehrstufiger Dialog: 1) Einführung mit Titel „App installieren“, Untertitel „Greife auf diese Website in einem eigenen Fenster auf deinem Computer zu“, Knopf „Weiter“ (Windows, macOS, ChromeOS) bzw. „Installieren“ (Linux), 2) Installationsoptionen: Windows „Wird zum Startmenü hinzugefügt“ (Ordner „Chrome-Apps > ManaWG“), „Desktopverknüpfung hinzufügen“, „An Taskleiste anpinnen“; macOS ein Bild „App-Icon → Pfeil → Ordner“; ChromeOS „An Ablage anpinnen“, 3) Fortschritt mit Titel „App wird installiert…“, 4) Titel „Installation war erfolgreich“ mit Knöpfen „Tab in App öffnen“ und „Im Finder anzeigen“ (macOS) bzw. „Schließen“. [SRC `web_app_install_flow_dialog_delegate.cc`, `web_app_install_options_view.cc`; LOC Chrome 154 `de`] Für die Landing gilt heute (Stable 154) der einfache Dialog; der neue Ablauf käme mit Chrome ab etwa 157 [?].

### 4.2 Edge 154 (Windows, macOS)

Edge hat eine **eigene** Oberfläche, nicht die von Chrome. Originalbilder (deutsche Oberfläche, Windows, Beispiel-Apps „Webboard“ und „Temperaturkonverter“) aus Microsoft Learn, Seite „Verwenden von progressiven Web-Apps (PWAs) in Microsoft Edge“, Stand 2026-09-02, Lizenz CC BY 4.0: `desk-edge-flyout.webp`, `desk-edge-postinstall-win.webp`.

1. In der Adressleiste, links vom Stern, erscheint das Symbol **„App verfügbar“** (Rechteck mit vier Feldern und einem Plus). Tooltip **„App verfügbar. ManaWG installieren“** [LOC Edge 154 `479`; DOK Microsoft Learn „Symbol „App verfügbar“ in der Adressleiste“].
2. Klick darauf öffnet ein **Flyout** unter dem Symbol, mit Anker (`desk-edge-flyout.webp`): Titel **„Installieren der ManaWG-App“** (Muster laut Bild: „Installieren der Webboard-App“; die Edge-154-Sprachdatei enthält zusätzlich „Installieren Sie $1 app“, welcher Stand das Flyout heute trägt, ist nicht belegt [?]), darunter **„Herausgeber: app.manawg.com“**, Text **„Diese Website kann als Anwendung installiert werden. Es wird in einem eigenen Fenster geöffnet und sicher mit Windows-Features.“** (Wortlaut der Windows-Ausgabe im Bild; die macOS-Sprachdatei von Edge 154 sagt „Sie wird in einem eigenen Fenster geöffnet und integriert sich problemlos in die macOS-Funktionen.“), Knöpfe **„Installieren“** (blau gefüllt, links) und **„Jetzt nicht“** (grau, rechts), Schließen-X oben rechts. [DOK-Bild, LOC `17282`, `17284`, `1775`, `12475`]
3. Nach „Installieren“ öffnet Edge die App in einem eigenen Fenster und zeigt darin einen Dialog **„App wurde installiert“** (im Windows-Bild älterer Fassung: „App installiert“) mit dem Text „ManaWG wurde als App auf Ihrem Gerät installiert und wird in einem eigenen Fenster problemlos ausgeführt.“ [LOC `17287`, `17288`]. Windows (Bild `desk-edge-postinstall-win.webp`): Zeile „Zulassen, dass diese App“ mit vier Kontrollkästchen **„An Taskleiste anheften“** (an), **„An Start anheften“** (an), **„Verknüpfung „Desktop erstellen““** (aus), **„Automatischer Start bei Geräteanmeldung“** (aus) und Knöpfen **„Zulassen“** (blau) und **„Nicht zulässig“**. Die macOS-Sprachdatei kennt „An Dock anheften“ und „App beim Anmelden starten“; ihre Zuordnung zu diesem Dialog ist nicht belegt [?].
4. Alternativ: **Einstellungen und mehr (…) → Weitere Tools → Apps → „Installieren Sie diese Website als App“** (Microsoft Support, de) [DOK].
5. Ergebnis: eigenes Fenster, Taskleiste, Startmenü, Alt+Tab; Verwaltung unter `edge://apps` („Öffnen“, „Details“) [DOK].

### 4.3 Safari auf dem Mac (macOS Sonoma 14 und neuer)

1. Menüleiste **Ablage → „Zum Dock hinzufügen …“** (Menüeintrag mit Auslassungspunkten) oder Teilen-Knopf in der Werkzeugleiste → **„Zum Dock hinzufügen“**. Apple-Anleitung (macOS 27): „Klicke in der Symbolleiste auf Teilen und wähle dann „Zum Dock hinzufügen“. Klicke auf „Hinzufügen“.“ [LOC Safari auf macOS 26.6, DOK Apple]
2. Dialog **„Zum Dock hinzufügen“**: App-Icon, Feld **„Name“** (Platzhalter „Name“), Feld **„URL der Website“**, Text „Für schnellen Zugriff auf diese Website wird im Dock ein Symbol hinzugefügt.“ (andere Fassung: „Ein Symbol wird zu deinem Dock und Launchpad hinzugefügt, sodass du im Handumdrehen auf diese Website zugreifen kannst.“), Knöpfe **„Abbrechen“** und **„Hinzufügen“**. Die Apple-Seite beschreibt den Dialog nur über ein Bild („Die Aufforderung, die nach Auswahl von „Zum Dock hinzufügen“ angezeigt wird.“) und nennt als Bedienung „Gib einen Namen für die Web-App ein und klicke auf „Hinzufügen““. [LOC, DOK]
3. Ergebnis: Symbol im Dock und als App im Ordner „Programme“ des Benutzerordners, auch über Spotlight zu finden (Apple-Seite: Dock und Spotlight; Safari-17-Handbuch: Dock und Launchpad). Fenster mit schlanker Symbolleiste (Zurück, Vorwärts, Teilen, Safari-Erweiterungen), Titelleiste kann die Farbe der Website annehmen („Farbe in Titelleiste anzeigen“). Eigenes Datenmodell, teilt weder Verlauf noch Cookies mit Safari; Anmeldungen der Website gelten meist auch in der Web-App. Zurück zu Safari über Teilen → „In Safari öffnen“. Einstellungen der Web-App: Menü „ManaWG“ → „Einstellungen“ mit „App-Name“, „App-URL“, „Symbol“, „Navigationssteuerung einblenden“, „Farbe in Titelleiste anzeigen“. [DOK]
4. Sprachdatei meldet bei Fehlern: „„%@“ kann nicht zum Dock hinzugefügt werden“, und „Ersetzen“ bei vorhandener App [LOC].

## 5. App-Identität (Prod `https://app.manawg.com`) [Quelltext und Live-Abruf]

Manifest (`/manifest.json`, identisch mit `manawg-app/apps/web/public/manifest.json`):

| Feld | Wert |
|------|------|
| `name` | **ManaWG** |
| `short_name` | **ManaWG** |
| `theme_color` | **#0A0A0A** |
| `background_color` | #FFFFFF |
| `display` / `orientation` | standalone / portrait |
| `start_url` / `scope` / `id` | `/?source=pwa` / `/` / `/` |
| `lang` | de-DE |
| `description` | „Ausgaben, Putzplan, Einkauf und Pinnwand für deine WG — offlinefähig.“ |
| Verknüpfung | „WG beitreten“ (Kurzname „Beitreten“) → `/neu?source=pwa-shortcut` |
| Kategorien | lifestyle, productivity, social |

Symbole (`manawg-app/apps/web/public/`): `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` (alle schwarz `#0A0A0A` mit weißer Blob-Marke, Marke 317 × 254 px von 512, mittig, innerhalb der Maskable-Sicherheitszone), `apple-touch-icon.png` (180 × 180), `manawg-icon-1024.png`, `icon.svg`, `favicon.svg`, `manawg-mark.svg` (Marke allein, Maske aus acht Kreisen minus Loch bei 207/175, r 22). Kopien: `install-ref/app-icon-512.webp`, `install-ref/app-apple-touch-icon-180.webp`.

HTML-Kopf: `apple-mobile-web-app-capable=yes`, `apple-mobile-web-app-title=ManaWG`, `apple-mobile-web-app-status-bar-style=black`, `apple-touch-icon` 180, `theme-color #0a0a0a` (hell und dunkel), `<title>ManaWG</title>`, `og:title` „ManaWG — Deine WG-App“. Das Service-Worker-Gerüst (`/sw.js`) liegt vor, Installierbarkeitsfehler laut Chrome: keine.

In-App-Hinweis (`InstallPrompt.tsx`): erscheint 1,2 s nach dem Start auf der Startseite, solange nicht installiert; Chromium mit Ereignis: Knopf „Jetzt installieren“, sonst „So installierst du ManaWG“ (öffnet den Dialog „ManaWG als App installieren“ mit iOS-, Android- oder Desktop-Anleitung).

## 6. Prüfliste für die Szene (Pflichtpunkte)

- iPhone: Teilen liegt im Seitenmenü (≡), nicht in der Leiste. „Zum Home-Bildschirm“ erst nach „Mehr anzeigen“. Dialog als Vollhöhen-Sheet mit Namensfeld „ManaWG“, URL, Schalter „Als Web-App öffnen“ (an), Tastatur, **Hinzufügen oben rechts**. Kein Pop des neuen Icons: es steht sofort in der Zelle, während der Springboard entblurrt.
- Android: Menü ist ein Popup rechts (kein Bottom-Sheet). Eintrag „Installieren und Verknüpfung erstellen“ (älter „Zum Startbildschirm hinzufügen“). Danach Sheet „Installieren / Verknüpfung erstellen“, dann Dialog „App installieren“ mit Namensfeld und Textknöpfen „Abbrechen“ und „Installieren“, danach Toast.
- Rechner: Symbol in der Adressleiste (Chrome: Monitor mit Pfeil und Chip „Installieren“, Tooltip „ManaWG installieren“; Edge: „App verfügbar“), Chrome-Dialog „App installieren“ als tab-modaler Kasten oben mittig (keine Blase am Symbol) mit „Abbrechen“ und „Installieren“, Ergebnis ist ein eigenes Fenster ohne Adressleiste. Safari: Ablage → „Zum Dock hinzufügen …“ → Dialog mit „Name“, „Abbrechen“, „Hinzufügen“.
- Edge zeigt vor der Installation ein Flyout „Installieren der ManaWG-App“ mit „Installieren“ und „Jetzt nicht“ und nach der Installation im App-Fenster den Dialog „App wurde installiert“ mit Optionen.

## 7. Quellen

- Chrome-Hilfe Computer (de): https://support.google.com/chrome/answer/9658361?hl=de&co=GENIE.Platform%3DDesktop
- Chrome-Hilfe Android (de und en): https://support.google.com/chrome/answer/9658361?hl=de&co=GENIE.Platform%3DAndroid und https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid
- Chrome-Hilfe Verknüpfungen Android: https://support.google.com/chrome/answer/15085120?hl=en&co=GENIE.Platform%3DAndroid
- Umbenennung des Menüpunkts ab Chrome 150: https://github.com/philfung/add-to-homescreen/issues/110 und gHacks vom 2026-07-10 (laut Suchergebnis, Seite lieferte 403): https://www.ghacks.net/2026/07/10/chrome-for-android-adds-back-button-in-version-150-top-menu/
- Edge PWA (de): https://learn.microsoft.com/de-de/microsoft-edge/progressive-web-apps/ux
- Edge Apps installieren (de): https://support.microsoft.com/de-de/topic/installieren-verwalten-oder-deinstallieren-von-apps-in-microsoft-edge-0c156575-a94a-45e4-a54f-3a84846f6113
- Safari Web-Apps (Apple, de): https://support.apple.com/de-de/104996 und Safari-Handbuch https://support.apple.com/guide/safari/add-to-dock-ibrw9e991864/mac
- PWA-Installation allgemein (WebAPK, iOS-Verhalten): https://web.dev/learn/pwa/installation
- Chrome Apps unter macOS: https://www.makeuseof.com/run-web-apps-macos-using-chrome-shortcuts/
- Lokale Sprachdateien: Chrome `Google Chrome Framework.framework/…/de.lproj/locale.pak` (154.0.8037.98), Edge `Microsoft Edge Framework.framework/…/de.lproj/locale.pak` (154.0.4258.62, aus dem offiziellen Installer entpackt, nicht installiert), Chromium `ChromePublic.apk/assets/locales/de.pak` (157), Safari `Safari.app/…/de.lproj/WebAppInstallationViewController.strings` und `SafariShared.framework/…/de.lproj/Localizable.strings`.

- Chromium-Quelltext auf Tag `154.0.8037.98` (GitHub-Spiegelung `chromium/chromium`, Pfade relativ zur Wurzel): `chrome/browser/ui/views/web_apps/web_app_simple_install_dialog.cc` und `web_app_icon_name_and_origin_view.cc` (einfacher Dialog), `web_app_install_flow_dialog_delegate.cc`, `web_app_install_options_view.cc` (neuer Dialog), `chrome/browser/ui/web_applications/pwa_install_page_action.cc` (Symbol, Chip, Tooltip), `web_app_ui_manager_impl.cc` (Tab → App-Fenster), `components/webapps/browser/banners/app_banner_settings_helper.cc` (Abstände des Chips), `ui/views/bubble/bubble_dialog_model_host.cc` (Modal ohne Pfeil), `ui/views/style/platform_style.h` (Knopfreihenfolge), `chrome/common/chrome_features.cc` (`kWebAppInstallDialog`), `components/vector_icons/install_desktop.icon`, `chrome/app/generated_resources.grd` und `chrome/browser/ui/android/strings/android_chrome_strings.grd` (englische Quelltexte). Dieselben Dateien auf `main` (157.0.8090.0): Schalter `kWebAppInstallDialog` an.
- Microsoft Learn (de, Stand 2026-09-02, CC BY 4.0) samt Originalbildern `edge-app-install-flyout.png` und `pin-to-start-during-install.png` unter `https://learn.microsoft.com/de-de/microsoft-edge/progressive-web-apps/ux-images/`.
- Apple, Safari-Benutzerhandbuch (macOS 27, de): https://support.apple.com/de-de/guide/safari/ibrw9e991864/mac
- Chrome-Hilfe (de), Wortlaut am 2026-10-06 gelesen: Dreipunkt-Menü → „Streamen, speichern und teilen“ → „Seite als App installieren…“; „Auf einigen Websites müssen Sie rechts oben in der Adressleiste „Installieren“ auswählen.“

## 8. Abweichungen der aktuellen Landing und Empfehlung

### 8.1 Ist-Zustand (`engine/install.js`, `engine/logic.js`, `sections.tsx` › `Installieren`)

- Tab iPhone: Leiste mit ‹ › ↑ ⧉ und Teilen-Symbol **in der Leiste** (falsch). Sheet mit vier Zeilen „Kopieren ⌘C“, „Zur Leseliste hinzufügen“, „Zum Home-Bildschirm +“, „Lesezeichen hinzufügen“ (erfunden). Dialog „Zum Home-Bildschirm“ als Karte mit Knopf „Hinzufügen“ unten rechts (falsch). Icon-Pop mit Überschwinger (gibt es nicht). Schritttexte: „Teilen antippen.“, „„Zum Home-Bildschirm“ wählen.“, „„Hinzufügen“ antippen. Fertig.“.
- Tab Android: dasselbe Bottom-Sheet mit „Neuer Tab · Lesezeichen ☆ · App installieren + · Teilen“ (falsch: echtes Menü ist ein Popup mit 14 Einträgen und dem Eintrag „Installieren und Verknüpfung erstellen“). Dialog „App installieren“ mit gefülltem Knopf; echter Dialog hat Namensfeld und Textknöpfe.
- Tab Rechner: Fenster 600 × 400 mit „+“-Kasten als Symbol, Dialogtitel „App installieren?“ (falsch: bei Chrome 154 heißt der Titel „App installieren“ ohne Fragezeichen, das Symbol ist ein Monitor mit Pfeil mit Chip „Installieren“, der Dialog ein tab-modaler Kasten oben mittig statt einer Blase am Symbol; bei Edge ein Flyout „Installieren der ManaWG-App“). Kein Dock- oder Fenster-Ergebnis (echt: der Tab wandert in ein App-Fenster ohne Adressleiste).
- Schritttexte Android: „Menü ⋮ antippen.“, „„App installieren“ wählen.“, „„Installieren“ antippen. Fertig.“, Rechner: „Installieren-Symbol in der Adressleiste klicken.“, „„Installieren“ bestätigen.“, „ManaWG startet als eigenes Fenster.“.

### 8.2 Vorschlag Schritttexte (Original-Beschriftungen)

- iPhone: 1 „≡ antippen, dann „Teilen““ · 2 „„Mehr anzeigen“, dann „Zum Home-Bildschirm““ · 3 „„Hinzufügen“ antippen. Fertig.“
- Android: 1 „Menü ⋮ antippen.“ · 2 „„Installieren und Verknüpfung erstellen“, dann „Installieren““ · 3 „Im Dialog „Installieren“ bestätigen. Fertig.“ (älteres Chrome: „Zum Startbildschirm hinzufügen“)
- Rechner (Chrome): 1 „Symbol „Installieren“ rechts in der Adressleiste klicken.“ · 2 „Im Dialog „App installieren“ auf „Installieren“ klicken.“ · 3 „ManaWG öffnet als eigenes Fenster.“ · Edge: Symbol „App verfügbar“, im Flyout „Installieren“ · Safari: „Ablage → Zum Dock hinzufügen“, dann „Hinzufügen“.

### 8.3 Choreografie iPhone (Schleife ≈ 12,5 s, aus den gemessenen Zeiten)

| t (s) | Ereignis | Dauer der Bewegung |
|-------|----------|--------------------|
| 0,0 | Seite in Safari, Banner liegt unten | Ruhe 1,2 s |
| 1,2 | Tipp auf ≡ (115, 786), Menü wächst nach oben mit 5 % Überschwinger | 450 ms |
| 2,8 | Tipp auf „Teilen“ (176, 321), Menü zieht zusammen, Share-Sheet steigt auf | 530 ms |
| 4,5 | Tipp auf „Mehr anzeigen“ (323, 733), Sheet dehnt sich bis y = 48 | 350 ms |
| 6,2 | Tipp auf „Zum Home-Bildschirm“ (158, 635), Dialog fährt hoch, Tastatur folgt | 800 ms |
| 8,2 | Tipp auf „Hinzufügen“ (312, 85), Tastatur sinkt, Seite schrumpft, Springboard entblurrt, Icon schon da | 450 ms |
| 8,65 | Haltebild Home-Bildschirm mit „ManaWG“ | 1,8 s |
| 10,45 | Tipp auf das Icon: Zoom 0,4 s, schwarzes Startbild 0,4 s, Überblendung 0,3 s | 1,1 s |
| 11,55 | Haltebild App-Inhalt, dann Schleife | 0,95 s |

Android analog: Menü (0,65 s) → Sheet „Installieren und Verknüpfung erstellen“ → Dialog „App installieren“ (0,2 s) → Toast „„ManaWG“ wird installiert…“ → Home mit Icon → Splash (im Emulator Logo auf `#F4F6F6`, beim echten WebAPK vermutlich `#FFFFFF` aus dem Manifest [?]) → App.

Rechner (Chrome 154), nur Reihenfolge, **keine Messzeiten** [?]: Seite mit Symbol in der Adressleiste → Chip „Installieren“ klappt aus → Klick → Dialog „App installieren“ erscheint oben mittig → Klick „Installieren“ → der Tab wird zum App-Fenster ohne Adressleiste.

### 8.4 Offene Punkte

- Rechner nicht live aufgenommen (Grund in Abschnitt 4). Belegt sind Reihenfolge, Beschriftungen und Aufbau; Pixelmaße, Hervorhebung des Standardknopfs, Abdunklung der Seite und Bewegungsdauern der Dialoge fehlen [?]. Wer sie braucht, startet Chrome 154 mit leerem Profil (`--user-data-dir=<neu> --lang=de https://app.manawg.com`) und greift das Fenster mit `screencapture -l <Fenster-ID>` ab; die Fenster-ID liefert `CGWindowListCopyWindowInfo`.
- Endzustand eines echten Android-Geräts mit WebAPK nicht aufgenommen [?].
- iPhone nur im Safari-Layout „Kompakt“ geprüft; bei Layout „Oben“ liegen Leiste und Teilen-Position anders [?].
- Chrome auf Android zeigt die Werkzeugleiste je nach Version oben (124) oder unten (Chromium 157, ob das in Chrome-Stable 154/155 schon so ist: [?]); das Menü-Popup liegt immer rechts.
- Startzeiten der installierten Apps sind Simulator-/Emulator-Werte.

## 9. Bildverzeichnis `design/install-ref/`

iOS-Standbilder, 780 × 1688 px (2× pt), Sprache Deutsch, 09:41:

| Datei | Inhalt |
|-------|--------|
| `ios-01-seite-banner.webp` | Safari mit App-Banner „ManaWG als App installieren“ |
| `ios-02-app-anleitung.webp` | App-Dialog „So installierst du ManaWG“ (veralteter Text) |
| `ios-03-seitenmenue.webp` | Seitenmenü (≡) offen |
| `ios-04-share-kompakt.webp` | Share-Sheet kompakt |
| `ios-05-share-erweitert.webp` | Share-Sheet erweitert, „Zum Home-Bildschirm“ sichtbar |
| `ios-06-zum-home-dialog.webp` | Dialog „Zum Home-Bildschirm“ mit Tastatur |
| `ios-07-uebergang-zum-home.webp` | Übergangsbild nach „Hinzufügen“ (≈ +230 ms) |
| `ios-08-home-icon.webp` | Home-Bildschirm mit neuem Icon |
| `ios-09-app-start-zoom.webp` | App-Start, Zoom aus dem Icon |
| `ios-10-app-standalone.webp` | installierte App im Standalone-Modus |

iOS-Filmstreifen (Bilder alle 33 ms, Beschriftung in ms relativ zur ersten Reaktion): `ios-anim-1-seitenmenue`, `-2-teilen`, `-3-mehr-anzeigen`, `-4-zum-home-dialog`, `-5-hinzufuegen`, `-6-app-start`, `-7-app-inhalt-und-schliessen` (Überblendung schwarz → weiß, Inhalt, Rückkehr).

Android-Standbilder, 540 × 1200 px (2× dp ≈ 1,31), Chrome 124: `and-01-seite`, `and-02-chrome-menue`, `and-03-dialog-app-installieren`, `and-04-toast-wird-installiert`, `and-05-launcher-sheet`, `and-06-home-icon`, `and-07-splash`, `and-08-app-standalone`. Chromium 157 (neuer Menüpunkt): `and-new-01-menue-installieren-verknuepfung`, `and-new-02-sheet-installieren-oder-verknuepfung`, `and-new-03-dialog-app-installieren`.

Android-Filmstreifen (Chrome 124, Zeiten auf Echtzeit zurückgerechnet): `and-anim-1-chrome-menue`, `-2-dialog-erscheint`, `-3-installieren-toast`, `-4-launcher-sheet`, `-5-sheet-schliessen`, `-6-home`, `-7-app-start`.

App: `app-icon-512.webp`, `app-apple-touch-icon-180.webp`.

Rechner (Originalbilder aus Microsoft Learn, CC BY 4.0, Windows-Edge mit Beispiel-Apps): `desk-edge-flyout.webp` (670 × 321, Flyout „Installieren der Webboard-App“ mit „Installieren“ und „Jetzt nicht“), `desk-edge-postinstall-win.webp` (502 × 492, Dialog nach der Installation mit Kontrollkästchen sowie „Zulassen“ und „Nicht zulässig“).

Clip: `ios-flow-real.webm` (585 × 1266, 30 Bilder/s, 19,6 s, VP9, 0,7 MB), Beschreibung in 2.7.

## 10. Wiederholen

```
# iPhone (deutscher Zwilling, bereits angelegt)
xcrun simctl boot B1C61364-54EB-4171-B904-B3765A32D24F
xcrun simctl openurl B1C61364-54EB-4171-B904-B3765A32D24F https://app.manawg.com
idb ui tap --udid B1C61364-54EB-4171-B904-B3765A32D24F 115 786     # nach jedem Tipp Screenshot prüfen

# Android
~/Library/Android/sdk/emulator/emulator -avd ManaWG_InstallRef -no-snapshot-save -no-boot-anim -port 5556
adb -s emulator-5556 shell am start -a android.intent.action.VIEW -d https://app.manawg.com/ com.android.chrome
```

Rohmaterial (nicht im Repo, in der Sitzung erhalten), Wurzel `/private/tmp/claude-501/-Users-abu-Company/17c74616-ad5d-4e8c-a4ae-7a7cfcd35b9c/scratchpad/`: `install/ios-clean-1.mov` (iPhone, 35,5 s, 1170 × 2532) mit `install/ios-clean-1.log.json` (Tippprotokoll), `install2/and-take1.mp4` (Android Echtzeit, Chrome 124), `install2/and-slow1.mp4` (5-fach langsam, Chrome 124), `install2/and-cr-slow1.mp4` (5-fach langsam, Chromium 157) jeweils mit `.log.json`, Auswertung `install2/motion2.py`, `ins3/meas/edge.py` (Kantenmessung aus 2.6).

Aufgeräumt zum Abschluss (2026-10-06): Emulator `ManaWG_InstallRef` und Zwilling „ManaWG-Install-DE“ heruntergefahren, keine ManaWG-Symbole auf den Test-Startbildschirmen, Chromium 157 deinstalliert. iPhone 17e `CF14DEAC…` unverändert: das vorhandene ManaWG-Symbol steht auf Seite 2 genau einmal (am 2026-10-06 um 22:50 nachgeprüft, Seite danach wieder auf 1 gestellt).
