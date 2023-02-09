import { ActionRowBuilder, ModalBuilder, PermissionsBitField, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { i18n, fallback, localization } from '../../features/i18n';
import { ChatInputCommand } from '../../interfaces';


const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName(fallback('example-name'))
        .setNameLocalizations(localization('example-name'))
        .setDescription(fallback('example-description'))
        .setDescriptionLocalizations(localization('example-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addSubcommand(subcommand => subcommand
            .setName(fallback('example-modal-name'))
            .setNameLocalizations(localization('example-modal-name'))
            .setDescription(fallback('example-modal-description'))
            .setDescriptionLocalizations(localization('example-modal-description'))),
    global: true,
    async execute(_client, interaction) {
        switch (interaction.options.getSubcommand(true)) {
        case fallback('example-modal-name'):
            interaction.showModal(new ModalBuilder()
                .setCustomId('model')
                .setTitle('Model Window')
                .addComponents(new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(new TextInputBuilder()
                        .setCustomId('short')
                        .setLabel(i18n(interaction.locale, 'example-modal-short-label'))
                        .setPlaceholder(i18n(interaction.locale, 'example-modal-short-placeholder'))
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(new TextInputBuilder()
                        .setCustomId('paragraph')
                        .setLabel(i18n(interaction.locale, 'example-modal-paragraph-label'))
                        .setPlaceholder(i18n(interaction.locale, 'example-modal-paragraph-placeholder'))
                        .setMaxLength(500)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false))));
            break;

        default:
            break;
        }
    },
};
export default command;