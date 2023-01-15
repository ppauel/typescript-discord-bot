/* eslint-disable no-inline-comments */
import { ApplicationCommandType, bold, ContextMenuCommandBuilder, inlineCode } from 'discord.js';
import { MessageContextMenu } from '../../interfaces';

// Example message context menu

const contextMenu: MessageContextMenu = {
	options: new ContextMenuCommandBuilder()
		.setName('Count characters')
		.setType(ApplicationCommandType.Message) // Specify the context menu type
		.setDMPermission(false),
	global: false,
	execute: async (_client, interaction) => {
		const message = interaction.targetMessage,
			length = message.content.length;
		await interaction.reply({ content: `${bold(message.author.username)}'s message has ${inlineCode(length.toString())} characters.`, ephemeral: true });
	},
};

export default contextMenu;