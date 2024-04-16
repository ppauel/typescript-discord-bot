import {
    AnySelectMenuInteraction, ButtonInteraction, Collection, ModalSubmitInteraction
} from 'discord.js';
import { Client } from '../Client/index.js';
import { Interaction } from '../Interaction.js';

export class InteractionHandler {
    readonly client: Client;

    // Collection of Button Interactions
    protected _buttons = new Collection<string, Interaction<ButtonInteraction>>();

    // Collection of Select Menu Interactions
    protected _selectMenus = new Collection<string, Interaction<AnySelectMenuInteraction>>();

    // Collection of Modal Submit Interactions
    protected _modals = new Collection<string, Interaction<ModalSubmitInteraction>>();

    get buttons() {
        return this._buttons;
    }

    private set buttons(buttons:Collection<string, Interaction<ButtonInteraction>>) {
        this._buttons = buttons;
    }

    get selectMenus() {
        return this._selectMenus;
    }

    private set selectMenus(buttons:Collection<string, Interaction<AnySelectMenuInteraction>>) {
        this._selectMenus = buttons;
    }

    get modals() {
        return this._modals;
    }

    private set modals(buttons:Collection<string, Interaction<ModalSubmitInteraction>>) {
        this._modals = buttons;
    }

    addButton(interaction: Interaction<ButtonInteraction>) {
        this.buttons.set(interaction.name, interaction);
        return this;
    }

    addButtons(collection: Collection<string, Interaction<ButtonInteraction>>) {
        this.buttons = this.buttons.concat(collection);
        return this;
    }

    runButton(interaction: ButtonInteraction) {
        const interactionName = this.client.splitCustomID ? interaction.customId.split(this.client.splitCustomIDOn)[0] : interaction.customId;
        return this.buttons.get(interactionName).execute(interaction);
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
