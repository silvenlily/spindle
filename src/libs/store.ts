import pg from "pg";

async function merge(base: any, changes: any) {
  let changeKeys = Object.keys(changes);
}

class store {
  guilds: any;
  pg: pg.Client;
  cacheAllGuilds: boolean;
  constructor(pgURI: string, cacheAllGuilds?: boolean) {
    if (cacheAllGuilds) {
      this.cacheAllGuilds = cacheAllGuilds;
    } else {
      this.cacheAllGuilds = true;
    }

    this.pg = new pg.Client();
  }

  async fetchGuild(guildid: string) {}
  async storeGuild(guildid: string, changes: any) {}
  async fetchChannel(guildid: string, channelid: string) {}
  async storeChannel(guildid: string, channelid: string, changes: any) {}
}

export { store };
export default store;
