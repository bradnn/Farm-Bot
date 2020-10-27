module.exports = class {
    async run(error, shard) {
        console.warn(`Drug Bot: Shard ${shard} disconnect with error:` + error.message);
    }
}