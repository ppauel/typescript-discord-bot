 
import {
    ApplicationCommandType,
    InteractionContextType,
    MessageContextMenuCommandInteraction
} from 'discord.js';
import { ContextMenuCommand } from '../../../Classes/index.js';
import { localize } from '../../../bot.js';

// Locale Namespace
const ns = 'count';

// Example message context menu

export default new ContextMenuCommand()
    .setBuilder((builder) => builder
        .setName('Count characters')
        .setNameLocalizations(localize.discordLocalizationRecord('count-name', ns))
        .setType(ApplicationCommandType.Message) // Specify the context menu type
        // Allows command to be used in servers
        .setContexts(InteractionContextType.Guild))
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