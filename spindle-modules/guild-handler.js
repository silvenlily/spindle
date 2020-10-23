const fs = require('fs')
const path = './guild-cashe'
const defaultServerConfig = '{"prefix":"|","linkedChannels":{"enabled":true,"channels":{}},"customChannels":{"enabled":false,"catagorys":{},"channels":{}}}'

async function newGuild(guild,db,guildCashe,prefix){
  console.log("adding new guild")
  db.query('INSERT INTO servers (id,settings) VALUES ($1,$2)',[guild['id'],JSON.parse(defaultServerConfig)])
  return newguild
}

exports.newGuild = newGuild;
exports.defaultServerConfig = defaultServerConfig
