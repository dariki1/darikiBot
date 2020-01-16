"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility = require("./../utility.js");
exports.info = {
    "command": "nuke",
    "parameters": "<user>",
    "needsAdmin": true,
    "caseSensitive": false,
    "help": "Nukes <user>"
};
function concatNumber(num) {
    return Math.floor(Math.random() * 100000 + 100000) + "" + (num > 0 ? concatNumber(num - 1) : "");
}
exports.command = (para, message) => {
    // Make sure a target is specified
    if (para.length === 0) {
        message.reply("please tell me who you are nuking");
    }
    else {
        let stringTarget = para.toString().replace(/,/g, ' ');
        utility.sendMessage("<@" + message.author.id + "> nuked " + stringTarget + " and did " + concatNumber(3) + " damage", message.channel);
    }
};
