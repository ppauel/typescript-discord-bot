import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { getPingButton } from '../../features/ping';
import i18n, { localization } from '../../i18n';
import { ChatInputCommand } from '../../interfaces';

// Example slash command
const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations(localization('ping-name'))
        .setDescription('Replies with Pong')
        .setDescriptionLocalizations(localization('ping-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    execute: async (_client, interaction) => {
        interaction.reply({ content: ` ${i18n(interaction.locale, 'ping-reply')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    },
};
export default command;