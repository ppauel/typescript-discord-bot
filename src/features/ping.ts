import {
    ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, MessageActionRowComponentBuilder
} from 'discord.js';
import { localize } from '../bot.js';

// Example button (related to the /ping command)
/**
 * Creates the ping response button
 * @param locale the locale of the interation where the button was requested
 * @returns Button builder object
 */
export function getPingButton(locale:Locale) {
    const pingButton = new ButtonBuilder()
        .setCustomId('ping')
        .setLabel(localize.t('button', 'ping', locale))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
        .setEmoji('🏓');
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(pingButton);
}