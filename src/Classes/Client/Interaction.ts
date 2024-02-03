import { Interaction as DiscordInteraction } from 'discord.js';

/**
 * Interaction object
 */
export class Interaction<E extends DiscordInteraction> {
	// Name of Interaction
	private _name: string;

	// Method that to run when interaction happens
	private _execute: (interaction: E) => Promise<void>;

	get name(){
		return this._name;
	}

	get execute() {
		return this._execute;
	}

	/**
	 *
	 * @param options
	 * @returns
	 */
	constructor(options: Partial<Interaction<E>> = {}) {
		if (options.name) this._name = options.name;
		if (options.execute) this._execute = options.execute;
	}

	/**
	 * Set the name of the interaction
	 * @param name Name of interaction
	 * @returns The modified object
	 */
	public setName(name: string) {
		this._name = name;
		return this;
	}

	/**
	 * Set the execute method
	 * @param execute function passed in
	 * @returns The modified object
	 */
	public setExecute(execute: (interaction: E) => Promise<void>) {
		this._execute = execute;
		return this;
	}
}
