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
		installIos: '/install/guest-page-ios-dark.webp',
		installAndroid: '/install/guest-page-android-dark.webp',
		installApp: '/install/app-home-dark.webp',
	},
	en: {
		lang: 'en',
		src: '/app-demo-en/index.html',
		still: '/app-demo-en/start.webp',
		installIos: '/install-en/guest-page-ios-dark.webp',
		installAndroid: '/install-en/guest-page-android-dark.webp',
		installApp: '/install-en/app-home-dark.webp',
	},
};
