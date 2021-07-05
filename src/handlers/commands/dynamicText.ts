import type eris from "eris";
import type store from "../../libs/store";
import { newVoice } from "./newChannelSettings";

async function disableDynamicText(
  msg: any,
  channel: any,
  member: eris.Member,
  bot: eris.Client,
  Store: store
) {
  if (member.voiceState.channelID) {
    if (!channel) {
      channel = newVoice;
    }

    channel.enableDynamicText = false;
    Store.storeVoiceChannel(msg.guildID, member.voiceState.channelID, channel);

    bot.createMessage(
      msg.channel.id,
      `Disabled dynamic voice for channel ${member.voiceState.channelID}.`
    );
  }
}

async function enableDynamicText(
  msg: any,
  channel: any,
  member: eris.Member,
  bot: eris.Client,
  Store: store
) {
  console.log(``);
  if (member.voiceState.channelID) {
    if (!channel) {
      channel = newVoice;
    }

    channel.enableDynamicText = true;

    if (!channel.dynamicTextChannelSettings) {
      let voiceChannel: eris.VoiceChannel = msg.channel.guild.channels.find((element: any) => {
        if (element.id == member.voiceState.channelID) {
          return true;
        } else {
          return false;
        }
      });

      channel.dynamicTextChannelSettings = {
        name: `${voiceChannel.name.replace(/ /g, "-")}-text`,
        options: {
          permissionOverwrites: [],
          topic:
            "This channel will automaticly be created when the first person joins the corresponding channel and removed when the last person leaves.",
        },
      };
      if (voiceChannel.parentID) {
        channel.dynamicTextChannelSettings.parentID = voiceChannel.parentID;
      }
    }

    channel.enableDynamicText = true;
    Store.storeVoiceChannel(msg.guildID, member.voiceState.channelID, channel);

    bot.createMessage(
      msg.channel.id,
      `Enabled dynamic voice for channel ${member.voiceState.channelID}.`
    );
  }
}

async function toggleDynamicText(msg: any, bot: eris.Client, Store: store) {
  let member: eris.Member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
  if (member.permissions.has(`manageGuild`)) {
    if (member.voiceState && member.voiceState.channelID) {
      let channel = await Store.fetchVoiceChannel(msg.guildID, member.voiceState.channelID);

      if (channel == null) {
        enableDynamicText(msg, channel, member, bot, Store);
        return;
      }

      if (channel.enableDynamicText) {
        disableDynamicText(msg, channel, member, bot, Store);
      } else {
        enableDynamicText(msg, channel, member, bot, Store);
      }
    } else {
      bot.createMessage(
        msg.channel.id,
        `You must be in the voice channel you want to enable dynamic text for, and the bot must be able to see that channel.`
      );
    }
  } else {
    bot.createMessage(
      msg.channel.id,
      `You don't have permssion to do this, you need \`Manage Server\`.`
    );
  }
}

export { toggleDynamicText };
export default toggleDynamicText;