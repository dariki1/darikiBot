"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("./../JSON/config.json"));
let commandList = [];
let prefix = config.commandPrefix;
let adminRole = config.adminRole;
/**
 * Adds a function that can be run later with runCommand
 * @param {String} commandName The string that will be matched against user input
 * @callback callback The function that will be run if user input matches commandName
 * @param {Boolean} [caseSensitive=false] Whether the command should be checked with case sensitivity
 */
function addCommand(commandName, callback, commandJSON) {
    commandList.push({ name: commandName, effect: callback, commandJSON: commandJSON });
}
exports.addCommand = addCommand;
/**
 * Returns a shallow copy of all registed commands
 */
function listCommands() {
    return commandList.slice();
}
exports.listCommands = listCommands;
/**
 * Returns if the entered command exists yet
 * @param {String} commandName The name of the command being checked
 */
function checkCommand(commandName) {
    return commandList.filter(item => item.name.toLowerCase() === commandName.toLowerCase())[0];
}
exports.checkCommand = checkCommand;
/**
 * Attempts to run a function associated with a command
 * Message must start with the prefix found in config.json
 * Message must be registered as a command with addCommand
 * @param {String} message The message to be looked for in the command list
 */
async function runCommand(message) {
    let commandString = message.content;
    if (!commandString.startsWith(prefix)) {
        return;
    }
    let command = commandString.substr(prefix.length).split(" ");
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
exports.runCommand = runCommand;
