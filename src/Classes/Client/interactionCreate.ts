import {
    ApplicationCommandType,
    DiscordAPIError, Events, Interaction,
    InteractionType
} from 'discord.js';
import { Event } from '../Event';

/**
 * Handles the creation of a new interaction.
 * @param interaction - The interaction object.
 */
async function onInteractionCreate(interaction: Interaction) {
    const { client, type } = interaction;
    try {
        switch (type) {
            case InteractionType.ApplicationCommandAutocomplete:
                // If the interaction is an autocomplete request, handle autocomplete
                await client.commands.runAutocomplete(interaction);
                break;
            case InteractionType.ModalSubmit:
                // If the interaction is a modal submit interaction, execute the corresponding modal submit handler
                await client.interactions.runModal(interaction);
                break;
            case InteractionType.ApplicationCommand:

                switch (interaction.commandType) {
                    case ApplicationCommandType.ChatInput:
                        // If the interaction is a chat input command, execute the corresponding command
                        await client.commands.runChatCommand(interaction);
                        break;
                    case ApplicationCommandType.User:
                    case ApplicationCommandType.Message:
                        // If the interaction is a context menu command, execute the corresponding command
                        await client.commands.runContextCommand(interaction);
                        break;
                    default:
                        break;
                }
                break;

            case InteractionType.MessageComponent:
                if (interaction.isButton()) {
                    // If the interaction is a button interaction, execute the corresponding button handler
                    await client.interactions.runButton(interaction);
                }
                else if (interaction.isAnySelectMenu()) {
                    // If the interaction is a select menu interaction, execute the corresponding select menu handler
                    await client.interactions.runSelectMenus(interaction);
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
                console.error(error);
            }
            else if (error instanceof Error) {
                console.error(error);
        
                if (!interaction.client.replyOnError) return;
        
                // TODO: replace this with a client option
                const errorMessage = 'There was an error while executing this interaction.';
        
                if (interaction.deferred) {
                    // If the interaction is deferred, follow up with an ephemeral error message
                    await interaction.followUp({ content: errorMessage, ephemeral: true }).catch((e) => console.error(e));
                }
                else {
                    // If the interaction is not deferred, reply with an ephemeral error message
                    await interaction.reply({ content: errorMessage, ephemeral: true }).catch((e) => console.error(e));
                }
            }
        }
        else {
            // If the interaction is not repliable, simply log the error
            console.error(error);
        }
    }
}

export default new Event({
    name: Events.InteractionCreate,
    once: false,
    execute: onInteractionCreate
});