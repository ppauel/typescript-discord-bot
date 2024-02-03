import {
    DiscordAPIError, Interaction, RepliableInteraction,
} from 'discord.js';

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
 * @param {Interaction} interaction - The interaction object.
 * @returns {Promise<void>}
 */
export async function onInteractionCreate(interaction: Interaction) {
    let interactionName: string;
    const { client } = interaction;

    try {
        if (interaction.isChatInputCommand()) {
            // If the interaction is a chat input command, execute the corresponding command
            await client.commands.get(interaction.commandName)?.execute(interaction);
        }
        else if (interaction.isContextMenuCommand()) {
            // If the interaction is a context menu command, execute the corresponding command
            await client.contextMenus.get(interaction.commandName)?.execute(interaction);
        }
        else if (interaction.isAutocomplete()) {
            // If the interaction is an autocomplete request, handle autocomplete
            const autocomplete = client.commands.get(interaction.commandName)?.autocomplete;
            if (!autocomplete) {
                console.warn(`[Warning] Autocomplete for ${interactionName} was not set up`);
            }
            else {
                await autocomplete(interaction);
            }
        }
        else if (interaction.isAnySelectMenu()) {
            // If the interaction is a select menu interaction, execute the corresponding select menu handler
            interactionName = client.splitCustomID ? interaction.customId.split(client.splitCustomIDOn)[0] : interaction.customId;
            await client.selectMenus.get(interactionName)?.execute(interaction);
        }
        else if (interaction.isButton()) {
            // If the interaction is a button interaction, execute the corresponding button handler
            interactionName = client.splitCustomID ? interaction.customId.split(client.splitCustomIDOn)[0] : interaction.customId;
            await client.buttons.get(interactionName)?.execute(interaction);
        }
        else if (interaction.isModalSubmit()) {
            // If the interaction is a modal submit interaction, execute the corresponding modal submit handler
            interactionName = client.splitCustomID ? interaction.customId.split(client.splitCustomIDOn)[0] : interaction.customId;
            await client.modals.get(interactionName)?.execute(interaction);
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