import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from 'discord.js';
import { ChatInputCommand } from '../../Client';
import { t, localization } from '../../i18n';

// Locale Namespace
const ns = 'modal';

// Example slash command

export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(t({ key:'command-name', ns }))
        .setNameLocalizations(localization('command-name', ns))
        .setDescription(t({ key: 'command-description', ns }))
        .setDescriptionLocalizations(localization('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages))
    .setGlobal(true)
    .setExecute(execute);

async function execute(interaction: ChatInputCommandInteraction) {
    return interaction.showModal(new ModalBuilder()
        .setCustomId('modal')
        .setTitle(t({ locale: interaction.locale, key: 'modal-title', ns }))
        .addComponents(new ActionRowBuilder<TextInputBuilder>()
            .addComponents(new TextInputBuilder()
                .setCustomId('short')
                .setLabel(t({ locale: interaction.locale, key: 'modal-short-label', ns }))
                .setPlaceholder(t({ locale: interaction.locale, key:'modal-short-placeholder', ns }))
                .setStyle(TextInputStyle.Short)
                .setRequired(true)),
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(new TextInputBuilder()
                .setCustomId('paragraph')
                .setLabel(t({ locale: interaction.locale, key: 'modal-paragraph-label', ns }))
                .setPlaceholder(t({ locale: interaction.locale, key: 'modal-paragraph-placeholder', ns }))
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false))));
}