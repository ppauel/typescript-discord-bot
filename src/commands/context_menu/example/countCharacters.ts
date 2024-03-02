/* eslint-disable no-inline-comments */
import { ApplicationCommandType, MessageContextMenuCommandInteraction } from 'discord.js';
import { ContextMenuCommand } from '../../../Classes';
import { localize } from '../../../bot';

// Locale Namespace
const ns = 'count';

// Example message context menu

export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName('Count characters')
        .setNameLocalizations(localize.DiscordlocalizationRecord('count-name', ns))
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        .setDMPermission(false))
    .setExecute(async (interaction: MessageContextMenuCommandInteraction) => {
        const message = interaction.targetMessage,
            length = message.content.length;
        return interaction.reply({
            content: localize.t(
                'count-reply',
                ns,
                interaction.locale,
                {
                    'username': message.author.username,
                    'length': length.toString()
                }),
            ephemeral: true 
        });
    });