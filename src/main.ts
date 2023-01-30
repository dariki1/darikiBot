console.log("Starting Bot");

// Load dependencies
import * as fs from "fs";
import * as priv from "./JSON/private.json";
import { log } from "./JS/utility";
import { Collection, GatewayIntentBits, Client, Events, Message, SlashCommandBuilder, REST, Routes } from "discord.js";

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
		commands: Collection<string, { data: SlashCommandBuilder; execute: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void> }>;
	}
}

// Discord module
const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

DynamicJSDirs.forEach((dirName: string) => {
	fs.readdirSync(`./JS/${dirName}`).forEach((fileName: string) => {
		const filePath = `./JS/${dirName}/${fileName}`;
		const command = require(filePath);

		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
			log(`Set command from ${filePath}`);
		} else {
			log(`Failed to load command from ${filePath}`);
		}
	});
});

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(key);

(async () => {
	const commands = client.commands.map((command) => {
		return command.data.toJSON();
	});

	const data = await rest.put(Routes.applicationCommands(id), {
		body: commands,
	});
})();

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
		await interaction.reply({ content: `There was an error when executing this command`, ephemeral: true });
	}
});

/*// Add a message listener that will attempt to run the message as a command if it is not from a bot, and is from the regestered channel
client.on("message", (message: Message) => {
	if (message.author.bot) {
		return;
	}
});*/

client.once(Events.ClientReady, (c) => {
	log("Logged in");
});

// Login
client.login(key)