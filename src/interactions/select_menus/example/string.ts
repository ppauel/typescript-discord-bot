import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../../Client';
import { t } from '../../../i18n';

const ns = 'select';

export default new Interaction<StringSelectMenuInteraction>()
    .setName('string')
    .setExecute(async (interaction) => {
        interaction.update({ content: t({ locale: interaction.locale, key: 'string-reply', ns }), components: [] });
    });