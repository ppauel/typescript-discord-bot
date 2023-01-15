import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { pingActionRow } from '../../features/ping';
import { ChatInputCommand } from '../../interfaces';

const command:ChatInputCommand = {
    options: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong')
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages),
    global: true,
    execute: async (_client, interaction) => {
        interaction.reply({ content:'Pong 🏓', components:[pingActionRow], ephemeral:true });
    },
};

export default command;