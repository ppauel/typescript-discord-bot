import {
    ApplicationCommandType,
    AutocompleteInteraction, ChatInputCommandInteraction, Collection, ContextMenuCommandInteraction,
    Events,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Routes,
    Snowflake
} from 'discord.js';
import assert from 'node:assert/strict';
import { Client } from '../Client/index.js';
import { ChatInputCommand, ContextMenuCommand } from '../Commands/index.js';


export class CommandHandler {

    // Parent client of the handler
    readonly client: Client;

    // Slash commands in the handler
    protected _chatCommands = new Collection<string, ChatInputCommand>();

    // User context commands in the handler
    protected _userContextMenus = new Collection<string, ContextMenuCommand>();

    // Message context commands in the handler
    protected _messageContextMenus = new Collection<string, ContextMenuCommand>();

    get userContexMenus() {
        return this._userContextMenus;
    }

    get chatCommands() {
        return this._chatCommands;
    }

    get rest() {
        return this.client.rest;
    }

    /**
     * Commandvalidates that exspected values are present
     * @param AplicationCommand the command being inspected
     * @param type type of aplication command to be exspected
     */
    private validateAplicationCommand(AplicationCommand: ContextMenuCommand | ChatInputCommand, type: ApplicationCommandType) {
        assert(typeof AplicationCommand.execute !== 'undefined', 'excute function not present');
        assert(typeof AplicationCommand.builder !== 'undefined', 'builder is not present');
        if (AplicationCommand.type !== type) new Error('Command Type does not match Expected');
    }

    /**
     * Add command to command handler
     * @param command Command to add
     * @returns the command handler
     */
    add(command: ChatInputCommand | ContextMenuCommand) {
        const { type } = command;
        try {
            this.validateAplicationCommand(command, type);
        }
        catch (error) {
            this.client.emit(Events.Error, error);
        }
		
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

    /**
     * Add a collection of chat commands to the handler
     * @param commands Collections of chat commands
     * @returns The command handler
     */
    addChatCommands(commands: Collection<string, ChatInputCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.ChatInput);
                this._chatCommands.set(name, command);
            }
            catch (error) {
                this.client.emit(Events.Error, new Error(`Command "${name}" had an error: {error}`));
            }
        }
        
        return this;
    }

    /**
     * Add a collection of user context commands to the handler
     * @param commands Collections of user context commands
     * @returns The command handler
     */
    addUserContextMenus(commands: Collection<string, ContextMenuCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.User);
                this._userContextMenus.set(name, command);
            }
            catch (error) {
                this.client.emit(Events.Error, new Error(`Command "${name}" had an error: {error}`));
            }
        }
        return this;
    }

    /**
     * Add a collection of message context commands to the handler
     * @param commands Collections of message context commands
     * @returns the command handler
     */
    addMessageContextMenus(commands: Collection<string, ContextMenuCommand>) {
        for (const [ name, command ] of commands) {
            try {
                this.validateAplicationCommand(command, ApplicationCommandType.User);
                this._messageContextMenus.set(name, command);
            }
            catch (error) {
                this.client.emit(Events.Error, new Error(`Command "${name}" had an error: {error}`));
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

        this.client.emit(Events.Debug, 'Deploying commands...');
        const globalCommandData = this.chatCommands.filter((f) => f.isGlobal === true).map((m) => m.toJSON())
            .concat(this._userContextMenus.filter((f) => f.isGlobal === true).map((m) => m.toJSON()))
            .concat(this._messageContextMenus.filter((f) => f.isGlobal === true).map((m) => m.toJSON()));
        const sentCommands = await this.client.application.commands.set(globalCommandData);
        this.client.emit(Events.Debug, `Deployed ${sentCommands.size} global command(s)`);
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
        
        this.client.emit(Events.Debug, `Deployed commands to ${guildCommandData.size} guilds`);
        this.client.emit(Events.Debug, 'Commands registered');
    }
    /**
     * Deregiser commands for one or more guilds
     * @param guildId optional Id to only remove commands from on guild
     */
    async deregisterGuildCommands(guildId?: string) {
        try {
            if (guildId) {
                await this.rest.put(Routes.applicationGuildCommands(this.client.user.id, guildId), { body: [] })
                    .then(() => this.client.emit(Events.Debug, `Successfully deleted all guild commands in ${guildId}.`))
                    .catch((e) => this.client.emit(Events.Error, e));
            }
            
            else {
                for ([guildId] of await (this.client.guilds.fetch())) {
                    await this.rest.put(Routes.applicationGuildCommands(this.client.user.id, guildId), { body: [] })
                        .catch((e) => this.client.emit(Events.Error, e));
                }
                
                this.client.emit(Events.Debug, `Successfully deleted all guild commands.`);
            }
        }
        catch (error) {
            this.client.emit(Events.Error, error);
        }
        
    }

    /**
     * Run function for a chat command in handler
     * @param interaction recived interaction
     * @returns The function for the interaction
     */
    runChatCommand(interaction: ChatInputCommandInteraction) {
        return this.chatCommands.get(interaction.commandName).execute(interaction);
    }

    /**
     * Run function for an autocompete interaction in handler
     * @param interaction recived interaction
     * @returns The function for the interaction
     */
    runAutocomplete(interaction: AutocompleteInteraction) {
        return this.chatCommands.get(interaction.commandName).autocomplete(interaction);
    }

    /**
     * Run function for a user context command in handler
     * @param interaction recived interaction
     * @returns The function for the interaction
     */
    runUserContextMenus(interaction: ContextMenuCommandInteraction) {
        return this._userContextMenus.get(interaction.commandName).execute(interaction);
    }

    /**
     * Run function for a message context command in handler
     * @param interaction recived interaction
     * @returns The function for the interaction
     */
    runMessageContextMenus(interaction: ContextMenuCommandInteraction) {
        return this._messageContextMenus.get(interaction.commandName).execute(interaction);
    }
    /**
     * create a command handler
     * @param client parent client
     */
    constructor(client: Client) {
        this.client = client;
    }
}
