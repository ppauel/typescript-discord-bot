import { ClientOptions } from 'discord.js';

export interface ExtendedClientOptions extends ClientOptions {
    receiveMessageComponents?: boolean;
    receiveModals?: boolean;
    receiveAutocomplete?: boolean;
    replyOnError?: boolean;
    splitCustomID?: boolean;
    splitCustomIDOn?: string;
    useDefaultInterctionEvent?: boolean;
    useGuildCommands?: boolean;
}