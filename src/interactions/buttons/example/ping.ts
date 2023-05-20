import { ButtonInteraction } from 'discord.js';
import { getPingButton } from '../../../features/ping';
import { t } from '../../../i18n';
import { Interaction } from '../../../Client';


// Example interaction (related to the /ping command)
export default new Interaction<ButtonInteraction>()
    .setName('ping')
    .setExecute(async (interaction) => {
        interaction.reply({
            content: `${t({
                locale: interaction.locale,
                key: 'button',
                ns:'ping',
            })} 🏓`,
            components: [getPingButton(interaction.locale)],
            ephemeral: true,
        });
    });