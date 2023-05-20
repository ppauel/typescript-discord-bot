import {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    CommandInteraction,
    SlashCommandSubcommandsOnlyBuilder,
    InteractionResponse,
    Message,
    ContextMenuCommandInteraction,
} from 'discord.js';
import { Mutable } from './types';

export type ReturnableInteraction = void | CommandInteraction | ContextMenuCommandInteraction | InteractionResponse | Message;

export type ChatInputCommandBuilders =
	| SlashCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

/**
 * Slash command or context command
 */
export interface Command {
	/**
	 * The constructor for the registation for the command
	 */
	builder: ChatInputCommandBuilders | ContextMenuCommandBuilder;

	/**
	 * State if the command is avaible in all servers
	 */
	isGlobal: boolean;
}

/**
 * Slash command
 */
export class ChatInputCommand implements Command {
    readonly builder: ChatInputCommandBuilders;

    readonly isGlobal: boolean;

    public execute: (interaction: ChatInputCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

    /**
	 * runs when client recives and Autocomplete interaction
	 * @param interaction Autocomplete interaction recived by the client
	 */
    public autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    constructor(options?: Partial<ChatInputCommand>) {
        // is options is undifined
        if (!options) return;

        this.isGlobal = options.isGlobal === undefined ? true : options.isGlobal;
        if (options.builder) this.builder = options.builder;
        if (options.execute) this.execute = options.execute;
        if (options.autocomplete) this.autocomplete = options.autocomplete;
    }

    public setBuilder(input: SlashCommandBuilder | ((subcommandBuilder: SlashCommandBuilder) => ChatInputCommandBuilders)): this {
        if (typeof input === 'function') {
            (this as Mutable<ChatInputCommand>).builder = input(new SlashCommandBuilder());
        }
        else {
            (this as Mutable<ChatInputCommand>).builder = input;
        }
        return this;
    }

    public setGlobal(isGlobal: boolean): this {
        (this as Mutable<ChatInputCommand>).isGlobal = isGlobal;
        return this;
    }

    public setExecute(execute: (interaction: ChatInputCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction) {
        this.execute = execute;
        return this;
    }

    public setAutocomplete(autocomplete: (interaction: AutocompleteInteraction) => Promise<void>) {
        this.autocomplete = autocomplete;
        return this;
    }
}

export class ContextMenuCommand implements Command {
    readonly builder: ContextMenuCommandBuilder;

    readonly isGlobal: boolean;

    public execute: (interaction: ContextMenuCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

    constructor(options?: Partial<ContextMenuCommand>) {
        // is options is undifined
        if (!options) return;

        this.isGlobal = options.isGlobal === undefined ? true : options.isGlobal;
        if (options.builder) this.builder = options.builder;
        if (options.execute) this.execute = options.execute;
    }

    public setBuilder(input: ContextMenuCommandBuilder | ((subcommandBuilder: ContextMenuCommandBuilder) => ContextMenuCommandBuilder)): this {
        if (typeof input === 'function') {
            (this as Mutable<ContextMenuCommand>).builder = input(new ContextMenuCommandBuilder());
        }
        else {
            (this as Mutable<ContextMenuCommand>).builder = input;
        }
        return this;
    }

    public setGlobal(isGlobal: boolean): this {
        (this as Mutable<ContextMenuCommand>).isGlobal = isGlobal;
        return this;
    }

    public setExecute(execute: (interaction: ContextMenuCommandInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction) {
        this.execute = execute;
        return this;
    }
}

export default {
    ContextMenuCommand,
    ChatInputCommand,
};
