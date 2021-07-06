"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const pg_1 = __importDefault(require("pg"));
const newGuild = {
    guildid: "",
    settings: {
        prefix: "|",
    },
    voicechannels: {},
    textchannels: {},
};
class store {
    constructor(pgURI) {
        this.db = new pg_1.default.Client(pgURI);
        this.guilds = {};
        this.finishedInit = this.init();
    }
    async init() {
        try {
            console.log(`connecting to postgres server...`);
            await this.db.connect();
            console.log(`connected to postgres server!`);
        }
        catch (error) {
            console.log(`Unable to connect to postgres server, likely manformed pg URI or pg server is down: \n${error}`);
            process.exit(1);
        }
        await this.db.query("CREATE TABLE IF NOT EXISTS guilds (guildid VARCHAR(18) PRIMARY KEY, voicechannels JSON, textchannels JSON, settings JSON)", []);
        let res = (await this.db.query("SELECT * FROM guilds")).rows;
        res.forEach((guild) => {
            this.guilds[guild.guildid] = guild;
        });
        console.log(`store finished init.`);
        return true;
    }
    async fetchGuildSettings(guildid) {
        let guild = await this.fetchGuild(guildid);
        if (guild) {
            return guild.settings;
        }
        else {
            return null;
        }
    }
    async fetchGuildVoiceChannels(guildid) {
        let guild = await this.fetchGuild(guildid);
        if (guild) {
            return guild.voicechannels;
        }
        else {
            return null;
        }
    }
    async fetchVoiceChannel(guildid, channelid) {
        let guild = await this.fetchGuild(guildid);
        if (guild) {
            if (guild.voicechannels[channelid]) {
                return guild.voicechannels[channelid];
            }
            else {
                return null;
            }
        }
        else {
            this.addGuild({ guildid: guildid });
            return null;
        }
    }
    async fetchGuild(guildid) {
        if (this.guilds[guildid]) {
            return this.guilds[guildid];
        }
        else {
            let guild = newGuild;
            guild.guildid = guildid;
            this.addGuild(guild);
        }
    }
    async setDynamicVoiceChannel(guildID, voiceChannelID, textChannelID) { }
    async storeGuildSettings(guildid, settings) {
        let guild = await this.fetchGuild(guildid);
        if (!guild) {
            this.addGuild({ guildid: guildid });
        }
        else {
            this.guilds[guildid].settings = settings;
            await this.db.query(`UPDATE guilds SET settings = $1 WHERE guildid = $2`, [
                settings,
                guildid,
            ]);
        }
    }
    async storeGuildVoiceChannels(guildid, channels) {
        let guild = await this.fetchGuild(guildid);
        if (!guild) {
            guild = newGuild;
            guild.guildid = guildid;
            guild.voicechannels = channels;
            this.addGuild(guild);
        }
        else {
            this.guilds[guildid].voicechannels = channels;
            await this.db.query(`UPDATE guilds SET voicechannels = $1 WHERE guildid = $2`, [
                this.guilds[guildid].voicechannels,
                guildid,
            ]);
        }
    }
    async storeVoiceChannel(guildid, channelid, channel) {
        if (!this.guilds[guildid]) {
            let guild = newGuild;
            guild.guildid = guildid;
            guild.voicechannels[channelid] = channel;
            await this.addGuild(guild);
        }
        else {
            console.log(`storeVoiceChannel: ${channelid} : ${channel.id} :\n ${JSON.stringify(this.guilds[guildid].voicechannels)}`);
            this.guilds[guildid].voicechannels[channelid] = channel;
            await this.db.query(`UPDATE guilds SET voicechannels = $1 WHERE guildid = $2`, [
                this.guilds[guildid].voicechannels,
                guildid,
            ]);
        }
    }
    async addGuild(guild) {
        console.log(`addGuild`);
        if (!this.guilds[guild.guildid]) {
            if (!guild.voicechannels) {
                guild.voicechannels = newGuild.voicechannels;
            }
            if (!guild.textchannels) {
                guild.textchannels = newGuild.textchannels;
            }
            if (!guild.settings) {
                guild.settings = newGuild.settings;
            }
            this.guilds[guild.guildid] = guild;
            this.db.query(`INSERT INTO guilds(guildid, voicechannels, textchannels, settings) VALUES($1, $2, $3, $4) RETURNING *`, [guild.guildid, guild.voicechannels, guild.textchannels, guild.settings]);
        }
        return null;
    }
}
exports.store = store;
exports.default = store;
