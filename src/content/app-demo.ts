import type { Locale } from '@/lib/locale';

/**
 * Demo and install stills per page language. `lang` is the language of the recording, which
 * the date overlay follows. The English entry still points at the German assets until an
 * English recording exists.
 */
export const APP_DEMO: Record<
	Locale,
	{
		lang: 'de' | 'en';
		src: string;
		still: string;
		installIos: string;
		installAndroid: string;
		installApp: string;
	}
> = {
	de: {
		lang: 'de',
		src: '/app-demo/index.html',
		still: '/app-demo/start.webp',
		installIos: '/install/seite-ios-gast-dunkel.webp',
		installAndroid: '/install/seite-android-gast-dunkel.webp',
		installApp: '/install/app-start-dunkel.webp',
	},
	en: {
		lang: 'de',
		src: '/app-demo/index.html',
		still: '/app-demo/start.webp',
		installIos: '/install/seite-ios-gast-dunkel.webp',
		installAndroid: '/install/seite-android-gast-dunkel.webp',
		installApp: '/install/app-start-dunkel.webp',
	},
};
