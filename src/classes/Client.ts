import { Client, Collection } from 'discord.js';
import { Command, ContextMenu, Event, Interaction } from '../interfaces';
import configJSON from '../config.json';
import path from 'path';
import { readdirSync } from 'fs';

// TypeScript or JavaScript environment (thanks to https://github.com/stijnvdkolk)
let tsNodeRun = false;
try {
    // @ts-ignore
    if (process[Symbol.for('ts-node.register.instance')]) {
        tsNodeRun = true;
    }
} catch (e) { }

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public contextMenus: Collection<string, ContextMenu> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public interactions: Collection<string, Interaction> = new Collection();
    public config = configJSON;
    public async init() {

        console.log('Starting up...')

        // Paths
        const commandPath = path.join(__dirname, '..', 'commands'),
            contextMenuPath = path.join(__dirname, '..', 'context_menus'),
            interactionPath = path.join(__dirname, '..', 'interactions'),
            eventPath = path.join(__dirname, '..', 'events');

        // Command Handler
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) =>
                file.endsWith(tsNodeRun ? '.ts' : '.js')
            );
            for (const file of commands) {
                const { command } = require(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.options.name, command);
            }
        });

        // Context Menu Handler
        readdirSync(contextMenuPath).forEach((dir) => {
            const contextMenus = readdirSync(`${contextMenuPath}/${dir}`).filter((file) =>
                file.endsWith(tsNodeRun ? '.ts' : '.js')
            );
            for (const file of contextMenus) {
                const { contextMenu } = require(`${contextMenuPath}/${dir}/${file}`);
                this.contextMenus.set(contextMenu.options.name, contextMenu);
            }
        });

        // Interaction Handler
        readdirSync(interactionPath).forEach((dir) => {
            const interactions = readdirSync(`${interactionPath}/${dir}`).filter((file) =>
                file.endsWith(tsNodeRun ? '.ts' : '.js')
            );
            for (const file of interactions) {
                const { interaction } = require(`${interactionPath}/${dir}/${file}`);
                this.interactions.set(interaction.name, interaction);
            }
        });

        // Event Handler
        const events = readdirSync(`${eventPath}`).filter((file) =>
            file.endsWith(tsNodeRun ? '.ts' : '.js')
        );
        for (const file of events) {
            const { event } = require(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            if (event.once) {
                this.once(event.name, event.execute.bind(null, this));
            } else {
                this.on(event.name, event.execute.bind(null, this));
            }
        }

        // Login
        if (!process.env.TOKEN) return console.error('No token was specified. Did you create a .env file?');
        this.login(process.env.TOKEN);
    }
}

export default ExtendedClient;