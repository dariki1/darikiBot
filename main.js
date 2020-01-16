"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Starting Bot');
// Load dependencies
const Discord = __importStar(require("discord.js"));
const fs = __importStar(require("fs"));
const priv = __importStar(require("./JSON/private.json"));
const inputHandler = __importStar(require("./JS/inputHandler"));
const utility_1 = require("./JS/utility");
// Discord module
const client = new Discord.Client();
/**
 * Shows the help information for the given command
 */
fs.readdirSync("./JS/commands").forEach((fileName) => {
    const command = require("./JS/commands/" + fileName);
    if (!command.info) {
        utility_1.log("Attempt to add command with no info! Aborting command", 1);
        return;
    }
    if (!command.command) {
        utility_1.log("Attempt to add command with no command function! Aborting command", 1);
        return;
    }
    if (!command.info.command) {
        utility_1.log("Attempting to add command with no command name! Aborting command", 1);
        return;
    }
    inputHandler.addCommand(command.info.command, command.command, command.info);
    utility_1.log("Loaded command; " + command.info.command);
});
// Add a message listener that will attempt to run the message as a command if it is not from a bot, and is from the regestered channel
client.on('message', (message) => {
    if (message.author.bot || message.channel.type !== "text") {
        return;
    }
    inputHandler.runCommand(message);
});
// Login
client.login(priv.key).then(async () => {
    utility_1.initialiseUtility(client);
    // Inform user the bot is running
    utility_1.log("Bot startup complete");
});
