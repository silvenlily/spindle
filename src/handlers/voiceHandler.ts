import type eris from "eris";

class voiceHandler {
  settings: any;
  constructor(settings: any) {
    this.settings = settings;
  }

  async voiceSwitchHandler(
    member: eris.Member,
    oldChannel: eris.AnyVoiceChannel,
    newChannel: eris.AnyVoiceChannel
  ) {}

  voiceLeaveHandler(member: eris.Member, Channel: eris.AnyVoiceChannel) {}
  voiceJoinHandler(member: eris.Member, Channel: eris.AnyVoiceChannel) {}
}

export { voiceHandler };
export default voiceHandler;
