import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("highfive")
		.setDescription("High-fives a user")
		.addUserOption((option) => {
			option.setRequired(true).setName("username").setDescription("Name of user to high-five");
			return option;
		}),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply(`${interaction.user.username} high-fived ${interaction.options.getUser("username")?.username}`);
	},
};