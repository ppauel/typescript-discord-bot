import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from 'discord.js';

// Example button (related to the /ping command)

export const pingButton = new ButtonBuilder()
    .setCustomId('ping')
    .setLabel('Ping')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(false)
    .setEmoji('🏓');

export const pingActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(pingButton);