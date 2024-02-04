import { FluentResource } from '@fluent/bundle';
import { Locale } from 'discord.js';

export interface i18nOptions {
    fallbackLocale?: Locale,
    globalResource?: FluentResource
}