import type eris from "eris";
import type store from "../../libs/store";
import { newVoice } from "./newChannelSettings";

async function linkChannels(msg: any, bot: eris.Client, Store: store) {
  let member: eris.Member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
  if (member.permissions.has(`manageGuild`)) {
    if (member.voiceState && member.voiceState.channelID) {
      let channel = await Store.fetchVoiceChannel(msg.guildID, member.voiceState.channelID);

      if (!channel) {
        channel = newVoice;
      }

      if (channel.linkedTextChannels[msg.channel.id]) {
        bot.createMessage(
          msg.channel.id,
          "These channels are already linked. You can unlink them with |unlink."
        );
        return;
      }

      channel.linkedTextChannels[msg.channel.id] = { dynamic: false };
      Store.storeVoiceChannel(msg.guildID, member.voiceState.channelID, channel);
      bot.createMessage(
        msg.channel.id,
        `Linked voice channel ${member.voiceState.channelID} to <#${msg.channel.id}>.`
      );
    } else {
      bot.createMessage(
        msg.channel.id,
        `You must be in the voice channel you want to link, and the bot must be able to see that channel.`
      );
    }
  } else {
    bot.createMessage(
      msg.channel.id,
      `You don't have permssion to do this, you need \`Manage Server\`.`
    );
  }
}

export { linkChannels };
export default linkChannels;
