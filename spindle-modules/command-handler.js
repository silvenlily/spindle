async function handler(bot,msg,guildCashe,db){
  if(msg.channel.type === 0){
    console.log('prefix: '+guildCashe[msg['guildID']]['prefix'])
    if(msg.content.substring(0,(guildCashe[msg['guildID']]['prefix']).length) === guildCashe[msg['guildID']]['prefix']) {
      console.log('command: '+msg.content)

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
          addVoiceLink(args,msg,guildCashe,bot,db)
          break;
        case 'prefix':
          console.log('cmd: prefix')

      }
    }
  }
}

async function addVoiceLink(args,msg,guildCashe,bot,db){
  let options = {'userIDs':msg.author.id}
  let guild = msg.channel.guild
  let member = guild.fetchMembers(options);
  member = (await member)[0];
  if(member.permission.has('manageChannels')){
    if(member.voiceState.channelID != null){
      let voiceChannel = member.voiceState.channelID
      let textChannel = msg.channel.id
      console.log("linking channel: "+voiceChannel+" to: "+textChannel)
      guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = textChannel
      if(!guildCashe[guild['id']]['linkedChannels']['enabled']){
        guildCashe[guild['id']]['linkedChannels']['enabled'] = true
      }
      console.log("guild id: " + guild.id +'\nguild cashe: ' + JSON.stringify(guildCashe[guild['id']]))
      db.query('UPDATE servers SET settings = $1 WHERE id = ($2)',[JSON.stringify(guildCashe[guild['id']]),guild.id])
      bot.createMessage(msg.channel.id,"Linked text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel)
    }
  }
}

exports.handler = handler;
