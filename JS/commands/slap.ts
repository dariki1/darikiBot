import { sendMessage } from "./../utility.js";
import * as Discord from "discord.js";

export let info = {
	"command": "slap",
	"parameters": "<user>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Slaps <user>"
}

export let command = (para: string[], message: Discord.Message) => {
	// Make sure a target is specified
	if (para.length === 0) {
		message.reply("please tell me who you are slapping");
	} else {
		let stringTarget = para.toString().replace(/,/g,' ');
		if (stringTarget.toLowerCase().includes("darikibot") || stringTarget.toLowerCase().includes("<@518703172303192064>")) {
			sendMessage("<@518703172303192064> slapped <@" + message.author.id + "> and did " + Math.floor(Math.random()*49+1) + " damage", <Discord.TextChannel>message.channel);
		} else {
			sendMessage("<@" + message.author.id + "> slapped " + stringTarget + " and did " + Math.floor(Math.random()*49+1) + " damage", <Discord.TextChannel>message.channel);
		}
	}
}