import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../interfaces';

// Example slash command

export const command: Command = {
    options: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll a dice')
        .setDMPermission(false),
    global: false,
    execute: async (client, interaction) => {
        const result = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('diceroll')
                .setLabel('Roll again')
                .setStyle(ButtonStyle.Secondary)
        );

        await interaction.reply({ content: `You rolled a ${bold(result.toString())}!`, components: [row], ephemeral: true });
    }
};