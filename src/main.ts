console.log('Starting Bot');

// Load dependencies
import * as Discord from 'discord.js';
import * as fs from 'fs';
import * as priv from './JSON/private.json';
import * as inputHandler from './JS/inputHandler';
import { log } from './JS/utility';
import { GatewayIntentBits } from 'discord.js';

process.title = "darikiBot";

let DynamicJSDirs = [
	"commands"
]

let key: string;

switch (process.argv.slice(2)[0]) {
	case 'dep':
		console.log('Starting in deployment mode');
		key = priv.depKey;
		break;
	default:
		console.log('Starting in development mode');
		key = priv.devKey;
		break;
}

// Discord module
const client: Discord.Client = new Discord.Client({intents: [GatewayIntentBits.Guilds]});

/**
 * Shows the help information for the given command
 */
DynamicJSDirs.forEach((dirName: string) => {
	fs.readdirSync(`./JS/${dirName}`).forEach((fileName: string) => {
		if (!fileName.match('.js')) {
			log("Attempted to add command from a non .js file! Aborting command", 1);
			return;
		}
		const command = require("./JS/commands/" + fileName);
		if (!command.info) {
			log("Attempt to add command with no info! Aborting command", 1);
			return;
		}
		if (!command.command) {
			log("Attempt to add command with no command function! Aborting command", 1);
			return;
		}
		if (!command.info.command) {
			log("Attempting to add command with no command name! Aborting command", 1);
			return;
		}
		inputHandler.addCommand(command.info.command, command.command, command.info);
		log("Loaded command; " + command.info.command);
	});
});

// Add a message listener that will attempt to run the message as a command if it is not from a bot, and is from the regestered channel
client.on('message', (message: Discord.Message) => {
	if (message.author.bot) {
		return;
	}

	inputHandler.runCommand(message);
});

client.once(Discord.Events.ClientReady, c => {
	log("Logged in");
})

// Login
client.login(key).then(async () => {
	// Inform user the bot is running
	
	log("Bot startup complete");
});