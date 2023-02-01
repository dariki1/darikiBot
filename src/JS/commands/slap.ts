import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CommandExport, SlashCommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		<SlashCommandExport>{
			interaction: new SlashCommandBuilder()
				.setName("slap")
				.setDescription("Slaps a user")
				.addUserOption((option) => option.setRequired(true).setName("username").setDescription("Name of user to slap")),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				await interaction.reply(`${interaction.user.username} slapped ${interaction.options.getUser("username")?.username} and did ${Math.floor(Math.random() * 49 + 1)} damage`);
			},
		},
	],
};
