import { Locale } from 'discord.js';
import { HelpInfoProperties, LocalizedHelpInfo } from '../../util';


/**
 * Definition of a constructor
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any[]) => object;

/**
 * Add Help infor to an object class
 * @param Base the object beeing extended
 * @returns the Base object with the added helpInfo methods
 */
export function addHelpInfo<T extends Constructor>(Base: T) {
	return class extends Base implements HelpInfoProperties {
		/**
		 * Titles for help Embed
		 */
		helpTitles: LocalizedHelpInfo = {};

		/**
		 * Descriptions for help Embed
		 */
		helpDescriptions: LocalizedHelpInfo = {};

		public setHelpTitleLocalizations(localizedTitle: LocalizedHelpInfo) {
			Object.assign(this.helpTitles, localizedTitle);
			return this;
		}

		public setHelpDescriptionLocalizations(localizedDescriptions: LocalizedHelpInfo) {
			Object.assign(this.helpDescriptions, localizedDescriptions);
			return this;
		}

		public getHelpInfo(locale: Locale): { title: string; description: string } {
			return {
				title: this.helpTitles[locale] ,
				description: this.helpDescriptions[locale]
			};
		}
	};
}
