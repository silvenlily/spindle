const guildHandler = require("./guild-handler.js");
const voiceLink = require("./voicelink-handler.js");

async function handler(bot, msg, guildCashe, db, config) {
  if (msg.channel.type === 0) {
    if (
      msg.content.substring(0, guildCashe[msg["guildID"]]["prefix"].length) ===
      guildCashe[msg["guildID"]]["prefix"]
    ) {
      let args = msg.content.substring(
        guildCashe[msg["guildID"]]["prefix"].length
      );
      if (args.includes(" ")) {
        args = args.split(" ", 8);
        command = args[0];
      } else {
        command = args;
      }
      console.log("command: " + command);
      switch (command) {
        case "help":
          console.log("cmd: help");
          bot.createMessage(
            msg.channel.id,
            "Join a voice channel and use **" +
              guildCashe[msg["guildID"]]["prefix"] +
              "link** in the channel you wish to link! The bot must have the ability to Manage Permissions for the text channel you link. Set the channel permissions to the permissions you want users to have in that channel, except with **View Channel** disabled. When a user joins the linked voice channel it will automaticly add a permission overwride for that user to view the channel, then remove that overwride when they leave. You can remove a channel link by following the same process used to create one, but with the **" +
              guildCashe[msg["guildID"]]["prefix"] +
              "unlink**. You can only use the link or unlink commands if you have the Manage Channels permission."
          );
          break;
        case "resetChannel":
          voiceLink.resetChannel(bot,msg,args,guildCashe)
          break;
        case "link":
          console.log("cmd: link");
          voiceLink.addVoiceLink(
            args,
            msg,
            guildCashe,
            bot,
            db,
            config["maxLinkedChannels"]
          );
          break;
        case "unlink":
          console.log("cmd: unlink");
          voiceLink.removeVoiceLink(args, msg, guildCashe, bot, db);
        case "prefix":
          console.log("cmd: prefix");
          break;
        //case 'update':
        //  updateGuildCashe(db,bot,msg,guildCashe)
        //  console.log('cmd: update guild')
        //  break;
        case "d.guilds":
          debugManager.guilds.number(bot, msg);
          break;
        case "d.guilds.list":
          debugManager.guilds.list(bot, msg);
          break;
        case "d.guildSettings":
          debugManager.guildSettings(bot, msg, guildCashe);
          break;
      }
    }
  }
}

const debugManager = {
  guilds: {
    number: async function (bot, msg) {
      if ((msg.author.id = "229331045726552066")) {
        bot.createMessage(
          msg.channel.id,
          "guildCashe: " + Object.keys(guildCashe).length
        );
      }
    },
    list: async function (bot, msg) {
      if ((msg.author.id = "229331045726552066")) {
        let guildsArray = bot.guilds.filter(() => {
          return true;
        });
        let guildsString = "guildCashe: ";
        for (let i = 0; i < guildsArray.length; i++) {
          guildsString = `${guildsString} \n${guildsArray[i]["name"]}`;
        }
        bot.createMessage(msg.channel.id, guildsString);
      }
    },
  },
  guildSettings: async function (bot, msg, guildCashe) {
    bot.createMessage(
      msg.channel.id,
      "guild: ```json\n" +
        JSON.stringify(guildCashe[msg.guildID], null, 2) +
        "\n```"
    );
  },
};

async function updateGuildCashe(db, bot, msg, guildCashe) {
  let member = msg.channel.guild.fetchMembers({ userIDs: msg.author.id });
  member = (await member)[0];
  if (
    member.permission.has("manageChannels") ||
    msg.author.id === "229331045726552066"
  ) {
    guildCashe[msg.guildID] = JSON.parse(guildHandler.defaultServerConfig);
    console.log(guildHandler.defaultServerConfig);
    bot.createMessage(
      msg.channel.id,
      "Updated and reset your servers settings"
    );
    db.query("UPDATE servers SET settings = $1 WHERE id = ($2)", [
      JSON.stringify(guildCashe[msg.guildID]),
      msg.guildID,
    ]);
  }
}

exports.handler = handler;
