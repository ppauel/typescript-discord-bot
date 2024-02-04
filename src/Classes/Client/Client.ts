import { Client } from 'discord.js';
import {
    CommandHandler, EventHandler, InteractionHandler
} from './handlers';
import { ExtendedClientOptions } from './interfaces';

/**
 * Client is extended from the {@import ('discord.js').Client}.
 * @see {@link https://discord.js.org/#/docs/main/stable/class/Client}
 */
export class ExtendedClient extends Client<true> {

    private _eventHandler = new EventHandler(this);

    private _commandHandler = new CommandHandler(this);

    private _interactionHandler = new InteractionHandler(this);

    // Whether the bot should responded to buttons or select menus
    readonly receiveMessageComponents: boolean;

    // Whether the bot should responded to modals
    readonly receiveModals: boolean;

    // Whether the bot should responded to autocomplete
    readonly receiveAutocomplete: boolean;

    // Whether the bot should responded to autocomplete
    readonly replyOnError: boolean;

    // Whether the bot should split interactions' custom ids (Recommended `true`)
    readonly splitCustomID: boolean;

    // The sting that is used to split the custom id
    readonly splitCustomIDOn: string;

    // Should bot push guild specific commands at start up
    readonly useGuildCommands: boolean;

    // Checks if the init function has run
    private _hasInitRun = false;

    get loggedIn() {
        return this._hasInitRun;
    }

    get events() {
        return this._eventHandler;
    }

    get commands() {
        return this._commandHandler;
    }

    get interactions() {
        return this._interactionHandler;
    }

    /**
     *
     * @param options Options for the client
     * @see https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
     */
    constructor(options: ExtendedClientOptions) {
        super(options);

        this.emit('debug', 'Client starting up...');

        // Paths
        const {
            receiveMessageComponents,
            receiveModals,
            receiveAutocomplete,
            replyOnError,
            splitCustomID,
            splitCustomIDOn,
            useGuildCommands 
        } = options;

        // Misc configuration
        this.receiveMessageComponents = receiveMessageComponents === undefined ? false : receiveMessageComponents;
        this.receiveModals = receiveModals === undefined ? false : receiveModals;
        this.receiveAutocomplete = receiveAutocomplete === undefined ? false : receiveAutocomplete;
        this.replyOnError = replyOnError === undefined ? false : replyOnError;
        this.splitCustomID = splitCustomID === undefined ? false : splitCustomID;
        this.useGuildCommands = useGuildCommands === undefined ? false : useGuildCommands;
        this.splitCustomIDOn = splitCustomIDOn || '_';
    }

    /**
     * Login to the Discord WS
     * @param token The bot's Discord token
     * @returns string response
     */
    public async login(token?: string) {
        this.emit('debug', 'Start of login called');

        if (!this._hasInitRun) {
            throw Error('[ERROR] client.init() has not been completed');
        }

        if (!token) {
            throw new Error('[ERROR] Missing token');
        }

        this.emit('debug', 'Initializing login');

        return super.login(token);
    }
}