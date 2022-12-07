import { Events } from 'discord.js';
import deploy from '../features/deploy';
import { Event } from '../interfaces';

export const event: Event = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        await deploy(client); // Deploy commands
        console.log(`Ready! Logged in as ${client.user?.tag} (${client.user?.id})\n`);
    }
}