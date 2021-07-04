import eris from "eris";
import pg from "pg";

import loadConfig from "./libs/loadConf";
import validators from "./libs/confValidators";
import StoreLib from "./libs/store";

import messageHandler from "./handlers/messageHandler";
import voiceHandlerLib from "./handlers/voiceHandler";

let tokens: any = loadConfig(`./config/tokens.json`, validators.tokens);
let config: any = loadConfig(`./config/config.json`, validators.config);

let voiceHandler = new voiceHandlerLib(config);

let Store = new StoreLib(tokens.pg);

let bot = eris(tokens.discord);

bot.on("ready", () => {
  console.log("ready!");
});

bot.on("messageCreate", (msg) => {
  messageHandler(msg, bot);
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
