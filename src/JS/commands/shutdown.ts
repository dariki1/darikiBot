import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import * as db from "./../dbHandler";
import { CommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		{
			interaction: new SlashCommandBuilder().setName("shutdown").setDescription("Reboots the bot").setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				await interaction.reply(`Good night`);
				interaction.client.destroy();
				db.shutdown();
			},
		},
	],
};
