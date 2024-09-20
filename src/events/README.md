# Events
Client Events is how the bot interacts with Discord. Built in to the bot is an event handler. The following is how to add the `messageCreate` event to the bot
1. Create the a new event object
	- `name` - is the name of the client event, see the full list in the [discord.js documentation](https://discord.js.org/docs/packages/discord.js/14.14.1/Client:Class) 
	- `once` - by default `false` this property allows the event to be limited to run only once
	- `execute` - the function with runs on the occurrence of the event
```ts
// src/events/messageCreate.ts
import { Events, Message } from 'discord.js';
import { Client, Event } from '../Classes/index.js';

export default new Event({
	name: Events.MessageCreate,
	once: false,
	execute: (message:Message) => {
		/* Some Code*/
	}
});
```
2. Export `default` from the object you just made using the name of the event, in `index.ts`
```ts
// src/events/index.ts
export { default as messageCreate } from './messageCreate.js'
```

3. In the main make sure the following is present
```ts
// src/index.ts
import { Client } from './Classes/index.js';
import * as events from './events/index.js';

export const client = new Client();

// Load Events
for (const event of Object.values(events)) 
	client.events.add(event);
```
