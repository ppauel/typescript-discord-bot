import { getPingButton } from '../../../features/ping';
import i18n from '../../../features/i18n';
import { Button } from '../../../interfaces';

// Example interaction (related to the /ping command)

const button: Button = {
    name: 'ping',
    async execute(_client, interaction) {
        interaction.reply({ content: `${i18n(interaction.locale, 'ping-button')} 🏓`, components: [getPingButton(interaction.locale)], ephemeral: true });
    },
};

export default button;