import { Interaction as DiscordInteraction } from 'discord.js';

/**
 * Interaction object
 */
export class Interaction<E extends DiscordInteraction> {
    
    // Name of Interaction
    private _customIdPrefix: string;

    // Method that to run when interaction happens
    private _run: (interaction: E) => Promise<void>;

    get customIdPrefix() {
        return this._customIdPrefix;
    }

    private  set customIdPrefix(id:string) {
        this._customIdPrefix = id;
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * @deprecated Use `customId`
     */
    get name() {
        return this._customIdPrefix;
    }

    // eslint-disable-next-line jsdoc/require-returns
    /**
     * @deprecated Use `run`
     */
    get execute() {
        return this._run;
    }

    get run() {
        return this._run;
    }

    private set run(execute: (interaction: E) => Promise<void>) {
        this._run = execute;
    }

    constructor(options: Partial<Interaction<E>> = {}) {
        if (options.customIdPrefix) this.customIdPrefix = options.customIdPrefix;
        if (options.run) this.run = options.run;
    }

    /**
     * Set the name of the interaction
     * @deprecated Use `setCustomId`
     * @param name Name of interaction
     * @returns The modified object
     */
    public setName(name: string) {
        this.customIdPrefix = name;
        return this;
    }

    /**
     * Set the name of the interaction
     * @param customId Name of interaction
     * @returns The modified object
     */
    public setCustomIdPrefix(customId: string) {
        this.customIdPrefix = customId;
        return this;
    }

    /**
     * Set the execute method
     * @deprecated Use `setRun`
     * @param execute function passed in
     * @returns The modified object
     */
    public setExecute(execute: (interaction: E) => Promise<void>) {
        this.run = execute;
        return this;
    }

    /**
     * Set the execute method
     * @param run function passed in
     * @returns The modified object
     */
    public setRun(run: (interaction: E) => Promise<void>) {
        this.run = run;
        return this;
    }
}
