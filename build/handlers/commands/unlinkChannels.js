"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkChannels = void 0;
async function unlinkChannels(msg, bot, Store) {
    let member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
    if (member.permissions.has(`manageGuild`)) {
        if (member.voiceState && member.voiceState.channelID) {
            let channel = await Store.fetchVoiceChannel(msg.guildID, member.voiceState.channelID);
            if (!channel || !channel.linkedTextChannels[msg.channel.id]) {
                bot.createMessage(msg.channel.id, "These channels are not linked. You can link them with |link.");
                return;
            }
            delete channel.linkedTextChannels[msg.channel.id];
            if ((Object.keys(channel.linkedTextChannels).length = 0)) {
                let voiceChannels = await Store.fetchGuildVoiceChannels(msg.guildID);
                delete voiceChannels[member.voiceState.channelID];
                Store.storeGuildVoiceChannels(msg.guildID, voiceChannels);
            }
            Store.storeVoiceChannel(msg.guildID, member.voiceState.channelID, channel);
            bot.createMessage(msg.channel.id, `Unlinked voice channel ${member.voiceState.channelID} from <#${msg.channel.id}>.`);
        }
        else {
            bot.createMessage(msg.channel.id, `You must be in the voice channel you want to unlink, and the bot must be able to see that channel.`);
        }
    }
    else {
        bot.createMessage(msg.channel.id, `You don't have permssion to do this, you need \`Manage Server\`.`);
    }
}
exports.unlinkChannels = unlinkChannels;
exports.default = unlinkChannels;
