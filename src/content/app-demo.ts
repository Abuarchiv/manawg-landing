import type { Locale } from '@/lib/locale';

/**
 * Demo and install stills per page language. `lang` is the language of the recording, which
 * the date overlay follows. The English entry points at the English recording.
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
		lang: 'en',
		src: '/app-demo-en/index.html',
		still: '/app-demo-en/start.webp',
		installIos: '/install-en/seite-ios-gast-dunkel.webp',
		installAndroid: '/install-en/seite-android-gast-dunkel.webp',
		installApp: '/install-en/app-start-dunkel.webp',
	},
};
