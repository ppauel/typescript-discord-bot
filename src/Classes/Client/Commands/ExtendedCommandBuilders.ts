import {
	Collection,
	ContextMenuCommandBuilder,
	SharedSlashCommandOptions,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder
} from 'discord.js';

import { addHelpInfo } from './addHelpInfo';

export class ExtendedContextMenuCommandBuilder extends addHelpInfo(ContextMenuCommandBuilder) {}

export class ExtendedSlashCommandSubcommandBuilder extends addHelpInfo(SlashCommandSubcommandBuilder) {}

export class ExtendedSlashCommandSubcommandGroupBuilder extends addHelpInfo(SlashCommandSubcommandGroupBuilder) {
	protected subcommandBuilders = new Collection<string, ExtendedSlashCommandSubcommandBuilder>();

	public addSubcommand(
		input: ExtendedSlashCommandSubcommandBuilder | ((subcommandGroup: ExtendedSlashCommandSubcommandBuilder) => ExtendedSlashCommandSubcommandBuilder)
	): this {
		const command = typeof input === 'function' ? input(new ExtendedSlashCommandSubcommandBuilder()) : input;

		this.subcommandBuilders.set(command.name, command);

		super.addSubcommand(input);

		return this;
	}
}

export class ExtendedSlashCommandBuilder extends addHelpInfo(SlashCommandBuilder) {
	protected subcommandGroupBuilders = new Collection<string, ExtendedSlashCommandSubcommandGroupBuilder>();

	protected subcommandBuilders = new Collection<string, ExtendedSlashCommandSubcommandBuilder>();

	public addSubcommandGroup(
		input:
			| ExtendedSlashCommandSubcommandGroupBuilder
			| ((subcommandGroup: ExtendedSlashCommandSubcommandGroupBuilder) => ExtendedSlashCommandSubcommandGroupBuilder)
	): Omit<ExtendedSlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>> {
		const group = typeof input === 'function' ? input(new ExtendedSlashCommandSubcommandGroupBuilder()) : input;

		this.subcommandGroupBuilders.set(group.name, group);

		super.addSubcommandGroup(input);

		return this as Omit<ExtendedSlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>>;
	}

	public addSubcommand(
		input: ExtendedSlashCommandSubcommandBuilder | ((subcommandGroup: ExtendedSlashCommandSubcommandBuilder) => ExtendedSlashCommandSubcommandBuilder)
	): Omit<ExtendedSlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>> {
		const command = typeof input === 'function' ? input(new ExtendedSlashCommandSubcommandBuilder()) : input;

		this.subcommandBuilders.set(command.name, command);

		super.addSubcommand(input);

		return this as Omit<ExtendedSlashCommandBuilder, Exclude<keyof SharedSlashCommandOptions, 'options'>>;
	}
}
