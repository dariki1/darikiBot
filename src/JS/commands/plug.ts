import { CacheType, ChatInputCommandInteraction, Guild, PermissionFlagsBits, PermissionsBitField, SlashCommandBuilder, TextChannel, flatten } from "discord.js";
import { CommandExport } from "../command";

module.exports = <CommandExport>{
	slashCommands: [
		{
			interaction: new SlashCommandBuilder()
				.setDMPermission(false)
				.setName("plug")
				.setDescription("Prevents non-admins from posting in the channel the command is used in")
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
				.addIntegerOption((option) => option.setRequired(true).setName("seconds").setDescription("Number of seconds to prevent posting")),
			execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
				if (!interaction.inGuild()) {
					interaction.reply("Must be in a server");
					return;
				} else if (interaction.channel === null) {
					interaction.reply("Invalid channel");
					return;
				} else if (!interaction.channel.isTextBased()) {
					interaction.reply(`Invalid channel`);
					return;
				}

				let guild = <Guild>interaction.guild;
				let everyone = guild.roles.everyone;

				let channel = <TextChannel>interaction.channel;

				let originalPerms = channel.permissionsFor(everyone).has(PermissionsBitField.Flags.SendMessages);

				channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });

				await interaction.reply("Channel plugged");

				setTimeout(async () => {
					channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: originalPerms });
					await interaction.followUp(`Channel unplugged`);
				}, Number(interaction.options.getInteger("seconds")) * 1000);
			},
		},
	],
};
