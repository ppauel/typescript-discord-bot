/* eslint-disable no-inline-comments */
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, GuildMember } from 'discord.js';
import { UserContextMenu } from '../../interfaces';

// Example user context menu

const contextMenu: UserContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(ApplicationCommandType.User) // Specify the context menu type
        .setDMPermission(false),
    global: true,
    execute: async (client, interaction) => {
        const member = interaction.targetMember as GuildMember,
            embed = new EmbedBuilder()
                .setTitle(`Avatar for ${member.displayName}`)
                .setImage(member.displayAvatarURL({ size:4096 }))
                .setColor(client.config.colors.embed)
                .setFooter({ text:`ID: ${member.id}` })
                .setTimestamp();
        interaction.reply({ embeds:[embed] });
    },
};

export default contextMenu;