import {
    ChatInputCommandInteraction, CommandInteraction, ContextMenuCommandBuilder,
    ContextMenuCommandInteraction, InteractionResponse,
    Message, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import { BaseCommand } from './BaseCommand.js';

export type builders = SlashCommandBuilder | ContextMenuCommandBuilder;

export type ReturnableInteraction = void | CommandInteraction | ContextMenuCommandInteraction | InteractionResponse<boolean> | Message<boolean>;

export type TypeCommand = BaseCommand<SlashCommandBuilder | ContextMenuCommandBuilder, ChatInputCommandInteraction | ContextMenuCommandInteraction>;

export type AnySlashCommandBuilder = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;