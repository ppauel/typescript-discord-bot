/* eslint-disable no-inline-comments */
import { ApplicationCommandType, EmbedBuilder, GuildMember, UserContextMenuCommandInteraction } from 'discord.js';
import { t, localization } from '../../i18n';
import { ContextMenuCommand, ExtraColor } from '../../Client';

// Locale Namespace
const ns = 'avatar';

// Example user context menu

export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName(t({ key: 'command-name', ns }))
        .setNameLocalizations(localization('command-name', ns))
        .setType(ApplicationCommandType.User) // Specify the context menu type
        .setDMPermission(false))
    .setGlobal(true)
    .setExecute(async (interaction: UserContextMenuCommandInteraction) => {
        if (!interaction.inGuild()) return;
        const member = interaction.targetMember as GuildMember,
            embed = new EmbedBuilder()
                .setTitle(t({
                    locale: interaction.guildLocale,
                    key: 'embed',
                    ns,
                    args: { 'username': member.displayName },
                }))
                .setImage(member.displayAvatarURL({ size:4096 }))
                .setColor(ExtraColor.EmbedGray)
                .setFooter({ text:`ID: ${member.id}` });
        return interaction.reply({ embeds:[embed] });
    });