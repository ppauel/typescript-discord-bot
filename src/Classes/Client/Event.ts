/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientEvents as DiscordClientEvents } from 'discord.js';

/**
 * Event Class
 */
export class Event {
	// Name of the Event
	private _name?: keyof DiscordClientEvents;

	// Flag if the event should only run once
	private _once: boolean;

	// Method to be run when the event occurs
	private _execute?: (...args: any[]) => Promise<void>;

	get name() {
		return this._name;
	}

	get once() {
		return this._once;
	}

	get execute() {
		return this._execute;
	}

	constructor(options: Partial<Event> = {}) {
		if (options.name) this._name = options.name;
		this._once = options.once || false;
		if (options.execute) this._execute = options.execute;
	}

	/**
	 * Set the once flag
	 * @param input value to set
	 * @returns The modified object
	 */
	public setOnce(input: boolean) {
		this._once = input;
		return this;
	}

	/**
	 * Set the name of the event
	 * @param input value to set
	 * @returns The modified object
	 */
	public setName(input: keyof DiscordClientEvents) {
		this._name = input;
		return this;
	}

	/**
	 * Set the execute method
	 * @param execute function passed in
	 * @returns The modified object
	 */
	public setExecute(execute: (...args: any[]) => Promise<void>) {
		this._execute = execute;
		return this;
	}
}

export default Event;
