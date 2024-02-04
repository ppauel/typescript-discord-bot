import {
    DiscordAPIError, Events, Interaction, RepliableInteraction
} from 'discord.js';
import { Event } from '../Classes/Client';

/**
 * Sends an error message in response to an interaction.
 * @param error - The error object.
 * @param interaction - The interaction to respond to.
 */
async function replyError(error: unknown, interaction: RepliableInteraction) {
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

/**
 * Handles the creation of a new interaction.
 * @param interaction - The interaction object.
 */
async function onInteractionCreate(interaction: Interaction) {
    const { client } = interaction;
    try {
        if (interaction.isChatInputCommand()) {
            // If the interaction is a chat input command, execute the corresponding command
            await client.commands.runChatCommand(interaction);
        }
        else if (interaction.isContextMenuCommand()) {
            // If the interaction is a context menu command, execute the corresponding command
            await client.commands.runContextCommand(interaction);
        }
        else if (interaction.isAutocomplete()) {
            // If the interaction is an autocomplete request, handle autocomplete
            await client.commands.runAutocomplete(interaction);
        }
        else if (interaction.isAnySelectMenu()) {
            // If the interaction is a select menu interaction, execute the corresponding select menu handler
            await client.interactions.runSelectMenus(interaction);
        }
        else if (interaction.isButton()) {
            // If the interaction is a button interaction, execute the corresponding button handler
            await client.interactions.runButton(interaction);
        }
        else if (interaction.isModalSubmit()) {
            // If the interaction is a modal submit interaction, execute the corresponding modal submit handler
            await client.interactions.runModal(interaction);
        }
    }
    catch (error) {
        if (interaction.isRepliable()) {
            // If the interaction is repliable, handle the error with a reply
            replyError(error, interaction);
        }
        else {
            // If the interaction is not repliable, simply log the error
            console.error(error);
        }
    }
}

export default new Event({
    name: Events.InteractionCreate,
    execute: onInteractionCreate
});