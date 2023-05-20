/* eslint-disable no-console */
import {
	ApplicationCommandType, ComponentType, DiscordAPIError, Interaction, InteractionType, RepliableInteraction 
} from 'discord.js';

// Send a warning on error
async function replyError(error: unknown, interaction: RepliableInteraction) {
	const reply = interaction.deferred ? interaction.followUp : interaction.reply;

	if (error instanceof DiscordAPIError) {
		console.error(error);
	}
	else if (error instanceof Error) {
		console.error(error);

		if (!interaction.client.replyOnError) return;

		const errorMessage = '[Error] There was an error while executing this interaction.';

		reply({ content: errorMessage, ephemeral: true }).catch(console.error);
	}
}

export async function onInteractionCreate(interaction: Interaction) {
	let interactionName: string;
	const { client } = interaction;
	try {
		switch (interaction.type) {
		case InteractionType.ApplicationCommand:
			switch (interaction.commandType) {
			// Chat Input Command
			case ApplicationCommandType.ChatInput:
				client.commands.get(interaction.commandName)?.execute(interaction);
				break;

				// Context Menu
			case ApplicationCommandType.Message:
			case ApplicationCommandType.User:
				client.contextMenus.get(interaction.commandName)?.execute(interaction);
				break;
			default:
				break;
			}
			break;

			// Component (Button | Select Menu)
		case InteractionType.MessageComponent:
			if (!client.receiveMessageComponents) return;
			interactionName = client.splitCustomID ? interaction.customId.split(client.splitCustomIDOn)[0] : interaction.customId;

			switch (interaction.componentType) {
			case ComponentType.Button:
				// Check if message components are enabled
				if (!client.receiveMessageComponents) return;
				client.buttons.get(interactionName)?.execute(interaction);
				break;

			case ComponentType.ChannelSelect:
			case ComponentType.RoleSelect:
			case ComponentType.UserSelect:
			case ComponentType.MentionableSelect:
			case ComponentType.StringSelect:
				client.selectMenus.get(interactionName)?.execute(interaction);
				break;
			default:
				break;
			}

			break;

			// ModalSubmit
		case InteractionType.ModalSubmit:
			// Check if modal interactions are enabled
			if (!client.receiveModals) return;
			interactionName = client.splitCustomID ? interaction.customId.split(client.splitCustomIDOn)[0] : interaction.customId;
			client.modals.get(interactionName)?.execute(interaction);
			break;
		case InteractionType.ApplicationCommandAutocomplete:
			// Check if autocomplete interactions are enabled
			if (!client.receiveAutocomplete) return;
			interactionName = interaction.commandName;

			// eslint-disable-next-line no-case-declarations
			const autocomplete = client.commands.get(interactionName)?.autocomplete;
			if (!autocomplete) {
				console.warn(`[Warning] Autocomplete for ${interactionName} was not Setup`);
			}
			else {
				autocomplete(interaction);
			}
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
