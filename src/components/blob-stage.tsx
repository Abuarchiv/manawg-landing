'use client';

import {
	APERTURE,
	type Ball,
	CAMERA_Z,
	FOV_Y,
	NAMES,
	TASKS,
	choresBalls,
	clamp01,
	euro,
	markBalls,
	markScale,
	moneyBalls,
	project,
	scatterBalls,
	smooth,
} from '@/lib/choreo';
import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

// Raymarching über acht Kugeln mit weicher Vereinigung. Das ist dieselbe Idee wie der
// Gooey-Filter der Bildmarke (Unschärfe + Schwelle), nur räumlich.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec4 uB[8]; uniform float uK;
uniform vec3 uAp; uniform float uMat; uniform float uCamZ; uniform float uTan; uniform vec2 uPtr;
out vec4 o;

float smin(float a, float b, float k){ float h = max(k - abs(a - b), 0.) / k; return min(a, b) - h * h * k * .25; }
float map(vec3 p){
	float d = 1e5;
	for (int i = 0; i < 8; i++) {
		vec4 b = uB[i];
		if (b.w < .002) continue;
		d = smin(d, length(p - b.xyz) - b.w, uK);
	}
	if (uAp.z > .001) d = max(d, -(length(p.xy - uAp.xy) - uAp.z));
	return d;
}
vec3 nrm(vec3 p){
	const vec2 e = vec2(1., -1.) * .0015;
	return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}
float ao(vec3 p, vec3 n){
	float a = 0., s = 1.;
	for (int i = 1; i <= 4; i++) { float h = .06 * float(i); a += (h - map(p + n * h)) * s; s *= .6; }
	return clamp(1. - 2.2 * a, 0., 1.);
}
// Studio: Softbox oben, zwei Lichtstreifen, ein Hauch Horizont. Der Pointer schiebt den Hauptstreifen.
vec3 env(vec3 d){
	float x0 = .62 + uPtr.x * .35;
	float top = smoothstep(.45, .95, d.y) * 1.3;
	float s1 = exp(-pow((d.x - x0) * 6., 2.)) * smoothstep(-.35, .45, d.y) * 1.8;
	float s2 = exp(-pow((d.x + .78) * 9., 2.)) * smoothstep(-.1, .6, d.y) * .55;
	float hor = exp(-abs(d.y + .05) * 18.) * .12;
	return vec3(top + s1 + s2 + hor);
}
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
	vec2 uv = (gl_FragCoord.xy * 2. - uRes) / uRes.y;
	vec3 ro = vec3(0., 0., uCamZ);
	vec3 rd = normalize(vec3(uv * uTan, -1.));
	float glow = exp(-length(uv - vec2(uPtr.x, uPtr.y) * .6) * 1.6);
	vec3 col = vec3(.0032) + vec3(.012) * glow;

	float t = 0.; bool hit = false;
	for (int i = 0; i < 80; i++) {
		vec3 p = ro + rd * t;
		float d = map(p);
		if (d < .0008 * t) { hit = true; break; }
		t += d * .9;
		if (t > 18.) break;
	}
	if (hit) {
		vec3 p = ro + rd * t;
		vec3 n = nrm(p);
		vec3 r = reflect(rd, n);
		float fr = pow(1. - max(dot(n, -rd), 0.), 5.);
		float occ = ao(p, n);
		vec3 L = normalize(vec3(.5, .8, .6));
		float dif = max(dot(n, L), 0.);
		vec3 black = vec3(.012) * (.3 + dif) + env(r) * (.035 + .9 * fr);
		vec3 white = vec3(.72) * (dif * .75 + .22) + env(r) * (.03 + .45 * fr) * .7;
		vec3 chrome = env(r) * .92 + vec3(.015);
		vec3 m = uMat < .5 ? black : (uMat < 1.5 ? white : chrome);
		col = m * occ;
	}
	col = 1. - exp(-col * 1.15);
	col = pow(col, vec3(1. / 2.2));
	col += (hash(gl_FragCoord.xy + fract(uTime) * 91.) - .5) * .028;
	o = vec4(col, 1.);
}`;

type StageName = 'hero' | 'merge' | 'money' | 'chores' | 'features' | 'final';

function compile(gl: WebGL2RenderingContext) {
	const prog = gl.createProgram();
	for (const [type, src] of [
		[gl.VERTEX_SHADER, VERT],
		[gl.FRAGMENT_SHADER, FRAG],
	] as const) {
		const sh = gl.createShader(type);
		if (!sh || !prog) return null;
		gl.shaderSource(sh, src);
		gl.compileShader(sh);
		if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
			console.error(gl.getShaderInfoLog(sh));
			return null;
		}
		gl.attachShader(prog, sh);
	}
	if (!prog) return null;
	gl.bindAttribLocation(prog, 0, 'p');
	gl.linkProgram(prog);
	return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

export function BlobStage() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const labelRoot = labelsRef.current;
		if (!canvas || !labelRoot) return;
		const root = document.documentElement;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
		const prog = gl && compile(gl);
		if (!gl || !prog) {
			root.dataset.webgl = 'off';
			return;
		}
		root.dataset.webgl = 'on';

		const lenis = reduced ? null : new Lenis({ autoRaf: true, lerp: 0.11 });

		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.useProgram(prog);
		const u = (n: string) => gl.getUniformLocation(prog, n);
		const U = {
			res: u('uRes'),
			time: u('uTime'),
			b: u('uB'),
			k: u('uK'),
			ap: u('uAp'),
			mat: u('uMat'),
			camZ: u('uCamZ'),
			tan: u('uTan'),
			ptr: u('uPtr'),
		};
		gl.uniform1f(U.camZ, CAMERA_Z);
		gl.uniform1f(U.tan, Math.tan(FOV_Y / 2));

		// ponytail: Auflösung adaptiv über die Framezeit, statt GPU-Erkennung.
		let quality = Math.min(devicePixelRatio, 1.5) * (innerWidth < 700 ? 0.7 : 1);
		const resize = () => {
			canvas.width = Math.round(innerWidth * quality);
			canvas.height = Math.round(innerHeight * quality);
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.uniform2f(U.res, canvas.width, canvas.height);
		};
		resize();
		addEventListener('resize', resize);

		const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
		const onMove = (e: PointerEvent) => {
			ptr.tx = (e.clientX / innerWidth) * 2 - 1;
			ptr.ty = -((e.clientY / innerHeight) * 2 - 1);
		};
		addEventListener('pointermove', onMove, { passive: true });
		let mat = 0;
		const matTarget = { v: 0 };
		const onClick = (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest('a,button,[data-no-material]')) return;
			const stage = (e.target as HTMLElement).closest('[data-stage]') as HTMLElement | null;
			if (!stage || stage.dataset.stage === 'features') return;
			matTarget.v = (matTarget.v + 1) % 3;
			mat = matTarget.v;
			root.dataset.material = String(mat);
		};
		addEventListener('click', onClick);

		const stages = [...document.querySelectorAll<HTMLElement>('[data-stage]')];
		const pos: Ball[] = scatterBalls(innerWidth / innerHeight, 0);
		const vel = pos.map(() => [0, 0, 0, 0]);
		const k = { v: 0.06, vel: 0 };
		const ap = { v: 0 };

		const labels = [...labelRoot.querySelectorAll<HTMLElement>('[data-ball]')];
		const taskLabels = [...labelRoot.querySelectorAll<HTMLElement>('[data-task]')];

		let raf = 0;
		let last = performance.now();
		let slow = 0;
		const start = last;
		const flat = new Float32Array(32);

		const frame = (now: number) => {
			raf = requestAnimationFrame(frame);
			const dt = Math.min(0.05, (now - last) / 1000);
			last = now;
			const time = reduced ? 0 : (now - start) / 1000;
			const aspect = innerWidth / innerHeight;
			const vh = innerHeight;

			// Adaptive Qualität: dauerhaft unter ~40 fps → Auflösung senken.
			slow = dt > 0.025 ? slow + 1 : Math.max(0, slow - 1);
			if (slow > 40 && quality > 0.45) {
				quality *= 0.8;
				slow = 0;
				resize();
			}

			// Bühne + lokaler Fortschritt (sticky: 0 beim Eintritt, 1 kurz vor dem Austritt).
			let active: StageName = 'hero';
			let t = 0;
			for (const el of stages) {
				const r = el.getBoundingClientRect();
				const local = clamp01(-r.top / Math.max(1, r.height - vh));
				el.style.setProperty('--t', local.toFixed(4));
				for (const n of el.querySelectorAll<HTMLElement>('[data-show]')) {
					const [a, b] = (n.dataset.show ?? '0,1').split(',').map(Number);
					n.classList.toggle('on', local >= a && local < b);
				}
				for (const n of el.querySelectorAll<HTMLElement>('[data-count]')) {
					const [from, to, a, b] = (n.dataset.count ?? '').split(',').map(Number);
					n.textContent = euro(from + (to - from) * smooth(a, b, local));
				}
				if (r.top <= vh * 0.5 && r.bottom > vh * 0.5) {
					active = el.dataset.stage as StageName;
					t = local;
				}
			}
			root.dataset.stage = active;

			let target: Ball[];
			let kT = 0.06;
			let apT = 0;
			let turn = 0;
			const s = markScale(aspect);
			if (active === 'hero') {
				target = scatterBalls(aspect, time);
			} else if (active === 'merge') {
				const m = smooth(0.05, 0.7, t);
				const sc = scatterBalls(aspect, time);
				const mk = markBalls(s);
				target = sc.map((b, i) => b.map((v, j) => v + (mk[i][j] - v) * m) as Ball);
				kT = 0.06 + 0.5 * smooth(0.35, 0.8, t);
				apT = smooth(0.75, 0.95, t);
			} else if (active === 'money') {
				target = moneyBalls(t, aspect);
				kT = 0.56 - 0.36 * smooth(0.55, 0.8, t);
			} else if (active === 'chores' || active === 'features') {
				const c = choresBalls(active === 'features' ? 1 : t, aspect);
				target = c.balls;
				turn = c.turn;
				kT = 0.2;
			} else {
				target = markBalls(markScale(aspect, 0.62), 0, aspect > 1 ? 0.25 : 0.55);
				kT = 0.56;
				apT = 1;
			}

			// Pointer zieht leicht an den Körpern (nicht im reduzierten Modus).
			ptr.x += (ptr.tx - ptr.x) * 0.06;
			ptr.y += (ptr.ty - ptr.y) * 0.06;
			const half = CAMERA_Z * Math.tan(FOV_Y / 2);
			const px = ptr.x * half * aspect;
			const py = ptr.y * half;

			for (let i = 0; i < 8; i++) {
				const tg = target[i];
				const dx = px - tg[0];
				const dy = py - tg[1];
				const pull = reduced || active === 'money' ? 0 : 0.35 / (1 + (dx * dx + dy * dy) * 1.4);
				const goal = [tg[0] + dx * pull * 0.3, tg[1] + dy * pull * 0.3, tg[2], tg[3]];
				for (let j = 0; j < 4; j++) {
					if (reduced) {
						pos[i][j] = goal[j];
						continue;
					}
					// Feder mit leichtem Nachschwingen; jeder Körper hat ein eigenes Gewicht.
					const stiff = 38 - i * 2.2;
					vel[i][j] += (goal[j] - pos[i][j]) * stiff * dt;
					vel[i][j] *= Math.exp(-7.5 * dt);
					pos[i][j] += vel[i][j] * dt;
				}
				flat.set([pos[i][0], pos[i][1], pos[i][2], Math.max(0, pos[i][3])], i * 4);
			}
			k.v += (kT - k.v) * (reduced ? 1 : 1 - Math.exp(-4 * dt));
			ap.v += (apT - ap.v) * (reduced ? 1 : 1 - Math.exp(-5 * dt));

			gl.uniform4fv(U.b, flat);
			gl.uniform1f(U.k, Math.max(0.01, k.v));
			gl.uniform3f(U.ap, APERTURE.x * s, APERTURE.y * s, APERTURE.r * s * ap.v);
			gl.uniform1f(U.mat, mat);
			gl.uniform1f(U.time, time);
			gl.uniform2f(U.ptr, ptr.x, ptr.y);
			gl.drawArrays(gl.TRIANGLES, 0, 3);

			// Beschriftungen an den Körpern.
			const showMoney = active === 'money';
			const showChores = active === 'chores';
			labels.forEach((el, i) => {
				const b = pos[i];
				const p = project(b[0], b[1], b[2], aspect);
				let text = '';
				let on = false;
				if (showMoney) {
					const split = t > 0.62;
					on = split ? i < 4 : i === 0 && t > 0.3;
					text = split ? `${NAMES[i] ?? ''} · ${euro(12)}` : euro(48);
				} else if (showChores && i < 4) {
					on = true;
					text = NAMES[i];
				}
				el.classList.toggle('on', on);
				if (on) {
					if (el.textContent !== text) el.textContent = text;
					el.style.transform = `translate3d(${p.x * innerWidth}px, ${p.y * vh}px, 0) translate(-50%, -50%)`;
				}
			});
			const ring = choresBalls(0, aspect).balls;
			taskLabels.forEach((el, i) => {
				el.classList.toggle('on', showChores);
				if (!showChores) return;
				const b = ring[i];
				const out = 1.62;
				const p = project(b[0] * out, b[1] * out, 0, aspect);
				el.style.transform = `translate3d(${p.x * innerWidth}px, ${p.y * vh}px, 0) translate(-50%, -50%)`;
				const owner = NAMES[(((i - Math.round(turn)) % 4) + 4) % 4];
				el.dataset.owner = owner;
				const ownerNode = el.querySelector('span');
				if (ownerNode && ownerNode.textContent !== owner) ownerNode.textContent = owner;
			});
		};
		raf = requestAnimationFrame(frame);

		return () => {
			cancelAnimationFrame(raf);
			lenis?.destroy();
			removeEventListener('resize', resize);
			removeEventListener('pointermove', onMove);
			removeEventListener('click', onClick);
		};
	}, []);

	return (
		<>
			<canvas ref={canvasRef} className="stage-canvas" aria-hidden="true" />
			<div ref={labelsRef} className="stage-labels" aria-hidden="true">
				{NAMES.concat(NAMES).map((n, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: feste Reihenfolge, acht Körper
					<div key={i} data-ball={i} className="ball-label">
						{n}
					</div>
				))}
				{TASKS.map((task) => (
					<div key={task} data-task={task} className="task-label">
						{task}
						<span />
					</div>
				))}
			</div>
		</>
	);
}
