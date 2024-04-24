import { Events } from 'discord.js';
import { Event } from '../../Classes/index.js';

export default new Event({
	name: Events.Warn,
	execute: async (info: string) => console.warn(info)
});
