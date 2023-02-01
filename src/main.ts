console.log("Starting Bot");

// Load dependencies
import * as fs from "fs";
import * as priv from "./JSON/private.json";
import { log } from "./JS/utility";
import { Collection, GatewayIntentBits, Client, Events, SlashCommandBuilder, REST, Routes, ButtonBuilder, ComponentType, ButtonStyle, APIMessageComponentEmoji } from "discord.js";
import { ButtonCommandExport, CommandExport, ModalCommandExport, SlashCommandExport } from "./JS/command";

process.title = "darikiBot";

let DynamicJSDirs = ["commands"];

let key: string;
let id: string;

switch (process.argv.slice(2)[0]) {
	case "dep":
		console.log("Starting in deployment mode");
		key = priv.depKey;
		id = priv.depID;
		break;
	default:
		console.log("Starting in development mode");
		key = priv.devKey;
		id = priv.devID;
		break;
}

declare module "discord.js" {
	interface Client {
		commands: {
			slashCommands: Collection<string, SlashCommandExport>;
			buttonCommands: Collection<string | RegExp, ButtonCommandExport>;
			buttonRegexps: {expression: RegExp, execute: (interaction: ButtonInteraction) => Promise<void>}[];
			modalCommands: Collection<string, ModalCommandExport>;
		}
	}
	interface ButtonBuilder {
		data: {
			custom_id: string;
			type: ComponentType.Button | undefined;
			style: ButtonStyle | undefined;
			label: string | undefined;
			emoji: APIMessageComponentEmoji | undefined;
			disabled: boolean | undefined;
		}
	}
}

// Discord module
const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = {
	slashCommands: new Collection(),
	buttonCommands: new Collection(),
	buttonRegexps: [],
	modalCommands: new Collection(),
};

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(key);

DynamicJSDirs.forEach((dirName: string) => {
	fs.readdirSync(`./JS/${dirName}`).forEach((fileName: string) => {
		const filePath = `./JS/${dirName}/${fileName}`;
		const command = <CommandExport>require(filePath);

		if ("slashCommands" in command) {
			command.slashCommands.forEach(slashCommand => {
				client.commands.slashCommands.set(slashCommand.interaction.name, slashCommand);
			});
		}
		if ("buttonCommands" in command) {
			command.buttonCommands.forEach(buttonCommand => {
				if (buttonCommand.interaction instanceof RegExp) {
					client.commands.buttonRegexps.push({
						expression: buttonCommand.interaction, execute: buttonCommand.execute
					});
				} else {
					client.commands.buttonCommands.set(buttonCommand.interaction.data.custom_id, buttonCommand);
				}
			});
		}
		if ("modalCommands" in command) {
			command.modalCommands.forEach(modalCommand => {
				if (modalCommand.interaction.data.custom_id) {
					client.commands.modalCommands.set(modalCommand.interaction.data.custom_id, modalCommand);
				} else {
					console.warn("Modal command without custom id");
				}
			});
		}
	});
});

(async () => {
	let commands = client.commands.slashCommands.map((command) => {
		return command.interaction.toJSON();
	});

	const data = await rest.put(Routes.applicationCommands(id), {
		body: commands,
	});
})();

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isButton()) {
		const command = interaction.client.commands.buttonCommands.get(interaction.customId);
		
		if (!command) {
			let exps = interaction.client.commands.buttonRegexps.filter(exp => exp.expression.test(interaction.customId))
			for (let e of exps) {
				await e.execute(interaction);
			}
			if (exps.length == 0) {
				console.error(`No button command matching ${interaction.customId}`);
			}
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({ content: `There was an error when executing this command`, ephemeral: true });
		}
	} else if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.slashCommands.get(interaction.commandName);

		if (!command) {
			console.error(`No slash command matching ${interaction.commandName}`);
			return;
		}
	
		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({ content: `There was an error when executing this command`, ephemeral: true });
		}
	} else if (interaction.isModalSubmit()) {
		const command = interaction.client.commands.modalCommands.get(interaction.customId);

		if (!command) {
			console.error(`No slash command matching ${interaction.customId}`);
			return;
		}
	
		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({ content: `There was an error when executing this command`, ephemeral: true });
		}
	}
});

client.once(Events.ClientReady, (c) => {
	log("Logged in");
});

// Login
client.login(key)