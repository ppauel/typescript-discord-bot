import { ActionRowBuilder, MessageActionRowComponentBuilder, PermissionsBitField, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { ChatInputCommand } from '../../classes/Command';
import { fallback, i18n, localization } from '../../features/i18n';

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(fallback('select-name'))
        .setNameLocalizations(localization('select-name'))
        .setDescription(fallback('select-menu-description'))
        .setDescriptionLocalizations(localization('select-menu-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
            .setName(fallback('select-menu-name'))
            .setNameLocalizations(localization('select-menu-name'))
            .setDescription(fallback('select-menu-description'))
            .setDescriptionLocalizations(localization('select-menu-description'))
            .addSubcommand(subcommand => subcommand
                .setName(fallback('select-menu-string-name'))
                .setNameLocalizations(localization('select-menu-string-name'))
                .setDescription(fallback('select-menu-string-description'))
                .setDescriptionLocalizations(localization('select-menu-string-description')))))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        let row:ActionRowBuilder<MessageActionRowComponentBuilder>;
        switch (interaction.options.getSubcommand(true)) {
        case fallback('select-menu-string-name'):
            row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('string')
                        .setPlaceholder(i18n(interaction.locale, 'select-menu-string-placeholder'))
                        .addOptions(
                            new StringSelectMenuOptionBuilder()
                                .setLabel(i18n(interaction.locale, 'select-menu-string-first-label'))
                                .setDescription(i18n(interaction.locale, 'select-menu-string-first-description'))
                                .setValue('first_option')
                                .setEmoji('1️⃣'),
                            new StringSelectMenuOptionBuilder()
                                .setLabel(i18n(interaction.locale, 'select-menu-string-second-label'))
                                .setDescription(i18n(interaction.locale, 'select-menu-string-second-description'))
                                .setValue('second_option')
                                .setEmoji('2️⃣'),
                        ));

            await interaction.reply({ components: [row], ephemeral:true });
            break;
        default:
            break;
        }
    });