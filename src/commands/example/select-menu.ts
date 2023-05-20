import { ActionRowBuilder, MessageActionRowComponentBuilder, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { ChatInputCommand } from '../../Client';
import { t, localization } from '../../i18n';

// Locale Namespace
const ns = 'select';

/** TODO: add exsamples of more select menus */

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(t({ key:'command-name', ns }))
        .setNameLocalizations(localization('command-name', ns))
        .setDescription(t({ key:'command-description', ns }))
        .setDescriptionLocalizations(localization('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addSubcommand(subcommand => subcommand
            .setName(t({ key: 'menu-string-name', ns }))
            .setNameLocalizations(localization('menu-string-name', ns))
            .setDescription(t({ key: 'menu-string-description', ns }))
            .setDescriptionLocalizations(localization('menu-string-description', ns))))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        let row:ActionRowBuilder<MessageActionRowComponentBuilder>;
        const locale = interaction.locale;
        switch (interaction.options.getSubcommand(true)) {
        case t({ key: 'menu-string-name', ns }):
            row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('string')
                        .setPlaceholder(t({ locale, key:'menu-string-placeholder', ns }))
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(t({ locale, key:'menu-string-first-label', ns }))
                                .setDescription(t({ locale, key:'menu-string-first-description', ns }))
                                .setValue('first_option')
                                .setEmoji('1️⃣'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(t({ locale, key: 'menu-string-second-label', ns }))
                                .setDescription(t({ locale, key: 'menu-string-second-description', ns }))
                                .setValue('second_option')
                                .setEmoji('2️⃣'),
                        ));

            return interaction.reply({ components: [row], ephemeral:true });
        default:
            break;
        }
    });