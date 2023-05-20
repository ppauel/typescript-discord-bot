/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientEvents as DiscordClientEvents } from 'discord.js';
import { Mutable } from './types';

/**
 * Event Class
 */
export class Event {
	readonly name: keyof DiscordClientEvents;

	readonly once: boolean;

	public execute: (...args: any[]) => Promise<void>;

	constructor(options?: Partial<Event>) {
		if (!options) return;
		if (options.name) this.name = options.name;
		this.once = options.once === undefined ? false : options.once;
		if (options.execute) this.execute = options.execute;
	}

	public setOnce(input: boolean) {
		(this as Mutable<Event>).once = input;
		return this;
	}

	public setName(input: keyof DiscordClientEvents) {
		(this as Mutable<Event>).name = input;
		return this;
	}

	public setExecute(execute: (...args: any[]) => Promise<void>) {
		this.execute = execute;
		return this;
	}
}

export default Event;
