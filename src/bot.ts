import { GatewayIntentBits as Intents, Partials } from 'discord.js';
import ExtendedClient from './classes/Client';
import { config } from 'dotenv';

// Load .env file contents
config();

// Initialization (specify intents and partials)
new ExtendedClient({
	intents: [
		Intents.Guilds,
		Intents.GuildMessages,
		Intents.MessageContent,
		Intents.GuildMembers,
	],
	partials: [
		Partials.Message,
		Partials.Channel,
		Partials.Reaction,
		Partials.GuildMember,
	],
}).login(process.env.TOKEN);