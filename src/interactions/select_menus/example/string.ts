import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../../Classes/index.js';
import { localize } from '../../../bot.js';

const ns = 'select';

export default new Interaction<StringSelectMenuInteraction>()
    .setCustomIdPrefix('string')
    .setRun(async (interaction) => {
        interaction.update({ content: localize.t('string-reply', ns, interaction.locale), components: [] });
    });