import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../../classes/Interaction';
import i18n from '../../../features/i18n';

export default new Interaction<StringSelectMenuInteraction>()
    .setName('string')
    .setExecute(async (interaction) => {
        interaction.update({ content: i18n(interaction.locale, 'select-menu-string-reply'), components: [] });
    });