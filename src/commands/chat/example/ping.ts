import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand } from '../../../Classes';
import { localize } from '../../../bot';
import { getPingButton } from '../../../features/ping';

// Locale Namespace
const ns = 'ping';

// Example slash command
export default new ChatInputCommand({
    builder: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong')
        .setNameLocalizations(localize.DiscordlocalizationRecord('command-name', ns))
        .setDescriptionLocalizations(localize.DiscordlocalizationRecord('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    execute: async (interaction) => {
        return interaction.reply({
            content: ` ${localize.t('reply', ns, interaction.locale)} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true 
        });
    }
});