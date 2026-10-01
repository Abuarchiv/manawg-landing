// Fotos als 2.5D-Räume: jedes freigegebene Bild wird über seine Tiefenkarte (Depth Anything V2) zu einem Relief,
// durch das die Kamera fährt. Übergänge lösen sich von hinten nach vorn auf.
import * as THREE from 'three';

const N = 'bilder/';
export const FOTOS = [
	{
		b: '06-flur-v2',
		fov: 62,
		drift: [0, 0, 0.55],
		tags: [
			[0.15, 0.12, 'Lea · Mika · Jona · Sami', 'Vier Haken. Vier Namen.'],
			[0.72, 0.6, 'Mikas Rad', 'steht seit März im Flur'],
			[0.93, 0.36, 'Post', 'Sami sortiert, keiner liest'],
		],
	},
	{
		b: '01-hero-wohnzimmer',
		fov: 64,
		drift: [0.08, 0, 0.5],
		tags: [
			[0.79, 0.6, 'Togo, Kleinanzeigen', '340,00 € · durch vier'],
			[0.66, 0.18, 'Akari 75D', 'Jona bringt sie mit, nimmt sie mit'],
			[0.6, 0.76, 'Perser, 300 × 200', 'von Samis Oma'],
			[0.16, 0.32, 'Chromregal', 'gehört allen'],
		],
	},
	{
		b: '02-esstisch-v2',
		fov: 52,
		drift: [-0.06, 0.04, 0.35],
		tags: [
			[0.22, 0.72, 'Vier Tassen', 'Lea · Mika · Jona · Sami'],
			[0.55, 0.42, 'Kerzen in Weinflaschen', 'Reste vom WG-Essen'],
			[0.39, 0.5, 'French Press', 'Mika · nie in die Spülmaschine'],
		],
	},
	{
		b: '03-chromregal-v2',
		fov: 58,
		drift: [0.07, 0, 0.4],
		tags: [
			[0.32, 0.16, 'Boombox', 'Mika, seit 2019'],
			[0.2, 0.36, 'Platten', 'Samis · laufen sonntags'],
			[0.14, 0.6, 'Pilzlampe', 'Flohmarkt, 15 € · Jona'],
		],
	},
	{
		b: '05-kueche-v2',
		fov: 62,
		drift: [0.06, 0, 0.5],
		tags: [
			[0.68, 0.7, 'Einkauf!!', 'steht jetzt in der App'],
			[0.79, 0.74, 'Putzplan', 'dreht sich von allein'],
			[0.88, 0.74, '„Bon aufheben!“', 'nicht mehr nötig'],
		],
	},
	{
		b: '07-fenster-v2',
		fov: 56,
		drift: [-0.07, 0, 0.35],
		tags: [
			[0.75, 0.3, 'Hinterhof', 'Jona ist bis Sonntag weg'],
			[0.64, 0.73, 'ManaWG', 'liegt hier nur zur Deko'],
		],
	},
	{
		b: '09-nacht-v2',
		fov: 64,
		drift: [0, 0.03, 0.6],
		tags: [
			[0.66, 0.17, '23:40', 'Akari an, Rest aus'],
			[0.25, 0.55, 'WG-Essen', 'alle Salden: 0,00 €'],
		],
	},
];
const NEAR = 1.1;
const FAR = 9;

const vert = `uniform sampler2D dep; uniform float tanX, aspect; varying vec2 vUv; varying float vD;
	float depth(vec2 uv){ vec3 c = texture2D(dep, uv).rgb; return (c.r * 255. * 256. + c.g * 255.) / 65535.; }
	void main(){ vUv = uv; float d = depth(uv); vD = d;
		float z = 1. / (d * (1. / ${NEAR.toFixed(2)} - 1. / ${FAR.toFixed(1)}) + 1. / ${FAR.toFixed(1)});
		vec3 p = vec3((uv.x * 2. - 1.) * tanX * z, (uv.y * 2. - 1.) * tanX / aspect * z, -z);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`;
const frag = `uniform sampler2D col; uniform float reveal, dim; varying vec2 vUv; varying float vD;
	float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
	void main(){
		// von hinten nach vorn auflösen, mit feinem Korn an der Kante
		float edge = (1. - vD) * 0.92 + hash(floor(vUv * vec2(900., 600.))) * 0.08;
		float a = smoothstep(edge - 0.03, edge, reveal * 1.06);
		if (a <= 0.001) discard;
		vec3 c = texture2D(col, vUv).rgb * dim;
		gl_FragColor = vec4(c, a);
		#include <colorspace_fragment>
	}`;

function depthReader(img) {
	const c = document.createElement('canvas');
	c.width = img.width;
	c.height = img.height;
	const g = c.getContext('2d', { willReadFrequently: true });
	g.drawImage(img, 0, 0);
	const data = g.getImageData(0, 0, c.width, c.height).data;
	return (u, v) => {
		const x = Math.min(c.width - 1, Math.round(u * (c.width - 1)));
		const y = Math.min(c.height - 1, Math.round(v * (c.height - 1)));
		const i = (y * c.width + x) * 4;
		return (data[i] * 256 + data[i + 1]) / 65535;
	};
}

export async function ladeFotos(onProgress) {
	const loader = new THREE.TextureLoader();
	let done = 0;
	const total = FOTOS.length * 2;
	const load = (u) =>
		new Promise((r, j) =>
			loader.load(
				u,
				(t) => {
					onProgress(++done / total);
					r(t);
				},
				undefined,
				j,
			),
		);
	await Promise.all(
		FOTOS.map(async (f) => {
			const [col, dep] = await Promise.all([
				load(`${N}${f.b}.jpg`),
				load(`${N}${f.b}-tiefe-rg.png`),
			]);
			col.colorSpace = THREE.SRGBColorSpace;
			col.anisotropy = 8;
			dep.minFilter = dep.magFilter = THREE.NearestFilter;
			dep.generateMipmaps = false;
			f.aspect = col.image.width / col.image.height;
			f.tanX = Math.tan(THREE.MathUtils.degToRad(f.fov / 2));
			f.depthAt = depthReader(dep.image);
			f.mat = new THREE.ShaderMaterial({
				transparent: true,
				uniforms: {
					col: { value: col },
					dep: { value: dep },
					tanX: { value: f.tanX },
					aspect: { value: f.aspect },
					reveal: { value: 1 },
					dim: { value: 1 },
				},
				vertexShader: vert,
				fragmentShader: frag,
			});
			f.mesh = new THREE.Mesh(
				new THREE.PlaneGeometry(1, 1, 480, Math.round(480 / f.aspect)),
				f.mat,
			);
			f.scene = new THREE.Scene();
			f.scene.add(f.mesh);
		}),
	);
}

// Bildpunkt (u, v von oben links) → Position im Relief
export function punkt(f, u, v) {
	const d = f.depthAt(u, v);
	const z = 1 / (d * (1 / NEAR - 1 / FAR) + 1 / FAR);
	const vy = 1 - v;
	return new THREE.Vector3((u * 2 - 1) * f.tanX * z, (((vy * 2 - 1) * f.tanX) / f.aspect) * z, -z);
}

// Kamera füllt den Bildschirm mit dem Foto (cover), etwas Reserve für die Fahrt
export function kamera(cam, f, scrAspect) {
	const tX = f.tanX;
	const tY = f.tanX / f.aspect;
	const t = Math.min(tY, tX / scrAspect) * 0.86; // Reserve, damit bei Fahrt + Maus kein Rand sichtbar wird
	cam.fov = THREE.MathUtils.radToDeg(2 * Math.atan(t));
	cam.aspect = scrAspect;
	cam.updateProjectionMatrix();
}
