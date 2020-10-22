const fs = require('fs')

const defaultTokens = {configVersion:1,discord:"place your discord bot token here."}
const defaultConfig = {configVersion:1,commandChar:"|"}

//maybe at some point make this async? not sure if its worth the time investment given that the code only runs at startup

function fetchConfig(){
  let path = './config/config.json';
  if(fs.existsSync(path)){
    console.log('config file found');
    let config = fs.readFileSync(path,'utf8');
    return JSON.parse(config);
  } else {
    console.log('config file not found, generating new config file')
    let data = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(path,data)
    let config = fs.readFileSync(path,'utf8');
    return JSON.parse(config);
  }
}

function fetchTokens(){
  let path = './config/tokens.json'
  if(fs.existsSync(path)){
    console.log('tokens file found')
    let tokens = fs.readFileSync(path,'utf8')
    return JSON.parse(tokens)
  } else {
    console.log('tokens file not found, generating new tokens file')
    let data = JSON.stringify(defaultTokens, null, 2);
    fs.writeFileSync(path,data)
    let tokens = fs.readFileSync(path,'utf8')
    return JSON.parse(tokens)
  }
}

exports.fetchConfig = fetchConfig
exports.defaultConfig = defaultConfig
exports.fetchTokens = fetchTokens
exports.defaultTokens = defaultTokens
