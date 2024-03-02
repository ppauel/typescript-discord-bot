import {
    GatewayIntentBits as Intents, Locale, Partials
} from 'discord.js';
import { Client, i18n } from './Classes';
import * as commands from './commands';
import * as events from './events';
import {
    buttons, modals, selectMenus
} from './interactions';

// Load locales
export const localize = new i18n()
    .setLocale('../locales/de', Locale.German)
    .setLocale('../locales/en-US', Locale.EnglishUS)
    .setFallbackLocale(Locale.EnglishUS)
    .setGlobalResource('../locales/global.ftl');

// Initialization (specify intents and partials)
const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMessages,
        Intents.MessageContent,
        Intents.GuildMembers
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember
    ],
    receiveMessageComponents: true,
    receiveModals: true,
    receiveAutocomplete: true,
    replyOnError: true,
    // replyMessageOnError: 'message on comand error',
    splitCustomID: true,
    splitCustomIDOn: '_',
    useGuildCommands: false
});

// Load Events
for (const event of Object.values(events)) {
    client.events.add(event);
}

// Load commands 
for (const command of Object.values(commands)) {
    client.commands.add(command);
}

// Load buttons
for (const button of Object.values(buttons)) {
    client.interactions.addButton(button);
}

// Load modals
for (const modal of Object.values(modals)) {
    client.interactions.addModal(modal);
}

// Load selectMenus
for (const selectMenu of Object.values(selectMenus)) {
    client.interactions.addSelectMenu(selectMenu);
}

// Bot logins to Discord services
client.login(process.env.TOKEN)
    .then(() => {
    // Skip if no-deployment flag is set, else deploys command
        if (!process.argv.includes('--no-deployment')) {
            client.commands.register();
        }
    });