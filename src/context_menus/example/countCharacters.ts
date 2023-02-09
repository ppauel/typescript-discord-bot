/* eslint-disable no-inline-comments */
import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { i18n, fallback, localization } from '../../features/i18n';
import { MessageContextMenu } from '../../interfaces';

// Example message context menu

const contextMenu: MessageContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName(fallback('count-name'))
        .setNameLocalizations(localization('count-name'))
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false),
    global: false,
    async execute(_client, interaction) {
        const message = interaction.targetMessage,
            length = message.content.length;
        await interaction.reply(
            {
                content: i18n(interaction.locale, 'count-reply', { 'username':message.author.username, 'length':length.toString() }),
                ephemeral: true,
            });
    },
};
export default contextMenu;