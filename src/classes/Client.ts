import { ApplicationCommand, Client, ClientOptions, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { AnySelectMenu, Button, ChatInputCommand, ContextMenu, Event, ModalSubmit } from '../interfaces';
import configJSON from '../config.json';
import path from 'path';
import { readdirSync } from 'fs';

// TypeScript or JavaScript environment (thanks to https://github.com/stijnvdkolk)
let tsNodeRun = false;
try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (process[Symbol.for('ts-node.register.instance')]) {
        tsNodeRun = true;
    }
}
catch (e) {
    /* empty */
}

interface readdirSyncError extends Error {
    errno:number,
    syscall:string,
    code:string,
    path:string
}
/**
 * ExtendedClient is extends frome `Discord.js`'s Client
 */
class ExtendedClient extends Client {
    readonly commands: Collection<string, ChatInputCommand> = new Collection();
    readonly contextMenus: Collection<string, ContextMenu> = new Collection();
    readonly events: Collection<string, Event> = new Collection();
    readonly buttons: Collection<string, Button> = new Collection();
    readonly selectMenus: Collection<string, AnySelectMenu> = new Collection();
    readonly modals: Collection<string, ModalSubmit> = new Collection();
    readonly config = configJSON;

    constructor(options:ClientOptions) {
        super(options);

        console.log('Starting up...');

        // Paths
        const commandPath = path.join(__dirname, '..', 'commands'),
            contextMenuPath = path.join(__dirname, '..', 'context_menus'),
            buttonPath = path.join(__dirname, '..', 'interactions', 'buttons'),
            selectMenuPath = path.join(__dirname, '..', 'interactions', 'select_menus'),
            modalPath = path.join(__dirname, '..', 'interactions', 'modals'),
            eventPath = path.join(__dirname, '..', 'events');

        // Command Handler
        try {
            readdirSync(commandPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(commandPath, file)).then((command:{ default:ChatInputCommand }) => {
                    // console.log(command);
                    this.commands.set(command.default.options.name, command.default);
                });
            });
        }
        catch (error) { checkReaddirSyncError(error); }


        // Context Menu Handler
        try {
            readdirSync(contextMenuPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(contextMenuPath, file)).then((command:{ default:ContextMenu }) => {
                    this.contextMenus.set(command.default.options.name, command.default);
                });
            });
        }
        catch (error) { checkReaddirSyncError(error); }


        // Interaction Handlers
        // Button Handler
        try {
            readdirSync(buttonPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(buttonPath, file)).then((interaction:{ default:Button }) => {
                    this.buttons.set(interaction.default.name, interaction.default);
                });
            });
        }
        catch (error) { checkReaddirSyncError(error); }


        // Select Menu Handler
        try {
            readdirSync(selectMenuPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(selectMenuPath, file)).then((interaction:{ default:AnySelectMenu }) => {
                    this.selectMenus.set(interaction.default.name, interaction.default);
                });
            });
        }
        catch (error) { checkReaddirSyncError(error); }

        // Modal Handler
        try {
            readdirSync(modalPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(modalPath, file)).then((interaction:{ default:ModalSubmit }) => {
                    this.modals.set(interaction.default.name, interaction.default);
                });
            });
        }
        catch (error) { checkReaddirSyncError(error); }

        // Event Handler
        readdirSync(eventPath).filter((dir) => dir.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => import(path.join(eventPath, file))
            .then((event:{ default:Event }) => {

                this.events.set(event.default.name, event.default);

                if (event.default.once) {this.once(event.default.name, (...args) => event.default.execute(this, ...args));}
                else {this.on(event.default.name, (...args) => event.default.execute(this, ...args));}
            }),
        );
    }
    /**
     * Logins in the client
     */
    public login(token?:string): Promise<string> {

        // Login
        if (!token) {
            console.error('\nNo token was specified. Did you create a .env file?\n');
            return Promise.resolve('No token was specified. Did you create a .env file?');
        }
        else {return super.login(token);}
    }
    public async deploy() {
        // Skip if no-deployment flag is set
        if (process.argv.includes('--no-deployment')) return;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const rest = new REST({ version: this.config.restVersion }).setToken(this.token!),
            globalDeploy:RESTPostAPIApplicationCommandsJSONBody[] = (Array.from(this.commands.filter(cmd => cmd.global === true).values()).map(m => m.options.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[])
                .concat(Array.from(this.contextMenus.filter(cmd => cmd.global === true).values()).map(m => m.options.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[]),

            guildDeploy:RESTPostAPIApplicationCommandsJSONBody[] = (Array.from(this.commands.filter(cmd => cmd.global === false).values()).map(m => m.options.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[])
                .concat(Array.from(this.contextMenus.filter(cmd => cmd.global === false).values()).map(m => m.options.toJSON()) as RESTPostAPIApplicationCommandsJSONBody[]);

        console.log('Deploying commands...');

        // Deploy global commands
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const applicationCommands = await rest.put(Routes.applicationCommands(this.user!.id), { body: globalDeploy })
            .catch(console.error) as ApplicationCommand[];

        console.log(`Deployed ${applicationCommands.length} global commands`);

        // Deploy guild commands
        if (!this.config.interactions.useGuildCommands) return;
        if (this.config.guild === 'your_guild_id') return console.log('Please specify a guild id in order to use guild commands');
        const guildId = this.config.guild;
        const guild = await this.guilds.fetch(guildId).catch(console.error);
        if (!guild) return;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const applicationGuildCommands = await rest.put(Routes.applicationGuildCommands(this.user!.id, guildId), { body: guildDeploy })
            .catch(console.error) as ApplicationCommand[];

        console.log(`Deployed ${applicationGuildCommands?.length || 0} guild commands to ${guild.name}`);
    }
}
/**
 * logs out to consle if error is a director error
 * @param error unkowen object cought in a try block
 */
function checkReaddirSyncError(error:unknown) {
    if ((error instanceof Error) && (error as readdirSyncError).errno == -4058 && (error as readdirSyncError).syscall == 'scandir') {
        console.log(`Directory not found at ${(error as readdirSyncError).path}`);
    }
    else {
        throw error;
    }
}

export default ExtendedClient;