import * as db from '../dbHandler';
import * as Discord from 'discord.js';

//commandInformation
export let info = {
	"command": "shutdown",
	"parameters": "",
	"needsAdmin": true,
	"caseSensitive": false,
	"help": "Reboots the bot"
}

export let command = (para: string[], message: Discord.Message) => {	
	db.closeConnection();
	message.client.destroy();
}