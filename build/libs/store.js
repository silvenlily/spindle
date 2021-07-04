"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const pg_1 = __importDefault(require("pg"));
async function merge(base, changes) {
    let changeKeys = Object.keys(changes);
}
class store {
    constructor(pgURI, cacheAllGuilds) {
        if (cacheAllGuilds) {
            this.cacheAllGuilds = cacheAllGuilds;
        }
        else {
            this.cacheAllGuilds = true;
        }
        this.pg = new pg_1.default.Client();
    }
    async fetchGuild(guildid) { }
    async storeGuild(guildid, changes) { }
    async fetchChannel(guildid, channelid) { }
    async storeChannel(guildid, channelid, changes) { }
}
exports.store = store;
exports.default = store;
