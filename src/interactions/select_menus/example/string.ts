import i18n from '../../../features/i18n';
import { StringSelectMenu } from '../../../interfaces';

const menu: StringSelectMenu = {
    name: 'string',
    async execute(_client, interaction) {
        interaction.update({ content: i18n(interaction.locale, 'select-menu-string-reply') });
    },
};
export default menu;