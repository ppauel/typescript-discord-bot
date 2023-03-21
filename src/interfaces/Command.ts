import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, MessageContextMenuCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, UserContextMenuCommandInteraction } from 'discord.js';

export interface Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder,
    global: boolean,
    execute(interaction: CommandInteraction): Promise<void>
}

export interface ChatInputCommand extends Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    execute(interaction: ChatInputCommandInteraction): Promise<void>,
    autocomplete?(interaction: AutocompleteInteraction): Promise<void>
}

export interface ContextMenu extends Command {
    options: ContextMenuCommandBuilder
    execute(interaction: ContextMenuCommandInteraction): Promise<void>
}

export interface UserContextMenu extends ContextMenu {
    execute(interaction: UserContextMenuCommandInteraction): Promise<void>
}

export interface MessageContextMenu extends ContextMenu {
    execute(interaction: MessageContextMenuCommandInteraction): Promise<void>
}
