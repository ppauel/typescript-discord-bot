import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { Mutable } from './types';

/**
 * The type of interaction that can be returned from a command execution.
 */
export type ReturnableInteraction = void | CommandInteraction | ContextMenuCommandInteraction | InteractionResponse | Message;

/**
 * The type of builders that can be used for chat input commands.
 */
export type ChatInputCommandBuilders =
	| SlashCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

/**
 * Represents a slash command or context command.
 */
export interface Command {
	/**
	 * The builder for registering the command.
	 */
	builder: ChatInputCommandBuilders | ContextMenuCommandBuilder;

	/**
	 * Indicates whether the command is available in all servers.
	 */
	isGlobal: boolean;
}

/**
 * Represents a chat input command.
 */
export class ChatInputCommand implements Command {
    readonly builder: ChatInputCommandBuilders;
    readonly isGlobal: boolean;

    /**
	 * Runs when the client receives an command interaction.
	 * @param interaction - The command interaction received by the client.
	 */
    public execute: (interaction: ChatInputCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

    /**
	 * Runs when the client receives an autocomplete interaction.
	 * @param interaction - The autocomplete interaction received by the client.
	 */
    public autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    /**
     * Creates a new instance of ChatInputCommand.
     * @param options - The options to customize the ChatInputCommand instance.
     */
    constructor(options?: Partial<ChatInputCommand>) {
        if (!options) return;

        this.isGlobal = options.isGlobal === undefined ? true : options.isGlobal;
        if (options.builder) this.builder = options.builder;
        if (options.execute) this.execute = options.execute;
        if (options.autocomplete) this.autocomplete = options.autocomplete;
    }

    /**
     * Sets the builder for the command.
     * @param input - The SlashCommandBuilder or a function that takes a subcommandBuilder and returns ChatInputCommandBuilders.
     * @returns The updated ChatInputCommand instance.
     */
    public setBuilder(input: SlashCommandBuilder | ((subcommandBuilder: SlashCommandBuilder) => ChatInputCommandBuilders)): this {
        if (typeof input === 'function') {
            (this as Mutable<ChatInputCommand>).builder = input(new SlashCommandBuilder());
        }
        else {
            (this as Mutable<ChatInputCommand>).builder = input;
        }
        return this;
    }

    /**
     * Sets whether the command is available globally.
     * @param isGlobal - Indicates if the command is available globally.
     * @returns The updated ChatInputCommand instance.
     */
    public setGlobal(isGlobal: boolean): this {
        (this as Mutable<ChatInputCommand>).isGlobal = isGlobal;
        return this;
    }

    /**
     * Sets the execute function for the command.
     * @param execute - The function to be executed when the command is triggered.
     * @returns The updated ChatInputCommand instance.
     */
    public setExecute(execute: (interaction: ChatInputCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction) {
        this.execute = execute;
        return this;
    }

    /**
     * Sets the autocomplete function for the command.
     * @param autocomplete - The function to be executed when an autocomplete interaction is received.
     * @returns The updated ChatInputCommand instance.
     */
    public setAutocomplete(autocomplete: (interaction: AutocompleteInteraction) => Promise<void>) {
        this.autocomplete = autocomplete;
        return this;
    }
}

/**
 * Represents a context menu command.
 */
export class ContextMenuCommand implements Command {
    readonly builder: ContextMenuCommandBuilder;
    readonly isGlobal: boolean = true;
    public execute: (interaction: ContextMenuCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

    /**
     * Creates a new instance of ContextMenuCommand.
     * @param options - The options to customize the ContextMenuCommand instance.
     */
    constructor(options?: Partial<ContextMenuCommand>) {
        if (!options) return;

        this.isGlobal = options.isGlobal === undefined ? true : options.isGlobal;
        if (options.builder !== undefined) this.builder = options.builder;
        if (options.execute) this.execute = options.execute;
    }

    /**
     * Sets the builder for the command.
     * @param input - The ContextMenuCommandBuilder or a function that takes a subcommandBuilder and returns ContextMenuCommandBuilder.
     * @returns The updated ContextMenuCommand instance.
     */
    public setBuilder(input: ContextMenuCommandBuilder | ((subcommandBuilder: ContextMenuCommandBuilder) => ContextMenuCommandBuilder)): this {
        if (typeof input === 'function') {
            (this as Mutable<ContextMenuCommand>).builder = input(new ContextMenuCommandBuilder());
        }
        else {
            (this as Mutable<ContextMenuCommand>).builder = input;
        }
        return this;
    }

    /**
     * Sets whether the command is available globally.
     * @param isGlobal - Indicates if the command is available globally.
     * @returns The updated ContextMenuCommand instance.
     */
    public setGlobal(isGlobal: boolean): this {
        (this as Mutable<ContextMenuCommand>).isGlobal = isGlobal;
        return this;
    }

    /**
     * Sets the execute function for the command.
     * @param execute - The function to be executed when the command is triggered.
     * @returns The updated ContextMenuCommand instance.
     */
    public setExecute(execute: (interaction: ContextMenuCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction) {
        this.execute = execute;
        return this;
    }
}

export default {
    ContextMenuCommand,
    ChatInputCommand,
};