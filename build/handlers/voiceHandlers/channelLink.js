"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeChannel = exports.addChannel = exports.voiceHandler = void 0;
async function addChannel(member, channel, channelSettings) {
    channel.guild.channels.forEach((element) => {
        if (channelSettings.linkedTextChannels[element.id]) {
            element.editPermission(member.id, 1024, 0, "member");
        }
    });
}
exports.addChannel = addChannel;
async function removeChannel(member, channel, channelSettings) {
    channel.guild.channels.forEach(async (element) => {
        if (channelSettings.linkedTextChannels[element.id]) {
            element.deletePermission(member.id);
        }
    });
}
exports.removeChannel = removeChannel;
const voiceHandler = { addChannel, removeChannel };
exports.voiceHandler = voiceHandler;
exports.default = voiceHandler;
