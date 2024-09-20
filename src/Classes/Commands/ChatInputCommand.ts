import {
    ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder
} from 'discord.js';
import { BaseCommand } from './BaseCommand.js';
import { AnySlashCommandBuilder } from './types.js';

/**
 * Slash command
 */
export class ChatInputCommand extends BaseCommand<AnySlashCommandBuilder, ChatInputCommandInteraction> {

    /**
     * Runs when client receives and Autocomplete interaction
     * @param interaction Autocomplete interaction received by the client
     */
    protected _autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;

    get autocomplete() {
        return this._autocomplete;
    }

    set autocomplete(autocomplete: (interaction: AutocompleteInteraction) => Promise<void>) {
        this._autocomplete = autocomplete;
    }

    get type() {
        return ApplicationCommandType.ChatInput;
    }
    
    /**
     * Set the command builder method
     * @param input Slash command builder or callback
     * @returns The modified object
     */
    setBuilder(input: SlashCommandBuilder | ((commandBuilder: SlashCommandBuilder) => AnySlashCommandBuilder)): this {
        if (typeof input === 'function') {
            this._builder = input(new SlashCommandBuilder());
        }
        else {
            this._builder = input;
        }
        return this;
    }

    /**
     * Set Autocomplete method
     * @param autocomplete autocomplete function
     * @returns The modified object
     */
    public setAutocomplete(autocomplete: (interaction: AutocompleteInteraction) => Promise<void>) {
        this._autocomplete = autocomplete;
        return this;
    }

    constructor(options: Partial<ChatInputCommand> = {}) {
        super(options);
        if (options.autocomplete) this.autocomplete = options.autocomplete;
    }
}