import {
    ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder, ContextMenuCommandInteraction, InteractionResponse, Message, SlashCommandBuilder
} from 'discord.js';
import { BaseCommand } from './BaseCommand';

export type builders = SlashCommandBuilder | ContextMenuCommandBuilder;

export type ReturnableInteraction = void | CommandInteraction | ContextMenuCommandInteraction | InteractionResponse<boolean> | Message<boolean>;

export type TypeCommand = BaseCommand<SlashCommandBuilder | ContextMenuCommandBuilder, ChatInputCommandInteraction | ContextMenuCommandInteraction>;