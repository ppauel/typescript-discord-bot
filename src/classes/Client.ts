import {
    Client,
    ClientOptions,
    Collection,
    ColorResolvable,
    Snowflake,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import configJSON from "../config.json";
import {
    AnySelectMenu,
    Button,
    ChatInputCommand,
    Command,
    ContextMenu,
    Event,
    Interaction,
    ModalSubmit,
} from "../interfaces";

// TypeScript or JavaScript environment (thanks to https://github.com/stijnvdkolk)
let tsNodeRun = false;
try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (process[Symbol.for("ts-node.register.instance")]) {
        tsNodeRun = true;
    }
} catch (e) {
    /* empty */
}
/**
 * Type Definitions for config
 */
interface Config {
    guild: Snowflake | "your_guild_id";
    interactions: {
        receiveMessageComponents: boolean;
        receiveModals: boolean;
        replyOnError: boolean;
        splitCustomId: boolean;
        useGuildCommands: boolean;
    };
    colors: {
        embed: ColorResolvable;
    };
    restVersion: "10";
}
/**
 * ExtendedClient is extends frome `Discord.js`'s Client
 */
export default class ExtendedClient extends Client {
    /**
     * Collection of Chat Input Commands
     */
    readonly commands: Collection<string, ChatInputCommand>;
    /**
     * Collection of Context Menu Commands
     */
    readonly contextMenus: Collection<string, ContextMenu>;
    /**
     * Collection of Events
     */
    readonly events: Collection<string, Event> = new Collection();
    /**
     * Collection of Button Interactions
     */
    readonly buttons: Collection<string, Button>;
    /**
     * Collection of Select Menu Interactions
     */
    readonly selectMenus: Collection<string, AnySelectMenu>;
    /**
     * Collection of Modal Submit Interactions
     */
    readonly modals: Collection<string, ModalSubmit>;
    /**
     * Config File
     */
    readonly config: Config = configJSON as Config;

    /**
     *
     * @param options Options for the client
     * @see https://discord.js.org/#/docs/discord.js/main/typedef/ClientOptions
     */
    constructor(options: ClientOptions) {
        super(options);

        console.log("\nStarting up...\n");

        // Paths
        const commandPath = path.join(__dirname, "..", "commands"),
            contextMenuPath = path.join(__dirname, "..", "context_menus"),
            buttonPath = path.join(__dirname, "..", "interactions", "buttons"),
            selectMenuPath = path.join(
                __dirname,
                "..",
                "interactions",
                "select_menus",
            ),
            modalPath = path.join(__dirname, "..", "interactions", "modals"),
            eventPath = path.join(__dirname, "..", "events");

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
        readdirSync(eventPath)
            .filter((dir) => dir.endsWith(tsNodeRun ? ".ts" : ".js"))
            .forEach((file) =>
                import(path.join(eventPath, file)).then(
                    (event: { default: Event }) => {
                        this.events.set(event.default.name, event.default);

                        if (event.default.once) {
                            this.once(event.default.name, (...args) =>
                                event.default.execute(this, ...args),
                            );
                        } else {
                            this.on(event.default.name, (...args) =>
                                event.default.execute(this, ...args),
                            );
                        }
                    },
                ),
            );
    }
    /**
     * Deploy Application Commands to Discord
     * @see https://discord.com/developers/docs/interactions/application-commands
     */
    public async deploy() {
        if (!this.token) {
            return console.warn(
                "[Error] Token not present at command deployment",
            );
        }

        const publicChatInputCommands = Array.from(
            this.commands.filter((cmd) => cmd.global).values(),
        ).map((m) => m.options.toJSON());

        const publicContextMenuCommands = Array.from(
            this.contextMenus.filter((cmd) => cmd.global).values(),
        ).map((m) => m.options.toJSON());

        const publicCommands = [
            ...publicChatInputCommands,
            ...publicContextMenuCommands,
        ];

        const guildChatInputCommands = Array.from(
            this.commands.filter((cmd) => !cmd.global).values(),
        ).map((m) => m.options.toJSON());

        const guildContextMenuCommands = Array.from(
            this.contextMenus.filter((cmd) => !cmd.global).values(),
        ).map((m) => m.options.toJSON());

        const guildCommands = [
            ...guildChatInputCommands,
            ...guildContextMenuCommands,
        ];

        console.log("[INFO] Deploying commands...");

        // Deploy global commands
        if (!this.application) {
            return console.warn(
                "[Error] Application not present at command deployment",
            );
        }

        const applicationCommands =
            await this.application.commands.set(publicCommands);

        console.log(
            `[INFO] Deployed ${applicationCommands.size} global command(s)`,
        );

        // Deploy Application Guild Commands to Discord
        // TODO: This is not recommended for sharding
        if (!this.config.interactions.useGuildCommands) return;
        const guild = this.guilds.cache.get(this.config.guild);
        if (!guild) {
            return console.warn(
                "[Warning] Please specify a guild id in order to use guild command(s)",
            );
        }

        const applicationGuildCommands = await this.application.commands.set(
            guildCommands,
            guild.id,
        );

        console.log(
            `[INFO] Deployed ${applicationGuildCommands?.size || 0} guild commands to ${guild.name}`,
        );
    }
}

/**
 * Converts Commands and Interactions in to Collection objects
 * @param dirPath Root directory of object
 * @returns Collection of Type
 */
function fileToCollection<Type extends Command | Interaction>(
    dirPath: string,
): Collection<string, Type> {
    const collection: Collection<string, Type> = new Collection();

    try {
        const dirents = readdirSync(dirPath, { withFileTypes: true });

        dirents
            .filter((dirent) => dirent.isDirectory())
            .forEach((dir) => {
                const directoryPath = path.join(dirPath, dir.name);
                readdirSync(directoryPath)
                    .filter((file) => file.endsWith(tsNodeRun ? ".ts" : ".js"))
                    .forEach((file) => {
                        import(path.join(directoryPath, file)).then(
                            (resp: { default: Type }) => {
                                collection.set(
                                    (resp.default as Command).options !=
                                        undefined
                                        ? (resp.default as Command).options.name
                                        : (resp.default as Interaction).name,
                                    resp.default,
                                );
                            },
                        );
                    });
            });

        dirents
            .filter(
                (dirent) =>
                    !dirent.isDirectory() &&
                    dirent.name.endsWith(tsNodeRun ? ".ts" : ".js"),
            )
            .forEach((file) => {
                import(path.join(dirPath, file.name)).then(
                    (resp: { default: Type }) => {
                        collection.set(
                            (resp.default as Command).options != undefined
                                ? (resp.default as Command).options.name
                                : (resp.default as Interaction).name,
                            resp.default,
                        );
                    },
                );
            });
    } catch (error) {
        if (
            isErrnoException(error) &&
            error.code == "ENOENT" &&
            error.syscall == "scandir"
        ) {
            console.warn(`[Warning] Directory not found at ${error.path}`);
        } else {
            throw error;
        }
    }
    return collection;
}

/**
 * Returns a boolean and Types a unkown as ErrnoException if the object is an error
 * @param error Any unkown object
 * @returns A boolean value if the the object is a ErrnoException
 */
function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
    return error instanceof Error;
}
