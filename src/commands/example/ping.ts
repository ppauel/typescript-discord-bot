import { PermissionsBitField } from 'discord.js';
import { getPingButton } from '../../features/ping';
import { t, localization } from '../../i18n';
import { ChatInputCommand } from '../../Client';

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