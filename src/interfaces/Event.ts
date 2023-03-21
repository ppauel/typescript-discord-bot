import { ClientEvents as DiscordClientEvents } from 'discord.js';

export interface Event {
    name: keyof DiscordClientEvents;
    once?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute(...args: any[]): void;
}