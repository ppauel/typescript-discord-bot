import ExtendedClient from '../classes/Client';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommand, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

type AnyPayload = (SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | ContextMenuCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">)[]

export default async function deploy(client: ExtendedClient) {
    // Skip if no-deployment flag is set
    if (process.argv.includes('--no-deployment')) return;

    const rest = new REST({ version: client.config.restVersion }).setToken(client.token!);

    const globalDeploy: AnyPayload = (Array.from(client.commands.filter(cmd => cmd.global === true).values()).map(m => m.options) as AnyPayload)
        .concat(Array.from(client.contextMenus.filter(cmd => cmd.global === true).values()).map(m => m.options) as AnyPayload);

    const guildDeploy: AnyPayload = (Array.from(client.commands.filter(cmd => cmd.global === false).values()).map(m => m.options) as AnyPayload)
        .concat(Array.from(client.contextMenus.filter(cmd => cmd.global === false).values()).map(m => m.options) as AnyPayload);

    console.log(`Deploying commands...`);

    // Deploy global commands
    const applicationCommands = await rest.put(Routes.applicationCommands(client.user!.id), { body: globalDeploy })
        .catch(console.error) as ApplicationCommand[];

    console.log(`Deployed ${applicationCommands.length} global commands`);

    // Deploy guild Commands
    if (!client.config.interactions.useGuildCommands) return;
    if (client.config.guild === "your_guild_id") return console.log('Please specify a guild id in order to use guild commands')
    const guildId = client.config.guild;
    const guild = await client.guilds.fetch(guildId).catch(console.error);
    if (!guild) return;

    const applicationGuildCommands = await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: guildDeploy })
        .catch(console.error) as ApplicationCommand[];

    console.log(`Deployed ${applicationGuildCommands?.length || 0} guild commands to ${guild.name}`);
}