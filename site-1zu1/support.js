// Minimal x-dc runtime: only what final.html uses.
// <x-dc> + <helmet>, DCLogic (props/state/setState/renderVals/lifecycle),
// {{ path }} in text and attributes, sc-if, sc-for, onClick, style-hover, style-active.
(function () {
  const css = document.createElement('style');
  css.textContent = 'x-dc{display:block}sc-if,sc-for{display:contents}';
  document.head.appendChild(css);

  class DCLogic {
    constructor(props) { this.props = props; }
    setState(p) {
      const n = typeof p === 'function' ? p(this.state) : p;
      this.state = Object.assign({}, this.state, n);
      if (this.__update) this.__update();
    }
  }
  window.DCLogic = DCLogic;

  const EXPR = /\{\{\s*([^}]*?)\s*\}\}/g;
  const get = (path, scope) => {
    if (path === 'true') return true;
    if (path === 'false') return false;
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), scope);
  };
  const interp = (tpl, scope) => tpl.replace(EXPR, (_, p) => { const v = get(p, scope); return v == null ? '' : String(v); });
  const only = v => { const m = /^\{\{\s*([^}]*?)\s*\}\}$/.exec(v.trim()); return m && m[1]; };

  // Compile children of src into dst; returns list of update(scope) fns.
  function compile(srcNodes, dst) {
    const ups = [];
    srcNodes.forEach(src => {
      if (src.nodeType === 3) {
        const t = src.nodeValue, n = document.createTextNode(t);
        dst.appendChild(n);
        if (EXPR.test(t)) { EXPR.lastIndex = 0; ups.push(sc => { const v = interp(t, sc); if (n.nodeValue !== v) n.nodeValue = v; }); }
        EXPR.lastIndex = 0;
        return;
      }
      if (src.nodeType !== 1) return;
      const tag = src.localName, kids = [...src.childNodes];
      if (tag === 'sc-if') {
        const el = document.createElement('sc-if'); dst.appendChild(el);
        const cond = only(src.getAttribute('value')); let inner = null;
        ups.push(sc => {
          const on = !!get(cond, sc);
          if (on && !inner) inner = compile(kids, el);
          else if (!on && inner) { el.textContent = ''; inner = null; }
          if (inner) inner.forEach(f => f(sc));
        });
        return;
      }
      if (tag === 'sc-for') {
        const el = document.createElement('sc-for'); dst.appendChild(el);
        const list = only(src.getAttribute('list')), as = src.getAttribute('as') || 'item'; let inst = [];
        ups.push(sc => {
          const arr = get(list, sc) || [];
          if (arr.length !== inst.length) { el.textContent = ''; inst = arr.map(() => compile(kids, el)); }
          arr.forEach((item, i) => { const s2 = Object.create(sc); s2[as] = item; inst[i].forEach(f => f(s2)); });
        });
        return;
      }
      const el = src.cloneNode(false); dst.appendChild(el);
      let base = null, hov = null, act = null, styleTpl = null;
      [...el.attributes].map(a => a.name).forEach(name => {
        const val = src.getAttribute(name);
        if (name.startsWith('hint-placeholder')) { el.removeAttribute(name); return; }
        if (/^on[a-z]+$/.test(name) && only(val)) {
          el.removeAttribute(name);
          const p = only(val), ev = name.slice(2);
          el.addEventListener(ev, e => { const f = get(p, el.__scope); if (typeof f === 'function') f(e); });
          return;
        }
        if (name === 'style-hover') { hov = val; el.removeAttribute(name); return; }
        if (name === 'style-active') { act = val; el.removeAttribute(name); return; }
        if (name === 'style') { base = val; styleTpl = val; return; }
        if (EXPR.test(val)) { EXPR.lastIndex = 0; ups.push(sc => { const v = interp(val, sc); if (el.getAttribute(name) !== v) el.setAttribute(name, v); }); }
        EXPR.lastIndex = 0;
      });
      const paint = () => el.setAttribute('style', (el.__base || '') + (el.__h && hov ? ';' + hov : '') + (el.__a && act ? ';' + act : ''));
      if (styleTpl != null || hov || act) {
        el.__base = base || '';
        if (hov) { el.addEventListener('pointerenter', () => { el.__h = 1; paint(); }); el.addEventListener('pointerleave', () => { el.__h = 0; el.__a = 0; paint(); }); }
        if (act) { el.addEventListener('pointerdown', () => { el.__a = 1; paint(); }); ['pointerup', 'pointercancel'].forEach(e => el.addEventListener(e, () => { el.__a = 0; paint(); })); }
        ups.push(sc => { if (styleTpl != null) { const v = interp(styleTpl, sc); if (v !== el.__base) { el.__base = v; paint(); } } });
      }
      ups.push(sc => { el.__scope = sc; });
      ups.push(...compile(kids, el));
    });
    return ups;
  }

  function boot() {
    const xdc = document.querySelector('x-dc'), scr = document.querySelector('script[data-dc-script]');
    if (!xdc || !scr) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = xdc.innerHTML;
    const src = [...tpl.content.childNodes];
    const hel = src.find(n => n.localName === 'helmet');
    if (hel) [...hel.children].forEach(c => { if (c.localName === 'style') document.head.appendChild(c.cloneNode(true)); });
    const body = src.filter(n => n !== hel);
    const props = {}; try { const d = JSON.parse(scr.getAttribute('data-props') || '{}'); for (const k in d) props[k] = d[k].default; } catch (e) {}
    const Comp = new Function('DCLogic', scr.textContent + '\nreturn Component;')(DCLogic);
    const inst = new Comp(props);
    xdc.textContent = '';
    const ups = compile(body, xdc);
    inst.__update = () => { const v = inst.renderVals(); ups.forEach(f => f(v)); };
    inst.__update();
    if (inst.componentDidMount) inst.componentDidMount();
    // The faded-out intro overlay (data-art="stars") keeps pointer-events:auto at opacity 0 and would
    // swallow every click below it; only let it receive events while it is actually visible.
    setInterval(() => document.querySelectorAll('canvas[data-art="stars"]').forEach(c => { c.style.pointerEvents = parseFloat(getComputedStyle(c.parentElement).opacity) > 0.05 ? '' : 'none'; }), 100);
    window.addEventListener('pagehide', () => inst.componentWillUnmount && inst.componentWillUnmount());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
