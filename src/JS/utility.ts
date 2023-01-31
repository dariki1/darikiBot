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