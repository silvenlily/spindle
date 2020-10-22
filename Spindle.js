const configHandler = require('./spindle-modules/config-handler.js');
const menuHandler = require ('./spindle-modules/menu-handler.js');
const commandHandler = require ('./spindle-modules/command-handler.js')
const guildHandler = require ('./spindle-modules/guild-handler.js')

var guildCashe = guildHandler.fetchGuilds();
var config = configHandler.fetchConfig();
var tokens = configHandler.fetchTokens();

let Eris = require('eris')
let postGres = require('pg')

let bot = new Eris(tokens.discord);
let db = new postGres.Client(tokens.database)

if (tokens.discord === configHandler.defaultTokens.discord || !(tokens.discord)){
  console.log("**********************************************************************\n****** please place your discord bot token into the tokens file ******\n**********************************************************************")
} else if (tokens.database === configHandler.defaultTokens.database || !(tokens.database)) {
  console.log("**********************************************************************\n**** please place your postgres database url into the tokens file ****\n**********************************************************************")
} else {
  console.log("connecting to postgres...")
  db.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres ", err);
  } else {
    console.log("connected!\nconnecting to discord...")
    bot.connect();
  }
});
}

bot.on("ready", async () => {
  console.log("connected!\nready!");
});

bot.on("guildCreate", async (guild) => { //adds a new
  //guildCashe[guild[id]] = {"linkedChannels":{"enabled":false,"channels":{}},"customChannels":{"enabled":false,"catagorys":{},"channels":{}}}
});

//bot.on("messageReactionAdd", async (msg, reaction, userID) => { /*place menu handler here*/ });

bot.on("messageCreate", async (msg) => {
  if(msg.content.substring(0,1) === config.commandChar) {
    commandHandler.handler(bot,msg,config,guilds)
  }
});
