import { ButtonInteraction } from 'discord.js';
import { Interaction } from '../../../Classes/index.js';
import { getPingButton } from '../../../features/ping.js';
import { localize } from '../../../i18n.js';


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