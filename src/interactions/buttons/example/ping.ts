import { ButtonInteraction } from 'discord.js';
import { Interaction } from '../../../Classes';
import { localize } from '../../../bot';
import { getPingButton } from '../../../features/ping';


// Example interaction (related to the /ping command)
export default new Interaction<ButtonInteraction>()
    .setCustomIdPrefix('ping')
    .setRun(async (interaction) => {
        interaction.reply({
            content: `${localize.t('button', 'ping', interaction.locale)} 🏓`,
            components: [getPingButton(interaction.locale)],
            ephemeral: true
        });
    });