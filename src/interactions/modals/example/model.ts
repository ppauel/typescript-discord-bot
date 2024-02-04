import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { ExtraColor, Interaction } from '../../../Classes/Client';
import { localize } from '../../../bot';

const ns = 'modal';


export default new Interaction<ModalSubmitInteraction>()
    .setName('modal')
    .setExecute(async (interaction) => {
        const locale = localize.getLocale(interaction.locale);
        interaction.reply({
            embeds: [new EmbedBuilder()
                .setTitle(locale.t('embed-title', ns))
                .setColor(ExtraColor.EmbedGray)
                .setFields(
                    {
                        name: locale.t('embed-short', ns),
                        value: interaction.fields.getTextInputValue('short')
                    },
                    {
                        name: locale.t('embed-paragraph', ns),
                        value: interaction.fields.getTextInputValue('paragraph') || '`N/A`'
                    }
                )],
            ephemeral: true
        });
    });