import {
    ContextMenuCommandBuilder, ContextMenuCommandInteraction,
    ContextMenuCommandType
} from 'discord.js';
import { BaseCommand } from './BaseCommand.js';

export class ContextMenuCommand extends BaseCommand<ContextMenuCommandBuilder, ContextMenuCommandInteraction> {
    /**
     * Set the Context Menu command builder method
     * @param input Context Menu command builder or callback
     * @returns The modified object
     */
    public setBuilder(
        input: ContextMenuCommandBuilder | ((subcommandBuilder: ContextMenuCommandBuilder) => ContextMenuCommandBuilder)
    ): this {
        if (typeof input === 'function') {
            this._builder = input(new ContextMenuCommandBuilder());
        }
        else {
            this._builder = input;
        }
        return this;
    }

    get type(): ContextMenuCommandType {
        return this.builder.type;
    }
}