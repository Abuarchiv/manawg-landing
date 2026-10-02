// Echtzeit-Wohnung: in Blender gebackenes Licht (welt/atlas_*.webp) + Glanz aus dem Umgebungsbild.
// Die Kamera fährt über die Referenzkameras (welt/kameras.json) vom Flur durch die Tür bis ans Fenster.
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const BASE = new URL('welt/', import.meta.url).href;
const PFAD = [
	'Kamera_10-hochformat',
	'Kamera',
	'Kamera_02-esstisch',
	'Kamera_03-chromregal',
	'Kamera_04-sofa',
];
const smooth = (x) => x * x * (3 - 2 * x);

export async function ladeWelt(onProgress) {
	const klein = Math.min(innerWidth, innerHeight) < 700;
	const lm = new THREE.LoadingManager();
	lm.onProgress = (_u, n, total) => onProgress(n / total);
	const tl = new THREE.TextureLoader(lm);
	const tex = (f, ch = 0) => {
		const t = tl.load(BASE + f);
		t.colorSpace = THREE.SRGBColorSpace;
		t.flipY = false;
		t.anisotropy = 8;
		t.channel = ch;
		return t;
	};
	const [man, kam] = await Promise.all(
		['manifest.json', 'kameras.json'].map((f) => fetch(BASE + f).then((r) => r.json())),
	);
	const env = tl.load(`${BASE}umgebung.webp`);
	env.mapping = THREE.EquirectangularReflectionMapping;
	env.colorSpace = THREE.SRGBColorSpace;
	const draco = new DRACOLoader(lm).setDecoderPath(new URL('vendor/draco/', import.meta.url).href);
	const gltf = await new GLTFLoader(lm).setDRACOLoader(draco).loadAsync(`${BASE}welt.glb`);

	// Gebackenes Licht als Emission, Glanz aus dem Umgebungsbild; Rauheit je Vertex (COLOR_0.r)
	// Tag → Nacht: zweiter Atlas mit gleichen UVs, überblendet per uNacht
	const uNacht = { value: 0 };
	const envN = man.nacht ? tl.load(`${BASE}umgebung_n.webp`) : null;
	if (envN) {
		envN.mapping = THREE.EquirectangularReflectionMapping;
		envN.colorSpace = THREE.SRGBColorSpace;
	}
	const baked = (map, nmap, extra = {}) => {
		const m = new THREE.MeshStandardMaterial({
			color: 0x000000,
			emissive: 0xffffff,
			emissiveMap: map,
			metalness: 0,
			roughness: 1,
			envMap: env,
			...extra,
		});
		m.toneMapped = false;
		m.onBeforeCompile = (sh) => {
			if (nmap) {
				sh.uniforms.nachtMap = { value: nmap };
				sh.uniforms.uNacht = uNacht;
				sh.fragmentShader = sh.fragmentShader
					.replace(
						'#include <emissivemap_pars_fragment>',
						'#include <emissivemap_pars_fragment>\nuniform sampler2D nachtMap; uniform float uNacht;',
					)
					.replace(
						'#include <emissivemap_fragment>',
						'#include <emissivemap_fragment>\ntotalEmissiveRadiance = mix(totalEmissiveRadiance, texture2D(nachtMap, vEmissiveMapUv).rgb, uNacht);',
					);
			}
			sh.vertexShader = sh.vertexShader
				.replace('#include <color_pars_vertex>', 'attribute vec4 color; varying float vRgh;')
				.replace('#include <color_vertex>', 'vRgh = color.r;');
			sh.fragmentShader = sh.fragmentShader
				.replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vRgh;')
				.replace('void main() {', 'varying float vRgh;\nvoid main() {');
		};
		return m;
	};
	const atl = {};
	const liveMats = new Set();
	let hof = null;
	const blau = new THREE.Color(0x0b1a33);
	const suffix = klein ? '_2k.webp' : '.webp';
	gltf.scene.traverse((o) => {
		if (!o.isMesh) return;
		const m = o.material;
		if (m.name.startsWith('BAKED_')) {
			const k = m.name.slice(6);
			atl[k] ??= tex(`atlas_${k}${suffix}`);
			atl[`${k}n`] ??= man.nacht ? tex(`atlas_${k}_n${suffix}`) : null;
			o.material = baked(atl[k], atl[`${k}n`]);
		} else if (m.name.startsWith('ALPHA_')) {
			atl.a ??= tex(`atlas_a${suffix}`, 1);
			atl.an ??= man.nacht ? tex(`atlas_a_n${suffix}`, 1) : null;
			o.material = baked(atl.a, atl.an, {
				alphaMap: tex(man.alpha[m.name].replace('.png', '.webp'), 0),
				alphaTest: 0.5,
				side: THREE.DoubleSide,
			});
		} else {
			m.envMap = env;
			m.toneMapped = false;
			liveMats.add(m);
			if (m.name.startsWith('Hof')) hof = { m, c: m.color.clone(), e: m.emissive.clone() };
		}
		o.matrixAutoUpdate = false;
		o.updateMatrix();
	});
	const scene = new THREE.Scene();
	scene.add(gltf.scene);
	scene.background = new THREE.Color(0x0d0a08);

	const cams = PFAD.map((n) => kam.find((c) => c.name === n));
	const pts = new THREE.CatmullRomCurve3(
		cams.map((c) => new THREE.Vector3(...c.pos)),
		false,
		'centripetal',
		0.5,
	);
	const quats = cams.map((c) => new THREE.Quaternion(...c.quat));
	const cam = new THREE.PerspectiveCamera(50, 1, 0.03, 60);
	const q = new THREE.Quaternion();
	const e = new THREE.Euler(0, 0, 0, 'YXZ');
	const qm = new THREE.Quaternion();

	// u: 0 Flur … 1 Fenster. Rückgabe: aktuelle Station (für Texte)
	function render(renderer, u, mx = 0, my = 0, nacht = 0) {
		uNacht.value = nacht;
		// Hof hinter den Fenstern: Abend → blaue Stunde
		if (hof) {
			hof.m.color.copy(hof.c).lerp(blau, nacht);
			hof.m.emissive.copy(hof.e).lerp(blau, nacht);
		}
		if (envN) for (const m of liveMats) m.envMap = nacht > 0.5 ? envN : env;
		const n = cams.length - 1;
		const x = Math.min(n - 1e-6, Math.max(0, u * n));
		const i = Math.floor(x);
		// an jeder Station kurz verweilen, dazwischen fahren
		const k = smooth(Math.min(1, Math.max(0, (x - i - 0.18) / 0.64)));
		cam.position.copy(pts.getPoint((i + k) / n));
		q.slerpQuaternions(quats[i], quats[i + 1], k);
		e.set(-my * 0.05, -mx * 0.08, 0);
		cam.quaternion.copy(q).multiply(qm.setFromEuler(e));
		const h = THREE.MathUtils.lerp(cams[i].hfov, cams[i + 1].hfov, k);
		const a = renderer.domElement.width / renderer.domElement.height;
		cam.aspect = a;
		cam.fov = THREE.MathUtils.radToDeg(
			2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(h / 2)) / Math.max(a, 1.5)),
		);
		cam.updateProjectionMatrix();
		renderer.render(scene, cam);
		return Math.round(x);
	}
	return { render, stationen: cams.length };
}
