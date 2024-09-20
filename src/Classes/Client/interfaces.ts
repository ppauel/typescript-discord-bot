import { ClientOptions } from 'discord.js';

export interface ExtendedClientOptions extends ClientOptions {
    receiveMessageComponents?: boolean;
    receiveModals?: boolean;
    receiveAutocomplete?: boolean;
    replyOnError?: boolean;
    replyMessageOnError?: string;
    splitCustomIDOn?: string;
    useDefaultInteractionEvent?: boolean;
}