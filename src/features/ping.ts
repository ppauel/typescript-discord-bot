import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Locale, MessageActionRowComponentBuilder } from 'discord.js';
import { t } from '../i18n';

// Example button (related to the /ping command)
export function getPingButton(locale:Locale) {
    const pingButton = new ButtonBuilder()
        .setCustomId('ping')
        .setLabel(t({ locale, key:'button', ns: 'ping' }))
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false)
        .setEmoji('🏓');
    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(pingButton);
}