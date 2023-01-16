import { pingActionRow } from '../../../features/ping';
import { Button } from '../../../interfaces';

// Example interaction (related to the /ping command)

const button: Button = {
    name: 'ping',
    execute: async (_client, interaction) => {
        interaction.reply({ content: 'Pong 🏓', components: [pingActionRow], ephemeral: true });
    },
};

export default button;