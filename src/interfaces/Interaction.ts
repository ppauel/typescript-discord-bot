import ExtendedClient from '../classes/Client';
import { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";

interface Execute {
    (client: ExtendedClient, interaction: ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction): Promise<void>;
}

export interface Interaction {
    name: string;
    execute: Execute;
}