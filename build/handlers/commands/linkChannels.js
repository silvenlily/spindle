"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkChannels = void 0;
const newChannelSettings_1 = require("./newChannelSettings");
async function linkChannels(msg, bot, Store) {
    let member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
    if (member.permissions.has(`manageGuild`)) {
        if (member.voiceState && member.voiceState.channelID) {
            let channel = await Store.fetchVoiceChannel(msg.guildID, member.voiceState.channelID);
            if (!channel) {
                channel = newChannelSettings_1.newVoice;
            }
            if (channel.linkedTextChannels[msg.channel.id]) {
                bot.createMessage(msg.channel.id, "These channels are already linked. You can unlink them with |unlink.");
                return;
            }
            channel.linkedTextChannels[msg.channel.id] = { dynamic: false };
            Store.storeVoiceChannel(msg.guildID, member.voiceState.channelID, channel);
            bot.createMessage(msg.channel.id, `Linked voice channel ${member.voiceState.channelID} to <#${msg.channel.id}>.`);
        }
        else {
            bot.createMessage(msg.channel.id, `You must be in the voice channel you want to link, and the bot must be able to see that channel.`);
        }
    }
    else {
        bot.createMessage(msg.channel.id, `You don't have permssion to do this, you need \`Manage Server\`.`);
    }
}
exports.linkChannels = linkChannels;
exports.default = linkChannels;