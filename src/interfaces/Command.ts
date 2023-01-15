import ExtendedClient from '../classes/Client';
import { ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, UserContextMenuCommandInteraction } from 'discord.js';

export interface Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder,
    global: boolean,
    execute(client: ExtendedClient, interaction: CommandInteraction): Promise<void>
}

export interface ChatInputCommand extends Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    execute(client: ExtendedClient, interaction: ChatInputCommandInteraction): Promise<void>
}

export interface ContextMenu extends Command {
    options: ContextMenuCommandBuilder
    execute(client: ExtendedClient, interaction: ContextMenuCommandInteraction): Promise<void>
}

export interface UserContextMenu extends ContextMenu {
    execute(client: ExtendedClient, interaction: UserContextMenuCommandInteraction): Promise<void>
}

export interface MessageContextMenu extends ContextMenu {
    execute(client: ExtendedClient, interaction: MessageContextMenuCommandInteraction): Promise<void>
}
