/* eslint-disable no-inline-comments */
import { ApplicationCommandType, ContextMenuCommandBuilder, Locale } from 'discord.js';
import i18n from '../../i18n';
import { MessageContextMenu } from '../../interfaces';

// Example message context menu

const contextMenu: MessageContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName('Count characters')
        .setNameLocalizations({
            'en-US':i18n(Locale.EnglishUS, 'count-name'),
        })
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false),
    global: false,
    execute: async (_client, interaction) => {
        const message = interaction.targetMessage,
            length = message.content.length;
        await interaction.reply({ content: i18n(interaction.locale, 'count-reply', { 'username':message.author.username, 'length':length.toString() }), ephemeral: true });
    },
};
export default contextMenu;