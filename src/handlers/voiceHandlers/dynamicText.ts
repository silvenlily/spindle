import type eris from "eris";
import type store from "../../libs/store";

async function userJoin(
  member: eris.Member,
  channel: eris.VoiceChannel,
  channelSettings: any,
  Store: store
) {
  console.log(`asdfasdf`);
  let textChannel: eris.TextChannel | undefined;
  if (channelSettings.dynamicTextChannel) {
    textChannel = channel.guild.channels.find((channel) => {
      if (channel.id == channelSettings.dynamicTextChannel) {
        return true;
      } else {
        return false;
      }
    }) as eris.TextChannel;
  }
  if (textChannel) {
    console.log(`add member to dynamic channel ${textChannel.name}`);
    textChannel.editPermission(member.id, 1024, 0, "member");
  } else {
    console.log("createDyamicChannel");
    let txt = await channel.guild.createChannel(
      channelSettings.dynamicTextChannelSettings.name,
      0,
      channelSettings.dynamicTextChannelSettings.options
    );

    channelSettings.dynamicTextChannel = txt.id;
    txt.editPermission(member.id, 1024, 0, "member");
    Store.storeVoiceChannel(channel.guild.id, channel.id, channelSettings);
    return;
  }
}

async function userLeave(
  member: eris.Member,
  channel: eris.VoiceChannel,
  channelSettings: any,
  Store: store
) {
  let textChannel: eris.TextChannel = channel.guild.channels.find((channel) => {
    if (channel.id == channelSettings.dynamicTextChannel) {
      return true;
    }
    return false;
  }) as eris.TextChannel;
  if (textChannel) {
    if (channel.voiceMembers.size == 0) {
      console.log(`destroy dyamic channel: ${textChannel.name}`);

      channelSettings.dynamicTextChannelSettings = {
        name: textChannel.name,
        options: {
          nsfw: textChannel.nsfw,
          parentID: textChannel.parentID,
          permissionOverwrites: [],
          rateLimitPerUser: textChannel.rateLimitPerUser,
          topic: textChannel.topic,
        },
      };

      channelSettings.dynamicTextChannelSettings.permissionOverwrites =
        textChannel.permissionOverwrites.map((overwrite) => {
          return overwrite;
        });

      channelSettings.dynamicTextChannel = null;
      Store.storeVoiceChannel(channel.guild.id, channel.id, channelSettings);
      await textChannel.deletePermission(member.id);
      await textChannel.delete();
    } else {
      console.log(`remove user from dynamic channel: ${textChannel.name}`);
      textChannel.deletePermission(member.id);
    }
  }
}

const voiceHandler = { userJoin, userLeave };
export {};
export default voiceHandler;
