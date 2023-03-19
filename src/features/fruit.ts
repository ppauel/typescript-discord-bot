import { Locale } from 'discord.js';
import i18n from './i18n';

export function fruit(locale:Locale) {
    return [
        i18n(locale, 'oranges'),
        i18n(locale, 'bananas'),
        i18n(locale, 'apples'),
        i18n(locale, 'grapefruits'),
        i18n(locale, 'avocados'),
        i18n(locale, 'apricots'),
    ];
}