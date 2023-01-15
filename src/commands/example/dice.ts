import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand } from '../../interfaces';

// Example slash command

const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Roll a dice')
        .setDMPermission(false),
    global: false,
    execute: async (_client, interaction) => {
        const result = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('diceroll')
                .setLabel('Roll again')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🎲')
        );

        await interaction.reply({ content: `You rolled a ${bold(result.toString())}!`, components: [row], ephemeral: true });
        
        // You should probably use a collector to handle the button interaction - for demonstration purposes i use the interactionCreate listener
    }
};

export default command;