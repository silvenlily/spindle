const fs = require('fs')
const path = './guild-cashe'

async function newGuild(guild,db,guildCashe,prefix){
  console.log("adding new guild")
  newguild = '{"prefix":"|","linkedChannels":{"enabled":true,"channels":{}},"customChannels":{"enabled":false,"catagorys":{},"channels":{}}}'
  db.query('INSERT INTO servers (id,settings) VALUES ($1,$2)',[guild['id'],JSON.parse(newguild)])
  return newguild
}

exports.newGuild = newGuild;
