import {
	AutocompleteInteraction, ChatInputCommandInteraction, ContextMenuCommandInteraction
} from 'discord.js';
import { ExtendedContextMenuCommandBuilder, ExtendedSlashCommandBuilder } from '..';
import {
	ChatInputCommandBuilders,
	ReturnableInteraction
} from '../../util';

/**
 * Slash command or context command
 */
export class Command<
	TypeBuilder extends ChatInputCommandBuilders | ExtendedContextMenuCommandBuilder,
	TypeInteraction extends ChatInputCommandInteraction | ContextMenuCommandInteraction
> {
	// The constructor for the registration for the command
	protected _builder: TypeBuilder;

	// State if the command is available in all servers
	protected _isGlobal: boolean = true;

	// Method that is run when command is executed
	protected _execute: (interaction: TypeInteraction) => Promise<ReturnableInteraction> | ReturnableInteraction;

	get isGlobal() {
		return this._isGlobal;
	}

	set isGlobal(isGlobal: boolean) {
		this._isGlobal = isGlobal;
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

	/**
	 * Set the isGlobal Value
	 * @param isGlobal boolean vaule to be set
	 * @returns The modified object
	 */
	setGlobal(isGlobal: boolean): this {
		this.isGlobal = isGlobal;
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

	/**
	 * 
	 * @param options 
	 */
	constructor(options: Partial<Command<TypeBuilder, TypeInteraction>> = {}) {
		if (options.isGlobal) this.isGlobal = options.isGlobal;
		if (options.builder) this.builder = options.builder;
		if (options.execute) this.execute = options.execute;
	}
}

/**
 * Slash command
 */
export class ChatInputCommand extends Command<ChatInputCommandBuilders, ChatInputCommandInteraction> {

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
	setBuilder(input: ExtendedSlashCommandBuilder | ((subcommandBuilder: ExtendedSlashCommandBuilder) => ChatInputCommandBuilders)): this {
		if (typeof input === 'function') {
			this._builder = input(new ExtendedSlashCommandBuilder());
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

export class ContextMenuCommand extends Command<ExtendedContextMenuCommandBuilder, ContextMenuCommandInteraction> {
	/**
	 * Set the Context Menu command builder method
	 * @param input Context Menu command builder or callback
	 * @returns The modified object
	 */
	public setBuilder(
		input: ExtendedContextMenuCommandBuilder | ((subcommandBuilder: ExtendedContextMenuCommandBuilder) => ExtendedContextMenuCommandBuilder)
	): this {
		if (typeof input === 'function') {
			this._builder = input(new ExtendedContextMenuCommandBuilder());
		}
		else {
			this._builder = input;
		}
		return this;
	}
}
