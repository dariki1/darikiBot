import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder().setName(`test`).setDescription(`A simple ping command`),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply(`Command ran by ${interaction.user.username}`);
	},
}