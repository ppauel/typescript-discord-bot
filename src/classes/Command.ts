import { SlashCommandBuilder, ContextMenuCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction, ContextMenuCommandInteraction,
    CommandInteraction } from 'discord.js';
import { ChatInputCommandBuilders, Mutable } from './Types';

export interface CommandOptions{
    builder: ChatInputCommandBuilders | ContextMenuCommandBuilder,
    global: boolean,
    execute: (interaction: CommandInteraction) => Promise<void>,
}

export class ChatInputCommand implements CommandOptions {

    readonly builder: ChatInputCommandBuilders;

    readonly global: boolean;

    public execute: (interaction: ChatInputCommandInteraction) => Promise<void>;

    public autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    constructor()
    constructor(options?:Partial<ChatInputCommand>) {
        if (!options) {
            this.global = false;
        }
        else {
            if (options.builder) this.builder = options.builder;
            this.global = options.global == undefined ? true : options.global;
            if (options.execute) this.execute = options.execute;
            this.autocomplete = options.autocomplete;
        }
    }

    public setBuilder(input: SlashCommandBuilder | ((subcommandBuilder: SlashCommandBuilder) => ChatInputCommandBuilders)): this {
        if (typeof input == 'function') {
            (this as Mutable<ChatInputCommand>).builder = input(new SlashCommandBuilder());
        }
        else {
            (this as Mutable<ChatInputCommand>).builder = input;
        }
        return this;
    }

    public setGlobal(global: boolean) {
        (this as Mutable<ChatInputCommand>).global = global;
        return this;
    }

    public setExecute(execute:((interaction: ChatInputCommandInteraction) => Promise<void>)) {
        this.execute = execute;
        return this;
    }

    public setAutocomplete(autocomplete:((interaction: AutocompleteInteraction) => Promise<void>)) {
        this.autocomplete = autocomplete;
        return this;
    }
}

export class ContextMenuCommand implements CommandOptions {

    readonly builder: ContextMenuCommandBuilder;

    readonly global: boolean;

    public execute: (interaction: ContextMenuCommandInteraction) => Promise<void>;

    constructor()
    constructor(options?:Partial<ContextMenuCommand>) {
        if (!options) {
            this.global = false;
        }
        else {
            if (options.builder) this.builder = options.builder;
            this.global = options.global == undefined ? true : options.global;
            if (options.execute) this.execute = options.execute;
        }
    }

    public setBuilder(input: ContextMenuCommandBuilder | ((subcommandBuilder: ContextMenuCommandBuilder) => ContextMenuCommandBuilder)): this {
        if (typeof input == 'function') {
            (this as Mutable<ContextMenuCommand>).builder = input(new ContextMenuCommandBuilder());
        }
        else {
            (this as Mutable<ContextMenuCommand>).builder = input;
        }
        return this;
    }

    public setGlobal(global: boolean) {
        (this as Mutable<ContextMenuCommand>).global = global;
        return this;
    }

    public setExecute(execute:((interaction: ContextMenuCommandInteraction) => Promise<void>)) {
        this.execute = execute;
        return this;
    }
}

export default {
    ContextMenuCommand,
    ChatInputCommand,
};