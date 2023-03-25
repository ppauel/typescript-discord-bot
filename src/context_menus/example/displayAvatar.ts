/* eslint-disable no-inline-comments */
import { ApplicationCommandType, EmbedBuilder, GuildMember, UserContextMenuCommandInteraction } from 'discord.js';
import { ContextMenuCommand } from '../../classes/Command';
import { i18n, fallback, localization } from '../../features/i18n';

// Example user context menu
export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName(fallback('avatar-name'))
        .setNameLocalizations(localization('avatar-name'))
        .setType(ApplicationCommandType.User) // Specify the context menu type
        .setDMPermission(false))
    .setGlobal(true)
    .setExecute(async (interaction: UserContextMenuCommandInteraction) => {
        if (!interaction.inGuild()) return;
        const member = interaction.targetMember as GuildMember,
            embed = new EmbedBuilder()
                .setTitle(i18n(interaction.guildLocale, 'avatar-embed', { 'username': member.displayName }))
                .setImage(member.displayAvatarURL({ size:4096 }))
                .setColor(interaction.client.config.colors.embed)
                .setFooter({ text:`ID: ${member.id}` });
        interaction.reply({ embeds:[embed] });
    });