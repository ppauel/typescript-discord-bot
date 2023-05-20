/* eslint-disable no-inline-comments */
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from 'discord.js';
import { t, localization } from '../../i18n';
import { ContextMenuCommand } from '../../Client';

// Locale Namespace
const ns = 'count';

// Example message context menu

export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName(t({ key:'command-name', ns }))
        .setNameLocalizations(localization('count-name', ns))
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false))
    .setGlobal(false)
    .setExecute(async (interaction: MessageContextMenuCommandInteraction) => {
        const message = interaction.targetMessage,
            length = message.content.length;
        return interaction.reply({ content: t({
            locale: interaction.locale,
            key: 'count-reply',
            ns,
            args: {
                'username':message.author.username,
                'length':length.toString(),
            },
        }), ephemeral: true });
    });