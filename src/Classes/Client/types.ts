import { ExtendedClient } from './Client';

export type TimeCode = 'd' | 'D' | 't' | 'T' | 'f' | 'F' | 'R';

export declare const TimeFormat: {
	ShortDate: 'd';
	LongDatez: 'D';
	ShortTime: 't';
	LongTime: 'T';
	ShortDateTime: 'f';
	LongDateTime: 'F';
	RelativeTime: 'R';
};

export declare const ExtraColor: {
	EmbedGray: 0x2b2d31;
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
