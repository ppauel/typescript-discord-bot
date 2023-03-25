import { ApplicationCommandType, ComponentType, Events, Interaction, InteractionType, RepliableInteraction } from 'discord.js';
import Event from '../classes/Event';

const errorMessage = '[Error] There was an error while executing this interaction.';

export default new Event()
    .setName(Events.InteractionCreate)
    .setExecute(execute);


// Send a warning on error
async function replyError(error:unknown, interaction: RepliableInteraction) {
    if (error instanceof Error) {
        console.error(error);
        if (interaction.client.config.interactions.replyOnError) return;

        if (interaction.deferred) {
            await interaction.followUp({ content: errorMessage }).catch(console.error);
        }
        else {
            await interaction.reply({ content: errorMessage, ephemeral: true }).catch(console.error);
        }

    }
}

async function execute(interaction: Interaction) {
    let interactionName:string;
    try {
        // console.log(interaction);
        switch (interaction.type) {
        case InteractionType.ApplicationCommand:

            switch (interaction.commandType) {
            // Chat Input Command
            case ApplicationCommandType.ChatInput:
                // console.log(interaction.client.commands);
                interaction.client.commands.get(interaction.commandName)?.execute(interaction);
                break;

                // Context Menu
            case ApplicationCommandType.Message:
            case ApplicationCommandType.User:
                interaction.client.contextMenus.get(interaction.commandName)?.execute(interaction);
                break;
            default:
                break;
            }
            break;
            // Component (Button | Select Menu)
        case InteractionType.MessageComponent:

            if (!interaction.client.config.interactions.receiveMessageComponents) return;
            interactionName = interaction.client.config.interactions.splitCustomId ? interaction.customId.split('_')[0] : interaction.customId;

            switch (interaction.componentType) {
            case ComponentType.Button:
                // Check if message components are enabled
                if (!interaction.client.config.interactions.receiveMessageComponents) return;
                interaction.client.buttons.get(interactionName)?.execute(interaction);
                break;

            case ComponentType.ChannelSelect:
            case ComponentType.RoleSelect:
            case ComponentType.UserSelect:
            case ComponentType.MentionableSelect:
            case ComponentType.StringSelect:
                interaction.client.selectMenus.get(interactionName)?.execute(interaction);
                break;
            default:
                break;
            }

            break;
            // ModalSubmit
        case InteractionType.ModalSubmit:
            // Check if modal interactions are enabled
            if (!interaction.client.config.interactions.receiveModals) return;
            interactionName = interaction.client.config.interactions.splitCustomId ? interaction.customId.split('_')[0] : interaction.customId;
            interaction.client.modals.get(interactionName)?.execute(interaction);
            break;
        case InteractionType.ApplicationCommandAutocomplete:
            // Check if autocomplete interactions are enabled
            if (!interaction.client.config.interactions.receiveAutocomplete) return;
            interactionName = interaction.commandName;
            // eslint-disable-next-line no-case-declarations
            const autocomplete = interaction.client.commands.get(interactionName)?.autocomplete;
            if (!autocomplete) { console.warn(`[Warning] Autocomplete for ${interactionName} was not Setup`); }
            else { autocomplete(interaction); }
            break;
        default:
            break;
        }
    }
    catch (error) {
        if (interaction.isRepliable()) replyError(error, interaction);
        else console.error(error);
    }
}