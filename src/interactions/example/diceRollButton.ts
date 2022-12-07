import { bold } from 'discord.js';
import { Interaction } from '../../interfaces';

// Example interaction (related to the /dice command)

export const interaction: Interaction = {
    name: 'diceroll',
    execute: async (client, interaction) => {
        const result = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6
        await interaction.deferUpdate();
        await interaction.editReply({ content: `You rolled a ${bold(result.toString())}!` });
    }
};