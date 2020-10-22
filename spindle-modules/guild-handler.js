const fs = require('fs')
const path = './guild-cashe'


async function fetchGuilds(){
  if(fs.existsSync(path)){
    console.log('guild cashe found');
    let config = fs.readFileSync(path,'utf8');
    return JSON.parse(config);
  } else {
    console.log('guild cashe not found, generating new empty guild cashe')
    let data = JSON.stringify({}, null, 2);
    fs.writeFileSync(path,data)
    let config = fs.readFileSync(path,'utf8');
    return JSON.parse(config);
  }
}

async function newGuild(guild,guildCashe,defaultSettings){

}




exports.fetchGuilds = fetchGuilds;
exports.newGuild = newGuild;
