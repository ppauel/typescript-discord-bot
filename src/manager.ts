import { DiscordjsError, ShardingManagerOptions } from 'discord.js';
import { config } from 'dotenv';
import ExtendedShardingManager from './classes/ShardingManager';

config();

import './features/i18n';

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

const options:ShardingManagerOptions = {
    token: process.env.TOKEN,
    totalShards: 'auto',
    shardArgs: ['--no-deployment'],
};

if (tsNodeRun) {
    options.execArgv = ['-r', 'ts-node/register'];
}

// Create your ShardingManager instance then starts shard(s) and catches Token Error
new ExtendedShardingManager(tsNodeRun ? './src/bot.ts' : './dist/bot.js', options)
    .spawn()
    .catch((err:unknown) => {
        if (err instanceof DiscordjsError) {
            if (err.code == 'TokenMissing') console.warn(`\n[Error] ${err.name}: ${err.message} Did you create a .env file?\n`);
            else if (err.code == 'TokenInvalid') console.warn(`\n[Error] ${err.name}: ${err.message} Check your .env file\n`);
            else throw err;
        }
        else {
            throw err;
        }
    });