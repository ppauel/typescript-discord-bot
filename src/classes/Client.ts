import { ApplicationCommand, Client, ClientOptions, Collection, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { AnySelectMenu, Button, ChatInputCommand, Command, ContextMenu, Event, Interaction, ModalSubmit } from '../interfaces';
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
    readonly commands: Collection<string, ChatInputCommand>;
    readonly contextMenus: Collection<string, ContextMenu>;
    readonly events: Collection<string, Event> = new Collection();
    readonly buttons: Collection<string, Button>;
    readonly selectMenus: Collection<string, AnySelectMenu>;
    readonly modals: Collection<string, ModalSubmit>;
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
        this.commands = fileToCollection<ChatInputCommand>(commandPath);

        // Context Menu Handler
        this.contextMenus = fileToCollection<ContextMenu>(contextMenuPath);

        // Interaction Handlers
        // Button Handler
        this.buttons = fileToCollection<Button>(buttonPath);

        // Select Menu Handler
        this.selectMenus = fileToCollection<AnySelectMenu>(selectMenuPath);

        // Modal Handler
        this.modals = fileToCollection<ModalSubmit>(modalPath);

        // Event Handler
        readdirSync(eventPath).filter((dir) => dir.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => import(path.join(eventPath, file))
            .then((event: { default: Event }) => {

                this.events.set(event.default.name, event.default);

                if (event.default.once) { this.once(event.default.name, (...args) => event.default.execute(this, ...args)); }
                else { this.on(event.default.name, (...args) => event.default.execute(this, ...args)); }
            }),
        );
    }

    /**
     * Logs the client in, establishing a WebSocket connection to Discord.
     * @param token Token of the account to log in with
     * @returns Token of the account used
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
 * Coverts Commands and Interactions in to Collection objects
 * @param dirPath Root directory of object
 * @returns colection of type
 */
function fileToCollection<Type extends Command | Interaction>(dirPath:string):Collection<string, Type> {

    const collection:Collection<string, Type> = new Collection();

    try {
        const dirents = readdirSync(dirPath, { withFileTypes:true });

        dirents.filter(dirent => dirent.isDirectory()).forEach((dir) => {
            const directoryPath = path.join(dirPath, dir.name);
            readdirSync(directoryPath).filter((file) => file.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
                import(path.join(directoryPath, file)).then((resp: { default: Type }) => {
                    collection.set(((resp.default as Command).options != undefined) ? (resp.default as Command).options.name : (resp.default as Interaction).name, resp.default);
                });
            });
        });
        dirents.filter(dirent => !dirent.isDirectory() && dirent.name.endsWith(tsNodeRun ? '.ts' : '.js')).forEach((file) => {
            import(path.join(dirPath, file.name)).then((resp: { default: Type }) => {
                collection.set(((resp.default as Command).options != undefined) ? (resp.default as Command).options.name : (resp.default as Interaction).name, resp.default);
            });
        });
    }
    catch (error) {

        if ((error instanceof Error) && (error as readdirSyncError).code == 'ENOENT' && (error as readdirSyncError).syscall == 'scandir') {
            console.log(`Directory not found at ${(error as readdirSyncError).path}`);
        }
        else {
            throw error;
        }
    }
    return collection;
}

export default ExtendedClient;