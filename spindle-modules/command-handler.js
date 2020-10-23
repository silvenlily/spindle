async function handler(bot,msg,guildCashe,db){
  if(msg.channel.type === 0){
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
          bot.createMessage(msg.channel.id,"note to lily: add a help message later")
          break;
        case 'ping':
          console.log('cmd: ping')
          bot.createMessage(msg.channel.id,"pong");
          break;
        case 'link':
          console.log('cmd: link')
          addVoiceLink(args,msg,guildCashe,bot,db)
          break;
        case 'status':
          console.log('cmd: status')
          let options = {'userIDs':msg.author.id}
          let guild = msg.channel.guild
          let member = guild.fetchMembers(options);
          member = (await member)[0];
          console.log('status:\n'+JSON.stringify(member))
          break;
        case 'settings':
          console.log("cmd: server")
          break;
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
