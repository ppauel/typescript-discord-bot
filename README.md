<div align="center">
  <br />
  <p>
    <img src="https://i.imgur.com/LAV5caA.png" width="546" alt="Discord.js Bot Template" />
  </p>

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fppauel%2Ftypescript-discord-bot%2Fraw%2Fmain%2Fpackage.json&query=%24.dependencies%5B%22discord.js%22%5D&logo=discord&logoColor=ffffff&label=discord.js)
![GitHub](https://img.shields.io/github/license/ppauel/typescript-discord-bot)
  
</div>

# TypeScript Discord Bot Template

A multi-purpose discord.js v14 bot template.
This is the successor of the [djs-template](https://github.com/ppauel/djs-template) repository.

This template is still 🚧 under development 🚧 and will be constantly extended, for example when changes are made to the Discord API.

## Features

- Command Handler (global / guild)
- Interaction Handler (Message Components, Modals)
- Event Handler
- Localizations
- Customizable configuration
- [Examples](#demo-files)

## Installation

Intsall Node.js 20.6.0 or later. The latest version of Node.js can be installed from [here](https://nodejs.org/en/download/current)

Cone the repo then install the required `npm` modules.

```bash
git clone https://github.com/ppauel/typescript-discord-bot.git new_bot
npm install
```
In the root of the project create a copy of `example.env` then rename it to `.env` this file contains all environmental variables for the project. replace the `TOKEN` with your Application's [Bot Token](https://discord.com/developers/docs/quick-start/getting-started#configuring-your-bot).

**Optional:** Replace `GUILDID` if you wish to deploy commands to a Spific guild

### Configuration
The `.env` only contains information which you may want to keep private like your bots token.
To configure the bot is done in `src/bot.ts` with the client options. Extended from the [discord.js ClientOptions](https://old.discordjs.dev/#/docs/discord.js/14.14.1/typedef/ClientOptions).

Choose witch thyes of interaction you want your bot to interact with
- **[message components](https://discord.com/developers/docs/interactions/overview#message-components)** - buttons and select menus.
- **[modals](https://discord.com/developers/docs/interactions/overview#message-components)** -  Pop up windows for text entry
- **[Autocomplete](https://discord.com/developers/docs/interactions/application-commands#autocomplete)** - Aoto complete options in slash commands
```typescript
receiveMessageComponents: true,
receiveModals: true,
receiveAutocomplete: true
```

Select whether to reply with a meassage if an error occurs whilst executing an interaction. 

Optional: You may provided a customised message
```typescript
replyOnError: true,
replyMessageOnError: "Error message here"
```

When using interactions you may wish to included information in the custom ID of an interaction.

For example `report_527814442746904591` is treated as `report`.

By adding this option the interaction hadaler will parse custom IDs using the charicter
```typescript
splitCustomIDOn: "_"
```

Optional: if you would like to write your own `onInteractionCreate` event handling set this option to `false`.
```typescript
useDefaultInterctionEvent: true
```

**Done!** You can now experiment with some examples. For that, you just need to start your bot...

## Scripts

To run the bot use the following command. this will both build and then run the bot
```bash
npm run start
```

To only compile a JavaScript build of your bot, run this command.
```bash
npm run build
```

The finished build will be located in the `dist/` directory.

## Usage / Examples

### Demo files

This template contains some sample commands and interactions so you understand how to use it:

- `src/commands/example/ping.ts` *Ping Command*
- `src/features/ping.ts` *Ping Button Builder*
- `src/interactions/buttons/example/ping.ts` *Ping Button Interaction*

- `src/context_menus/example/countCharacters.ts` *Message Context Menu*

- `src/context_menus/example/displayAvatar.ts` *User Context Menu*

**Hint:** *Commands, Context Menus and Interactions can be located in a subfolder.*

### ExtendedClient class

To make it easier to access the client's config and collections, the template includes the `ExtendedClient` class. It allows to access these properties directly from the client without importing them.

```typescript
const client = new ExtendedClient({splitCustomIDOn: '_'});
const splitCustomID = client.splitCustomIDOn;
```
Note: `ExtendedClient` my not be accesable every where client is as it is not part of the discord.js package.
### Localizations

By default, this project supports translations. These are managed in the `locales/` folder. The configuration is located in `src/classes/i18n`. Examples of usage can be found in the demo files.
