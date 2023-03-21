import i18n from '../../../features/i18n';
import { StringSelectMenu } from '../../../interfaces';

const menu: StringSelectMenu = {
    name: 'string',
    async execute(interaction) {
        interaction.update({ content: i18n(interaction.locale, 'select-menu-string-reply'), components: [] });
    },
};
export default menu;