console.log('Starting Bot');

// Load dependencies
const Discord = require('discord.js');
const fs = require('fs');
const priv = require('./JSON/private.json');
const config = require('./JSON/config.json');
const inputHandler = require('./JS/inputHandler.js');
const { log, writeJSON, sendMessage, initialiseUtility } = require('./JS/utility.js');

// Discord module
const client = new Discord.Client();

/**
 * Shows the help information for the given command
 */
fs.readdirSync("./JS/commands").forEach((file) => {
	const command = require("./JS/commands/" + file);
	if (!command.info) {
		log("Attempt to add command with no info! Aborting command", 1);
		return;
	}
	if (!command.command) {
		log("Attempt to add command with no command! Aborting command", 1);
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
client.on('message', message => {
	if (message.author.bot) {
		return;
	}

	inputHandler.runCommand(message);
});

// Login
client.login(PRIVATE_KEY).then(async () => {
	initialiseUtility(client);
	// Inform user the bot is running
	log("Bot startup complete");
	sendMessage("Good Morning! I am awake");
});