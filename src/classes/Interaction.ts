import { Interaction as DiscordInteraction } from 'discord.js';
import { Mutable } from './Types';

export interface InteractionOptions {
    name: string,
    execute: (interaction: DiscordInteraction) => Promise<void>;
}

export class Interaction<E extends DiscordInteraction> implements InteractionOptions {
    readonly name:string;
    public execute: (interaction: E) => Promise<void>;

    constructor(options?:Partial<Interaction<E>>) {
        if (!options) return;
        if (options.name) this.name = options.name;
        if (options.execute) this.execute = options.execute;
    }

    public setName(name: string) {
        (this as Mutable<Interaction<E>>).name = name;
        return this;
    }

    public setExecute(execute:((interaction: E) => Promise<void>)) {
        this.execute = execute;
        return this;
    }
}