import { AnySelectMenuInteraction, ButtonInteraction, ChannelSelectMenuInteraction, Interaction as dInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from 'discord.js';
import ExtendedClient from '../classes/Client';

export interface Interaction {
    name: string;
    execute(client: ExtendedClient, interaction: dInteraction): Promise<void>;
}

export interface Button extends Interaction {
    execute(client: ExtendedClient, interaction: ButtonInteraction): Promise<void>
}

export interface ModalSubmit extends Interaction {
    execute(client: ExtendedClient, interaction: ModalSubmitInteraction): Promise<void>
}

export interface AnySelectMenu extends Interaction {
    execute(client: ExtendedClient, interaction: AnySelectMenuInteraction): Promise<void>
}

export interface StringSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: StringSelectMenuInteraction): Promise<void>
}

export interface MentionableSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: MentionableSelectMenuInteraction): Promise<void>
}

export interface ChannelSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: ChannelSelectMenuInteraction): Promise<void>
}

export interface RoleSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: RoleSelectMenuInteraction): Promise<void>
}

export interface UserSelectMenu extends AnySelectMenu {
    execute(client: ExtendedClient, interaction: UserSelectMenuInteraction): Promise<void>
}