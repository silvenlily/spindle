async function handler(bot,msg,config,servers){
  let args = msg.content.substring(0,1);
  if(args.includes(" ")) {
    args = args.split(" ",8);
    command = args[0]
  } else {
    command = args
  }

  switch (command) {
    case 'help':
      bot.messageCreate(msg.channel.id,"note to lily: add a help message later")
      break;
    case 'ping':
      bot.messageCreate(msg.channel.id,"pong");
      break;
  }
}

exports.handler = handler;
