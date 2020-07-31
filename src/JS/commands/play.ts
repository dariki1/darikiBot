import * as Discord from 'discord.js';
import * as ytdl from 'ytdl-core';

let dispatcher: Discord.StreamDispatcher;
interface queueCon {
	queue: string[],
	dispatcher?: Discord.StreamDispatcher
}

let queue: Map<Discord.VoiceChannel, queueCon> = new Map();

//commandInformation
export let info = {
	"command": "play",
	"parameters": "<videoID>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Plays the sound of the video found at www.youtube.com/watch?v=<videoID>"
}

export let command = (para: string[], message: Discord.Message) => {
	if (!message.member || !message.member.voiceChannelID) {
		message.reply("Please connect to a voice channel and try again");
	}

	let id: string = message.member.voiceChannelID;
	//If no command is specified, list all registered commands
	if (para.length === 0) {
		message.reply("Please supply a video ID");
	} else if (para[0] == "skip") {
		skip(<Discord.VoiceChannel>message.guild.channels.get(id));
	} else {
		addSong(<Discord.VoiceChannel>message.guild.channels.get(id), para[0]);
	}

}

async function addSong(vc: Discord.VoiceChannel, videoID: string) {
	if (!queue.has(vc)) {
		queue.set(vc, {queue: [videoID]});
		play(vc, await vc.join());
	} else {
		queue.get(vc)?.queue.push(videoID);
	}
}

function play(vc: Discord.VoiceChannel, connection: Discord.VoiceConnection) {
	if (!queue.has(vc)) {
		vc.leave();
		return;
	} else if ((<queueCon>queue.get(vc)).queue.length <= 0) {
		queue.delete(vc);
		return;
	}
	let next: string = <string>queue.get(vc)?.queue.shift();
	if (!ytdl.validateURL("https://www.youtube.com/watch?v="+next)) {
		play(vc, connection);
		return;
	}
	(<queueCon>queue.get(vc)).dispatcher = connection.playStream(ytdl.default("https://www.youtube.com/watch?v="+next)).on("end", () => {
		play(vc, connection);
	}).on("error", error => {
		console.log("Music error; " + error);
	});
}

function skip(vc: Discord.VoiceChannel) {	
	if (!queue.has(vc)) {
		return;
	}
	queue.get(vc)?.dispatcher?.end();
}