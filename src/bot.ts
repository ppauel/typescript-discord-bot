import { GatewayIntentBits, Partials } from 'discord.js';
import ExtendedClient from './classes/Client';
import { config } from 'dotenv';

// Load .env file contents
config();

// Initialization (specify intents and partials)
new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
    ],
}).init();