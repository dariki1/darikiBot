import * as Discord from "discord.js";
import * as config from './../JSON/config.json';

let commandList: {name:String, effect:(para: string[], message: Discord.Message) => void, commandJSON:{
	"command": string,"parameters": string,"needsAdmin": boolean,"caseSensitive": boolean,"help": string
}}[] = [];
let prefix: string = config.commandPrefix;
let adminRole: string = config.adminRole;

/**
 * Adds a function that can be run later with runCommand
 * @param {String} commandName The string that will be matched against user input
 * @callback callback The function that will be run if user input matches commandName
 * @param {Boolean} [caseSensitive=false] Whether the command should be checked with case sensitivity
 */
export function addCommand(commandName: string, callback: (para: string[], message: Discord.Message) => void, commandJSON:{
	"command": string,"parameters": string,"needsAdmin": boolean,"caseSensitive": boolean,"help": string
}) {
	commandList.push({name:commandName,effect:callback, commandJSON:commandJSON});
}

/**
 * Returns a shallow copy of all registed commands
 */
export function listCommands():{name:String, effect:(para: string[], message: Discord.Message) => void, commandJSON:{
	"command": string,"parameters": string,"needsAdmin": boolean,"caseSensitive": boolean,"help": string
}}[] {
	return commandList.slice();
}

/**
 * Returns if the entered command exists yet
 * @param {String} commandName The name of the command being checked
 */
export function checkCommand(commandName: string): {name:String, effect:(para: string[], message: Discord.Message) => void, commandJSON:{
	"command": string,"parameters": string,"needsAdmin": boolean,"caseSensitive": boolean,"help": string
}} {
	return commandList.filter(item => item.name.toLowerCase() === commandName.toLowerCase())[0];
}

/**
 * Attempts to run a function associated with a command
 * Message must start with the prefix found in config.json
 * Message must be registered as a command with addCommand
 * @param {String} message The message to be looked for in the command list
 */
export async function runCommand(message: Discord.Message) {
	let commandString: string = message.content;
	if (!commandString.startsWith(prefix)) {
		return;
	}

	let command: string[] = commandString.substr(prefix.length).split(" ");

	let commandToRun = commandList.find((e) => e.commandJSON.caseSensitive ? e.name === command[0] : e.name.toLowerCase() === command[0].toLowerCase());

	if (commandToRun) {
		// Check user roles to make sure they have permission to run the command
		if (commandToRun.commandJSON.needsAdmin && !message.member.roles.find(role => role.name === adminRole)) {
			message.reply("Sorry, you must have the '" + adminRole + "' role to use that command");
			return;
		}
		commandToRun.effect(command.slice(1), message);
	}
}