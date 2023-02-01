import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, ChatInputCommandInteraction, EmbedBuilder, InteractionButtonComponentData, ModalActionRowComponent, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, SlashCommandBuilder, TextInputBuilder, TextInputStyle, User } from "discord.js";
import { CommandExport, SlashCommandExport, ButtonCommandExport, ModalCommandExport } from "../command";
import loki from "lokijs";

let db = new loki("gamesDatabase");

let gameCollection: Collection<Game>;

interface Game {
	players: string;
	name: string;
	info: string | null;
	interested: User[];
}

db.loadDatabase({}, (err) => {
	if (err) {
		console.log(`Error loading games DB: ${err}`);
	} else {
		gameCollection = db.getCollection("games") ?? db.addCollection("games", { unique: ["name"] });
		console.log("Loaded games db");
	}
});

const slashCommands: SlashCommandExport[] = [
	<SlashCommandExport>{
		interaction: new SlashCommandBuilder()
			.setName("games")
			.setDescription("temp")
			.addSubcommand((subcommand) => subcommand.setName("list").setDescription("List the games added"))
			.addSubcommand((subcommand) => subcommand.setName("add").setDescription("Add a game to the list")),
		execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
			switch (interaction.options.getSubcommand(true)) {
				case "list":
					listGames(interaction);
					return;
				case "add":
					interaction.showModal(modalCommands[0].interaction);
					return;
				default:
					await interaction.reply({ options: {ephemeral: true }, content: "An error occurred"});
			}
		},
	},
];

const modalCommands: ModalCommandExport[] = [
	{
		interaction: (() => {
			const modal = new ModalBuilder().setCustomId("addGame").setTitle("Add a game");

			const playerCount = new TextInputBuilder().setCustomId("playerCount").setLabel("How many players can the game have").setRequired(true).setStyle(TextInputStyle.Short);

			const gameName = new TextInputBuilder().setCustomId("gameName").setLabel("What is the name of the game?").setRequired(true).setStyle(TextInputStyle.Short);

			const gameInfo = new TextInputBuilder().setCustomId("gameInfo").setLabel("(optional) Additional information").setRequired(false).setStyle(TextInputStyle.Short);

			modal.addComponents([new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(playerCount), new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gameName), new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(gameInfo)]);

			return modal;
		})(),
		execute: async (interaction: ModalSubmitInteraction) => {
			const playerCount = interaction.fields.getTextInputValue("playerCount");
			const gameName = interaction.fields.getTextInputValue("gameName");
			const gameInfo = interaction.fields.getTextInputValue("gameInfo");

			if (gameCollection.by("name", gameName)) {
				interaction.reply({ content: `That game is already on the list`, options: { ephemeral: true } });
				return;
			}

			gameCollection.insert({
				name: gameName,
				players: playerCount,
				info: gameInfo == "" ? null : gameInfo,
				interested: [],
			});

			db.saveDatabase();

			interaction.reply({ content: `Game added`, options: { ephemeral: true } });
		},
	},
];

const buttonCommands: ButtonCommandExport[] = [
	{
		interaction: new ButtonBuilder().setCustomId("togglegameinterest").setLabel("Change your interest").setStyle(ButtonStyle.Primary),
		execute: async (interaction: ButtonInteraction) => {
			const gameName = interaction.message.content.match(/^> Game: .+/)?.[0].substring(8);

			let game = gameCollection.by("name", gameName);

			if (game?.interested.includes(interaction.user)) {
				game.interested = game.interested.filter((user) => user != interaction.user);
			} else {
				game?.interested.push(interaction.user);
			}

			game = gameCollection.by("name", gameName);

			if (!game) {
				return;
			}

			interaction.message.delete();

			db.saveDatabase();

			displayGame(game, interaction);
		},
	},
	{
		interaction: new ButtonBuilder().setCustomId("deletegame").setLabel("Delete").setStyle(ButtonStyle.Danger),
		execute: async (interaction: ButtonInteraction) => {
			const gameName = interaction.message.content.match(/^> Game: .+/)?.[0].substring(8);

			gameCollection.removeWhere((item) => item.name === gameName);

			db.saveDatabase();

			interaction.message.delete();

			interaction.reply({ content: "Deleted", options: { ephemeral: true } });
		},
	},
	{
		interaction: /^inspectGame\d+$/,
		execute: async (interaction: ButtonInteraction) => {
			const label = interaction.component.label;
			
			if (!label) {
				return;
			}

			let game = gameCollection.by("name", label);

			if (!game) {
				interaction.reply({ content: "An error ocurred", options: { ephemeral: true } });
				return;
			}

			interaction.message.delete();

			displayGame(game, interaction);
		},
	},
];

function displayGame(game: Game, interaction: ButtonInteraction) {
	// @ts-ignore
	interaction.reply({ content: `> Game: ${game?.name}\n> Players: ${game?.players}\n> Info: ${game?.info}\n> People interested: \n\t${game?.interested.join("\n\t")}`, components: [new ActionRowBuilder<ButtonBuilder>().addComponents([buttonCommands[0].interaction, buttonCommands[1].interaction])], options: { ephemeral: true } });
	return;
}

function listGames(interaction: ChatInputCommandInteraction | ButtonInteraction) {
	let buttons: ActionRowBuilder<ButtonBuilder>[] = [];
	let count = 0;

	for (let game of gameCollection
		.where(() => true)
		// Sort list ignoring preceding "the "
		.sort((a, b) => {
			let aName = a.name;
			if (a.name.toLowerCase().startsWith("the ")) {
				aName = a.name.substring(4);
			}

			let bName = b.name;
			if (b.name.toLowerCase().startsWith("the ")) {
				bName = b.name.substring(4);
			}

			let comp = [aName, bName];

			comp.sort();

			return aName === comp[0] ? -1 : 1;
		})) {
		buttons.push(new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId(`inspectGame${count++}`).setLabel(game.name).setStyle(ButtonStyle.Primary)));
	}

	interaction.reply({ content: "Click on a game to inspect it:", components: buttons, options: { ephemeral: true } });
}

module.exports = <CommandExport>{
	slashCommands: slashCommands,
	buttonCommands: buttonCommands,
	modalCommands: modalCommands,
};
