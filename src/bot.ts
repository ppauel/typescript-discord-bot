import { FluentResource } from '@fluent/bundle';
import { GatewayIntentBits as Intents, Locale, Partials } from 'discord.js';
import { readFileSync } from 'fs';
import { Client } from './Classes/Client';
import { i18n } from './Classes/i18n';
import * as commands from './commands';
import * as events from './events';
import { buttons, modals, selectMenus } from './interactions';

// Load locales
export const localize = new i18n({
    fallbackLocale: Locale.EnglishUS,
    globalResource: new FluentResource(readFileSync('../locales/global.ftl', {encoding: 'utf-8'}))
})

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

for (const event of Object.values(events)) {
    client.events.add(event)
}

for (const command of Object.values(commands)) {
    client.commands.add(command);
}

for (const button of Object.values(buttons)) {
    client.interactions.addButton(button)
}

for (const modal of Object.values(modals)) {
    client.interactions.addButton(modal)
}

for (const selectMenu of Object.values(selectMenus)) {
    client.interactions.addButton(selectMenu)
}

client.login(process.env.TOKEN)
.then(() => {
    // Skip if no-deployment flag is set, else deploys command
    if (!process.argv.includes('--no-deployment')) {
        client.commands.register();
    }
});