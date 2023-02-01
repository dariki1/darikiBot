import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandExport, SlashCommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		<SlashCommandExport>{
			interaction: new SlashCommandBuilder()
				.setName("nuke")
				.setDescription("Nukes a user")
				.addUserOption((option) => {
					option.setRequired(true).setName("target").setDescription("Name of user to nuke");
					return option;
				})
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				await interaction.reply(`${interaction.user.username} nuked ${interaction.options.getUser("target")?.username} and did ${concatNumber(3)} damage`);
			},
		},
	],
};

function concatNumber(num: number): string {
	return Math.floor(Math.random() * 100000 + 100000) + "" + (num > 0 ? concatNumber(num - 1) : "");
}