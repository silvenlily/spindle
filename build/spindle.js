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
let voiceHandler = new voiceHandler_1.default(config);
let Store = new store_1.default(tokens.pg);
let bot = eris_1.default(tokens.discord);
bot.on("ready", () => {
    console.log("ready!");
});
bot.on("messageCreate", (msg) => {
    messageHandler_1.default(msg, bot);
});
bot.on("voiceChannelJoin", (member, channel) => {
    voiceHandler.voiceJoinHandler(member, channel);
});
bot.on("voiceChannelLeave", (member, channel) => {
    voiceHandler.voiceLeaveHandler(member, channel);
});
bot.on("voiceChannelSwitch", (member, newChannel, oldChannel) => {
    voiceHandler.voiceSwitchHandler(member, oldChannel, newChannel);
});
bot.connect();
