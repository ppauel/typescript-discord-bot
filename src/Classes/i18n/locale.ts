import { Collection } from '@discordjs/collection';
import { FluentBundle, Message } from '@fluent/bundle';
import { i18n } from './i18n.js';
import {
    Locale, common, fluentVariables
} from './types.js';

export class LocaleBundle {

    /**
     * Contains a collection of fluent bundles
     */
    private bundles = new Collection<string, FluentBundle>();

    /**
     * Locale of this objects set at this of creation
     */
    readonly locale: Locale;

    /**
     * notes if this object is the fallback locale for i18n
     */
    readonly isFallback: boolean;

    /**
     * The host i18n object
     */
    readonly i18n: i18n;

    /**
     * 
     * @param i18n Host i18n object
     * @param locale The locale of this object
     */
    constructor(i18n: i18n, locale:Locale) {
        this.locale = locale;
        this.i18n = i18n;
        if (this.locale === i18n.fallbacklLocale) this.isFallback = true;
    }

    /**
     * Add a fluent bundle to the locale bundle
     * @param name The name of the bundle
     * @param bundle The bundle you wish to add
     * @returns The LocaleBundle
     */
    addBundle(name: string, bundle:FluentBundle) {
        this.bundles.set(name, bundle);
        return this;
    }

    /**
     * Add a fluent bundle as a comman bundle
     * @param bundle The bundle you wish to add
     * @returns The LocaleBundle
     */
    setCommonBundle(bundle:FluentBundle) {
        this.bundles.set(common, bundle);
        return this;
    }

    /**
     * get a message from  bundle
     * @param key the key of the message
     * @param bundleName The name of the budle where the message should be retreved from
     * @returns Fluent message
     */
    private getMessageBundle(key:string, bundleName:string): { bundle: FluentBundle, message: Message } {
        let bundle: FluentBundle | undefined;

        // Checks for the bundle with the provided name
        if (this.has(bundleName)) {
            bundle = this.get(bundleName);
            if (bundle.hasMessage(key)) {
                return {
                    bundle,
                    message: bundle.getMessage(key)
                };
            }
            
        }

        // Checks comman file of this Locale
        if (this.has(common)) {
            bundle = this.get(common);
            if (bundle.hasMessage(key)) {
                return {
                    bundle,
                    message: bundle.getMessage(key)
                };
            }
            
        }

        const fallback = this.i18n.getFallbackLocale();

        // Checks if the fallback has a bundle of the fallback locale
        if (fallback.has(bundleName)) {
            bundle = fallback.get(bundleName);
            if (bundle.hasMessage(key)) {
                return {
                    bundle,
                    message: bundle.getMessage(key)
                };
            }
            
        }

        // Checks fallback common file
        if (fallback.has(common)) {
            bundle = fallback.get(common);
            if (bundle.hasMessage(key)) {
                return {
                    bundle,
                    message: bundle.getMessage(key)
                };
            }
            
        }
        throw Error(`${key} not found in common in fallback locale`);
    }

    /**
     * Check if bundle is present
     * @param bundleName Name of the bundle to check
     * @returns `true` or `false`
     */
    has(bundleName:string) {
        return this.bundles.has(bundleName);
    }

    /**
     * Gets bundle
     * @param bundleName Name of the bundle to get
     * @returns FluentBundle
     */
    get(bundleName:string) {
        return this.bundles.get(bundleName);
    }

    /**
     * Resove bundle key and variables
     * @param key key of message to be resoved
     * @param bundleName name of the bendle wich to pull from
     * @param options veriables to be resoved
     * @returns the resolved message as a string
     */
    t(key:string, bundleName:string, options?: fluentVariables) {

        // finds the message and retuens it with the budle where it was found
        const { bundle, message } = this.getMessageBundle(key, bundleName);

        const errors: Error[] = [];

        // appliy formating
        const res = bundle.formatPattern(message.value, options, errors);

        // Returns if any errors occured
        if (errors.length) {
            throw Error(`i18n - Errors with ${key}`, { cause: errors });
        }
        
        return res;
    }
}
