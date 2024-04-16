import {
    ActionRowBuilder, MessageActionRowComponentBuilder, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder
} from 'discord.js';
import { ChatInputCommand } from '../../../Classes/index.js';
import { localize } from '../../../bot.js';

// Locale Namespace
const ns = 'select';

/** TODO: add exsamples of more select menus */

// Example slash command
export default new ChatInputCommand({
    builder: new SlashCommandBuilder()
        .setName('select-menu')
        .setDescription('Select Menu Example')
        .setNameLocalizations(localize.DiscordlocalizationRecord('command-name', ns))
        .setDescriptionLocalizations(localize.DiscordlocalizationRecord('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addSubcommand(subcommand => subcommand
            .setName('string')
            .setDescription('Example of a String Select Menu')
            .setNameLocalizations(localize.DiscordlocalizationRecord('menu-string-name', ns))
            .setDescriptionLocalizations(localize.DiscordlocalizationRecord('menu-string-description', ns)))
})
    .setExecute(async (interaction) => {
        let row:ActionRowBuilder<MessageActionRowComponentBuilder>;
        const locale = localize.getLocale(interaction.locale);
        switch (interaction.options.getSubcommand(true)) {
            case 'string':
                row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('string')
                            .setPlaceholder(locale.t('menu-string-placeholder', ns))
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale.t('menu-string-first-label', ns))
                                    .setDescription(locale.t('menu-string-first-description', ns))
                                    .setValue('first_option')
                                    .setEmoji('1️⃣'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(locale.t('menu-string-second-label', ns))
                                    .setDescription(locale.t('menu-string-second-description', ns))
                                    .setValue('second_option')
                                    .setEmoji('2️⃣')
                            ));

                return interaction.reply({ components: [row], ephemeral: true });
            default:
                break;
        }
    });