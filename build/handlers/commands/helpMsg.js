"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const help = {
    embed: {
        title: "Spindle Help",
        color: 0x44ccff,
        fields: [
            {
                name: "prefix",
                value: "changes the server prefix",
                inline: true,
            },
            {
                name: "link",
                value: "links a voice and text channel",
                inline: true,
            },
            {
                name: "unlink",
                value: "unlinks a voice and text channel",
                inline: true,
            },
            {
                name: "dynamic",
                value: "toggles dynamic creation and deletion of text channels",
                inline: true,
            },
        ],
    },
};
exports.help = help;
exports.default = help;
