import * as inputHandler from '../inputHandler';
import * as config from '../../JSON/config.json'; 
import * as Discord from 'discord.js';

//commandInformation
export let info = {
	"command": "odds",
	"parameters": "<dice type>...",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Gives you the odds of each possible total that could be rolled with the set of <dice type>"
}

export let command = (para: string[], message: Discord.Message) => {
	//If no command is specified, list all registered commands
	if (para.length === 0) {
		message.reply("Please give at least one type of dice (i.e; 6, or 6 6 10)");
	} else {
		let dice: number[] = [];
		let highestTotal = 0;
		for (let i = 0; i < para.length; i += 1) {
			let n = Number(para[i].split('').map(c => isNaN(Number(c)) ? undefined : Number(c)).join(''));

			if (n < 2) {
				message.reply("Please ensure all dice are at least 2");
				return;
			}

			dice[i] = n;
			highestTotal += n;
		}

		let rolls = [];

		for (let i = 0; i < dice.length; i += 1) {
			rolls[i] = 1;
		}

		let totals:number[] = [];

		for (let i = dice.length; i <= highestTotal; i += 1) {
			totals[i] = 0;
		}

		let currentInc:number = 0;

		let total;

		while (currentInc < dice.length) {
			total = 0;
			for (let i = 0; i < rolls.length; i += 1) {
				total += rolls[i];
			}

			totals[total] += 1;

			currentInc = 0;
			for (let i = 0; i <= currentInc && i < dice.length; i += 1) {
				rolls[i] += 1;
				if (rolls[i] > dice[i]) {
					rolls[i] = 1;
					currentInc += 1;
				}
			}
		}

		let rolledTotal = 0;

		for (let i = 0 ; i < totals.length; i += 1) {
			rolledTotal += Number(totals[i]) ? Number(totals[i]) : 0;
		}

		message.reply(`Here are the chances of each roll;\n\t${(totals.map((num, index) => `${index}:\t\t${Math.round(10000*num/rolledTotal)/100}%`).join("\n\t")).trim()}`);
	}
}