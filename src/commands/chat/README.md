# Chat Commands
Chat command also called [slash commands](https://discordjs.guide/creating-your-bot/slash-commands.html) are the primary way users interact with an application on Discord. Their are several type of options a command can be a `String`, `Integer`, `Number`, `Boolean`, `User`, `Channel`, `Role`, or `Mentionable`. Each option type help by proving ing basic input validation.
See [discord.js guide](https://discordjs.guide/slash-commands/advanced-creation.html#adding-options) for addtional help with options.

Additional you may want to group commands to gather this is done with `Subcommands` and `Subcommand Groups`. See [discord.js guide](https://discordjs.guide/slash-commands/advanced-creation.html#subcommands) for additional help with subcommands.

## Create a Chat Command object
1. Create a new file
	- `builder` - The discord.js [slash command buider](https://discordjs.dev/docs/packages/builders/main/SlashCommandBuilder:Class)
	- `execute` - The function that will be run on the command interaction
	- `guildIds` - An array of server IDs *Only use if the command will be exclusive to a set of servers*
	- `autoComplete` - function to run on uses of option [autocomplete](https://discordjs.guide/slash-commands/autocomplete.html)
```ts
// src/commands/chat/ping.ts
import { ChatInputCommand } from '../../Classes/index.js';

export default new ChatInputCommand()
	.setBuilder((builder) => builder
		.setName('ping')
		.setDescription('The bot will reply with pong'))
	.setExecute(async (interaction) => {
		interaction.reply('🏓 Pong');
	});
```
2. Add export to command `index.ts`
```ts
// src/commands/index.ts
export { default as ping } from './chat/ping.js';
```
3. Load commands into the client in main
```ts
// src/index.ts
import { Client } from './Classes/index.js';
import * as commands from './commands/index.js';

const client = new Client();

// Load commands 
for (const command of Object.values(commands)) 
	client.commands.add(command);
```
