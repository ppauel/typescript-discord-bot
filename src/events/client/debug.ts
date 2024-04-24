import { Events } from 'discord.js';
import { Event } from '../../Classes/index.js';

export default new Event({
	name: Events.Debug,
	execute: async (info: string) => {
		if(info.startsWith('[WS => '))
			return;
		console.debug(info);
	}
});
