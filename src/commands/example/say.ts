import { bold, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

// Example slash command with options

export const command: Command = {
    options: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Let me say something')
        .setDMPermission(false)
        .addStringOption(option => option
            .setName('text')
            .setDescription('What do you want me to say?')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('scream')
            .setDescription('Do you want me to scream it?')
        ),
    global: false,
    execute: async (client, interaction) => {
        const text = interaction.options.getString('text', true),
            scream = interaction.options.getBoolean('scream', false), // optional
            content = scream ? bold(text.toUpperCase()) : text;

        await interaction.reply({ content: content });
    }
};