

async function syncVoiceChannels(){

}

async function switchVoice(oldChannel,newChannel,user,guildCashe){
  enterVoice(newChannel,user,guildCashe)
  exitVoice(oldChannel,user,guildCashe)
}

async function enterVoice(newChannel,user,guildCashe){
  console.log('user ' + user.id + ' joined channel ' + newChannel.id)
  if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]){
    console.log('new channel a is linked channel')
    if((guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]).length = 1){
      let textChannels = await newChannel.guild.channels.find( (item) => {
        if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']][item['id']]){
          return true;
        }});
      } else {
        let textChannels = await newChannel.guild.channels.find( (item) => {
          for (var i = 0; i < guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']].length; i++) {
            if (guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']][i] = item.id){
              return true
            }
          }
        }
      }
    console.log('linked channels: ' + textChannels)
    if(Array.isArray(textChannels)){
      for (var i = 0; i < textChannels.length; i++) {
        textChannels[i].editPermission(user.id,1024,0,'member')
      }
    } else {
      textChannels.editPermission(user.id,1024,0,'member')
    }
  }
}

async function exitVoice(oldChannel,user,guildCashe){
  console.log('user ' + user.id + ' left channel ' + oldChannel.id)
  if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    console.log('old channel a is linked channel')
    let textChannels = await oldChannel.guild.channels.find( (item) => {
      if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']][item['id']]){
        return true;
      } else {
        return false;
      }});
    console.log('linked channels: ' + textChannels)
    if(Array.isArray(textChannels)){
      for (var i = 0; i < textChannels.length; i++) {
        console.log('test1: ' + textChannels[i])
        textChannels[i].deletePermission(user.id)
      }
    } else {
      console.log('test2: ' + textChannels)
      textChannels.deletePermission(user.id)
    }
  }
}

async function addVoiceLink(args,msg,guildCashe,bot,db,maxChannels){
  let options = {'userIDs':msg.author.id}
  let guild = msg.channel.guild
  let member = guild.fetchMembers(options);
  member = (await member)[0];
  if(member.permission.has('manageChannels') || member.id){
    if(member.voiceState.channelID != null){
      let voiceChannel = member.voiceState.channelID
      let textChannel = msg.channel.id
      console.log("linking voice channel: "+voiceChannel+" to text channel: "+textChannel)
      if(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]){
          if(Array.isArray(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel])){
            if((guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length <= maxChannels){
              (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).push(textChannel)
              bot.createMessage(msg.channel.id,"Linked additional text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
            } else {
              console.log('currently linked channels: ' + (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length)
              bot.createMessage(msg.channel.id,"Unable to link this channel. You have already linked the maximum number of channels linked to that voice channel.");
            }
          } else {
            guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel][0] = guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]
            guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel][1] = textChannel
            bot.createMessage(msg.channel.id,"Linked additional text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
          }
      } else {
        guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = [textChannel]
        bot.createMessage(msg.channel.id,"Linked text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
      }
      if(!guildCashe[guild['id']]['linkedChannels']['enabled']){
        guildCashe[guild['id']]['linkedChannels']['enabled'] = true
      }
      console.log("guild id: " + guild.id +'\nguild cashe: ' + JSON.stringify(guildCashe[guild['id']]))
      db.query('UPDATE servers SET settings = $1 WHERE id = ($2)',[JSON.stringify(guildCashe[guild['id']]),guild.id])
    } else {
      bot.createMessage(msg.channel.id,"You must be in a voice channel that I have permission to see to be able to link channels.");
    }
  }
}

async function removeVoiceLink(args,msg,guildCashe,bot,db){

}

exports.addVoiceLink = addVoiceLink;
exports.syncVoiceChannels = syncVoiceChannels;
exports.exitVoice = exitVoice;
exports.enterVoice = enterVoice;
exports.switchVoice = switchVoice;
