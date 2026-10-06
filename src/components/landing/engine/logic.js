export class Logic { // PORT
  PL = [['Ausgaben', 'Wer zahlt, trägt ein. ManaWG teilt auf.', 'Pizzaabend', 'Mika bezahlt · 4 Personen', '28,40 €'], ['Einkauf', 'Eine Liste für alle. Wer einkauft, hakt ab.', 'Hafermilch', '2 Packungen · von Mika', ''], ['Putzen', 'Ein Plan, der reihum geht.', 'Bad putzen', 'Lea · heute', ''], ['Pinnwand', 'Absprachen, die stehen bleiben.', 'Übergabe am Freitag', 'Jona · Schlüssel liegen im Flur bereit.', ''], ['Fixkosten', 'Miete, Strom und Internet mit Fälligkeit.', 'Internet', '29,99 € monatlich · nächste Zahlung am 3.', ''], ['Vorräte', 'Was im Haus ist, mit Mindestbestand.', 'Toilettenpapier', '2 Packungen · Mindestbestand 1', ''], ['Kalender', 'Termine für die ganze WG.', 'Putzplan-Check', 'Freitag · 18:00 Uhr', ''], ['Chat', 'Nachrichten in der WG.', 'In der WG', '„Bin um acht wieder da.“ · Lea', '']];
  state = { tab: 0, done: { 'Spülmittel': true }, added: false, replied: false, calc: { Lina: 1, Mika: 1, Jona: 1, Lea: 1 }, faq: 0, sel: 0, inst: 0 };
  renderVals() {
    const st = this.state, T = ['Start', 'Haushalt', 'Finanzen', 'Austausch'];
    const IT = [['Hafermilch', '2 Packungen · von Mika'], ['Bananen', '6 Stück · von Lea'], ['Spülmittel', '1 Flasche · von Jona'], ['Toilettenpapier', '2 Packungen · Vorrat 1']];
    const open = IT.filter(x => !st.done[x[0]]).length;
    const E = [['Pizzaabend', 'Mika bezahlt · durch 4', '28,40 €'], ['Internet', 'Fixkosten · monatlich', '29,99 €'], ['Wocheneinkauf', 'Lina bezahlt · durch 4', '18,90 €']];
    if (st.added) E.unshift(['Kinoabend', 'Jona bezahlt · Jona und Lea', '24,00 €']);
    const CPN = ['Mika', 'Lina', 'Jona', 'Lea'], cs = st.calc, cn = CPN.filter(p => cs[p]).length, each = cn ? 28.4 / cn : 0, fm = v => v.toFixed(2).replace('.', ',') + ' €';
    const FQ = [['Wie kommen meine Mitbewohner dazu?', 'Du erstellst die WG und teilst den Einladungslink. Wer ihn öffnet, kann beitreten.'], ['Brauche ich eine App aus dem Store?', 'Nein. ManaWG läuft im Browser unter app.manawg.com und lässt sich auf den Home-Bildschirm installieren.'], ['Wie wird abgerechnet?', 'Jede Ausgabe wird auf die Personen verteilt, die beteiligt waren. ManaWG zeigt, wer wem wie viel schuldet.']];
    const PLs = this.PL, pl = PLs[st.sel || 0];
    const IS = [['iPhone', ['Teilen antippen.', '„Zum Home-Bildschirm“ wählen.', '„Hinzufügen“ antippen. Fertig.']], ['Android', ['Menü ⋮ antippen.', '„App installieren“ wählen.', '„Installieren“ antippen. Fertig.']], ['Rechner', ['Installieren-Symbol in der Adressleiste klicken.', '„Installieren“ bestätigen.', 'ManaWG startet als eigenes Fenster.']]], ci = st.inst || 0;
    const SR = [[['Kopieren', '⌘C'], ['Zur Leseliste hinzufügen', ''], ['Zum Home-Bildschirm', '+'], ['Lesezeichen hinzufügen', '']], [['Neuer Tab', ''], ['Lesezeichen', '☆'], ['App installieren', '+'], ['Teilen', '']], [['', ''], ['', ''], ['', ''], ['', '']]];
    return {
      instTabs: IS.map((x, i) => ({ label: x[0], bg: i === ci ? '#FAFAFA' : 'transparent', col: i === ci ? '#0A0A0A' : '#FAFAFA', go: () => this.setState({ inst: i }) })),
      instSteps: IS[ci][1].map((t, i) => ({ n: '0' + (i + 1), t, i: String(i) })),
      sheetRows: SR[ci].map((r, i) => ({ t: r[0], k: r[1], tgt: i === 2 ? '2' : '', fw: i === 2 ? '600' : '400' })),
      dlgTitle: ['Zum Home-Bildschirm', 'App installieren', 'App installieren?'][ci], dlgBtn: ['Hinzufügen', 'Installieren', 'Installieren'][ci],
      plNo: String((st.sel || 0) + 1).padStart(2, '0'), plName: pl[0].toUpperCase(), plLine: pl[1], plTitle: pl[2], plDetail: pl[3], plAmt: pl[4],
      calcP: CPN.map(p => ({ name: p, bgD: cs[p] ? '#FAFAFA' : 'transparent', colD: cs[p] ? '#0A0A0A' : '#FAFAFA', bgL: cs[p] ? '#0A0A0A' : 'transparent', colL: cs[p] ? '#FAFAFA' : '#0A0A0A', toggle: () => this.setState(s => ({ calc: { ...s.calc, [p]: s.calc[p] ? 0 : 1 } })) })),
      calcEach: cn ? fm(each) : '0,00 €', calcInfo: cn ? 'PRO PERSON · ' + cn + ' VON 4 DABEI' : 'NIEMAND AUSGEWÄHLT',
      calcOwe: CPN.filter(p => p !== 'Mika' && cs[p]).map(p => ({ from: p, amt: fm(each) })),
      faqs: FQ.map((x, i) => ({ q: x[0], a: x[1], open: st.faq === i, mark: st.faq === i ? '−' : '+', toggle: () => this.setState(s => ({ faq: s.faq === i ? -1 : i })) })),
      tabTitle: ['WG Lindenstraße', 'Haushalt', 'Finanzen', 'Austausch'][st.tab],
      isStart: st.tab === 0, isHaus: st.tab === 1, isFin: st.tab === 2, isAus: st.tab === 3,
      saldo: st.added ? '12,00 €' : '0,00 €', saldoText: st.added ? 'Lea gibt Jona 12,00 €.' : 'Diesen Monat ist alles ausgeglichen.',
      lastAct: st.added ? 'Jona hat 24,00 € ausgelegt.' : 'Lina hat 18,90 € ausgelegt.',
      openCount: String(open), openText: open ? open + ' Dinge stehen auf der Liste.' : 'Die Liste ist leer.',
      items: IT.map((x, i) => { const d = !!st.done[x[0]]; return { title: x[0], detail: x[1], bt: i ? '1px solid #E5E5E5' : '0', bc: d ? '#0A0A0A' : '#D4D4D4', bg: d ? '#0A0A0A' : 'transparent', mark: d ? '✓' : '', deco: d ? 'line-through' : 'none', col: d ? '#737373' : '#0A0A0A', toggle: () => this.setState(s => ({ done: { ...s.done, [x[0]]: !s.done[x[0]] } })) }; }),
      exps: E.map((x, i) => ({ title: x[0], detail: x[1], amt: x[2], bt: i ? '1px solid #E5E5E5' : '0' })),
      addLabel: st.added ? 'Kinoabend entfernen' : 'Ausgabe erfassen', addExp: () => this.setState(s => ({ added: !s.added })),
      replyText: st.replied ? 'Passt, ich bin auch da.' : 'Antworten …', reply: () => this.setState(s => ({ replied: !s.replied })),
      tabs: T.map((l, i) => ({ label: l, bg: i === st.tab ? '#F5F5F5' : 'transparent', bd: i === st.tab ? '1px solid #E5E5E5' : '1px solid transparent', col: i === st.tab ? '#0A0A0A' : '#525252', go: () => this.setState({ tab: i }) }))
    };
  }
  V = [{ id: 'final', dots: 0, light: 0, st: 1 }];
  componentWillUnmount() { cancelAnimationFrame(this.raf); cancelAnimationFrame(this.raf2); cancelAnimationFrame(this.raf3); (this.sc || []).forEach(s => s && s.off()); }
} // PORT
