import { AnySelectMenuInteraction, ButtonInteraction, ChannelSelectMenuInteraction, Interaction as dInteraction, MentionableSelectMenuInteraction, ModalSubmitInteraction, RoleSelectMenuInteraction, StringSelectMenuInteraction, UserSelectMenuInteraction } from 'discord.js';

export interface Interaction {
    name: string;
    execute(interaction: dInteraction): Promise<void>;
}

export interface Button extends Interaction {
    execute(interaction: ButtonInteraction): Promise<void>
}

export interface ModalSubmit extends Interaction {
    execute(interaction: ModalSubmitInteraction): Promise<void>
}

export interface AnySelectMenu extends Interaction {
    execute(interaction: AnySelectMenuInteraction): Promise<void>
}

export interface StringSelectMenu extends AnySelectMenu {
    execute(interaction: StringSelectMenuInteraction): Promise<void>
}

export interface MentionableSelectMenu extends AnySelectMenu {
    execute(interaction: MentionableSelectMenuInteraction): Promise<void>
}

export interface ChannelSelectMenu extends AnySelectMenu {
    execute(interaction: ChannelSelectMenuInteraction): Promise<void>
}

export interface RoleSelectMenu extends AnySelectMenu {
    execute(interaction: RoleSelectMenuInteraction): Promise<void>
}

export interface UserSelectMenu extends AnySelectMenu {
    execute(interaction: UserSelectMenuInteraction): Promise<void>
}