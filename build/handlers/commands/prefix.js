"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = void 0;
async function prefix(msg, args, bot, Store) {
    if (typeof args != "string") {
        let member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
        if (member.permissions.has(`manageGuild`)) {
            let settings = await Store.fetchGuildSettings(msg.guildID);
            settings.prefix = args[1];
            Store.storeGuildSettings(msg.guildID, settings);
            bot.createMessage(msg.channel.id, `Prefix updated! New prefix: ${settings.prefix}`);
        }
        else {
            bot.createMessage(msg.channel.id, `You don't have permssion to do this, you need \`Manage Server\`.`);
        }
    }
    else {
        let member = (await msg.channel.guild.fetchMembers({ userIDs: [msg.author.id] }))[0];
        if (member.permissions.has(`manageGuild`)) {
            let settings = await Store.fetchGuildSettings(msg.guildID);
            settings.prefix = "|";
            Store.storeGuildSettings(msg.guildID, settings);
            bot.createMessage(msg.channel.id, `Prefix updated! New prefix: ${settings.prefix}`);
        }
        else {
            bot.createMessage(msg.channel.id, `You don't have permssion to do this, you need \`Manage Server\`.`);
        }
    }
}
exports.prefix = prefix;
exports.default = prefix;
