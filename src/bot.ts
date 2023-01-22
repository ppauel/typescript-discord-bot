import { DiscordjsError, GatewayIntentBits as Intents, Partials } from 'discord.js';
import ExtendedClient from './classes/Client';
import { config } from 'dotenv';

// Load .env file contents
config();
import './i18n';

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
}).login(process.env.TOKEN)
    .catch((err:unknown) => {
        if (err instanceof DiscordjsError && err.code == 'TokenMissing') {
            console.log(`\n${err.name}: ${err.message} Did you create a .env file?\n`);
        }
        else {
            throw err;
        }
    });