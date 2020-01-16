"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
let client;
const logLevels = [
    "",
    "Warn",
    "ERROR"
];
function initialiseUtility(discordClient) {
    client = discordClient;
}
exports.initialiseUtility = initialiseUtility;
/**
 * Outputs a message with the time in front of it
 * @param {String} message The message to be outputted
 */
function log(message, level = 0) {
    let time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    console.log("[" + time + "] " + logLevels[level] + ": " + message);
}
exports.log = log;
function writeJSON(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
}
exports.writeJSON = writeJSON;
/**
 * Sends a message to a specified channel in a specified guild
 * @param {String} message The message being sent
 * @param {String} channel The channel to send the message to
 */
function sendMessage(message, channel) {
    channel.send(message);
}
exports.sendMessage = sendMessage;
