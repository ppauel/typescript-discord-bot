import { Client } from 'discord.js';
import {
    CommandHandler, EventHandler, InteractionHandler
} from '../Handlers/index.js';
import onInteractionCreate from './interactionCreate.js';
import { ExtendedClientOptions } from './interfaces.js';

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

    // Message for errors in the interactionCreate
    readonly errorMessage: string = 'There was an error while executing this interaction.';

    // The sting that is used to split the custom id
    readonly splitCustomIDOn?: string;

    // shoult the bot use the provided InteractionCreate event 
    readonly useDefaultInterctionEvent: boolean = true;

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
            replyMessageOnError,
            splitCustomIDOn,
            useDefaultInterctionEvent
        } = options;

        // Misc configuration

        if (useDefaultInterctionEvent) {
            this.events.add(onInteractionCreate);
        }
        else {
            this.useDefaultInterctionEvent = false;
        }
        this.receiveMessageComponents = receiveMessageComponents === undefined ? false : receiveMessageComponents;
        this.receiveModals = receiveModals === undefined ? false : receiveModals;
        this.receiveAutocomplete = receiveAutocomplete === undefined ? false : receiveAutocomplete;
        this.replyOnError = replyOnError === undefined ? false : replyOnError;
        this.splitCustomIDOn = splitCustomIDOn || undefined;
        if (replyMessageOnError) this.errorMessage = replyMessageOnError;
    }

    /**
     * Login to the Discord WS
     * @param token The bot's Discord token
     * @returns string response
     */
    public async login(token?: string) {
        if (!token) {
            throw new Error('[ERROR] Missing token');
        }
        this._hasInitRun = true;
        return super.login(token);
    }
}
