import { Locale } from 'discord.js';
import { i18n } from './Classes/index.js';

// Load locales
export const localize = new i18n()
    .setGlobalResource('./locales')
    .setLocale('./locales/de', Locale.German)
    .setLocale('./locales/en-US', Locale.EnglishUS)
    .setFallbackLocale(Locale.EnglishUS);