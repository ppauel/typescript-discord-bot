import {
    ApplicationCommandType,
    AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction,
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Snowflake
} from 'discord.js';
import assert from 'node:assert/strict';
import { Client } from '../Client/index.js';
import { ChatInputCommand, ContextMenuCommand } from '../Commands/index.js';


export class CommandHandler {
    readonly client: Client;

    protected readonly rest: REST;

    protected _chatCommands = new Collection<string, ChatInputCommand>();

    protected _userContextMenus = new Collection<string, ContextMenuCommand>();

    protected _messageContextMenus = new Collection<string, ContextMenuCommand>();

    get userContexMenus() {
        return this._userContextMenus;
    }

    get chatCommands() {
        return this._chatCommands;
    }

    private validateAplicationCommand(AplicationCommand:ContextMenuCommand | ChatInputCommand, type: ApplicationCommandType) {
        assert(typeof AplicationCommand.execute !== 'undefined', 'excute function not present');
        assert(typeof AplicationCommand.builder !== 'undefined', 'builder is not present');
        if (AplicationCommand.type !== type) new Error('Command Type does not match Exspected');
    }

    add(command: ChatInputCommand | ContextMenuCommand) {
        const { type } = command;

        this.validateAplicationCommand(command, type);

        switch (type) {
            case ApplicationCommandType.ChatInput:
                this._chatCommands.set(command.builder.name, command);
                break;
            case ApplicationCommandType.Message:
                this._messageContextMenus.set(command.builder.name, command as ContextMenuCommand);
                break;
            case ApplicationCommandType.User:
                this._userContextMenus.set(command.builder.name, command as ContextMenuCommand);
                break;
            default:
                break;
        }
        return this;
    }

    addChatCommands(commands: Collection<string, ChatInputCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.ChatInput);
                this._chatCommands.set(name, command);
            }
            catch (error) {
                console.error(`Command "${name}" had an error: ${error}`);
            }
        }
        return this;
    }

    addUserContextMenus(commands: Collection<string, ContextMenuCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.User);
                this._userContextMenus.set(name, command);
            }
            catch (error) {
                console.error(`Command "${name}" had an error: ${error}`);
            }
        }
        return this;
    }

    addMessageContextMenus(commands: Collection<string, ContextMenuCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.User);
                this._messageContextMenus.set(name, command);
            }
            catch (error) {
                console.error(`Command "${name}" had an error: ${error}`);
            }
        }
        return this;
    }

    /**
     * Deploy Application Commands to Discord
     * @see https://discord.com/developers/docs/interactions/application-commands
     */
    async register() {
        if (!this.client.loggedIn) throw Error('Client cannot register commands before init');

        console.log('Deploying commands...');
        const globalCommandData = this.chatCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON())
            .concat(this._userContextMenus.filter((f) => f.isGlobal === true).map((m) => m.toJSON()))
            .concat(this._messageContextMenus.filter((f) => f.isGlobal === true).map((m) => m.toJSON()));
        const sentCommands = await this.client.application.commands.set(globalCommandData);
        console.log(`Deployed ${sentCommands.size} global command(s)`);
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
        this._userContextMenus.filter((f) => f.isGlobal === false).map((m) => {
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

        this._messageContextMenus.filter((f) => f.isGlobal === false).map((m) => {
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
        console.log('Commands registered');
    }

    runChatCommand(interaction: ChatInputCommandInteraction) {
        return this.chatCommands.get(interaction.commandName).execute(interaction);
    }

    runAutocomplete(interaction: AutocompleteInteraction) {
        return this.chatCommands.get(interaction.commandName).autocomplete(interaction);
    }

    runUserContextMenus(interaction: ContextMenuCommandInteraction) {
        return this._userContextMenus.get(interaction.commandName).execute(interaction);
    }

    runMessageContextMenus(interaction: ContextMenuCommandInteraction) {
        return this._messageContextMenus.get(interaction.commandName).execute(interaction);
    }
    constructor(client: Client) {
        this.client = client;
        this.rest = client.rest;
    }
}
