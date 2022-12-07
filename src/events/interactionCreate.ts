import { Events, Interaction, InteractionType, RepliableInteraction } from 'discord.js';
import { Event } from '../interfaces';
import configJSON from '../config.json';

// Send a warning on error
async function replyError(interaction: RepliableInteraction) {
    if (!configJSON.interactions.replyOnError) return;
    await interaction.reply({ content: 'There was an error while executing this interaction.', ephemeral: true })
        .catch(console.error);
}

export const event: Event = {
    name: Events.InteractionCreate,
    execute: async (client, interaction: Interaction) => {
        switch (interaction.type) {
            // Command
            case InteractionType.ApplicationCommand:

                // Chat Input Command
                if (interaction.isChatInputCommand()) {
                    const command = client.commands.get(interaction.commandName);
                    if (!command) return;

                    try {
                        await command.execute(client, interaction);
                    } catch (error: unknown) {
                        if (error! instanceof Error) {
                            console.error(error);
                            await replyError(interaction);
                        }
                    }
                }

                // Context Menu
                else if (interaction.isContextMenuCommand()) {
                    const contextMenu = client.contextMenus.get(interaction.commandName);
                    if (!contextMenu) return;

                    try {
                        await contextMenu.execute(client, interaction);
                    } catch (error: unknown) {
                        if (error! instanceof Error) {
                            console.error(error);
                            await replyError(interaction);
                        }
                    }
                }

                break;

            // Component (Button | Select Menu)
            case InteractionType.MessageComponent:
                // Check if message components are enabled
                if (!client.config.interactions.receiveMessageComponents) return;

                const componentInteractionId = client.config.interactions.splitCustomId ? interaction.customId.split('_')[0] : interaction.customId;
                const component = client.interactions.get(componentInteractionId);
                if (!component) return;

                try {
                    await component!.execute(client, interaction);
                } catch (error) {
                    if (error! instanceof Error) {
                        console.error(error);
                        await replyError(interaction);
                    }
                }

                break;

            // Modal
            case InteractionType.ModalSubmit:
                // Check if modal interactions are enabled
                if (!client.config.interactions.receiveModals) return;

                const modalInteractionId = client.config.interactions.splitCustomId ? interaction.customId.split('_')[0] : interaction.customId;
                const modal = client.interactions.get(modalInteractionId);
                if (!modal) return;

                try {
                    await modal!.execute(client, interaction);
                } catch (error) {
                    if (error! instanceof Error) {
                        console.error(error);
                        await replyError(interaction);
                    }
                }

                break;

            default:
                break;
        }
    }
}