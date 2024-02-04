import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { BaseCommand } from "./BaseCommand";

/**
 * Slash command
 */
export class ChatInputCommand extends BaseCommand<SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">, ChatInputCommandInteraction> {

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

	/**
	 * Set the command builder method
	 * @param input Slah command builder or callback
	 * @returns The modified object
	 */
	setBuilder(input: SlashCommandBuilder | ((commandBuilder: SlashCommandBuilder) => SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">)): this {
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