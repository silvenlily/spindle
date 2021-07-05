import type eris from "eris";
import type store from "../../libs/store";

async function prefix(msg: any, args: Array<any>, bot: eris.Client, Store: store) {
  if (typeof args != "string") {
    let member: eris.Member = (
      await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] })
    )[0];

    if (member.permissions.has(`manageGuild`)) {
      let settings = await Store.fetchGuildSettings(msg.guildID);
      settings.prefix = args[1];
      Store.storeGuildSettings(msg.guildID, settings);
      bot.createMessage(msg.channel.id, `Prefix updated! New prefix: ${settings.prefix}`);
    } else {
      bot.createMessage(
        msg.channel.id,
        `You don't have permssion to do this, you need \`Manage Server\`.`
      );
    }
  } else {
    let member: eris.Member = (
      await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] })
    )[0];

    if (member.permissions.has(`manageGuild`)) {
      let settings = await Store.fetchGuildSettings(msg.guildID);
      settings.prefix = "|";
      Store.storeGuildSettings(msg.guildID, settings);
      bot.createMessage(msg.channel.id, `Prefix updated! New prefix: ${settings.prefix}`);
    } else {
      bot.createMessage(
        msg.channel.id,
        `You don't have permssion to do this, you need \`Manage Server\`.`
      );
    }
  }
}

export { prefix };
export default prefix;
