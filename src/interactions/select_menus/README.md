# Select Menus
[Select menus](https://discordjs.guide/message-components/select-menus.html) are a [message component](https://discordjs.guide/message-components/interactions.html#responding-to-component-interactions) interaction that creates a dropdown allowing the user to select one or more items in the menu.

### Types
The main type of select menu is a `String` select menu how ever Discord allows for four Auto-populating types
- User - only users
- Role - only roles
- Mentionable - users and roles
- Channel - channels

### Creating an Interaction
Interactions start with the bot [sending the select menu](https://discordjs.guide/message-components/select-menus.html#building-string-select-menus), to receive this interaction upon it being used follow the below steps:
1. Create an interaction object
	- `customIdPrefix` - Is used to identify the which interactions should triggered
	- `run` - The functions which is called on the occurrence of the interaction
```ts
// src/interactions/select_menus/string.ts
import { StringSelectMenuInteraction } from 'discord.js';
import { Interaction } from '../../../Classes/index.js';

export default new Interaction<StringSelectMenuInteraction>({
	customIdPrefix:'string',
	run: async (interaction) => {
		/* Some Code */
	}
});
```
2. Create `index.ts` and export `default` from the object you just made as an unique name
```ts
// src/interactions/select_menus/index.ts
export { default as string } from './string.js'
```
3. In the main make sure the following is present
```ts
// src/index.ts
import { Client } from './Classes/index.js';
import * as selectMenus from './interactions/select_menus/index.js'

export const client = new Client({
	receiveMessageComponents: true, // enables the uses of message components
	splitCustomIDOn: '_', // allows the inclusions of additional arguments in a custom ID `prefix_arg1_arg2` converts [prefix, arg1, arg2]
});

// Load selectMenus
for (const selectMenu of Object.values(selectMenus)) 
	client.interactions.addSelectMenu(selectMenu);
```
