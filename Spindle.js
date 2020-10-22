const configHandler = require('./spindle-modules/config-handler.js');
const menuHandler = require ('./spindle-modules/menu-handler.js');
const commandHandler = require ('./spindle-modules/command-handler.js')
const serverHandler = require ('./spindle-modules/server-handler.js')

var servers = serverHandler.fetchServers();
var config = configHandler.fetchConfig();
var tokens = configHandler.fetchTokens();

let Eris = require('eris')

let bot = new Eris(tokens.discord);

if (tokens.discord === configHandler.defaultTokens.discord){
  console.log("**********************************************************************\n****** please place your discord bot token into the tokens file ******\n**********************************************************************")
} else {
  console.log("connecting...")
  bot.connect();
}


bot.on("ready", () => {
  console.log("connected!");
});


bot.on("guildCreate", (guild) => { //adds a new 
  serverHandler.newGuild(guild)
});



//bot.on("messageReactionAdd", async (msg, reaction, userID) => { /*place menu handler here*/ });

bot.on("messageCreate", async (msg) => {
  if(msg.content.substring(0,1) === config.commandChar) {
    commandHandler.handler(bot,msg,config,servers)
  }
});
