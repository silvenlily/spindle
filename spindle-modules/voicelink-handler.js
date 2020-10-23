

async function syncVoiceChannels(){

}

async function switchVoice(oldChannel,newChannel,user,guildCashe){
  enterVoice(newChannel,user,guildCashe)
  exitVoice(oldChannel,user,guildCashe)
}

async function enterVoice(newChannel,user,guildCashe){
  console.log('user ' + user.username + ' joined channel ' + newChannel.name)
  if(guildCashe[newChannel['guild']['id']]['linkedChannels']['channels'][newChannel['id']]){
    console.log('new channel a is linked channel')
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

async function exitVoice(oldChannel,user,guildCashe){
  console.log('user ' + user.username + ' left channel ' + oldChannel.name)
  if(guildCashe[oldChannel['guild']['id']]['linkedChannels']['channels'][oldChannel['id']]){
    console.log('old channel a is linked channel')
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




exports.syncVoiceChannels = syncVoiceChannels;
exports.exitVoice = exitVoice;
exports.enterVoice = enterVoice;
exports.switchVoice = switchVoice;
