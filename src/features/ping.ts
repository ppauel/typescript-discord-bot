import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, MessageActionRowComponentBuilder } from 'discord.js';
import i18n from './i18n';
// Example button (related to the /ping command)
export function getPingButton(locale:Locale) {
    const pingButton = new ButtonBuilder()
        .setCustomId('ping')
        .setLabel(i18n(locale, 'ping-button'))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
        .setEmoji('🏓');
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(pingButton);
}