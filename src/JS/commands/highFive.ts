import { sendMessage } from "./../utility";
import * as Discord from "discord.js";

export let info = {
	"command": "highFive",
	"parameters": "<user>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "High-fives <user>"
}

export let command = (para: string[], message: Discord.Message) => {
	// Make sure a target is specified
	if (para.length === 0) {
		message.reply("please tell me who you are high-fiving");
	} else {
		let stringTarget = para.toString().replace(/,/g,' ');
		sendMessage("<@" + message.author.id + "> high-fived " + stringTarget + ".\n " + stringTarget + " gained " + Math.floor(Math.random()*49+1) + " morale", <Discord.TextChannel>message.channel);
	}
}