"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceLeaveHandler = exports.voiceJoinHandler = exports.voiceSwitchHandler = exports.voiceHandler = void 0;
const channelLink_1 = __importDefault(require("./voiceHandlers/channelLink"));
const dynamicText_1 = __importDefault(require("./voiceHandlers/dynamicText"));
async function handleVoiceExit(member, channel, Store) {
    let channelSettings = await Store.fetchVoiceChannel(channel.guild.id, channel.id);
    if (channelSettings) {
        if (channelSettings.channelLink) {
            channelLink_1.default.removeChannel(member, channel, channelSettings);
        }
        if (channelSettings.enableDynamicText) {
            dynamicText_1.default.userLeave(member, channel, channelSettings, Store);
        }
    }
}
async function handleVoiceEnter(member, channel, Store) {
    let channelSettings = await Store.fetchVoiceChannel(channel.guild.id, channel.id);
    if (channelSettings) {
        if (channelSettings.channelLink) {
            channelLink_1.default.addChannel(member, channel, channelSettings);
        }
        if (channelSettings.enableDynamicText) {
            dynamicText_1.default.userJoin(member, channel, channelSettings, Store);
        }
    }
}
async function voiceSwitchHandler(member, oldChannel, newChannel, Store) {
    handleVoiceExit(member, oldChannel, Store);
    handleVoiceEnter(member, newChannel, Store);
}
exports.voiceSwitchHandler = voiceSwitchHandler;
async function voiceLeaveHandler(member, channel, Store) {
    handleVoiceExit(member, channel, Store);
}
exports.voiceLeaveHandler = voiceLeaveHandler;
async function voiceJoinHandler(member, channel, Store) {
    handleVoiceEnter(member, channel, Store);
}
exports.voiceJoinHandler = voiceJoinHandler;
const voiceHandler = { voiceSwitchHandler, voiceJoinHandler, voiceLeaveHandler };
exports.voiceHandler = voiceHandler;
exports.default = voiceHandler;
