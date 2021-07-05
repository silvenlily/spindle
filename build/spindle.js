"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = __importDefault(require("eris"));
const loadConf_1 = __importDefault(require("./libs/loadConf"));
const confValidators_1 = __importDefault(require("./libs/confValidators"));
const store_1 = __importDefault(require("./libs/store"));
const messageHandler_1 = __importDefault(require("./handlers/messageHandler"));
const voiceHandler_1 = __importDefault(require("./handlers/voiceHandler"));
let tokens = loadConf_1.default(`./config/tokens.json`, confValidators_1.default.tokens);
let config = loadConf_1.default(`./config/config.json`, confValidators_1.default.config);
let Store = new store_1.default(tokens.pg);
let bot = eris_1.default(tokens.discord);
bot.on("ready", async () => {
    Store.finishedInit = await Store.finishedInit;
    bot.guilds.forEach((guild) => {
        if (!Store.guilds[guild.id]) {
            Store.addGuild({ guildid: guild.id });
            console.log(`Loaded new guild: ${guild.name}`);
        }
        else {
            console.log(`Loaded guild: ${guild.name}`);
        }
    });
    console.log("ready!");
});
bot.on("guildCreate", async (guild) => {
    console.log(`ng: ${guild.name}`);
    if (!(await Store.fetchGuild(guild.id))) {
        console.log(`Loaded new guild: ${guild.name}`);
        Store.addGuild({ guildid: guild.id });
    }
});
bot.on("messageCreate", (msg) => {
    messageHandler_1.default(msg, bot, Store);
});
bot.on("voiceChannelJoin", (member, channel) => {
    voiceHandler_1.default.voiceJoinHandler(member, channel, Store);
});
bot.on("voiceChannelLeave", (member, channel) => {
    voiceHandler_1.default.voiceLeaveHandler(member, channel, Store);
});
bot.on("voiceChannelSwitch", (member, newChannel, oldChannel) => {
    voiceHandler_1.default.voiceSwitchHandler(member, oldChannel, newChannel, Store);
});
bot.connect();
