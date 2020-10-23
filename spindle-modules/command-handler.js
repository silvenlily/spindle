
const voiceLink = require('./voicelink-handler.js')

async function handler(bot,msg,guildCashe,db,config){
  if(msg.channel.type === 0){
    if(msg.content.substring(0,(guildCashe[msg['guildID']]['prefix']).length) === guildCashe[msg['guildID']]['prefix']) {
      let args = msg.content.substring((guildCashe[msg['guildID']]['prefix']).length)
      if(args.includes(" ")) {
        args = args.split(" ",8);
        command = args[0]
      } else {
        command = args
      }
      console.log('command: ' + command)
      switch (command) {
        case 'help':
          console.log('cmd: help')
          bot.createMessage(msg.channel.id,"Join a voice channel and use **"+guildCashe[msg['guildID']]['prefix'] + 'link** in the channel you wish to link! The bot must have the ability to Manage Permissions for the text channel you link.\n \n Set the channel permissions to the permissions you want users to have in that channel, except with **View Channel** disabled. When a user joins the linked voice channel it will automaticly add a permission overwride for that user to view the channel, then remove that overwride when they leave. You can remove a channel link by following the same process used to create one. **You can only use the link command if you have the admin permission.**\n \nYou can set your servers prefix using [coming soon]')
          break;
        case 'link':
          console.log('cmd: link')
          voiceLink.addVoiceLink(args,msg,guildCashe,bot,db,config['maxLinkedChannels'])
          break;
        case 'unlink':
          console.log('cmd: unlink')
          voiceLink.removeVoiceLink(args,msg,guildCashe,bot,db)
        case 'prefix':
          console.log('cmd: prefix')
          break;
      }
    }
  }
}



exports.handler = handler;
