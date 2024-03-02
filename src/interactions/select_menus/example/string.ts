import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../../Classes';
import { localize } from '../../../bot';

const ns = 'select';

export default new Interaction<StringSelectMenuInteraction>()
    .setCustomIdPrefix('string')
    .setRun(async (interaction) => {
        interaction.update({ content: localize.t('string-reply', ns, interaction.locale), components: [] });
    });