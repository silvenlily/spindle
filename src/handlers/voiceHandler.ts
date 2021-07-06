import type eris from "eris";
import type store from "../libs/store";
import channelLink from "./voiceHandlers/channelLink";
import dynamicText from "./voiceHandlers/dynamicText";

async function handleVoiceExit(member: eris.Member, channel: eris.AnyVoiceChannel, Store: store) {
  let channelSettings = await Store.fetchVoiceChannel(channel.guild.id, channel.id);
  if (channelSettings) {
    console.log(`ch settings lv: ${JSON.stringify(Store.guilds)}`);
    if (channelSettings.channelLink) {
      channelLink.removeChannel(member, channel, channelSettings);
    }

    if (channelSettings.enableDynamicText) {
      console.log(`user left dynamic channel: ${channelSettings}`);
      dynamicText.userLeave(member, channel, channelSettings, Store);
    }
  }
}

async function handleVoiceEnter(member: eris.Member, channel: eris.AnyVoiceChannel, Store: store) {
  let channelSettings = await Store.fetchVoiceChannel(channel.guild.id, channel.id);
  if (channelSettings) {
    //console.log(`ch settings en: ${JSON.stringify(Store.guilds)}`);
    if (channelSettings.channelLink) {
      channelLink.addChannel(member, channel, channelSettings);
    }
    if (channelSettings.enableDynamicText) {
      dynamicText.userJoin(member, channel, channelSettings, Store);
    }
  }
}

async function voiceSwitchHandler(
  member: eris.Member,
  oldChannel: eris.AnyVoiceChannel,
  newChannel: eris.AnyVoiceChannel,
  Store: store
) {
  handleVoiceExit(member, oldChannel, Store);
  handleVoiceEnter(member, newChannel, Store);
}

async function voiceLeaveHandler(member: eris.Member, channel: eris.AnyVoiceChannel, Store: store) {
  handleVoiceExit(member, channel, Store);
}
async function voiceJoinHandler(member: eris.Member, channel: eris.AnyVoiceChannel, Store: store) {
  handleVoiceEnter(member, channel, Store);
}

const voiceHandler = { voiceSwitchHandler, voiceJoinHandler, voiceLeaveHandler };
export { voiceHandler, voiceSwitchHandler, voiceJoinHandler, voiceLeaveHandler };
export default voiceHandler;
