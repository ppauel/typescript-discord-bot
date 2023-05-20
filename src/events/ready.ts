import { Events } from 'discord.js';
import { Client, Event } from '../Client';

export default new Event()
    .setName(Events.ClientReady)
    .setOnce(true)
    .setExecute(async (client:Client) => {
        console.log(`\nReady! Logged in as ${client.user?.tag} (${client.user?.id})\n`);
    });