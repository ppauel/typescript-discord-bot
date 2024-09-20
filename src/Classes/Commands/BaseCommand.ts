import {
    ChatInputCommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, SlashCommandBuilder,
    Snowflake
} from 'discord.js';
import { AnySlashCommandBuilder, ReturnableInteraction } from './types.js';

SlashCommandBuilder;

/**
 * Slash command or context command
 */
export class BaseCommand<
    TypeBuilder extends AnySlashCommandBuilder | ContextMenuCommandBuilder,
    TypeInteraction extends ChatInputCommandInteraction | ContextMenuCommandInteraction
> {
    // The constructor for the registration for the command
    protected _builder: TypeBuilder;

    protected _guildIds: Snowflake[] = [];

    // Method that is run when command is executed
    protected _execute: (interaction: TypeInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

    get name() {
        return this._builder.name;
    }

    get isGlobal() {
        return this._guildIds.length == 0;
    }

    get guildIds() {
        return this._guildIds;
    }
    set guildIds(ids: Snowflake[]) {
        this._guildIds = ids;
    }

    get builder() {
        return this._builder;
    }

    set builder(builder: TypeBuilder) {
        this._builder = builder;
    }

    get execute() {
        return this._execute;
    }

    set execute(execute: (interaction: TypeInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction) {
        this._execute = execute;
    }

    setGuildIds(... ids: Snowflake[]) {
        this._guildIds = ids;
        return this;
    }

    /**
     * Set the execute method
     * @param execute function passed in
     * @returns The modified object
     */
    setExecute(execute: (interaction: TypeInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction): this {
        this.execute = execute;
        return this;
    }

    toJSON() {
        return this._builder.toJSON();
    }

    constructor(options: Partial<BaseCommand<TypeBuilder, TypeInteraction>> = {}) {
        if (options.guildIds) this._guildIds = options.guildIds;
        if (options.builder) this.builder = options.builder;
        if (options.execute) this.execute = options.execute;
    }
}