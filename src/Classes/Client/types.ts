import { ExtendedClient } from './Client.js';

export type TimeCode = 'd' | 'D' | 't' | 'T' | 'f' | 'F' | 'R';

export const TimeFormat = {
    ShortDate: 'd',
    LongDatez: 'D',
    ShortTime: 't',
    LongTime: 'T',
    ShortDateTime: 'f',
    LongDateTime: 'F',
    RelativeTime: 'R'
};

export const ExtraColor = {
    EmbedGray: 0x2b2d31,
    EmbedWhite: 0xf2f3f5
};

declare global {
    interface Date {
        toDiscordString(format?: TimeCode): string;
    }
}

// eslint-disable-next-line func-names
Date.prototype.toDiscordString = function(format?: TimeCode) {
    const code = Math.floor(this.getTime() / 1000);
    if (!format) return `<t:${code}`;
    return `<t:${code}:${format}>`;
};

// TypeScript or JavaScript environment (thanks to https://github.com/stijnvdkolk)
export let tsNodeRun = false;
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

declare module 'discord.js' {
    interface BaseInteraction {
        client: ExtendedClient;
    }
    interface Component {
        client: ExtendedClient;
    }
    interface Message {
        client: ExtendedClient;
    }
    interface BaseChannel {
        client: ExtendedClient;
    }
    interface Role {
        client: ExtendedClient;
    }
    interface Guild {
        client: ExtendedClient;
    }
    interface User {
        client: ExtendedClient;
    }
    interface GuildMember {
        client: ExtendedClient;
    }
}
