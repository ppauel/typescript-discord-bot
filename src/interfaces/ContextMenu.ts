import ExtendedClient from '../classes/Client';
import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";

interface Execute {
    (client: ExtendedClient, interaction: ContextMenuCommandInteraction): Promise<void>;
}

export interface ContextMenu {
    options: ContextMenuCommandBuilder;
    global: Boolean;
    execute: Execute;
}