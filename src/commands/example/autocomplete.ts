import { PermissionsBitField, SlashCommandBuilder } from 'discord.js';
import { fruit } from '../../features/fruit';
import { fallback, i18n, localization } from '../../features/i18n';
import { ChatInputCommand } from '../../interfaces';

// Example slash command
const command: ChatInputCommand = {
    options: new SlashCommandBuilder()
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
            .setAutocomplete(true)),
    global: true,
    async execute(interaction) {
        interaction.reply({
            content: i18n(interaction.locale, 'autocomplete-reply', { fruit: interaction.options.getString(fallback('autocomplete-option1-name'), true) }),
            ephemeral:true,
        });
    },
    async autocomplete(interaction) {
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
    },
};
export default command;