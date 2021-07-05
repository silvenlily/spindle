import type eris from "eris";
import type store from "../libs/store";
import linkChannels from "./commands/linkChannels";
import unlinkChannels from "./commands/unlinkChannels";
import setPrefix from "./commands/prefix";
import helpMessage from "./commands/helpMsg";
import toggleDynamicText from "./commands/dynamicText";

async function messageHandler(msg: any, bot: eris.Client, Store: store) {
  if (!msg.author.bot && msg.author.id != bot.user.id) {
    if (msg.channel.type === 0) {
      if (!Store.guilds[msg.channel.guild.id]) {
        await Store.addGuild({ guildid: msg.guildID });
      }
      if (
        msg.content.substring(0, Store.guilds[msg["guildID"]].settings.prefix.length) ===
        Store.guilds[msg.guildID].settings.prefix
      ) {
        let args: any = msg.content.substring(Store.guilds[msg["guildID"]].settings.prefix.length);
        let command = "";
        if (args.includes(" ")) {
          args = args.split(" ", 8);
          command = args[0];
        } else {
          command = args;
        }

        switch (command) {
          case "ping":
            bot.createMessage(msg.channel.id, `pong`);
            break;

          case "prefix":
            setPrefix(msg, args, bot, Store);
            break;

          case "link":
            linkChannels(msg, bot, Store);
            break;

          case "unlink":
            unlinkChannels(msg, bot, Store);
            break;

          case "dynamic":
            toggleDynamicText(msg, bot, Store);
            break;

          case "help":
            bot.createMessage(msg.channel.id, helpMessage);
            break;

          case "db-s":
            console.log(`${JSON.stringify(Store.guilds[msg.guildID], null, 2)}`);
            break;
        }
      }
    }
  }
}

export { messageHandler };
export default messageHandler;
