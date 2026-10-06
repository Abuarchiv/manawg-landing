// Hand + Handy: Hand-SDF im Fragment-Shader (je ein kleiner GL-Kontext für hinten/vorne), Bayer-Punkte im Bildschirmraum.
// Handy-UI ist echtes DOM zwischen den beiden Canvases. Rahmen und Tasten im selben Dither wie die Hand.
// Hochformat: Handy füllt die Breite und ist seitlich/unten angeschnitten, nur der Zeigefinger kommt von unten rechts.
import { space } from '../lib.js';

const PCX = 800, PCY = 400, FR = [[232, 1.0], [318, 1.05], [402, 0.98], [482, 0.84]];
const KS = [0, 4, 4, 16, 8, 4, 8, 4, 8, 4, 14, 5, 4, 34];
const f1 = (n) => (Number.isInteger(n) ? n + '.' : String(n));

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes,uO,uTipFar; uniform float uK; uniform int uPass;
uniform vec4 uA[14]; uniform vec2 uR[14]; uniform vec4 uT, uN, uHT; uniform float uHold;
out vec4 o;
const float LX=-.5,LY=-.62,LZ=.6;
const float KS[14]=float[14](${KS.map(f1).join(',')});
const vec2 FR[4]=vec2[4](${FR.map((g) => `vec2(${f1(g[0])},${f1(g[1])})`).join(',')});
const float BY[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
float cl(float x){return clamp(x,0.,1.);}
float smn(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
float cap(vec2 p,vec2 a,vec2 b,float r){vec2 pa=p-a,ba=b-a;return length(pa-ba*cl(dot(pa,ba)/dot(ba,ba)))-r;}
float uc(vec2 p,vec2 a,vec2 b,float ra,float rb){vec2 q0=p-a,e=b-a;float h=dot(e,e);float qx=abs((q0.x*e.y-q0.y*e.x)/h),qy=dot(q0,e)/h;
  float bb=ra-rb,cx=sqrt(max(h-bb*bb,1e-6)),cy=bb,k=cx*qy-cy*qx,m=cx*qx+cy*qy,n=qx*qx+qy*qy;
  if(k<0.)return sqrt(h*n)-ra; if(k>cx)return sqrt(h*(n+1.-2.*qy))-rb; return m-ra;}
float hsh(int i,int j){uint h=uint(i)*374761393u+uint(j)*668265263u;h=(h^(h>>13u))*1274126177u;return float(h^(h>>16u))/4294967295.;}
float holdBack(vec2 p){float d=(length(vec2((p.x-790.)/178.,(p.y-748.)/96.))-1.)*96.;
  d=smn(d,uc(p,vec2(770.,800.),vec2(690.,1160.),122.,142.),60.);
  d=smn(d,(length(vec2((p.x-905.)/66.,(p.y-690.)/92.))-1.)*66.,34.);
  d=smn(d,(length(vec2((p.x-640.)/74.,(p.y-705.)/96.))-1.)*74.,40.);
  for(int q=0;q<4;q++){float s=FR[q].y,y0=FR[q].x;float e=uc(p,vec2(900.,y0+30.),vec2(980.,y0+6.),25.*s,23.*s);
    e=smn(e,length(p-vec2(986.,y0+2.))-24.*s,6.);e=smn(e,uc(p,vec2(986.,y0-1.),vec2(972.,y0-8.),22.*s,20.*s),5.);d=smn(d,e,3.);}
  return d;}
float holdFront(vec2 p){float d=uc(p,vec2(612.,692.),vec2(600.,560.),40.,32.);d=smn(d,uc(p,vec2(600.,560.),vec2(616.,466.),31.,27.),5.);d=smn(d,uc(p,vec2(616.,466.),vec2(652.,412.),26.,21.),5.);
  for(int q=0;q<4;q++){float s=FR[q].y,y0=FR[q].x;float e=uc(p,vec2(986.,y0-1.),vec2(972.,y0-8.),22.*s,20.*s);e=smn(e,uc(p,vec2(968.,y0-8.),vec2(938.,y0-12.),19.*s,15.5*s),4.);d=min(d,e);}
  return d;}
float pointD(vec2 p){float d=1e9;for(int q=0;q<14;q++){float e=uc(p,uA[q].xy,uA[q].zw,uR[q].x,uR[q].y);d=q==0?e:smn(d,e,KS[q]);}return d;}
float nail(vec2 p,vec2 a,vec2 b,float t0,float L,float w){vec2 dd=b-a;float l=length(dd);vec2 u=dd/l,pp=p-a;float al=dot(pp,u),pe=-pp.x*u.y+pp.y*u.x,c=t0*l;float x=(al-c)/L,y=pe/w;return x*x+y*y;}
float phoneBox(vec2 p){vec2 q=abs(p-vec2(${PCX}.,${PCY}.))-vec2(104.,264.);return length(max(q,0.))+min(max(q.x,q.y),0.)-46.;}
float sdBox(vec2 p,vec2 c,vec2 h){vec2 q=abs(p-c)-h;return length(max(q,0.))+min(max(q.x,q.y),0.);}
float shade(vec2 g,float d,float R){float h=sqrt(cl(-d/R)),sl=(1.-h)*2.2;vec2 n=g/1.5*sl;float l=length(vec3(n,1.));float lam=max(0.,(dot(n,vec2(LX,LY))+LZ)/l);return pow(h,.3)*(.1+.85*lam)+pow(lam,12.)*.35;}
#define SHN(FN,p,d,R) shade(vec2(FN((p)+vec2(1.5,0.))-(d),FN((p)+vec2(0.,1.5))-(d)),d,R)
float lightF(vec2 p){return .45+.55*cl(1.-((p.x-450.)+(p.y-120.))/1100.);}
void main(){
  vec2 p=(vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)-uO)/uK;
  if(p.x<0.||p.y<0.||p.x>1280.||p.y>800.)discard;
  vec2 ij=floor((p-1.5)/2.5+.5),s=1.5+ij*2.5;int i=int(ij.x),j=int(ij.y);
  float lf=lightF(s),v=0.,ring=0.;
  if(uPass==0){
    if(s.x<440.||s.x>1140.)discard;
    float pb=phoneBox(s);
    if(pb>0.){float d=uHold>0.?holdBack(s):1e5;
      if(d<0.){v=SHN(holdBack,s,d,70.)*(.45+.6*lf)*cl(1.-(s.y-760.)/320.);if(d>-2.6&&s.x<880.)v=max(v,.95*lf);v*=.35+.65*cl(pb/26.);}
      else if(d<18.)v=.18*exp(-d/5.)*lf*(hsh(j,i)<.4?1.:0.);
      if(pb<3.)v=max(v,.85);
      float bt=min(min(sdBox(s,vec2(${PCX - 152}.,${PCY - 118}.),vec2(3.,16.)),sdBox(s,vec2(${PCX - 152}.,${PCY - 62}.),vec2(3.,28.))),sdBox(s,vec2(${PCX + 152}.,${PCY - 70}.),vec2(3.,42.)));
      if(bt<0.)v=max(v,.85);
    } else if(pb>-6.) v=.62+.3*lf;
  } else {
    float d=uHold>0.?holdFront(s):1e5;
    if(d<0.){v=shade(vec2(holdFront(s+vec2(1.5,0.))-d,holdFront(s+vec2(0.,1.5))-d),d,30.)*(.55+.55*lf);if(d>-2.2)v=max(v,.9*lf+.1);
      float nq=nail(s,vec2(616.,466.),vec2(652.,412.),.72,14.,11.);if(nq<1.)v=nq>.72?v*.45:min(1.,v*.6+.4);}
    else if(d<8.)v=.16*exp(-d/3.);
    if(cap(s,uT.xy,uTipFar,160.)<0.){float dp=pointD(s);
      if(dp<36.){float fade=cl(1.-(length(s-uT.xy)-300.)/420.),w=0.;
        if(dp<0.){w=SHN(pointD,s,dp,44.)*(.6+.45*lf+uT.w*.25)*fade;if(dp>-2.4)w=max(w,.92*fade);
          float nq=nail(s,uN.xy,uN.zw,.5,12.,10.);if(nq<1.)w=nq>.7?w*.45:min(1.,w*.6+.38);}
        else if(dp<14.)w=.16*exp(-dp/4.)*fade*(hsh(i,j+3)<.45?1.:0.);
        v=max(v,w);}}
    if(uHT.w>0.){vec2 r=p-uHT.xy;float q=floor(atan(r.y,r.x)/(6.2832/72.)+.5)*(6.2832/72.);vec2 cp=uHT.xy+uHT.z*vec2(cos(q),sin(q));vec2 c2=clamp((1.-abs(p-cp))*uK+.5,0.,1.);ring=c2.x*c2.y*uHT.w;}
  }
  float cov=0.;
  if(v>.02){float vv=v*(.78+.4*hsh(i,j));if(vv>BY[(j&3)*4+(i&3)]/16.+.035){float z=.9+1.5*min(1.,vv);vec2 c2=clamp((z*.5-abs(p-s))*uK+.5,0.,1.);cov=c2.x*c2.y;}}
  cov=max(cov,ring);if(cov<.003)discard;
  o=vec4(vec3(.98)*cov,cov);
}`;
const VS = '#version 300 es\nvoid main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}';

const mkGL = (cv, pass) => {
  const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false }); if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr); const u = {}; for (const n of ['uRes', 'uHold', 'uO', 'uTipFar', 'uK', 'uPass', 'uA', 'uR', 'uT', 'uN', 'uHT']) u[n] = gl.getUniformLocation(pr, n);
  gl.uniform1i(u.uPass, pass); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
  return { gl, u };
};

// Hochformat: Handy füllt die Breite, Seiten und Unterkante sind angeschnitten; Kopf bleibt unter dem Header frei.
const spaceH = (ctx) => { if (ctx.tier !== 'mobile') return space(ctx.vw, ctx.vh, 'desktop', PCX, PCY);
  const k = Math.min((ctx.vw + 8) / 300, (ctx.vh - 54) / 620), top = Math.max(70, (ctx.vh - 620 * k + 30) / 2); return { k, ox: ctx.vw / 2 - PCX * k, oy: top - 90 * k }; };

let el, hb, hf, G = [], phone, ht = { x: 860, y: 430 }, S = null;
const SG = new Float32Array(56), SR = new Float32Array(28);
const NAMES = ['WG Lindenstraße', 'Haushalt', 'Finanzen', 'Austausch'], ITEMS = ['Hafermilch', 'Bananen', 'Spülmittel', 'Toilettenpapier'];

const render = (st) => {
  const $ = (q) => el.querySelectorAll(q), bind = (k, v) => $(`[data-bind="${k}"]`).forEach((n) => (n.textContent = v));
  $('[data-pane]').forEach((p) => (p.hidden = +p.dataset.pane !== st.tab)); $('[data-tab]').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.tab === st.tab)));
  $('[data-item]').forEach((b) => b.setAttribute('aria-pressed', String(!!st.done[b.dataset.item])));
  const open = ITEMS.filter((n) => !st.done[n]).length;
  bind('title', NAMES[st.tab]); bind('openCount', open); bind('openText', open ? open + ' Dinge stehen auf der Liste.' : 'Die Liste ist leer.');
  bind('saldo', st.added ? '12,00 €' : '0,00 €'); bind('saldoText', st.added ? 'Lea gibt Jona 12,00 €.' : 'Diesen Monat ist alles ausgeglichen.'); bind('lastAct', st.added ? 'Jona hat 24,00 € ausgelegt.' : 'Lina hat 18,90 € ausgelegt.');
  $('[data-add]').forEach((b) => { b.textContent = st.added ? 'Kinoabend entfernen' : 'Ausgabe erfassen'; b.setAttribute('aria-pressed', String(st.added)); }); $('[data-added]').forEach((n) => (n.hidden = !st.added));
  $('[data-reply]').forEach((b) => { b.textContent = st.replied ? 'Passt, ich bin auch da.' : 'Antworten …'; b.setAttribute('aria-pressed', String(st.replied)); });
};

export default {
  init(root, ctx) {
    el = root; hb = el.querySelector('.hb'); hf = el.querySelector('.hf'); phone = el.querySelector('[data-phone]');
    const build = () => { try { G = [mkGL(hb, 0), mkGL(hf, 1)].filter(Boolean); } catch (e) { console.error('hand shader', e); G = []; } };
    build(); for (const c of [hb, hf]) { c.addEventListener('webglcontextlost', (e) => { e.preventDefault(); G = []; }); c.addEventListener('webglcontextrestored', build); }
    el.addEventListener('click', (e) => { const t = e.target.closest('[data-tab],[data-item],[data-add],[data-reply]'); if (!t) return;
      if (t.dataset.tab !== undefined) ctx.set({ tab: +t.dataset.tab }); else if (t.dataset.item) ctx.set((s) => ({ done: { ...s.done, [t.dataset.item]: !s.done[t.dataset.item] } })); else if (t.hasAttribute('data-add')) ctx.set((s) => ({ added: !s.added })); else ctx.set((s) => ({ replied: !s.replied })); });
    ctx.on(render);
  },
  resize(ctx) {
    for (const c of [hb, hf]) { const w = Math.round(ctx.vw * ctx.dpr), h = Math.round(ctx.vh * ctx.dpr); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } }
    S = spaceH(ctx); phone.style.transform = `translate(${S.ox + 650 * S.k}px,${S.oy + 90 * S.k}px) scale(${S.k})`;
  },
  frame(t, dt, ctx) {
    if (ctx.tl.e < 0.01 || !S || !G.length) return;
    const { k, ox, oy } = S, L = ctx.light, on = ctx.tl.e > 0.6 && L.on;
    const tg = on ? [(L.x - ox) / k, (L.y - oy) / k] : [840 + Math.sin(t * 0.7) * 50, 380 + Math.cos(t * 0.5) * 80], kd = ctx.d(18, dt); ht.x += (tg[0] - ht.x) * kd; ht.y += (tg[1] - ht.y) * kd;
    const pr = ctx.reduced ? 9 : t - ctx.clickT, push = pr < 0.4 ? Math.sin((pr / 0.4) * Math.PI) : 0;
    const ax = 1460 - ht.x, ay = 1020 - ht.y, AL = Math.hypot(ax, ay) || 1, ux = ax / AL, uy = ay / AL, nx = -uy, ny = ux;
    const sc = 1 - push * 0.06, tx = ht.x + ux * (6 + push * 4), ty = ht.y + uy * (6 + push * 4);
    const P = (a, b) => [tx + (ux * a + nx * b) * sc, ty + (uy * a + ny * b) * sc];
    const Sg = [[P(0, 0), P(34, 0), 15, 16.5], [P(34, 0), P(74, 0), 16.5, 17.5], [P(74, 0), P(132, 2), 17.5, 19.5], [P(140, 8), P(250, 26), 46, 58], [P(150, 38), P(118, 46), 20, 19], [P(118, 46), P(112, 64), 19, 17],
      [P(160, 66), P(130, 74), 19, 18], [P(130, 74), P(126, 90), 18, 16], [P(172, 92), P(146, 100), 16, 15], [P(146, 100), P(142, 114), 15, 13],
      [P(250, -40), P(190, -40), 30, 26], [P(190, -40), P(140, -28), 26, 21], [P(140, -28), P(104, -16), 21, 18], [P(260, 30), P(820, 40), 72, 92]];
    Sg.forEach((g, q) => { SG.set([g[0][0], g[0][1], g[1][0], g[1][1]], q * 4); SR[q * 2] = g[2] * sc; SR[q * 2 + 1] = g[3] * sc; });
    const tipFar = P(800, 10), n0 = P(4, 0), n1 = P(30, 0), ring = pr < 0.8 ? [10 + pr * 150, 1 - pr / 0.8] : [0, 0], K = k * ctx.dpr;
    for (const { gl, u } of G) { const w = gl.canvas.width, h = gl.canvas.height; gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u.uRes, w, h); gl.uniform2f(u.uO, ox * ctx.dpr, oy * ctx.dpr); gl.uniform1f(u.uK, K); gl.uniform1f(u.uHold, ctx.tier === 'mobile' ? 0 : 1); gl.uniform2f(u.uTipFar, tipFar[0], tipFar[1]);
      gl.uniform4fv(u.uA, SG); gl.uniform2fv(u.uR, SR); gl.uniform4f(u.uT, tx, ty, sc, push); gl.uniform4f(u.uN, n0[0], n0[1], n1[0], n1[1]); gl.uniform4f(u.uHT, ht.x, ht.y, ring[0], ring[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3); }
  },
  destroy() {},
};
