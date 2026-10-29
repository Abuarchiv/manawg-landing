// Light or dark: follows the system unless the visitor picked one in the footer (stored like in the app).
// THEME_SCRIPT runs in <head> before the first paint and sets html[data-theme]; it also follows system changes
// and exposes window.__theme(choice) for the footer switch.

export type ThemeChoice = 'light' | 'dark' | 'system';
const THEME_KEY = 'manawg-theme';
export const THEME_COLOR = { dark: '#0a0a0a', light: '#f5f5f5' } as const;

export const THEME_SCRIPT = `(function(){var d=document.documentElement,m=matchMedia('(prefers-color-scheme: light)');function c(){try{return localStorage.getItem('${THEME_KEY}')||'system'}catch(e){return 'system'}}function a(){var t=c(),l=t==='light'||(t!=='dark'&&m.matches),v=l?'light':'dark';d.dataset.theme=v;d.dataset.themeChoice=t;var e=document.querySelector('meta[name="theme-color"]');if(e)e.content=l?'${THEME_COLOR.light}':'${THEME_COLOR.dark}'}a();m.addEventListener('change',a);document.addEventListener('DOMContentLoaded',a);window.__theme=function(t){try{t==='system'?localStorage.removeItem('${THEME_KEY}'):localStorage.setItem('${THEME_KEY}',t)}catch(e){}a()}})();`;

/** Light mode on the page right now (client only). */
export const isLight = () => document.documentElement.dataset.theme === 'light';
