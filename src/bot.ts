import { GatewayIntentBits as Intents, Locale, Partials } from 'discord.js';
import { Client } from './Client';
import { config } from 'dotenv';
import { join } from 'path';
import { init } from './i18n';

// Load .env file contents
config();

// Load locales
init(join(__dirname, '../locales'), { fallback: Locale.EnglishUS, hasGlobal: true });

// Initialization (specify intents and partials)
const client = new Client({
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
    receiveMessageComponents: true,
    receiveModals: true,
    receiveAutocomplete: true,
    replyOnError: true,
    splitCustomID: true,
    splitCustomIDOn: '_',
    useGuildCommands: false,
});
client.init({
    eventPath: join(__dirname, 'events'),
    commandPath: join(__dirname, 'commands'),
    contextMenuPath: join(__dirname, 'context_menus'),
    buttonPath: join(__dirname, 'interactions', 'buttons'),
    selectMenuPath: join(__dirname, 'interactions', 'select_menus'),
    modalPath: join(__dirname, 'interactions', 'modals'),
}).then(() => {
    client.login(process.env.TOKEN).then(async () => {
        // Skip if no-deployment flag is set, else deploys commands
        if (!process.argv.includes('--no-deployment')) {
            await client.deploy();
        }
    });
});