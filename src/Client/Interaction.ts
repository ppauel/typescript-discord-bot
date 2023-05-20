import { Interaction as DiscordInteraction, PermissionFlags } from 'discord.js';
import { Mutable } from './types';

export class Interaction<E extends DiscordInteraction> {
    readonly name: string;

    readonly permission: PermissionFlags;

    public execute: (interaction: E) => Promise<void>;

    constructor(options?: Partial<Interaction<E>>) {
        if (!options) return;
        if (options.name) this.name = options.name;
        if (options.execute) this.execute = options.execute;
    }

    public setName(name: string) {
        (this as Mutable<Interaction<E>>).name = name;
        return this;
    }

    public setExecute(execute: (interaction: E) => Promise<void>) {
        this.execute = execute;
        return this;
    }
}
