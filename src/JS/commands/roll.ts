import * as Discord from "discord.js";

export let info = {
	"command": "roll",
	"parameters": "<dice sides, default 20> <amount per batch, default 1> <number of batches, default 1>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Rolls <number of batches> <dices sides> sided dice <amount per batch> times and posts the results"
}

export let command = (para: string[], message: Discord.Message) => {
	if (Math.random()<0.01) {
		message.reply("never gonna give you up");
		return;
	}

	let ret: [number, number, number] = [20, 1, 1];
	for (let pCount = 0; pCount < 3; pCount += 1) {
		if (para.length < pCount + 1) {
			break;
		} else {
			if (isNaN(Number(para[pCount]))) {
				message.reply("please use a number for parameter #" + (pCount + 1));
				return;
			} else {
				ret[pCount] = Number(para[pCount]);
			}
		}
	}
	message.reply(`you rolled;\n\t${formatRolls(...ret)}`);
}

function formatRolls(sides: number, batchSize: number, batchCount: number) {
	let ret = "";
	for (let b = 0; b < batchCount; b += 1) {
		for (let d = 0; d < batchSize; d += 1) {
			ret += Math.floor(Math.random() * sides + 1) + (d === (batchSize - 1) ? "\n\t" : ",");
		}
	}
	return ret;
}