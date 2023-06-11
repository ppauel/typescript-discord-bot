import { PermissionsBitField } from 'discord.js';
import { ChatInputCommand } from '../../Client';
import { getPingButton } from '../../features/ping';
import { localization, t } from '../../i18n';

// Locale Namespace
const ns = 'ping';

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(t({ key: 'command-name', ns }))
        .setNameLocalizations(localization('command-name', ns))
        .setDescription(t({ key: 'command-description', ns }))
        .setDescriptionLocalizations(localization('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        return interaction.reply({ content: ` ${t({ locale: interaction.locale, key: 'reply', ns })} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    });