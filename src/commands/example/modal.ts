import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ChatInputCommand } from '../../classes/Command';
import { fallback, i18n, localization } from '../../features/i18n';

// Example slash command

export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(fallback('modal-name'))
        .setNameLocalizations(localization('modal-name'))
        .setDescription(fallback('modal-description'))
        .setDescriptionLocalizations(localization('modal-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages))
    .setGlobal(true)
    .setExecute(execute);

async function execute(interaction: ChatInputCommandInteraction) {
    interaction.showModal(new ModalBuilder()
        .setCustomId('modal')
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
}