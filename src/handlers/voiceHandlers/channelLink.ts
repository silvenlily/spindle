import type eris from "eris";

async function addChannel(member: eris.Member, channel: eris.GuildChannel, channelSettings: any) {
  channel.guild.channels.forEach((element: any) => {
    if (channelSettings.linkedTextChannels[element.id]) {
      element.editPermission(member.id, 1024, 0, "member");
    }
  });
}

async function removeChannel(
  member: eris.Member,
  channel: eris.GuildChannel,
  channelSettings: any
) {
  channel.guild.channels.forEach(async (element: any) => {
    if (channelSettings.linkedTextChannels[element.id]) {
      element.deletePermission(member.id);
    }
  });
}

const voiceHandler = { addChannel, removeChannel };
export { voiceHandler, addChannel, removeChannel };
export default voiceHandler;
