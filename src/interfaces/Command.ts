import {
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    UserContextMenuCommandInteraction,
} from "discord.js";
import ExtendedClient from "../classes/Client";

type AnySlashCommandBuilder =
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;

export interface Command {
    options: AnySlashCommandBuilder | ContextMenuCommandBuilder;
    global: boolean;
    execute(
        client: ExtendedClient,
        interaction: CommandInteraction,
    ): Promise<void>;
}

export interface ChatInputCommand extends Command {
    options: AnySlashCommandBuilder;
    execute(
        client: ExtendedClient,
        interaction: ChatInputCommandInteraction,
    ): Promise<void>;
}

export interface ContextMenu extends Command {
    options: ContextMenuCommandBuilder;
    execute(
        client: ExtendedClient,
        interaction: ContextMenuCommandInteraction,
    ): Promise<void>;
}

export interface UserContextMenu extends ContextMenu {
    execute(
        client: ExtendedClient,
        interaction: UserContextMenuCommandInteraction,
    ): Promise<void>;
}

export interface MessageContextMenu extends ContextMenu {
    execute(
        client: ExtendedClient,
        interaction: MessageContextMenuCommandInteraction,
    ): Promise<void>;
}
