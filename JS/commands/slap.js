"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utility_js_1 = require("./../utility.js");
exports.info = {
    "command": "slap",
    "parameters": "<user>",
    "needsAdmin": false,
    "caseSensitive": false,
    "help": "Slaps <user>"
};
exports.command = (para, message) => {
    // Make sure a target is specified
    if (para.length === 0) {
        message.reply("please tell me who you are slapping");
    }
    else {
        let stringTarget = para.toString().replace(/,/g, ' ');
        if (stringTarget.toLowerCase().includes("darikibot") || stringTarget.toLowerCase().includes("<@518703172303192064>")) {
            utility_js_1.sendMessage("<@518703172303192064> slapped <@" + message.author.id + "> and did " + Math.floor(Math.random() * 49 + 1) + " damage", message.channel);
        }
        else {
            utility_js_1.sendMessage("<@" + message.author.id + "> slapped " + stringTarget + " and did " + Math.floor(Math.random() * 49 + 1) + " damage", message.channel);
        }
    }
};
