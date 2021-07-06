import pg from "pg";

const newGuild = {
  guildid: "",
  settings: {
    prefix: "|",
  },
  voicechannels: {},
  textchannels: {},
} as {
  guildid: string;
  settings: {
    prefix: string;
  };
  voicechannels: any;
  textchannels: any;
};

class store {
  guilds: any;
  db: pg.Client;
  finishedInit: boolean | Promise<boolean>;
  config: any;
  constructor(pgURI: string, config: any) {
    this.db = new pg.Client(pgURI);
    this.guilds = {};
    this.finishedInit = this.init();
    this.config = config;
  }

  async init() {
    //connect to postgres server or err
    try {
      console.log(`connecting to postgres server...`);
      await this.db.connect();
      console.log(`connected to postgres server!`);
    } catch (error) {
      console.log(
        `Unable to connect to postgres server, likely manformed pg URI or pg server is down: \n${error}`
      );
      process.exit(1);
    }

    //create guilds tabe if it dosnt exist
    await this.db.query(
      "CREATE TABLE IF NOT EXISTS guilds (guildid VARCHAR(18) PRIMARY KEY, voicechannels JSON, textchannels JSON, settings JSON)",
      []
    );

    //add all guilds to cache
    let res = (await this.db.query("SELECT * FROM guilds")).rows;
    res.forEach((guild) => {
      this.guilds[guild.guildid] = guild;
    });
    console.log(`store finished init.`);
    return true;
  }

  async fetchGuildSettings(guildid: string) {
    let guild = await this.fetchGuild(guildid);
    if (guild) {
      return guild.settings;
    } else {
      return null;
    }
  }

  async fetchGuildVoiceChannels(guildid: string) {
    let guild = await this.fetchGuild(guildid);
    if (guild) {
      return guild.voicechannels;
    } else {
      return null;
    }
  }

  async fetchVoiceChannel(guildid: string, channelid: string) {
    let guild = await this.fetchGuild(guildid);

    if (guild) {
      if (guild.voicechannels[channelid]) {
        return guild.voicechannels[channelid];
      } else {
        return null;
      }
    } else {
      this.addGuild({ guildid: guildid });
      return null;
    }
  }

  async fetchGuild(guildid: string) {
    if (this.guilds[guildid]) {
      return this.guilds[guildid];
    } else {
      let guild = newGuild;
      guild.guildid = guildid;
      this.addGuild(guild);
    }
  }

  async setDynamicVoiceChannel(guildID: string, voiceChannelID: string, textChannelID: string) {}

  async storeGuildSettings(guildid: string, settings: any) {
    let guild = await this.fetchGuild(guildid);

    if (!guild) {
      this.addGuild({ guildid: guildid });
    } else {
      this.guilds[guildid].settings = settings;
      await this.db.query(`UPDATE guilds SET settings = $1 WHERE guildid = $2`, [
        settings,
        guildid,
      ]);
    }
  }

  async storeGuildVoiceChannels(guildid: string, channels: any) {
    let guild = await this.fetchGuild(guildid);

    if (!guild) {
      guild = newGuild;
      guild.guildid = guildid;
      guild.voicechannels = channels;
      this.addGuild(guild);
    } else {
      this.guilds[guildid].voicechannels = channels;
      await this.db.query(`UPDATE guilds SET voicechannels = $1 WHERE guildid = $2`, [
        this.guilds[guildid].voicechannels,
        guildid,
      ]);
    }
  }

  async storeVoiceChannel(guildid: string, channelid: string, channel: any) {
    if (!this.guilds[guildid]) {
      let guild = newGuild;
      guild.guildid = guildid;
      guild.voicechannels[channelid] = channel;
      await this.addGuild(guild);
    } else {
      console.log(
        `storeVoiceChannel: ${channelid} : ${channel.id} :\n ${JSON.stringify(
          this.guilds[guildid].voicechannels
        )}`
      );
      this.guilds[guildid].voicechannels[channelid] = channel;
      await this.db.query(`UPDATE guilds SET voicechannels = $1 WHERE guildid = $2`, [
        this.guilds[guildid].voicechannels,
        guildid,
      ]);
    }
  }

  async addGuild(guild: {
    guildid: string;
    voicechannels?: any;
    textchannels?: any;
    settings?: any;
  }) {
    console.log(`addGuild`);
    if (!this.guilds[guild.guildid]) {
      if (!guild.voicechannels) {
        guild.voicechannels = newGuild.voicechannels;
      }
      if (!guild.textchannels) {
        guild.textchannels = newGuild.textchannels;
      }
      if (!guild.settings) {
        guild.settings = newGuild.settings;
      }

      guild.settings.prefix = this.config.prefix;

      this.guilds[guild.guildid] = guild;
      this.db.query(
        `INSERT INTO guilds(guildid, voicechannels, textchannels, settings) VALUES($1, $2, $3, $4) RETURNING *`,
        [guild.guildid, guild.voicechannels, guild.textchannels, guild.settings]
      );
    }
    return null;
  }
}

export { store };
export default store;
