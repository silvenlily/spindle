

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
    if(Array.isArray(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']])){
      let textChannels = newChannel.guild.channels.find( (item) => {
        if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']][item['id']]){
          return true;
        } else {
          return false;
        }});
        console.log('linked channel: ' + textChannel.name)
        for (var i = 0; i < textChannels.length; i++) {
          textChannels[i].editPermission(user.id,1024,0,'member')
        }
    } else {
      let textChannel = newChannel.guild.channels.find( (item) => {
        if(item.id === guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]){
          return true;
        } else {
          return false;
        }});
      console.log('linked channel: ' + textChannel.name)
      textChannel.editPermission(user.id,1024,0,'member')
    }
  }
}

async function exitVoice(oldChannel,user,guildCashe){
  console.log('user ' + user.id + ' left channel ' + oldChannel.id)
  if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    console.log('old channel a is linked channel')
    if(Array.isArray(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']])){
      let textChannels = oldChannel.guild.channels.find( (item) => {
        if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']][item['id']]){
          return true;
        } else {
          return false;
        }});
        console.log('linked channel: ' + textChannel.name)
        for (var i = 0; i < textChannels.length; i++) {
          textChannels[i].deletePermission(user.id)
        }
    } else {
      let textChannel = oldChannel.guild.channels.find( (item) => {
        if(item.id === guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
          return true;
        } else {
          return false;
        }});
      console.log('linked channel: ' + textChannel.name)
      textChannel.deletePermission(user.id)
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
      if(Array.isArray(guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel])){
        if((guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length <= maxChannels){
          (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).push(textChannel)
          bot.createMessage(msg.channel.id,"Linked text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
        } else {
          console.log('currently linked channels: ' + (guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel]).length)
          bot.createMessage(msg.channel.id,"Unable to link this channel. You have already linked the maximum number of channels linked to that voice channel.");
        }
      } else {
        guildCashe[guild['id']]['linkedChannels']['channels'][voiceChannel] = textChannel
        bot.createMessage(msg.channel.id,"Linked text channel with id of "+textChannel+" to voice channel with id of "+voiceChannel);
      }
      if(!guildCashe[guild['id']]['linkedChannels']['enabled']){
        guildCashe[guild['id']]['linkedChannels']['enabled'] = true
      }
      console.log("guild id: " + guild.id +'\nguild cashe: ' + JSON.stringify(guildCashe[guild['id']]))
      db.query('UPDATE servers SET settings = $1 WHERE id = ($2)',[JSON.stringify(guildCashe[guild['id']]),guild.id])
    } else {
      bot.createMessage(msg.channel.id,"You must be in a voice channel that I can see to be able to link channels.");
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
