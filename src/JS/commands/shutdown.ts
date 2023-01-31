import { CacheType, ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import * as db from "./../dbHandler";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shutdown")
		.setDescription("Reboots the bot")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply(`Good night`);
		interaction.client.destroy();
		db.shutdown();
	},
};