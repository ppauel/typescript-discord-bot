import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../..//Classes/Client';
import { localize } from '../../../bot';

const ns = 'select';

export default new Interaction<StringSelectMenuInteraction>()
    .setName('string')
    .setExecute(async (interaction) => {
        interaction.update({ content: localize.t('string-reply', ns, interaction.locale), components: [] });
    });