import { DiscordjsError, DiscordjsErrorCodes, GatewayIntentBits as Intents, Partials } from 'discord.js';
import path from 'path';
import ExtendedClient, { ClientConfig } from './classes/Client';
import { config } from 'dotenv';
import configJSON from './config.json';
import './features/i18n';

// Load .env file contents
config();

// Initialization (specify intents and partials)
new ExtendedClient({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.MessageContent,
        Intents.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
    ],
    eventPath: path.join(__dirname, 'events'),
    commandPath: path.join(__dirname, 'commands'),
    contextMenuPath: path.join(__dirname, 'context_menus'),
    buttonPath: path.join(__dirname, 'interactions', 'buttons'),
    selectMenuPath: path.join(__dirname, 'interactions', 'select_menus'),
    modalPath: path.join(__dirname, 'interactions', 'modals'),
    clientConfig: configJSON as ClientConfig,
}).login(process.env.TOKEN)
    .catch((err:unknown) => {
        if (err instanceof DiscordjsError) {
            if (err.code == DiscordjsErrorCodes.TokenMissing) {
                console.warn(`\n[Error] ${err.name}: ${err.message} Did you create a .env file?\n`);
            }
            else if (err.code == DiscordjsErrorCodes.TokenInvalid) {
                console.warn(`\n[Error] ${err.name}: ${err.message} Check your .env file\n`);
            }
            else {
                throw err;
            }
        }
        else {
            throw err;
        }
    });

