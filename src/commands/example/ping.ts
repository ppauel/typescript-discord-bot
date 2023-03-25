import { PermissionsBitField } from 'discord.js';
import { getPingButton } from '../../features/ping';
import { fallback, i18n, localization } from '../../features/i18n';
import { ChatInputCommand } from '../../classes/Command';

export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(fallback('ping-name'))
        .setNameLocalizations(localization('ping-name'))
        .setDescription(fallback('ping-description'))
        .setDescriptionLocalizations(localization('ping-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        await interaction.reply({ content: ` ${i18n(interaction.locale, 'ping-reply')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    });