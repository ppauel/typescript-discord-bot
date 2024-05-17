import { Collection } from '@discordjs/collection';
import {
    FluentBundle,
    FluentResource
} from '@fluent/bundle';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { i18nOptions } from './interface.js';
import { LocaleBundle } from './locale.js';
import {
    Locale, LocalizationMap, fluentVariables
} from './types.js';

export class i18n {
    /**
     * the fallback if presented locale is not present
     */
    private _fallbackLocale?: Locale;

    /**
     * The global resource used in the case of Markdown
     */
    private global?: FluentResource;

    /**
     * locales to call from
     */
    private locales = new Collection<Locale, LocaleBundle>();

    constructor(options?: i18nOptions) {
        if (options) {
            if (options.fallbackLocale) this._fallbackLocale = options.fallbackLocale;
            if (options.globalResource) this.global = options.globalResource;
        }
        
    }

    get fallbacklLocale() {
        return this._fallbackLocale;
    }

    /**
     * Gets the fall back Locale bundle
     * @returns LocaleBundle for the fall back locale
     */
    getFallbackLocale() {
        return this.getLocale(this._fallbackLocale);
    }

    /**
     * Set the gobal resource file
     * @param filePath file path to the file in question
     * @returns the i18n object
     */
    setGlobalResource(filePath:string) {
        // get file
        const file = readFileSync(join(filePath, 'global.ftl'), { encoding: 'utf-8' });
        // resovle file
        this.global = new FluentResource(file);
        return this;
    }

    setLocale(filePath:string, locale: Locale) {
        // get files
        const files = (readdirSync(filePath))
            .filter((file) => file.endsWith('.ftl'));

        const local = new LocaleBundle(this, locale);

        // for each of the files creates a new FluentBundle
        for (const file of files) {
            const bundle = new FluentBundle(locale);
            const resource = new FluentResource(readFileSync(join(filePath, file), { encoding: 'utf-8' }));
            // gets bundle's name from file name
            const bundleName = file.slice(0, -4);

            // adds globals if present
            if (this.global) bundle.addResource(this.global);
            bundle.addResource(resource);

            local.addBundle(bundleName, bundle);
	
        }

        // Adds locale to  collection
        this.locales.set(locale, local);
        return this as Omit<i18n, 'setGlobalResource'>;
    }

    /**
     * set the fallback locale
     * @param locale the locale to set
     * @returns this
     */
    setFallbackLocale(locale:Locale) {
        this._fallbackLocale = locale;
        return this;
    }

    /**
     * Get the localeBundle
     * @param locale the locale to get
     * @returns LocaleBundle
     */
    getLocale(locale:Locale) {
        const hasLocale = this.locales.has(locale);
        const hasFallbackLocale = this.locales.has(this._fallbackLocale);
        let returnLocale:Locale;

        // Return requested locale
        if (hasLocale) {
            returnLocale = locale;
        }
        
        // Return fallback locale
        else if (this._fallbackLocale && hasFallbackLocale) {
            returnLocale = this._fallbackLocale;
        }
        
        // Throw if fallback is not set
        else if (!this._fallbackLocale) {
            throw Error('Fallback Locale not set');
        }
        
        // Throw if fallback is present but not added
        else {
            throw Error('Fallback Locale not added to i18n');
        }
        

        return this.locales.get(returnLocale);
		
    }

    /**
     * Translate and formate a key
     * @param key key for the message to get
     * @param bundleName the bundle wher it is located
     * @param locale the locale to target
     * @param options Additional options
     * @returns The traslated and formated string
     */
    t(key:string, bundleName:string, locale:Locale, options?: fluentVariables) {
        return this.getLocale(locale).t(key, bundleName, options);
    }

    /**
     * For Use with Discord.js command builder to localize commands
     * @param key key to resolve
     * @param bundleName name of the bundle where the key is
     * @returns A map of the with the values of all added locale
     * @see {@link https://discord-api-types.dev/api/discord-api-types-payloads/common#LocalizationMap}
     */
    discordLocalizationRecord(key: string, bundleName: string): LocalizationMap {
        const res: LocalizationMap = {};
        for (const [ locale, obj ] of this.locales) {
            res[locale] = obj.t(key, bundleName);
        }
        return res;
    }
}
