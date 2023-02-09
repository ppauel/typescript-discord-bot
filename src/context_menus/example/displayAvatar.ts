/* eslint-disable no-inline-comments */
import { ApplicationCommandType, ContextMenuCommandBuilder, EmbedBuilder, GuildMember } from 'discord.js';
import { i18n, fallback, localization } from '../../features/i18n';
import { UserContextMenu } from '../../interfaces';

// Example user context menu

const contextMenu: UserContextMenu = {
    options: new ContextMenuCommandBuilder()
        .setName(fallback('avatar-name'))
        .setNameLocalizations(localization('avatar-name'))
        .setType(ApplicationCommandType.User) // Specify the context menu type
        .setDMPermission(false),
    global: true,
    async execute(client, interaction) {
        if (!interaction.inGuild()) return;
        const member = interaction.targetMember as GuildMember,
            embed = new EmbedBuilder()
                .setTitle(i18n(interaction.guildLocale, 'avatar-embed', { 'username': member.displayName }))
                .setImage(member.displayAvatarURL({ size:4096 }))
                .setColor(client.config.colors.embed)
                .setFooter({ text:`ID: ${member.id}` });
        interaction.reply({ embeds:[embed] });
    },
};

export default contextMenu;