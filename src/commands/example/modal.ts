import { ActionRowBuilder, ModalBuilder, PermissionsBitField, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { fallback, i18n, localization } from '../../features/i18n';
import { ChatInputCommand } from '../../interfaces';

// Example slash command
const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName(fallback('modal-name'))
        .setNameLocalizations(localization('modal-name'))
        .setDescription(fallback('modal-description'))
        .setDescriptionLocalizations(localization('modal-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    async execute(interaction) {
        interaction.showModal(new ModalBuilder()
            .setCustomId('model')
            .setTitle(i18n(interaction.locale, 'modal-title'))
            .addComponents(new ActionRowBuilder<TextInputBuilder>()
                .addComponents(new TextInputBuilder()
                    .setCustomId('short')
                    .setLabel(i18n(interaction.locale, 'modal-short-label'))
                    .setPlaceholder(i18n(interaction.locale, 'modal-short-placeholder'))
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(new TextInputBuilder()
                    .setCustomId('paragraph')
                    .setLabel(i18n(interaction.locale, 'modal-paragraph-label'))
                    .setPlaceholder(i18n(interaction.locale, 'modal-paragraph-placeholder'))
                    .setMaxLength(500)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false))));
    },
};
export default command;