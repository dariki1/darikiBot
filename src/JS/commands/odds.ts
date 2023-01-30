import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const maxDice = 12;

// This is working, but the way Discord handles displaying the non-required options makes it confusing for the user

/*module.exports = {
	data: (() => {
		let builder = new SlashCommandBuilder()
		.setName("odds")
		.setDescription("Gives you the odds of each possible total that could be rolled with the set of dice")
		.addIntegerOption(option => option.setRequired(true).setMinValue(2).setDescription(`Number of sides of the dice`).setName('0'));
		
		for (let i = 1; i < maxDice; i += 1) {
			builder = builder.addIntegerOption(option => option.setRequired(false).setMinValue(2).setDescription(`Number of sides of the dice`).setName(i+''))
		}

		return builder;
	})(),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		let dice: number[] = [];
		let highestTotal = 0;

		for (let i = 0; i < maxDice; i += 1) {
			let n = interaction.options.getInteger(''+i);
			if (n === null) {
				continue;
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

		await interaction.reply(`Here are the chances of each roll;\n\t${(totals.map((num, index) => `${index}:\t\t${Math.round(10000*num/rolledTotal)/100}%`).join("\n\t")).trim()}`);
	},
};*/