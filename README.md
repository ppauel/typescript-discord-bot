<div align="center">
  <br />
  <p>
    <img src="https://i.imgur.com/LAV5caA.png" width="546" alt="Discord.js Bot Template" />
  </p>
</div>

# TypeScript Discord Bot Template

A multi-purpose discord.js v14 bot template.
This is the successor of the [djs-template](https://github.com/ppauel/djs-template) repository.


## Features

- Slash Command Handler (global / guild)
- Context Menu Handler (global / guild)
- Interaction Handler (Message Components, Modals)
- Event Handler
- Customizable configuration
- [Examples](#demo-files)
## Installation

Install the required `npm` modules.

```bash
npm install
```

Create a new file called `.env` in the root directory and insert your bot token as shown in the `.env.example` file.

### Configuration
Apart from the token, the configuration takes place in the `config.json` file located in the `src/` folder.

Specify a **guild ID** to which the guild commands will be deployed. Make sure that the bot is a member of this server and has sufficient permissions to create commands.
```json
"guild": "your_guild_id"
```

Choose if you want to receive **message components** and **modals** using the interaction handler.
```json
"receiveMessageComponents": true,
"receiveModals": true
```

Select whether to reply with a warning if an error occurs whilst executing an interaction.

```json
"replyOnError": true
```

Choose whether you want to split the custom ID of an interaction by **underscores** (_). In this case, the interaction handler uses only the string **before the first underscore** (if any).
This system makes sense if you want to use the custom ID to convey additional information.

For example `report_527814442746904591` is treated as `report`.
```json
"splitCustomId": false
```

If you want to use global commands only, you can disable guild commands. The `global` attribute must still be `true`.
```json
"useGuildCommands": true
```

**Done!** You can now experiment with some examples. For that, you just need to start your bot...
## Scripts

To start your bot and deploy all commands, run the following command.
```bash
npm run start
```

During development, it is a good idea not to deploy all commands every time you restart. You can use the following command to disable automatic deployment.
```bash
npm run dev
```

To compile a JavaScript build of your bot, run this command.
```bash
npm run build
```

The finished bot will be located in the `dist/` folder. You can then launch it via Node or a process manager of your choice.
```bash
node .
```
## Usage / Examples
### Demo files
This template contains some sample commands and interactions so you understand how to use it:
- `src/commands/example/say.ts`
- `src/commands/example/dice.ts`
- `src/context_menus/example/count.ts`
- `src/interactions/example/diceRollButton.ts`

**Hint:** *Commands, Context Menus and interactions have to be located in a subfolder.*

### ExtendedClient class
To make it easier to access the client's config and collections, the template includes the `ExtendedClient` class. It allows to access these properties directly from the client without importing them.
```javascript
const client = new ExtendedClient();
const guildId = client.config.guild;
```
However, the `ExtendedClient` cannot be accessed through an API object such as message or an interaction. The included handlers pass the `client` as its own parameter, so you don't have to worry about that.

## About this template
This template is still under development and will be constantly extended, for example when changes are made to the Discord API.
