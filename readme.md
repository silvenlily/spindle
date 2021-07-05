Spindle is a discord bot used to manage channels. It allows you to link text channels and voice channels, so users can only view a text channel when they are in the linked voice channel.

If you dont want to give spindle Admin for your entire server you can give it Manage Permissions for each text channel you link.

NOTE: working branch is a complete re-write of spindle, it is still being worked on, **use master**.

You can add the bot to your server using: https://discord.com/oauth2/authorize?client_id=768705571481452545&scope=bot&permissions=19472 and join the development server at: https://discord.gg/4ufepDPkPy

Selfhosting:  
If you want to selfhost you have to build from source.  
Before starting you will need:

- git installed
- npm (or yarn) and node.js installed
- a discord bot token from: https://discord.com/developers/applications
- a proccess manager like PM2 to restart spindle if (when) it crashes (technicly optional)

to install:

1. Clone the repo (`git clone https://github.com/silvenlily/spindle.git`)
2. open spindles root directory
3. open the config folder
4. copy `example-config.json` and rename the new file `config.json`
5. copy `example-tokens.json` and rename the new file `tokens.json`
6. edit config.json and tokens.json with your config values and tokens
7. open powershell or terminal in spindles root directory
8. run: `npm install --production` (installs dependencies)
9. run: `npm run start` (starts spindle)

to update:

1. open spindles root directory
2. open powershell or terminal in spindles root directory
3. pull the repo (`git pull`)
4. run: `npm install --production` (installs dependencies)
5. run: `node run start` (this actually runs spindle)

note: If using a process manager you can also use `node ./build/spindle.js` to run spindle rather then the npm script. This may work better with some proccess managers.
