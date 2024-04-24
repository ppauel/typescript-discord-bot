# Modals
[Modals](https://discordjs.guide/interactions/modals.html) interactions create a pop up window in the Discord client for form like text entry

### Creating an Interaction
Interactions start with the bot [sending the modal](https://discordjs.guide/interactions/modals.html#building-and-responding-with-modals), to recive this interaction opon it being used follow the below steps:
1. Create an interaction object
	- `customIdPrefix` - Is used to identify the wich interactions should trigered
	- `run` - The functions which is called on the occurrence of the interaction
```ts
// src/interactions/modals/modal.ts
import { ModalSubmitInteraction } from 'discord.js';
import { Interaction } from '../../../Classes/index.js';

export default new Interaction<ModalSubmitInteraction>({
	customIdPrefix:'modal',
	run: async (interaction) => {
		/* Some Code */
	}
});
```
2. Create `index.ts` and export `default` from the object you just made as an unique name
```ts
// src/interactions/modals/index.ts
export { default as string } from './modal.js'
```
3. In the main make sure the following is present
```ts
// src/index.ts
import { Client } from './Classes/index.js';
import * as modals from './interactions/modals/index.js'

export const client = new Client({
	receiveModals: true, // enables the uses of modals
	splitCustomIDOn: '_', // allows the inclustions of additional incomation in a custom ID `prefix_arg1_arg2` conversts [prefix, arg1, arg2]
});

// Load modals
for (const modal of Object.values(modals)) 
	client.interactions.addModal(modal);
```
