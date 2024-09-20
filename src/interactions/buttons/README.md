# Buttons
[Buttons](https://discordjs.guide/interactions/modals.html) are a [message component](https://discordjs.guide/message-components/interactions.html#responding-to-component-interactions) interaction that can be used to create an interaction event

### Creating an Interaction
Interactions start with the bot [sending the button](https://discordjs.guide/message-components/buttons.html), to receive this interaction upon it being used follow the below steps:
1. Create an interaction object
	- `customIdPrefix` - Is used to identify the which interactions should triggered
	- `run` - The functions which is called on the occurrence of the interaction
```ts
// src/interactions/button/button.ts
import { ButtonInteraction } from 'discord.js';
import { Interaction } from '../../../Classes/index.js';

export default new Interaction<ButtonInteraction>({
	customIdPrefix:'button',
	run: async (interaction) => {
		/* Some Code */
	}
});
```
2. Create `index.ts` and export `default` from the object you just made as an unique name
```ts
// src/interactions/button/index.ts
export { default as string } from './button.js'
```
3. In the main make sure the following is present
```ts
// src/index.ts
import { Client } from './Classes/index.js';
import * as buttons from './interactions/buttons/index.js'

export const client = new Client({
	receiveMessageComponents: true, // enables the uses of message components
	splitCustomIDOn: '_', // allows the inclusions of additional arguments in a custom ID `prefix_arg1_arg2` is converted [prefix, arg1, arg2]
});

// Load buttons
for (const button of Object.values(buttons)) 
	client.interactions.addButton(button);
```
