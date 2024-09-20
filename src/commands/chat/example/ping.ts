import {
    InteractionContextType,
    PermissionsBitField,
    SlashCommandBuilder
} from 'discord.js';
import { localize } from '../../../bot.js';
import { ChatInputCommand } from '../../../Classes/index.js';
import { getPingButton } from '../../../features/ping.js';

// Locale Namespace
const ns = 'ping';

// Example slash command
export default new ChatInputCommand({
    builder: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong')
        .setNameLocalizations(localize.discordLocalizationRecord('command-name', ns))
        .setDescriptionLocalizations(localize.discordLocalizationRecord('command-description', ns))
        // Allows command to be used in DMs, servers and group DMs
        .setContexts(InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    // Uncomment the below line to only have the ping command in the specified guild
    // guildIds: [process.env.GUILDID],
    execute: async (interaction) => {
        return interaction.reply({
            content: ` ${localize.t('reply', ns, interaction.locale)} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true 
        });
    }
});