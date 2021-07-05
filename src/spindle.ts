import eris from "eris";

import loadConfig from "./libs/loadConf";
import validators from "./libs/confValidators";
import StoreLib, { store } from "./libs/store";

import messageHandler from "./handlers/messageHandler";
import voiceHandler from "./handlers/voiceHandler";

let tokens: any = loadConfig(`./config/tokens.json`, validators.tokens);
let config: any = loadConfig(`./config/config.json`, validators.config);

let Store = new StoreLib(tokens.pg);

let bot = eris(tokens.discord);

bot.on("ready", async () => {
  Store.finishedInit = await Store.finishedInit;
  bot.guilds.forEach((guild) => {
    if (!Store.guilds[guild.id]) {
      Store.addGuild({ guildid: guild.id });
      console.log(`Loaded new guild: ${guild.name}`);
    } else {
      console.log(`Loaded guild: ${guild.name}`);
    }
  });

  bot.editStatus(`online`, { name: `|help - now V2!`, type: 2 });

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
  messageHandler(msg, bot, Store);
});

bot.on("voiceChannelJoin", (member, channel) => {
  voiceHandler.voiceJoinHandler(member, channel, Store);
});

bot.on("voiceChannelLeave", (member, channel) => {
  voiceHandler.voiceLeaveHandler(member, channel, Store);
});

bot.on("voiceChannelSwitch", (member, newChannel, oldChannel) => {
  voiceHandler.voiceSwitchHandler(member, oldChannel, newChannel, Store);
});

bot.connect();
