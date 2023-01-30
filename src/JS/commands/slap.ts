import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slap")
		.setDescription("Slaps a user")
		.addUserOption((option) => option.setRequired(true).setName("username").setDescription("Name of user to slap")),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply(`${interaction.user.username} slapped ${interaction.options.getUser("username")?.username} and did ${Math.floor(Math.random()*49+1)} damage`);
	},
};