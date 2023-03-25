import { PermissionsBitField } from 'discord.js';
import { ChatInputCommand } from '../../classes/Command';
import { fruit } from '../../features/fruit';
import { fallback, i18n, localization } from '../../features/i18n';

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(fallback('autocomplete-name'))
        .setNameLocalizations(localization('autocomplete-name'))
        .setDescription(fallback('autocomplete-description'))
        .setDescriptionLocalizations(localization('autocomplete-description'))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addStringOption(option => option
            .setName(fallback('autocomplete-option1-name'))
            .setNameLocalizations(localization('autocomplete-option1-name'))
            .setDescription(fallback('autocomplete-option1-description'))
            .setDescriptionLocalizations(localization('autocomplete-option1-description'))
            .setRequired(true)
            .setAutocomplete(true)))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        interaction.reply({
            content: i18n(interaction.locale, 'autocomplete-reply', { fruit: interaction.options.getString(fallback('autocomplete-option1-name'), true) }),
            ephemeral:true,
        });
    })
    .setAutocomplete(async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        let choices:string[] | undefined = undefined;

        if (focusedOption.name == fallback('autocomplete-option1-name')) {
            choices = fruit(interaction.locale);
        }

        if (!choices) return;
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        interaction.respond(
            filtered.map(choice => ({ name: choice, value:choice })).slice(0, 14),
        );
    });
