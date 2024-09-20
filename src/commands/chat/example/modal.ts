import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    InteractionContextType,
    ModalBuilder,
    PermissionsBitField,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle
} from 'discord.js';
import { ChatInputCommand } from '../../../Classes/index.js';
import { localize } from '../../../bot.js';

// Locale Namespace
const ns = 'modal';

// Example slash command

export default new ChatInputCommand({
    builder: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Demonstration of modal')
        .setNameLocalizations(localize.discordLocalizationRecord('command-name', ns))
        .setDescriptionLocalizations(localize.discordLocalizationRecord('command-description', ns))
    // Allows command to be used in DMs, servers and group DMs
        .setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    execute
});

/**
 * Function runs when modal command is used
 * @param interaction the interaction form the client event
 * @returns a void promise
 */
async function execute(interaction: ChatInputCommandInteraction) {
    const locale = localize.getLocale(interaction.locale);
    return interaction.showModal(new ModalBuilder()
        .setCustomId('modal')
        .setTitle(locale.t('modal-title', ns))
        .addComponents(new ActionRowBuilder<TextInputBuilder>()
            .addComponents(new TextInputBuilder()
                .setCustomId('short')
                .setLabel(locale.t('modal-short-label', ns))
                .setPlaceholder(locale.t('modal-short-placeholder', ns))
                .setStyle(TextInputStyle.Short)
                .setRequired(true)),
        new ActionRowBuilder<TextInputBuilder>()
            .addComponents(new TextInputBuilder()
                .setCustomId('paragraph')
                .setLabel(locale.t('modal-paragraph-label', ns))
                .setPlaceholder(locale.t('modal-paragraph-placeholder', ns))
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false))));
}