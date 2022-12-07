import { ApplicationCommandType, bold, ContextMenuCommandBuilder, inlineCode, MessageContextMenuCommandInteraction } from 'discord.js';
import { ContextMenu } from '../../interfaces';

// Example message context menu

export const contextMenu: ContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName('Count characters')
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false),
    global: false,
    execute: async (client, interaction) => {
        const message = (interaction as MessageContextMenuCommandInteraction).targetMessage;
        const length = message.content?.length || 0;
        await interaction.reply({ content: `${bold(message.author.username)}'s message has ${inlineCode(length.toString())} characters.`, ephemeral: true });
    }
};