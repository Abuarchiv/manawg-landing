'use client';

import { useEffect, useRef } from 'react';
import { css } from '../../core/dc';
import { useDict } from '../../dict';
import { End } from '../end/End';
import { HeroTitle } from './HeroTitle';
import { Rooms } from './Rooms';
import { createStage } from './stage';
import { INTRO_SCREENS, unwarp } from './timeline';

// Intro: a sticky stage at full window size (100lvh) over (1 + INTRO_SCREENS) screen heights.
// Layers from bottom to top: mountain and mark (hero), flat, safe box with title and
// room cards (100svh), end layer. The end layer scrolls away naturally with the stage.

const FILL = 'position:absolute;inset:0;width:100%;height:100%;display:block';

export function Intro() {
	const { aria, canvasRooms, people } = useDict();
	const secRef = useRef<HTMLElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const stage = createStage({
			sec: secRef.current as HTMLElement,
			stageEl: stageRef.current as HTMLDivElement,
			rooms: canvasRooms,
			people,
		});
		return () => stage.destroy();
	}, [canvasRooms, people]);

	return (
		<section
			id="intro"
			data-sec="intro"
			tabIndex={-1}
			ref={secRef}
			aria-label={aria.intro}
			style={css(`position:relative;z-index:1;height:calc(${1 + INTRO_SCREENS} * 100lvh)`)}
		>
			{/* Jump target of the app preview (focus anchor): start of the end layer, P 0.985 */}
			<div
				id="app-demo"
				role="region"
				tabIndex={-1}
				aria-label={aria.appPreview}
				style={css(
					`position:absolute;left:0;width:1px;height:1px;top:calc((100% - 100lvh) * ${(unwarp(0.985) ?? 0).toFixed(4)})`,
				)}
			/>
			<div
				data-buehne="intro"
				ref={stageRef}
				style={css('position:sticky;top:0;height:100lvh;overflow-x:clip;overflow-y:visible')}
			>
				<canvas data-intro="hero" aria-hidden="true" style={css(`${FILL};opacity:var(--g,1)`)} />
				<canvas
					data-intro="wohnung"
					aria-hidden="true"
					style={css(
						`${FILL};opacity:var(--f,0);clip-path:circle(calc(var(--por,1) * 90vmax) at 50% 50%)`,
					)}
				/>
				<div
					data-safe="1"
					style={css('position:absolute;left:0;right:0;top:0;height:100svh;pointer-events:none')}
				>
					<HeroTitle />
					<Rooms />
				</div>
				<End />
			</div>
		</section>
	);
}
