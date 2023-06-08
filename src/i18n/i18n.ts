import {
    FluentBundle, FluentResource, FluentVariable,
} from '@fluent/bundle';
import {
    Collection, Locale, LocaleString,
} from 'discord.js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const locales = Object.values(Locale);

export interface i18nOptions {
	hasGlobal?: boolean;
	fallback: Locale;
}

export interface tOptions {
	key: string;
	ns?: string;
	ons?: string;
	locale?: Locale | LocaleString;
	args?: Record<string, FluentVariable>;
}

export class i18n {
    readonly fallback: Locale | LocaleString;

    private readonly path: string;

    private readonly global: FluentResource | undefined;

    private lang = new Collection<LocaleString, Collection<string, FluentBundle>>();

    readonly supportedLocale: LocaleString[] = [];

    constructor(path: string, options?: i18nOptions) {
        this.path = path;

        if (options) {
            this.fallback = options.fallback === undefined ? undefined : options.fallback;
            if (options.hasGlobal) {
                this.global = new FluentResource(readFileSync(join(path, 'global.ftl'), { encoding: 'utf-8' }));
            }
        }

        readdirSync(path)
            .filter((obj) => obj.split('.').length === 1 && locales.includes(obj as Locale))
            .forEach((dir: LocaleString) => {
                this.supportedLocale.push(dir);
                this.createLocaleCollection(dir);
            });
    }

    public t(options: tOptions) {
        const {
            key, ons, args,
        } = options;
        const ns = options.ns === undefined ? 'common' : options.ns;
        const locale = options.locale === undefined ? this.fallback : options.locale;

        // Check if locale exists
        if (!this.lang.has(locale)) {
            if (locale === this.fallback) {
                throw Error(`Fallback locale [${locale}] Not present`);
            }

            return this.t({
                key,
                ns,
                locale: this.fallback,
                args,
            });
        }

        const local = this.lang.get(locale);
        // Checks if namespace is present
        if (!local.has(ns)) {
            if (locale === this.fallback && ns === 'common') {
                throw Error('common.ftl not found in fallback locale');
            }

            if (ns === 'common') {
                return this.t({
                    key,
                    ns: ons,
                    locale: this.fallback,
                    args,
                });
            }

            return this.t({
                key,
                ns: 'common',
                ons: ns,
                locale,
                args,
            });
        }

        const bundle = local.get(ns);
        const msg = bundle.getMessage(key);

        // Checks if key value is present
        if (!msg?.value) {
            if (ns === 'common' && locale === this.fallback) {
                throw Error(`${key} not found in common.ftl in fallback locale`);
            }

            if (ns === 'common') {
                return this.t({
                    key,
                    ns: ons,
                    locale: this.fallback,
                    args,
                });
            }

            if (locale === this.fallback) {
                return this.t({
                    key,
                    ns: 'common',
                    locale,
                    args,
                });
            }

            return this.t({
                key,
                ns: 'common',
                ons: ns,
                locale,
                args,
            });
        }

        const errors: Error[] = [];
        const res = bundle.formatPattern(msg.value, args, errors);

        if (errors.length) {
            throw Error(`i18n - Errors with ${key}`, { cause: errors });
        }

        return res;
    }

    /**
	 * Creates the collection of Collections for storing translations
	 * @param locale The locale of the collection being generated
	 */
    private createLocaleCollection(locale: LocaleString) {
        const path = join(this.path, locale);
        const collection = new Collection<string, FluentBundle>();
        const files = readdirSync(path).filter((file) => file.endsWith('.ftl'));

        for (const file of files) {
            const bundle = new FluentBundle(locale);
            if (this.global) bundle.addResource(this.global);
            bundle.addResource(new FluentResource(readFileSync(join(path, file), { encoding: 'utf-8' })));
            collection.set(file.slice(0, -4), bundle);
        }

        this.lang.set(locale, collection);
    }
}
