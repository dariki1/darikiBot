const utility = require("./../utility.js");

exports.info = {
	"command": "slap",
	"parameters": "<user>",
	"needsAdmin": false,
	"caseSensitive": false,
	"help": "Slaps <user>"
}

exports.command = (para, message) => {
	// Make sure a target is specified
	if (para.length === 0) {
		message.reply("please tell me who you are slapping");
	} else {
		let stringTarget = para.toString().replace(/,/g,' ');
		if (stringTarget.toLowerCase().includes("darikibot" || "<@518703172303192064>")) {
			utility.sendMessage("<@" + message.author.id + "> slapped " + stringTarget + " and did 0 damage", message.channel);
		} else {
			utility.sendMessage("<@" + message.author.id + "> slapped " + stringTarget + " and did " + Math.floor(Math.random()*49+1) + " damage", message.channel);
		}
	}

}