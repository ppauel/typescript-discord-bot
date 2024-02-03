import { Client, Collection } from 'discord.js';
import assert from 'node:assert/strict';
import { Event } from '../Event';

export class EventHandler {
	private client: Client;

	private events: Collection<string, Event> = new Collection();

	private validateEvent(event: Event) {
		assert(typeof event.name !== 'undefined');
		assert(typeof event.execute !== 'undefined');
	}

	add(event: Event) {
		this.validateEvent(event);
		if (event.once) this.client.once(event.name, event.execute);
		else this.client.on(event.name, event.execute);
		this.events.set(event.name, event);
	}

	get size() {
		return this.events.size;
	}

	constructor(client: Client) {
		this.client = client;
	}
}
