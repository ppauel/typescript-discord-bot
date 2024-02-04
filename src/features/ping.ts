import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, MessageActionRowComponentBuilder } from 'discord.js';
import { localize } from '../bot';

// Example button (related to the /ping command)
export function getPingButton(locale:Locale) {
    const pingButton = new ButtonBuilder()
        .setCustomId('ping')
        .setLabel(localize.t('button', 'ping', locale))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
        .setEmoji('🏓');
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(pingButton);
}