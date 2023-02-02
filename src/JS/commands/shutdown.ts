import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { CommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		{
			interaction: new SlashCommandBuilder().setName("shutdown").setDescription("Reboots the bot").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				await interaction.reply({ content: `Good night`, ephemeral: true });
				interaction.client.destroy();
			},
		},
	],
};
