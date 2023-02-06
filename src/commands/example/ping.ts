import { Locale, PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { getPingButton } from '../../features/ping';
import i18n, { localization } from '../../features/i18n';
import { ChatInputCommand } from '../../interfaces';

// Example slash command
const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName(i18n(Locale.EnglishUS, 'ping-name'))
        .setNameLocalizations(localization('ping-name'))
        .setDescription(i18n(Locale.EnglishUS, 'ping-description'))
        .setDescriptionLocalizations(localization('ping-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    execute: async (_client, interaction) => {
        interaction.reply({ content: ` ${i18n(interaction.locale, 'ping-reply')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    },
};
export default command;