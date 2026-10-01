# manawg-landing

Neustart der Landingpage. Alte Seite: Tag `archive/landing-v1-20261001`.

- Brief und Lusion-Lehren: `BRIEF.md`. Volle Analyse mit Videos: `~/Company/lusion-motion-study-2026-09-05/`.
- Blender-MCP (`blender`): Blender starten, Addon läuft automatisch (Port 9876). Prüfen: N-Panel → „MCP for Blender".
- TouchDesigner-MCP (`touchdesigner`, Plugin `touchdesigner@touchdesigner-mcp`): `/touchdesigner:launch` startet TD mit `mcp_webserver_base.tox` (Port 9981). Komponente liegt in `~/Company/tools/touchdesigner-mcp/`, Ordnerstruktur nicht ändern.
- Deploy: Vercel baut main automatisch. Solange kein Build existiert, bleibt die alte Prod-Version online.
