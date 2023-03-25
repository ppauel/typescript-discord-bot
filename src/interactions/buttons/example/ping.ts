import { getPingButton } from '../../../features/ping';
import i18n from '../../../features/i18n';
import { Interaction } from '../../../classes/Interaction';
import { ButtonInteraction } from 'discord.js';

// Example interaction (related to the /ping command)
export default new Interaction<ButtonInteraction>()
    .setName('ping')
    .setExecute(async (interaction) => {
        interaction.reply({ content: `${i18n(interaction.locale, 'ping-button')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    });