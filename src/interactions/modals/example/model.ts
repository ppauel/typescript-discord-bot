import { EmbedBuilder } from 'discord.js';
import i18n from '../../../features/i18n';
import { ModalSubmit } from '../../../interfaces';

const modal: ModalSubmit = {
    name: 'model',
    async execute(client, interaction) {
        interaction.reply({
            embeds:[new EmbedBuilder()
                .setTitle(i18n(interaction.locale, 'modal-embed-title'))
                .setColor(client.config.colors.embed)
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
    },
};

export default modal;