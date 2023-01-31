import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import * as db from "./../dbHandler";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("Access a list")
		.addSubcommandGroup((subcommand) =>
			subcommand
				.setName("group")
				.setDescription("Modify groups")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("add")
						.setDescription("Add a new group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group to add").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("remove")
						.setDescription("Delete a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group to delete").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("show")
						.setDescription("Shows the items in a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group to delete").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("rename")
						.setDescription("Renames a group")
						.addStringOption((option) => option.setName("currentgroupname").setDescription("Name of the group you want to change").setRequired(true))
						.addStringOption((option) => option.setName("newgroupname").setDescription("New name of the group").setRequired(true)),
				)
				.addSubcommand((subcommand) => subcommand.setName("list").setDescription("Lists names of all groups")),
		)
		.addSubcommandGroup((subcommand) =>
			subcommand
				.setName("column")
				.setDescription("Access an column in a group")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("add")
						.setDescription("Add a column to a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group to add a column to").setRequired(true))
						.addStringOption((option) => option.setName("columnname").setDescription("Name of the coulmn to add").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("remove")
						.setDescription("Remove a column from a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group the column is in").setRequired(true))
						.addStringOption((option) => option.setName("columnname").setDescription("Name of the column to remove").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("rename")
						.setDescription("Rename a column in a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group the column is in").setRequired(true))
						.addStringOption((option) => option.setName("currentcolumnname").setDescription("Name of the column you want to change").setRequired(true))
						.addStringOption((option) => option.setName("newcolumnname").setDescription("New name of the column").setRequired(true)),
				),
		)
		.addSubcommandGroup((subcommand) =>
			subcommand
				.setName("item")
				.setDescription("Access an item in a group")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("add")
						.setDescription("Add an item to a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group to add an item to").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("remove")
						.setDescription("Remove an item from a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group the item is in").setRequired(true))
						.addNumberOption((option) => option.setName("itemindex").setDescription("Index of the item to remove").setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("update")
						.setDescription("Update a column of an item in a group")
						.addStringOption((option) => option.setName("groupname").setDescription("Name of the group the item is in").setRequired(true))
						.addNumberOption((option) => option.setName("itemindex").setDescription("Index of the item you want to update").setRequired(true))
						.addStringOption((option) => option.setName("columnname").setDescription("Name of the column you want to update").setRequired(true))
						.addStringOption((option) => option.setName("itemdata").setDescription("Data you want to change to").setRequired(true)),
				),
		),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		interaction.reply({
			ephemeral: true,
			content: (() => {
				switch (interaction.options.getSubcommandGroup(true)) {
					case "group":
						switch (interaction.options.getSubcommand(true)) {
							case "add":
								return db.groupCreate(interaction.options.getString("groupname", true)) ? "Group created" : "Group already exists";
							case "remove":
								return db.groupRemove(interaction.options.getString("groupname", true)) ? "Group removed" : "Group does not exist";
							case "show":
								let group = db.groupShow(interaction.options.getString("groupname", true));
								if (group === undefined) {
									return "Group doesn't exist";
								}
								return formatGroup(group);
							case "rename":
								return db.groupRename(interaction.options.getString("currentgroupname", true), interaction.options.getString("newgroupname", true)) ? "Group renamed" : "Group does not exist or a group already exists with the new name";
							case "list":
								return `\`\`\`Groups:\n${formatList(db.groupList())}\`\`\``;
							default:
								return "An error occurred when getting the subcommand";
						}
					case "column":
						switch (interaction.options.getSubcommand(true)) {
							case "add":
								return db.columnAdd(interaction.options.getString("groupname", true), interaction.options.getString("columnname", true)) ? "Column added" : "Group doesn't exist or already has a column of that name";
							case "remove":
								return db.columnRemove(interaction.options.getString("groupname", true), interaction.options.getString("columnname", true)) ? "Column removed" : "Group doesn't exist or does not have a column of that name";
							case "rename":
								return db.columnRename(interaction.options.getString("groupname", true), interaction.options.getString("currentcolumnname", true), interaction.options.getString("newcolumnname", true)) ? "Column renamed" : "Group doesn't exist or does not have a column of that name, or already has a column with the new name";
							default:
								return "An error occurred when getting the subcommand";
						}
					case "item":
						switch (interaction.options.getSubcommand(true)) {
							case "add":
								let ret = db.itemAdd(interaction.options.getString("groupname", true));
								if (ret == null) {
									return `Group doesn't exist`;
								}
								return `Item added. Item index: ${ret}`;
							case "remove":
								return db.itemRemove(interaction.options.getString("groupname", true), interaction.options.getNumber("itemindex", true)) ? "Item removed" : "Group doesn't exist, or does not have an item of that index";
							case "update":
								return db.itemUpdate(interaction.options.getString("groupname", true), interaction.options.getNumber("itemindex", true), interaction.options.getString("columnname", true), interaction.options.getString("itemdata", true)) ? "Item updated" : "Group doesn't exist or doesn't have an item of that index, or doesn't have a column of that name";
							default:
								return "An error occurred when getting the subcommand";
						}
					default:
						return "An error occurred when getting the subcommand group";
				}
			})(),
		});
	},
};

function formatGroup(group: db.Group): string {
	let ret: string = "```";

	ret += `${group.name}\n`;

	for (let item of group.items) {
		ret += `Index: ${item.index}\n`;
		ret += `${item.columns.map((column) => `\t${column.name}\t${column.data}\n`).join("")}`;
	}

	ret += "```";

	return ret;
}

function formatList(groups: string[]): string {
	return groups.join(`\n`);
}
