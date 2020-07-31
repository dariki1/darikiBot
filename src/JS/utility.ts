import * as fs from 'fs';
import * as Discord from 'discord.js';

const logLevels = [
	"",
	"Warn",
	"ERROR"
];

/**
 * Outputs a message with the time in front of it
 * @param {String} message The message to be outputted
 */
export function log(message: string, level = 0) {
	let time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	console.log("[" + time + "] "+logLevels[level]+": " + message);
}

export function writeJSON(path: string, data: JSON) {
	fs.writeFileSync(path, JSON.stringify(data));
}

/**
 * Sends a message to a specified channel in a specified guild
 * @param {String} message The message being sent
 * @param {String} channel The channel to send the message to
 */
export function sendMessage(message: string, channel: Discord.TextChannel) {	
	channel.send(message);
}