import ExtendedClient from '../classes/Client';
import { ClientEvents as DiscordClientEvents } from "discord.js";

interface Execute {
    (client: ExtendedClient, ...args: any[]): void;
}

export interface Event {
    name: keyof DiscordClientEvents;
    once?: boolean;
    execute: Execute;
}