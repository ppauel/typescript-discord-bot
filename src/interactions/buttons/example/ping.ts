import { pingActionRow } from '../../../features/ping';
import { Button } from '../../../interfaces';
const button:Button = {
	name: 'ping',
	execute: async (_client, interaction) => {
		interaction.reply({ content:'Pong 🏓', components:[pingActionRow], ephemeral:true });
	},
};

export default button;