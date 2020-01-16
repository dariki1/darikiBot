const utility = require("./../utility.js");
import * as Discord from 'discord.js';

exports.info = {
	"command": "nuke",
	"parameters": "<user>",
	"needsAdmin": true,
	"caseSensitive": false,
	"help": "Nukes <user>"
}

function concatNumber(num: number): string {
	return Math.floor(Math.random()*100000+100000) + "" + (num > 0 ? concatNumber(num-1) : "");
}

exports.command = (para: string[], message:Discord.Message) => {
	// Make sure a target is specified
	if (para.length === 0) {
		message.reply("please tell me who you are nuking");
	} else {
		let stringTarget = para.toString().replace(/,/g,' ');
		utility.sendMessage("<@" + message.author.id + "> nuked " + stringTarget + " and did " + concatNumber(3) + " damage", message.channel);
	}

}