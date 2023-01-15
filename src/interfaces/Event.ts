import ExtendedClient from '../classes/Client';
import { ClientEvents as DiscordClientEvents } from 'discord.js';

export interface Event {
    name: keyof DiscordClientEvents;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(client: ExtendedClient, ...args: any[]): void;
}