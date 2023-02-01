import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExport, SlashCommandExport } from "../command";

module.exports = <CommandExport> {
	slashCommands: [
		<SlashCommandExport>{
			interaction: new SlashCommandBuilder()
				.setName("highfive")
				.setDescription("High-fives a user")
				.addUserOption((option) => {
					option.setRequired(true).setName("username").setDescription("Name of user to high-five");
					return option;
				}),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				await interaction.reply(`${interaction.user.username} high-fived ${interaction.options.getUser("username")?.username}`);
			},
		},
	],
};
