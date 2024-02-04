import { AnySelectMenuInteraction, ButtonInteraction, Collection, ModalSubmitInteraction } from 'discord.js';
import { Client } from '../../Client';
import { Interaction } from '../Interaction';

export class InteractionHandler {
	protected readonly client: Client;

	// Collection of Button Interactions
	protected _buttons: Collection<string, Interaction<ButtonInteraction>> = new Collection();

	// Collection of Select Menu Interactions
	protected _selectMenus: Collection<string, Interaction<AnySelectMenuInteraction>> = new Collection();

	// Collection of Modal Submit Interactions
	protected _modals: Collection<string, Interaction<ModalSubmitInteraction>> = new Collection();

	get buttons() {
		return this._buttons;
	}

	get selectMenus() {
		return this._selectMenus;
	}

	get modals() {
		return this._modals;
	}

	addButton(interaction: Interaction<ButtonInteraction>) {
		this._buttons.set(interaction.name, interaction);
		return this;
	}

	addButtons(collection: Collection<string, Interaction<ButtonInteraction>>) {
		this._buttons = this._buttons.concat(collection);
		return this;
	}

	runButton(interaction: ButtonInteraction) {
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this._buttons.get(interactionName).execute(interaction);
	}

	addModal(interaction: Interaction<ModalSubmitInteraction>) {
		this._modals.set(interaction.name, interaction);
		return this;
	}

	addModals(collection: Collection<string, Interaction<ModalSubmitInteraction>>) {
		this._modals = this._modals.concat(collection);
		return this;
	}

	runModal(interaction: ModalSubmitInteraction) {
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this._modals.get(interactionName).execute(interaction);
	}

	addSelectMenu(interaction: Interaction<AnySelectMenuInteraction>) {
		this._selectMenus.set(interaction.name, interaction);
		return this;
	}

	addSelectMenus(collection: Collection<string, Interaction<AnySelectMenuInteraction>>) {
		this._selectMenus = this._selectMenus.concat(collection);
		return this;
	}

	runSelectMenus(interaction: AnySelectMenuInteraction) {
		const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
		return this._selectMenus.get(interactionName).execute(interaction);
	}

	constructor(client: Client) {
		this.client = client;
	}
}
