import {
    AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction, REST
} from 'discord.js';
import assert from 'node:assert/strict';
import { ExtendedClient } from '../../Client';
import { ChatInputCommand, ContextMenuCommand } from '../Commands/Command';


export class CommandHandler {
	protected readonly client: ExtendedClient;

	protected readonly rest: REST;

	protected _chatCommands: Collection<string, ChatInputCommand> = new Collection();

	protected _contextCommands: Collection<string, ContextMenuCommand> = new Collection();

	get contextCommands() {
		return this._contextCommands;
	}

	get chatCommands() {
		return this._chatCommands;
	}

	private validateCommand(command: ChatInputCommand | ContextMenuCommand) {
		assert(typeof command.execute !== 'undefined');
	}

	private validateCommands(commands: Collection<string, ChatInputCommand> | Collection<string, ContextMenuCommand>) {
		for (const command of commands.values()) {
			this.validateCommand(command);
		}
	}

	add(command: ChatInputCommand | ContextMenuCommand) {
		if (command instanceof ChatInputCommand) this._chatCommands.set(command.builder.name, command);
		else this._contextCommands.set(command.builder.name, command);
		this.validateCommand(command);
		return this;
	}

	addChatCommands(commands: Collection<string, ChatInputCommand>) {
		this._chatCommands = this._chatCommands.concat(commands);
		this.validateCommands(commands);
		return this;
	}

	addContextCommands(commands: Collection<string, ContextMenuCommand>) {
		this._contextCommands = this._contextCommands.concat(commands);
		this.validateCommands(commands);
		return this;
	}

	/**
	 * Deploy Application Commands to Discord
	 * @see https://discord.com/developers/docs/interactions/application-commands
	 */
	async register() {
		if (!this.client.loggedIn) throw Error('Client cannot register commands before init');

		this.client.emit('debug', 'Deploying commands...');

		const commandData = this.chatCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON())
			.concat(this.contextCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON()));

		const sentCommands = await this.client.application.commands.set(commandData);

		this.client.emit('debug', `Deployed ${sentCommands.size} global command(s)`);

		return sentCommands;
	}

	runChatCommand(interaction: ChatInputCommandInteraction) {
		return this.chatCommands.get(interaction.commandName).execute(interaction);
	}

	runAutocomplete(interaction: AutocompleteInteraction) {
		return this.chatCommands.get(interaction.commandName).autocomplete(interaction);
	}

	runContextCommand(interaction: ContextMenuCommandInteraction) {
		return this.contextCommands.get(interaction.commandName).execute(interaction);
	}

	constructor(client: ExtendedClient) {
		this.client = client;
		this.rest = client.rest;
	}
}
