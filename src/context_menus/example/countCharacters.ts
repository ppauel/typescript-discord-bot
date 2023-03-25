/* eslint-disable no-inline-comments */
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from 'discord.js';
import { ContextMenuCommand } from '../../classes/Command';
import { i18n, fallback, localization } from '../../features/i18n';

// Example message context menu
export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName(fallback('count-name'))
        .setNameLocalizations(localization('count-name'))
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false))
    .setGlobal(false)
    .setExecute(async (interaction: MessageContextMenuCommandInteraction) => {
        const message = interaction.targetMessage,
            length = message.content.length;
        await interaction.reply(
            {
                content: i18n(interaction.locale, 'count-reply', { 'username':message.author.username, 'length':length.toString() }),
                ephemeral: true,
            });
    });