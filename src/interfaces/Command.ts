import ExtendedClient from '../classes/Client';
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

interface Execute {
    (client: ExtendedClient, interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface Command {
    options: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    global: Boolean;
    execute: Execute;
}