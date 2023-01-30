import * as inputHandler from './../inputHandler';
import * as config from '../../JSON/config.json'; 
import * as Discord from 'discord.js';
import { sendMessage } from '../utility';

//commandInformation
export let info = {
	"command": "plug",
	"parameters": "<seconds>",
	"needsAdmin": true,
	"caseSensitive": false,
	"help": "Prevents non-admins from posting in the channel the command is used in for <seconds> seconds"
}

export let command = (para: string[], message: Discord.Message) => {
	//If no command is specified, list all registered commands
	if (para.length === 0) {
		message.reply("Please specify a length");
	} else if (Number.isNaN(Number(para[0]))) {
		message.reply(`${para[0]} is not a number`);
	} else {
		let everyone = message.guild?.roles.everyone;
		// @ts-ignore
		let originalPerms = message.channel.permissionsFor(everyone).has('SEND_MESSAGES');
		// @ts-ignore
		message.channel.updateOverwrite(everyone, {'SEND_MESSAGES': false,});

		message.reply("Channel plugged");

		setTimeout(() => {
			// @ts-ignore
			message.channel.updateOverwrite(everyone, {'SEND_MESSAGES': originalPerms,});
			message.channel.send("Channel unplugged");
		}, Number(para[0]) * 1000);
	}

}