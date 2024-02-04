import {
    AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Snowflake
} from 'discord.js';
import assert from 'node:assert/strict';
import { Client } from '../../Client';
import { ChatInputCommand, ContextMenuCommand } from '../Commands';


export class CommandHandler {
    protected readonly client: Client;

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
    register() {
        if (!this.client.loggedIn) throw Error('Client cannot register commands before init');

        console.log('Deploying commands...');
        Promise.all([
            // Gloabl commands deploy
            async () => {
                const globalCommandData = this.chatCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON())
			        .concat(this.contextCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON()));
                const sentCommands = await this.client.application.commands.set(globalCommandData);
                console.log(`Deployed ${sentCommands.size} global command(s)`);
                return globalCommandData;
            },
            // Guild commands deploy
            async () => {
                const guildCommandData = new Collection<
                    Snowflake,
                    (RESTPostAPIChatInputApplicationCommandsJSONBody | RESTPostAPIContextMenuApplicationCommandsJSONBody)[]
                >();
                // Get guild chat commands menues
                this.chatCommands.filter((f) => f.isGlobal === false).map((m) => {
                    const json = m.toJSON();
                    m.guildIds.forEach((guildId) => {
                        if (guildCommandData.has(guildId)) {
                            guildCommandData.get(guildId).concat(json);
                        }
                        else {
                            guildCommandData.set(guildId, [json]);
                        }
                    });

                });
                // Get guild context menues
                this.contextCommands.filter((f) => f.isGlobal === false).map((m) => {
                    const json = m.toJSON();
                    m.guildIds.forEach((guildId) => {
                        if (guildCommandData.has(guildId)) {
                            guildCommandData.get(guildId).concat(json);
                        }
                        else {
                            guildCommandData.set(guildId, [json]);
                        }
                    });
                });

                // Deploys commands buy guild
                for (const [ guildIds, json ] of guildCommandData) {
                    await this.client.application.commands.set(json, guildIds);
                }
                console.log(`Deployed commands to ${guildCommandData.size} guilds`);
                return guildCommandData;
            }
        ]);
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

    constructor(client: Client) {
        this.client = client;
        this.rest = client.rest;
    }
}
