console.log('Starting Bot');

// Load dependencies
import * as Discord from "discord.js";
import * as fs from 'fs';
import * as priv from './JSON/private.json';
import * as inputHandler from './JS/inputHandler';
import { log, writeJSON, sendMessage, initialiseUtility } from './JS/utility';

// Discord module
const client: Discord.Client = new Discord.Client();

/**
 * Shows the help information for the given command
 */
fs.readdirSync("./JS/commands").forEach((fileName: string) => {
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

// Add a message listener that will attempt to run the message as a command if it is not from a bot, and is from the regestered channel
client.on('message', (message: Discord.Message) => {
	if (message.author.bot || message.channel.type !== "text") {
		return;
	}

	inputHandler.runCommand(message);
});

// Login
client.login(priv.key).then(async () => {
	initialiseUtility(client);
	// Inform user the bot is running
	log("Bot startup complete");
});