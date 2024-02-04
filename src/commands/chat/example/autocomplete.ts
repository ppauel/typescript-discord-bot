import { PermissionsBitField } from 'discord.js';
import { ChatInputCommand } from '../../../Classes/Client';
import { LocaleBundle } from '../../../Classes/i18n';
import { localize } from '../../../bot';

const ns = 'auto';

function fruit(locale:LocaleBundle) {
    return [
        locale.t('oranges', ns),
        locale.t('bananas', ns),
        locale.t('apples', ns),
        locale.t('grapefruits', ns),
        locale.t('avocados', ns),
        locale.t('apricots', ns)
    ];
}

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName('autocomplete')
        .setDescription('Demonstration of Autocomplete')
        .setNameLocalizations(localize.DiscordlocalizationRecord('command-name', ns))
        .setDescriptionLocalizations(localize.DiscordlocalizationRecord('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addStringOption(option => option
            .setName('option1-name')
            .setDescription('option1-description')
            .setNameLocalizations(localize.DiscordlocalizationRecord('option1-name', ns))
            .setDescriptionLocalizations(localize.DiscordlocalizationRecord('option1-description', ns))
            .setRequired(true)
            .setAutocomplete(true)))
    .setExecute(async (interaction) => {
        interaction.reply({
            content: localize.t(
                'reply',
                ns,
                interaction.locale,
                {
                    fruit: interaction.options.getString('option', true)
                }),
            ephemeral:true,
        })
    })
    .setAutocomplete(async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        const locale = localize.getLocale(interaction.locale)
        let choices:string[] | undefined = undefined;

        if (focusedOption.name == 'option') {
            choices = fruit(locale);
        }

        if (!choices) return;
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        interaction.respond(
            filtered.map(choice => ({ name: choice, value:choice })).slice(0, 14),
        );
    });