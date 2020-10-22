const fs = require('fs')
const path = './guild-cashe'

async function fetchGuilds(){

}

async function newGuild(guild,db,guildCashe,prefix){
  newguild = '{"prefix":"|","linkedChannels":{"enabled":false,"channels":{}},"customChannels":{"enabled":false,"catagorys":{},"channels":{}}}'
  db.query('INSERT INTO servers (id,settings) VALUES ($1,$2)',[guild['id'],JSON.parse(newguild)])
  return newguild
}

exports.fetchGuilds = fetchGuilds;
exports.newGuild = newGuild;
