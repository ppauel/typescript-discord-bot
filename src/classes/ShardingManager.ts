import { ShardingManager, ShardingManagerOptions } from 'discord.js';
export default class ExtendedShardingManager extends ShardingManager {
    constructor(file: string, options?: ShardingManagerOptions | undefined) {
        super(file, options);

        // Emitted when a shard is created
        this.on('shardCreate', shard => console.log(`[INFO] Launched shard ${shard.id}`));
    }
}