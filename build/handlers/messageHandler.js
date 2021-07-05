"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const linkChannels_1 = __importDefault(require("./commands/linkChannels"));
const unlinkChannels_1 = __importDefault(require("./commands/unlinkChannels"));
const prefix_1 = __importDefault(require("./commands/prefix"));
const helpMsg_1 = __importDefault(require("./commands/helpMsg"));
const dynamicText_1 = __importDefault(require("./commands/dynamicText"));
async function messageHandler(msg, bot, Store) {
    if (!msg.author.bot && msg.author.id != bot.user.id) {
        if (msg.channel.type === 0) {
            if (!Store.guilds[msg.channel.guild.id]) {
                await Store.addGuild({ guildid: msg.guildID });
            }
            if (msg.content.substring(0, Store.guilds[msg["guildID"]].settings.prefix.length) ===
                Store.guilds[msg.guildID].settings.prefix) {
                let args = msg.content.substring(Store.guilds[msg["guildID"]].settings.prefix.length);
                let command = "";
                if (args.includes(" ")) {
                    args = args.split(" ", 8);
                    command = args[0];
                }
                else {
                    command = args;
                }
                switch (command) {
                    case "ping":
                        bot.createMessage(msg.channel.id, `pong`);
                        break;
                    case "prefix":
                        prefix_1.default(msg, args, bot, Store);
                        break;
                    case "link":
                        linkChannels_1.default(msg, bot, Store);
                        break;
                    case "unlink":
                        unlinkChannels_1.default(msg, bot, Store);
                        break;
                    case "dynamic":
                        dynamicText_1.default(msg, bot, Store);
                        break;
                    case "help":
                        bot.createMessage(msg.channel.id, helpMsg_1.default);
                        break;
                    case "db-s":
                        console.log(`${JSON.stringify(Store.guilds[msg.guildID], null, 2)}`);
                        break;
                }
            }
        }
    }
}
exports.messageHandler = messageHandler;
exports.default = messageHandler;
