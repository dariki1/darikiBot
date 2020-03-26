import { sendMessage } from "./../utility.js";
import * as Discord from "discord.js";

export let info = {
	"command": "play",
	"parameters": "<audio/url>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Plays audio if recognised, assumed as youtube URL otherwise"
}

export let command = (para: string[], message: Discord.Message) => {
	
}