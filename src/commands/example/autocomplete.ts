import { Locale, PermissionsBitField } from 'discord.js';
import { ChatInputCommand } from '../../Client';
import { t, localization } from '../../i18n';

const ns = 'auto';

function fruit(locale:Locale) {
    return [
        t({ key: 'oranges', locale }),
        t({ key: 'bananas', locale }),
        t({ key: 'apples', locale }),
        t({ key: 'grapefruits', locale }),
        t({ key: 'avocados', locale }),
        t({ key: 'apricots', locale }),
    ];
}

// Example slash command
export default new ChatInputCommand()
    .setBuilder((builder) => builder
        .setName(t({ key: 'command-name', ns }))
        .setNameLocalizations(localization('command-name', ns))
        .setDescription(t({ key: 'command-description', ns }))
        .setDescriptionLocalizations(localization('command-description', ns))
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
        .addStringOption(option => option
            .setName(t({ key: 'option1-name', ns }))
            .setNameLocalizations(localization('option1-name', ns))
            .setDescription(t({ key: 'option1-description', ns }))
            .setDescriptionLocalizations(localization('option1-description', ns))
            .setRequired(true)
            .setAutocomplete(true)))
    .setGlobal(true)
    .setExecute(async (interaction) => {
        interaction.reply({
            content: t({
                locale: interaction.locale,
                key: 'reply',
                ns,
                args: {
                    fruit: interaction.options.getString(t({ key: 'option1-name', ns }), true),
                },
            }),
            ephemeral:true,
        });
    })
    .setAutocomplete(async (interaction) => {
        const focusedOption = interaction.options.getFocused(true);
        let choices:string[] | undefined = undefined;

        if (focusedOption.name == t({ key: 'option1-name', ns })) {
            choices = fruit(interaction.locale);
        }

        if (!choices) return;
        const filtered = choices.filter(choice => choice.toLowerCase().startsWith(focusedOption.value.toLowerCase()));
        interaction.respond(
            filtered.map(choice => ({ name: choice, value:choice })).slice(0, 14),
        );
    });