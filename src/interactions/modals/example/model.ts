import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { Interaction } from '../../../classes/Interaction';
import i18n from '../../../features/i18n';

export default new Interaction<ModalSubmitInteraction>()
    .setName('modal')
    .setExecute(async (interaction) => {
        interaction.reply({
            embeds:[new EmbedBuilder()
                .setTitle(i18n(interaction.locale, 'modal-embed-title'))
                .setColor(interaction.client.config.colors.embed)
                .setFields(
                    {
                        name: i18n(interaction.locale, 'modal-embed-short'),
                        value: interaction.fields.getTextInputValue('short'),
                    },
                    {
                        name: i18n(interaction.locale, 'modal-embed-paragraph'),
                        value: interaction.fields.getTextInputValue('paragraph') || '`N/A`',
                    },
                )],
            ephemeral:true,
        });
    });