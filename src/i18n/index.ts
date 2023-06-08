import { FluentVariable } from '@fluent/bundle';
import { LocaleString } from 'discord.js';
import {
    i18n as Client, i18nOptions, tOptions,
} from './i18n';

let i18n: Client;

export function init(path: string, options?: i18nOptions) {
    i18n = new Client(path, options);
    return i18n;
}

export function t(option: tOptions) {
    return i18n.t(option);
}

export function localization(key: string, ns: string, options?: Record<string, FluentVariable>): Partial<Record<LocaleString, string>> {
    const res: Partial<Record<LocaleString, string>> = {};
    i18n.supportedLocale.forEach((locale) => {
        try {
            res[locale] = i18n.t({
                key,
                locale,
                ns,
                args: options,
            });
        }
        catch (error) {
            /** do nothing */
        }
    });
    return res;
}

export default {
    init,
    t,
    localization,
};