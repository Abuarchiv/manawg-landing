import Lenis from 'lenis';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { fahrt } from './fahrt.js';
import { loader } from './loader.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (x) => x * x * (3 - 2 * x);
const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;
const _eur = (n) => n.toFixed(2).replace('.', ',');

// Bildschirm 390 × 844 px (47 px Statusleiste + echte App 390 × 797) → 3,3 × 7,14 m in der Szene.
// Zielflächen sind in der echten App gemessen (app/rects.mjs, Demo-WG auf der Startseite).
const SW = 390;
const SH = 844;
const ST = 47;
const K = 3.3 / SW;
const PH = 0.365;
const LAYOUT = {
	bad: [16, 97, 358, 54],
	geld: [16, 151, 358, 108],
	einkauf: [16, 259, 358, 55],
	woche: [16, 373, 358, 171],
	start: [12, 742, 89, 44],
	haushalt: [105, 742, 89, 44],
	finanzen: [197, 742, 89, 44],
	austausch: [290, 742, 89, 44],
};
const toWorld = ([x, y, w, h]) => ({
	x: (x + w / 2 - SW / 2) * K,
	z: (y + ST + h / 2 - SH / 2) * K,
	w: w * K,
	d: h * K,
});
const homeImg = new Image();
homeImg.src = 'plan/home.webp';
await homeImg.decode(); // Startseite der echten App, 3×

// Renderer
const canvas = $('#gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xebe7e1);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(
	new RoomEnvironment(),
	0.04,
).texture;
scene.environmentIntensity = 0.55;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
camera.up.set(0, 0, -1);

const sun = new THREE.DirectionalLight(0xfff1de, 2.6);
sun.position.set(-9, 16, -6);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = sun.shadow.camera.bottom = -11;
sun.shadow.camera.right = sun.shadow.camera.top = 11;
sun.shadow.radius = 6;
sun.shadow.bias = -0.0005;
scene.add(sun, new THREE.HemisphereLight(0xffffff, 0xd8cbb8, 0.7));
const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(80, 80),
	new THREE.ShadowMaterial({ opacity: 0.13 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Materialien
const planks = (() => {
	const c = document.createElement('canvas');
	c.width = 512;
	c.height = 512;
	const g = c.getContext('2d');
	for (let i = 0; i < 16; i++) {
		const l = 72 + Math.random() * 8;
		g.fillStyle = `hsl(32, 38%, ${l}%)`;
		g.fillRect(0, i * 32, 512, 31);
		g.fillStyle = 'rgba(90,60,30,0.18)';
		g.fillRect((i * 197) % 512, i * 32, 1.5, 32);
	}
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	t.wrapS = t.wrapT = THREE.RepeatWrapping;
	return t;
})();
const M = {
	white: new THREE.MeshStandardMaterial({ color: 0xf6f3ee, roughness: 0.85 }),
	soft: new THREE.MeshStandardMaterial({ color: 0xe6dfd5, roughness: 0.9 }),
	dark: new THREE.MeshStandardMaterial({ color: 0x1d1b19, roughness: 0.55 }),
	chrome: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.12 }),
	tile: new THREE.MeshStandardMaterial({ color: 0xf2efea, roughness: 0.4 }),
	rug: new THREE.MeshStandardMaterial({ color: 0x8a3b2c, roughness: 1 }),
	akari: new THREE.MeshStandardMaterial({
		color: 0xfff4e0,
		emissive: 0xffd9a0,
		emissiveIntensity: 1.4,
		roughness: 1,
	}),
	edge: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }),
};

// Grundriss in Metern, Ursprung oben links
const ROOMS = [
	{ name: 'Küche', fn: 'Einkaufsliste', to: 'einkauf', r: [0, 0, 4, 3.6] },
	{ name: 'Wohnzimmer', fn: 'Offene Beträge', to: 'geld', r: [4, 0, 5, 3.6] },
	{ name: 'Bad', fn: 'Bad putzen', to: 'bad', r: [9, 0, 3, 3.6] },
	{ name: 'Flur', fn: 'Diese Woche', to: 'woche', r: [0, 3.6, 12, 1.4] },
	{ name: 'Leas Zimmer', fn: 'Start', to: 'start', r: [0, 5, 3, 3.2], av: 1 },
	{ name: 'Mikas Zimmer', fn: 'Haushalt', to: 'haushalt', r: [3, 5, 3, 3.2], av: 1 },
	{ name: 'Jonas Zimmer', fn: 'Finanzen', to: 'finanzen', r: [6, 5, 3, 3.2], av: 1 },
	{ name: 'Samis Zimmer', fn: 'Austausch', to: 'austausch', r: [9, 5, 3, 3.2], av: 1 },
];
const OX = 6;
const OZ = 4.1;
const P = (x, z) => [x - OX, z - OZ];

const walls = new THREE.Group();
const furn = new THREE.Group();
scene.add(walls, furn);
const box = (parent, mat, x, z, w, d, h, y = 0, _rad = 0) => {
	const [px, pz] = P(x, z);
	const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
	m.position.set(px, y + h / 2, pz);
	m.castShadow = m.receiveShadow = true;
	parent.add(m);
	return m;
};
const cyl = (parent, mat, x, z, r, h, y = 0) => {
	const [px, pz] = P(x, z);
	const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40), mat);
	m.position.set(px, y + h / 2, pz);
	m.castShadow = m.receiveShadow = true;
	parent.add(m);
	return m;
};
const ball = (parent, mat, x, z, r, y) => {
	const [px, pz] = P(x, z);
	const m = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), mat);
	m.position.set(px, y, pz);
	m.castShadow = true;
	parent.add(m);
	return m;
};

// Schnittmodell: Wände 1,25 m hoch, Türlücken als Aussparung
const WH = 1.25;
const WT = 0.12;
const wallRun = (x0, z0, x1, z1, gaps = []) => {
	const horiz = z0 === z1;
	const len = horiz ? x1 - x0 : z1 - z0;
	const cuts = [0, ...gaps.flatMap((g) => [g - 0.45, g + 0.45]), len];
	for (let i = 0; i < cuts.length; i += 2) {
		const a = cuts[i];
		const b = cuts[i + 1];
		if (b - a < 0.05) continue;
		if (horiz) box(walls, M.white, x0 + (a + b) / 2, z0, b - a + WT, WT, WH);
		else box(walls, M.white, x0, z0 + (a + b) / 2, WT, b - a + WT, WH);
	}
};
wallRun(0, 0, 12, 0);
wallRun(0, 8.2, 12, 8.2);
wallRun(0, 0, 0, 8.2, [4.3]);
wallRun(12, 0, 12, 8.2);
wallRun(0, 3.6, 12, 3.6, [2, 6.5, 10.5]);
wallRun(0, 5, 12, 5, [1.5, 4.5, 7.5, 10.5]);
wallRun(4, 0, 4, 3.6, [1.6]);
wallRun(9, 0, 9, 3.6);
for (const x of [3, 6, 9]) wallRun(x, 5, x, 8.2);
// Fensterbänder in Chrom an der Straßenseite
for (const x of [1.5, 5.4, 7.6, 10.5]) box(walls, M.chrome, x, 0, 1.1, 0.16, 0.04, WH);

// Möbel
box(furn, M.white, 0.35, 1.8, 0.6, 3.2, 0.9);
box(furn, M.chrome, 0.35, 1.0, 0.5, 0.6, 0.02, 0.9);
box(furn, M.white, 2.2, 0.35, 2.8, 0.6, 0.9);
box(furn, M.soft, 3.6, 0.4, 0.7, 0.7, 1.9);
cyl(furn, M.white, 2.3, 2.3, 0.6, 0.74);
for (const a of [0, 1.57, 3.14, 4.71])
	cyl(furn, M.chrome, 2.3 + Math.cos(a) * 0.85, 2.3 + Math.sin(a) * 0.85, 0.2, 0.45);
box(furn, M.rug, 6.6, 1.8, 3, 2.1, 0.015);
box(furn, M.white, 6.6, 1.8, 1.8, 0.9, 0.74);
for (const dx of [-0.55, 0.55])
	for (const dz of [-0.65, 0.65]) cyl(furn, M.dark, 6.6 + dx, 1.8 + dz, 0.2, 0.46);
const _togo = box(furn, M.dark, 8.3, 2.1, 0.9, 2.2, 0.42);
ball(furn, M.akari, 8.3, 0.6, 0.32, 1.3);
cyl(furn, M.chrome, 4.6, 0.5, 0.3, 1.2);
box(furn, M.soft, 4.4, 3.2, 1.6, 0.4, 0.5);
box(furn, M.tile, 10.5, 0.55, 2.4, 0.8, 0.55);
cyl(furn, M.tile, 9.6, 3.0, 0.3, 0.85);
box(furn, M.chrome, 11.6, 2.6, 0.3, 0.5, 0.05, 1.0);
box(furn, M.soft, 0.4, 4.3, 0.4, 1.2, 1.7);
for (let i = 0; i < 4; i++) ball(furn, M.chrome, 11.2 - i * 0.35, 3.75, 0.06, 1.5);
for (let i = 0; i < 4; i++) {
	const x = i * 3;
	box(furn, M.soft, x + 1.0, 7.3, 1.4, 1.6, 0.45);
	box(furn, M.white, x + 1.0, 6.6, 1.4, 0.3, 0.12, 0.45);
	box(furn, M.white, x + 2.4, 5.6, 0.9, 0.55, 0.74);
	ball(furn, M.akari, x + 2.6, 5.5, 0.12, 0.92);
}

// Kacheln: Boden oben, Ausschnitt der echten App nach dem Umklappen
function cardTex(room) {
	const [x, y, w, h] = LAYOUT[room.to];
	const c = document.createElement('canvas');
	c.width = w * 3;
	c.height = h * 3;
	c.getContext('2d').drawImage(homeImg, x * 3, y * 3, w * 3, h * 3, 0, 0, w * 3, h * 3);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	t.anisotropy = 8;
	return t;
}
const tiles = ROOMS.map((room, i) => {
	const [x, z, w, d] = room.r;
	const [px, pz] = P(x + w / 2, z + d / 2);
	const floorTex = planks.clone();
	floorTex.needsUpdate = true;
	floorTex.repeat.set(w / 3, d / 3);
	if (room.av) floorTex.rotation = Math.PI / 2;
	const floor = new THREE.MeshStandardMaterial({
		map: room.name === 'Bad' ? null : floorTex,
		color: room.name === 'Bad' ? 0xeceae6 : 0xffffff,
		roughness: 0.7,
	});
	const card = new THREE.MeshBasicMaterial({ map: cardTex(room), toneMapped: false });
	const mats = [M.edge, M.edge, floor, M.edge, M.edge, M.edge];
	const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mats);
	mesh.castShadow = mesh.receiveShadow = true;
	scene.add(mesh);
	const to = toWorld(LAYOUT[room.to]);
	return { room, mesh, mats, floor, card, from: { x: px, z: pz, w: w - 0.04, d: d - 0.04 }, to, i };
});

// Blender-Wohnung von Codex (wohnung/wohnung.glb). Fehlt sie, bleibt das Platzhalter-Modell.
// Erwartet: Boden_<Raum> mit Möbeln als Kindern, Wände in der Collection "Waende" (Namen Wand_*), Mitte im Ursprung.
const BODEN = {
	Küche: 'Boden_Kueche',
	Wohnzimmer: 'Boden_Wohnzimmer',
	Bad: 'Boden_Bad',
	Flur: 'Boden_Flur',
	'Leas Zimmer': 'Boden_Lea',
	'Mikas Zimmer': 'Boden_Max',
	'Jonas Zimmer': 'Boden_Jonas',
	'Samis Zimmer': 'Boden_Hannah',
};
let glb = null;
try {
	const url = new URLSearchParams(location.search).get('glb');
	if (!url) throw new Error('ohne glb'); // Echtzeit-Modell nur zum Testen; Produktion nutzt die Cycles-Draufsicht
	const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
	const g = await new GLTFLoader().loadAsync(url);
	glb = { root: g.scene, walls: [], floors: new Map() };
	g.scene.traverse((o) => {
		if (o.isMesh) o.castShadow = o.receiveShadow = true;
	});
	// Alles, was kein Boden ist (Wände, Fenster, Glas, Stuck), sinkt gemeinsam weg
	glb.walls = g.scene.children.filter((o) => !o.name.startsWith('Boden_'));
	for (const k of tiles) {
		const f = g.scene.getObjectByName(BODEN[k.room.name]);
		if (!f) continue;
		glb.floors.set(k, f);
		// Teile außerhalb des Raums (Türblätter, Fensterbank-Pflanzen) bleiben beim Abheben zurück
		const c = new THREE.Vector3();
		f.userData.outside = f.children.filter((o) => {
			new THREE.Box3().setFromObject(o).getCenter(c);
			return (
				Math.abs(c.x - k.from.x) > k.from.w / 2 - 0.2 ||
				Math.abs(c.z - k.from.z) > k.from.d / 2 - 0.2
			);
		});
		const mesh = f.isMesh ? f : f.children.find((c) => c.isMesh && !c.children.length);
		if (mesh?.material?.map) {
			k.floor.map = mesh.material.map;
			k.floor.color.set(0xffffff);
			k.floor.needsUpdate = true;
		}
	}
	scene.add(g.scene);
	walls.visible = furn.visible = false;
} catch (_e) {}

// Cycles-Draufsicht aus Blender (wohnung/oben.py): a = Wände auf 1,1 m, b = nur Böden + Möbel, 12,4 × 8,6 m
let planA = null;
try {
	const tl = new THREE.TextureLoader();
	const [ta, tb] = await Promise.all(['a', 'b'].map((x) => tl.loadAsync(`plan/oben-${x}.webp`)));
	for (const t of [ta, tb]) {
		t.colorSpace = THREE.SRGBColorSpace;
		t.anisotropy = 8;
	}
	planA = new THREE.Mesh(
		new THREE.PlaneGeometry(12.4, 8.6).rotateX(-Math.PI / 2),
		new THREE.MeshBasicMaterial({
			map: ta,
			transparent: true,
			opacity: 0,
			toneMapped: false,
			depthWrite: false,
		}),
	);
	planA.position.y = 0.09;
	scene.add(planA);
	for (const k of tiles) {
		const [x, z, w, d] = k.room.r;
		const t = tb.clone();
		t.repeat.set(w / 12.4, d / 8.6);
		t.offset.set((x + 0.2) / 12.4, 1 - (z + d + 0.2) / 8.6);
		t.needsUpdate = true;
		k.floor = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
		k.mats[2] = k.floor;
	}
	glb?.floors.clear(); // Räume fliegen als Foto-Kacheln, nicht als Echtzeit-Modell
} catch (_e) {}

// Handy
const rrShape = (w, h, r) => {
	const s = new THREE.Shape();
	const x = -w / 2;
	const y = -h / 2;
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.quadraticCurveTo(x + w, y, x + w, y + r);
	s.lineTo(x + w, y + h - r);
	s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	s.lineTo(x + r, y + h);
	s.quadraticCurveTo(x, y + h, x, y + h - r);
	s.lineTo(x, y + r);
	s.quadraticCurveTo(x, y, x + r, y);
	return s;
};
const phone = new THREE.Group();
scene.add(phone);
const SWm = SW * K;
const SHm = SH * K;
const bodyGeo = new THREE.ExtrudeGeometry(rrShape(SWm + 0.3, SHm + 0.3, 0.52), {
	depth: 0.3,
	bevelEnabled: true,
	bevelThickness: 0.06,
	bevelSize: 0.06,
	bevelSegments: 6,
	curveSegments: 24,
});
bodyGeo.rotateX(-Math.PI / 2);
const body = new THREE.Mesh(
	bodyGeo,
	new THREE.MeshPhysicalMaterial({
		color: 0x1a1a1c,
		metalness: 0.9,
		roughness: 0.28,
		clearcoat: 1,
		clearcoatRoughness: 0.15,
	}),
);
body.castShadow = true;
phone.add(body);
const scrGeo = new THREE.ShapeGeometry(rrShape(SWm, SHm, 43 * K), 24);
scrGeo.rotateX(-Math.PI / 2);
const scr = new THREE.Mesh(
	scrGeo,
	new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
);
scr.position.y = PH + 0.002;
phone.add(scr);
const homeTex = (() => {
	const c = document.createElement('canvas');
	c.width = SW * 3;
	c.height = SH * 3;
	const g = c.getContext('2d');
	g.scale(3, 3);
	g.beginPath();
	g.roundRect(0, 0, SW, SH, 43);
	g.clip();
	g.fillStyle = '#fff';
	g.fillRect(0, 0, SW, SH);
	g.drawImage(homeImg, 0, ST, SW, SH - ST);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	t.anisotropy = 8;
	return t;
})();
const homeScr = new THREE.Mesh(
	new THREE.PlaneGeometry(SWm, SHm).rotateX(-Math.PI / 2),
	new THREE.MeshBasicMaterial({
		map: homeTex,
		transparent: true,
		opacity: 0,
		toneMapped: false,
		depthWrite: false,
	}),
);
homeScr.position.y = PH + 0.003;
phone.add(homeScr);
const isl = new THREE.Mesh(
	new THREE.ShapeGeometry(rrShape(116 * K, 32 * K, 16 * K), 12).rotateX(-Math.PI / 2),
	new THREE.MeshBasicMaterial({ color: 0x000000 }),
);
isl.position.set(0, PH + 0.004, (27 - SH / 2) * K);
phone.add(isl);
phone.visible = false;

// Beschriftungen
const labelsEl = $('.labels');
const labels = ROOMS.map((r) => {
	const el = document.createElement('div');
	el.className = 'label';
	el.innerHTML = `<span class="from">${r.name}</span><span class="to">${r.fn}</span>`;
	labelsEl.appendChild(el);
	return el;
});

// Kamera
let aspect = 1;
let fitPlan = 20;
let fitPhone = 18;
function resize() {
	const w = innerWidth;
	const h = innerHeight;
	renderer.setSize(w, h, false);
	aspect = w / h;
	camera.aspect = aspect;
	// Querformat: Modell rechts, Text links. Hochformat: Text oben, Modell darunter.
	const portrait = aspect < 0.8;
	camera.setViewOffset(w, h, portrait ? 0 : -w * 0.12, portrait ? -h * 0.17 : 0, w, h);
	const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
	fitPlan = portrait
		? 13.6 / 2 / (t * aspect) / 0.94 / 1.28
		: Math.max(9.6 / 2 / t, 13.6 / 2 / t / (aspect * 0.7));
	fitPhone = portrait
		? Math.max((SHm + 0.42) / 2 / t / 0.6, (SWm + 0.4) / 2 / (t * aspect) / 0.86)
		: (SHm + 0.42) / 2 / t / 0.86;
	camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
addEventListener('pointermove', (e) => {
	mouse.x = e.clientX / innerWidth - 0.5;
	mouse.y = e.clientY / innerHeight - 0.5;
});

// Scroll: Fotos (Flur → … → Nacht), dann „Licht an“, dann Grundriss → App
const FOTO_END = 0.58;
const PLAN_START = 0.62;
const lenis = new Lenis({
	autoRaf: true,
	lerp: matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.085,
});
lenis.stop();
window.__p = {
	lenis,
	get glb() {
		return glb;
	},
};
const steps = $$('.step');
const STEP_AT = [0, 0.12, 0.31, 0.5, 0.8];
const app = $('.app');
const bon = $('.bon');
const pct = $('.pct');
const v3 = new THREE.Vector3();
const project = (x, y, z) => {
	v3.set(x, y, z).project(camera);
	return [(v3.x * 0.5 + 0.5) * innerWidth, (-v3.y * 0.5 + 0.5) * innerHeight];
};
let lastStep = -1;

// Kamerafahrt durchs Wohnzimmer (Blender/Cycles)
const seqCanvas = $('#seq');
const seq = fahrt(seqCanvas);
const psteps = $$('.pstep');
const flash = $('.flash');
const chapter = $('.chapter');
const KAPITEL = ['Tür', 'Esstisch', 'Regal', 'Fenster', 'Sofa'];
let lastP = -1;
function fotos(P) {
	const u = clamp(P / FOTO_END);
	const i = seq.zeichne(u);
	if (i !== lastP) {
		psteps.forEach((el, j) => el.classList.toggle('on', j === i));
		chapter.textContent = `${String(i + 1).padStart(2, '0')}: ${KAPITEL[i]}`;
		lastP = i;
	}
}

function frame(t) {
	const P = clamp(lenis.limit ? lenis.animatedScroll / lenis.limit : 0);
	const p = clamp((P - PLAN_START) / (1 - PLAN_START));
	pct.textContent = String(Math.round(P * 100)).padStart(3, '0');
	mouse.sx += (mouse.x - mouse.sx) * 0.05;
	mouse.sy += (mouse.y - mouse.sy) * 0.05;
	// „Licht an“: zwischen Nacht und Grundriss kurz hell
	flash.style.opacity =
		seg(P, FOTO_END - 0.015, FOTO_END + 0.02) * (1 - seg(P, PLAN_START - 0.01, PLAN_START + 0.03));
	const inFotos = P < (FOTO_END + PLAN_START) / 2;
	document.body.classList.toggle('in-plan', !inFotos);
	seqCanvas.style.visibility = inFotos ? 'visible' : 'hidden';
	if (inFotos) {
		fotos(P);
		requestAnimationFrame(frame);
		return;
	}
	if (lastP !== -2) {
		for (const el of psteps) el.classList.remove('on');
		chapter.textContent = '06: Grundriss';
		lastP = -2;
	}

	// 1 Draufsicht · 2 Wände sinken · 3 Kacheln schweben, Handy darunter · 4 Kacheln fliegen und klappen · 5 Zoom aufs Handy
	const top = seg(p, 0.06, 0.24);
	const sink = seg(p, 0.14, 0.3);
	const lift = seg(p, 0.3, 0.36);
	const push = seg(p, 0.66, 0.8);
	const live = seg(p, 0.78, 0.84);
	const idle = 1 - top;
	const polar = lerp(0.95, 0, top) + mouse.sy * 0.12 * idle;
	const azim = lerp(-0.42, 0, top) + Math.sin(t * 0.00012) * 0.05 * idle + mouse.sx * 0.25 * idle;
	const radius = lerp(lerp(fitPlan * 1.2, fitPlan * 1.3, top), fitPhone, push);
	const ty = lerp(0, PH, push);
	camera.position.set(
		Math.sin(polar) * Math.sin(azim) * radius,
		ty + Math.cos(polar) * radius,
		Math.sin(polar) * Math.cos(azim) * radius,
	);
	camera.lookAt(0, ty, 0);

	const furnK = Math.max(0.001, 1 - seg(p, 0.12, 0.26));
	if (glb) {
		for (const w of glb.walls) {
			w.userData.sy ??= w.scale.y;
			w.scale.y = w.userData.sy * 0.42 * Math.max(0.001, 1 - sink);
			w.visible = sink < 1;
		}
	} else {
		walls.scale.y = Math.max(0.001, 1 - sink);
		furn.scale.y = furnK;
		walls.visible = sink < 1;
		furn.visible = p < 0.26;
	}
	phone.visible = p > 0.33;
	phone.position.y = lerp(-0.6, 0, seg(p, 0.33, 0.42));

	for (const k of tiles) {
		const { mesh, from, to, i } = k;
		const fly = seg(p, 0.37 + i * 0.02, 0.52 + i * 0.02);
		const hover = 0.7 * lift * (1 - fly) + Math.sin(fly * Math.PI) * 1.6;
		const w = lerp(from.w, to.w, fly);
		const d = lerp(from.d, to.d, fly);
		const h = lerp(0.08, 0.02, fly);
		mesh.scale.set(w, h, d);
		mesh.position.set(
			lerp(from.x, to.x, fly),
			lerp(h / 2, PH + 0.006 + h / 2, fly) + hover,
			lerp(from.z, to.z, fly),
		);
		// Umklappen um die Längsachse; bei 90° (Kante) Material tauschen, damit nichts gespiegelt wird
		const a = fly * Math.PI;
		mesh.rotation.z = a <= Math.PI / 2 ? a : a - Math.PI;
		mesh.rotation.y = Math.sin(fly * Math.PI) * 0.25 * (i % 2 ? 1 : -1);
		k.mats[2] = a <= Math.PI / 2 ? k.floor : k.card;
		// Blender-Raum samt Möbeln fliegt mit, bis er auf der Kante steht; danach zeigt die Kachel die App-Karte
		const f = glb?.floors.get(k);
		if (f) {
			f.userData.q0 ??= f.quaternion.clone();
			f.userData.s0 ??= f.scale.clone();
			const sc = Math.min(w / from.w, d / from.d);
			f.position.set(mesh.position.x, mesh.position.y + h / 2 - 0.04 * sc, mesh.position.z);
			f.quaternion.copy(mesh.quaternion).multiply(f.userData.q0);
			f.scale.copy(f.userData.s0).multiplyScalar(sc);
			f.visible = a < Math.PI / 2;
			for (const o of f.userData.outside) o.visible = lift === 0;
		}
		mesh.visible = live < 1 && (!f || a >= Math.PI / 2) && (!planA || p >= 0.24);
	}

	// Raum-Beschriftungen
	const lv = seg(p, 0.13, 0.18) * (1 - seg(p, 0.36, 0.4));
	labelsEl.classList.toggle('fn', p > 0.2);
	tiles.forEach((k, i) => {
		const [x, y] = project(k.mesh.position.x, k.mesh.position.y + 0.1, k.mesh.position.z);
		const el = labels[i];
		el.style.opacity = lv;
		el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
	});

	// DOM-App exakt über den 3D-Bildschirm legen
	if (push > 0) {
		const [x0, y0] = project(-SWm / 2, PH, -SHm / 2);
		const [x1, y1] = project(SWm / 2, PH, SHm / 2);
		app.style.transform = `translate(${x0}px, ${y0}px) scale(${(x1 - x0) / SW}, ${(y1 - y0) / SH})`;
	}
	homeScr.material.opacity = seg(p, 0.6, 0.72);
	if (planA) {
		walls.visible = furn.visible = false;
		planA.material.opacity = (glb ? seg(p, 0.18, 0.25) : 1) * (1 - seg(p, 0.27, 0.31));
		planA.visible = planA.material.opacity > 0;
		if (glb) glb.root.visible = p < 0.25;
	}
	app.style.opacity = live;
	app.classList.toggle('live', live > 0.98);
	bon.classList.toggle('on', p > 0.86);

	let s = 0;
	STEP_AT.forEach((a, i) => {
		if (p >= a) s = i;
	});
	if (s !== lastStep) {
		steps.forEach((el, i) => el.classList.toggle('on', i === s));
		lastStep = s;
	}

	renderer.render(scene, camera);
	requestAnimationFrame(frame);
}
// Start erst, wenn alles geladen ist
await seq.alle((x) => loader.progress(x));
await loader.done();
lenis.start();
requestAnimationFrame(frame);

// Handy: echte App-Bildschirme der Demo-WG (screens/, aufgenommen aus manawg-app). Mit ?live die laufende App per iframe (nur lokal).
const note = $('.note');
const clock = () => {
	const d = new Date();
	$('.app .clock').textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};
clock();
setInterval(clock, 30000);
let noteT;
const say = (msg) => {
	note.textContent = msg;
	note.classList.add('on');
	clearTimeout(noteT);
	noteT = setTimeout(() => note.classList.remove('on'), 5000);
};
const done = (t) => {
	const li = $(`.tasks [data-t="${t}"]`);
	if (li.classList.contains('done')) return;
	li.classList.add('done');
	if ($$('.tasks li.done').length === 3) document.body.classList.add('all-done');
};
const MELDUNG = {
	bon: 'Beispielbeleg erfasst: 48,00 € aufgeteilt in vier Anteile zu je 12,00 €.',
	milch: 'Hafermilch ist in dieser Demo als gekauft markiert.',
	putz: '„Bad putzen“ ist in dieser Demo als erledigt markiert.',
};
const live =
	new URLSearchParams(location.search).has('live') &&
	['127.0.0.1', 'localhost'].includes(location.hostname);
const appDemo = live ? await import('./app-live.js') : await import('./app-screens.js');
const demo = appDemo.start({
	app,
	done: (t) => {
		done(t);
		say(MELDUNG[t]);
	},
});

// Kassenbon aufs Handy ziehen
let drag = null;
bon.addEventListener('pointerdown', (e) => {
	const r = bon.getBoundingClientRect();
	drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, r };
	bon.setPointerCapture(e.pointerId);
	bon.classList.add('drag');
});
bon.addEventListener('pointermove', (e) => {
	if (!drag) return;
	bon.style.transform = `translate(${e.clientX - drag.dx - drag.r.left}px, ${e.clientY - drag.dy - drag.r.top}px) rotate(${7 - (e.clientX - drag.r.left) * 0.01}deg)`;
});
bon.addEventListener('pointerup', (e) => {
	if (!drag) return;
	drag = null;
	bon.classList.remove('drag');
	const a = app.getBoundingClientRect();
	if (e.clientX > a.left && e.clientX < a.right && e.clientY > a.top && e.clientY < a.bottom) {
		bon.classList.add('gone');
		bon.style.transform += ' scale(0.2)';
		demo.bon();
	} else bon.style.transform = '';
});
