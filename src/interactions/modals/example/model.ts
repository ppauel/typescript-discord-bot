import { EmbedBuilder, ModalSubmitInteraction } from 'discord.js';
import { ExtraColor, Interaction } from '../../../Client';
import { t } from '../../../i18n';

const ns = 'modal';


export default new Interaction<ModalSubmitInteraction>()
    .setName('modal')
    .setExecute(async (interaction) => {
        const locale = interaction.locale;
        interaction.reply({
            embeds:[new EmbedBuilder()
                .setTitle(t({ locale, key: 'embed-title', ns }))
                .setColor(ExtraColor.EmbedGray)
                .setFields(
                    {
                        name: t({ locale, key: 'embed-short', ns }),
                        value: interaction.fields.getTextInputValue('short'),
                    },
                    {
                        name: t({ locale, key: 'embed-paragraph', ns }),
                        value: interaction.fields.getTextInputValue('paragraph') || '`N/A`',
                    },
                )],
            ephemeral:true,
        });
    });