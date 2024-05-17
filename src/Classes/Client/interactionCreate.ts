import {
    ApplicationCommandType,
    DiscordAPIError, Events, Interaction,
    InteractionType
} from 'discord.js';
import { Event } from '../Event.js';

/**
 * Handles the creation of a new interaction.
 * @param interaction - The interaction object.
 */
async function onInteractionCreate(interaction: Interaction) {
    const { client, type } = interaction;
    const {
        commands, interactions, errorMessage, replyOnError
    } = client;
    // client.emit(Events.Debug, interaction.toString());
    try {
        switch (type) {
            case InteractionType.ApplicationCommandAutocomplete:
                // If the interaction is an autocomplete request, handle autocomplete
                await commands.runAutocomplete(interaction);
                break;
            case InteractionType.ModalSubmit:
                // If the interaction is a modal submit interaction, execute the corresponding modal submit handler
                await interactions.runModal(interaction);
                break;
            case InteractionType.ApplicationCommand:

                switch (interaction.commandType) {
                    case ApplicationCommandType.ChatInput:
                        // If the interaction is a chat input command, execute the corresponding command
                        await commands.runChatCommand(interaction);
                        break;
                    case ApplicationCommandType.User:
                        // If the interaction is a user context menu command, execute the corresponding command
                        await commands.runUserContextMenus(interaction);
                        break;
                    case ApplicationCommandType.Message:
                        // If the interaction is a message context menu command, execute the corresponding command
                        await commands.runMessageContextMenus(interaction);
                        break;
                    default:
                        break;
                }
                break;

            case InteractionType.MessageComponent:
                if (interaction.isButton()) {
                    // If the interaction is a button interaction, execute the corresponding button handler
                    await interactions.runButton(interaction);
                }
                else if (interaction.isAnySelectMenu()) {
                    // If the interaction is a select menu interaction, execute the corresponding select menu handler
                    await interactions.runSelectMenus(interaction);
                }   
                break;

            default:
                break;
        }
    }
    catch (error) {
        if (interaction.isRepliable()) {
            // If the interaction is repliable, handle the error with a reply
            if (error instanceof DiscordAPIError) {
                client.emit(Events.Error, error); 
            }
            else if (error instanceof Error) {
                client.emit(Events.Error, error);
        
                if (!replyOnError) return;
        
                if (interaction.deferred) {
                    // If the interaction is deferred, follow up with an ephemeral error message
                    await interaction.followUp({ content: errorMessage, ephemeral: true }).catch((e) => client.emit(Events.Error, e));
                }
                else {
                    // If the interaction is not deferred, reply with an ephemeral error message
                    await interaction.reply({ content: errorMessage, ephemeral: true }).catch((e) => client.emit(Events.Error, e));
                }       
            }
        }
        else {
            // If the interaction is not repliable, simply log the error
            client.emit(Events.Error, error);
        }
    }
}

export default new Event({
    name: Events.InteractionCreate,
    once: false,
    execute: onInteractionCreate
});
