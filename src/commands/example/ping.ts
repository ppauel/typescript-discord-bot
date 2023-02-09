import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { getPingButton } from '../../features/ping';
import { fallback, i18n, localization } from '../../features/i18n';
import { ChatInputCommand } from '../../interfaces';

// Example slash command
const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName(fallback('ping-name'))
        .setNameLocalizations(localization('ping-name'))
        .setDescription(fallback('ping-description'))
        .setDescriptionLocalizations(localization('ping-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    async execute(_client, interaction) {
        interaction.reply({ content: ` ${i18n(interaction.locale, 'ping-reply')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    },
};
export default command;