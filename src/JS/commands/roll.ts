import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		{
			interaction: new SlashCommandBuilder()
				.setName("roll")
				.setDescription("Rolls a number of dice")
				.addIntegerOption((option) => option.setName(`sides`).setDescription(`Number of sides on the dice`).setMinValue(2))
				.addIntegerOption((option) => option.setName(`diceperbatch`).setDescription(`Number of dice in each roll`).setMinValue(1))
				.addIntegerOption((option) => option.setName(`numberofbatches`).setDescription(`Number of times to roll`).setMinValue(1)),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				let ret: [number, number, number] = [interaction.options.getInteger(`sides`) ?? 20, interaction.options.getInteger(`diceperbatch`) ?? 1, interaction.options.getInteger(`numberofbatches`) ?? 1];

				interaction.reply(`you rolled;\n\t${formatRolls(...ret)}`);
			},
		},
	],
};

function formatRolls(sides: number, batchSize: number, batchCount: number) {
	let ret = "";
	for (let b = 0; b < batchCount; b += 1) {
		for (let d = 0; d < batchSize; d += 1) {
			ret += Math.floor(Math.random() * sides + 1) + (d === batchSize - 1 ? "\n\t" : ",");
		}
	}
	return ret;
}
