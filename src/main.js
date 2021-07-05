console.log("Starting Electioneering Bot...");

const Discord = require("discord.js");
const fs = require("fs")
const config = require("../config.json");
const data = require("../data.json");
const client = new Discord.Client();
const { createCanvas, loadImage } = require('canvas');

const Logic = require("./GameLogic")

client.once("ready", ()=>{
	console.log("Connected successfully!")
})

const states = [
	"ALABAMA",
	"ALASKA",
	"ARIZONA",
	"ARKANSAS",
	"CALIFORNIA",
	"COLORADO",
	"CONNECTICUT",
	"DELAWARE",
	"D.C.",
	"FLORIDA",
	"GEORGIA",
	"HAWAII",
	"IDAHO",
	"ILLINOIS",
	"INDIANA",
	"IOWA",
	"KANSAS",
	"KENTUCKY",
	"LOUISIANA",
	"MAINE",
	"MARYLAND",
	"MASSACHUSETTS",
	"MICHIGAN",
	"MINNESOTA",
	"MISSISSIPPI",
	"MISSOURI",
	"MONTANA",
	"NEBRASKA",
	"NEVADA",
	"NEW HAMPSHIRE",
	"NEW JERSEY",
	"NEW MEXICO",
	"NEW YORK",
	"NORTH CAROLINA",
	"NORTH DAKOTA",
	"OHIO",
	"OKLAHOMA",
	"OREGON",
	"PENNSYLVANIA",
	"RHODE ISLAND",
	"SOUTH CAROLINA",
	"SOUTH DAKOTA",
	"TENNESSEE",
	"TEXAS",
	"UTAH",
	"VERMONT",
	"VIRGINIA",
	"WASHINGTON",
	"WEST VIRGINIA",
	"WISCONSIN",
	"WYOMING"
]

client.login(config.botkey);

let commands = []

// reads through the commands folder specify commands for the bot
fs.readdir("./src/commands", (err, files) => {
	if (err) {
		console.error("Couldn't read commands folder!")
	}

	files.forEach((file) => {
		let newFile = file.replace(".js", "")
		commands.push(newFile)
	})
})

client.on("message", (msg)=>{
	if(msg.guild == null){
		if(!(msg.content.substring(0, 2) == "e?" || msg.content.substring(0, 2) == "E?" ) || msg.author.bot){
			if((msg.content.indexOf("%") == 3 || msg.content.indexOf("%") == 2 || msg.content.indexOf("%") == 1 || msg.content.toLowerCase() == "wealthy" || msg.content.toLowerCase() == "middle" || msg.content.toLowerCase() == "poor" || msg.content.toLowerCase() == "northeast" || msg.content.toLowerCase() == "midwest" || msg.content.toLowerCase() == "old south" || msg.content.toLowerCase() == "southwest" || msg.content.toLowerCase() == "northwest") && activeplayers.hasOwnProperty(msg.author.id) && activegames[activeplayers[msg.author.id]].players[msg.author.id].prompt != -1){
				if(msg.content.indexOf("%") == -1){
					activegames[activeplayers[msg.author.id]].Respond(msg.author.id, msg.content);
				}
				else{
					activegames[activeplayers[msg.author.id]].Respond(msg.author.id, msg.content.substring(0,msg.content.indexOf("%")));
				}
			}
			else if(activeplayers.hasOwnProperty(msg.author.id) && activegames[activeplayers[msg.author.id]].startedreal == true){
				if(activegames[activeplayers[msg.author.id]].turn == 1){
					if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage < 3){
						if(Validstate(msg.content.toUpperCase())){
							let pollmsg = "";
							let pollspercs = Poll(5, msg.content.toUpperCase(), activegames[activeplayers[msg.author.id]]);
							let realstate = msg.content.toUpperCase();
							if(typeof(data[realstate]) == "string"){
								realstate = data[realstate];
							}
							pollmsg += "**" + realstate + "**\n"
							for(let i = 0; i < pollspercs.length; i++){
								if(!(pollspercs[i] + "").includes(".")){
									pollspercs[i] += ".0";
								}
								pollmsg += "**" + activegames[activeplayers[msg.author.id]].playerlist[i].name + "**: " + pollspercs[i] + "%; " + Number.parseFloat((data[realstate][10] * 0.46836 * pollspercs[i])/1000).toFixed(1) + "m\n";
							}
							pollmsg += "*MoE +/- 5%*"
							msg.channel.send(pollmsg);
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
					else if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage == 3){
						if(Validstate(msg.content.toUpperCase(), true)){
							let realstate = msg.content.toUpperCase();
							if(typeof msg.content == "string" && !states.includes(msg.content.toUpperCase())){
								realstate = data[msg.content.toUpperCase()];
							}
							activegames[activeplayers[msg.author.id]].players[msg.author.id].campaignstops.push(realstate);
							msg.channel.send("**You have campaigned in " + realstate + "**");
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
							msg.channel.send("*You have finished Turn " + activegames[activeplayers[msg.author.id]].turn + "*");
							client.channels.cache.get(activegames[activeplayers[msg.author.id]].channel).send(msg.author.username + " has finished their turn.")
							activegames[activeplayers[msg.author.id]].CheckIfDoneTurn();
							
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
				}
				else if(activegames[activeplayers[msg.author.id]].turn == 8){
					if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage < 1){
						if(Validstate(msg.content.toUpperCase())){
							let pollmsg = "";
							let pollspercs = Poll(0, msg.content.toUpperCase(), activegames[activeplayers[msg.author.id]]);
							let realstate = msg.content.toUpperCase();
							if(typeof(data[realstate]) == "string"){
								realstate = data[realstate];
							}
							pollmsg += "**" + realstate + "**\n"
							for(let i = 0; i < pollspercs.length; i++){
								if(!(pollspercs[i] + "").includes(".")){
									pollspercs[i] += ".0";
								}
								pollmsg += "**" + activegames[activeplayers[msg.author.id]].playerlist[i].name + "**: " + pollspercs[i] + "%; " + Number.parseFloat((data[realstate][10] * 0.46836 * pollspercs[i])/1000).toFixed(1) + "m\n"
							}
							pollmsg += "*MoE +/- 0%*"
							msg.channel.send(pollmsg);
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
					else if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage < 4){
						if(Validstate(msg.content.toUpperCase(), true)){
							let realstate = msg.content.toUpperCase();
							if(typeof msg.content == "string" && !states.includes(msg.content.toUpperCase())){
								realstate = data[msg.content.toUpperCase()];
							}
							activegames[activeplayers[msg.author.id]].players[msg.author.id].campaignstops.push(realstate);
							msg.channel.send("**You have campaigned in " + realstate + "**");
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
							if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage == 4){
								msg.channel.send("*You have finished Turn " + activegames[activeplayers[msg.author.id]].turn + "*");
								client.channels.cache.get(activegames[activeplayers[msg.author.id]].channel).send(msg.author.username + " has finished their turn.")
								activegames[activeplayers[msg.author.id]].CheckIfDoneTurn();
							}
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
				}
				else{
					if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage < 1){
						if(Validstate(msg.content.toUpperCase())){
							let pollmsg = "";
							let pollspercs = Poll(5, msg.content.toUpperCase(), activegames[activeplayers[msg.author.id]]);
							let realstate = msg.content.toUpperCase();
							if(typeof(data[realstate]) == "string"){
								realstate = data[realstate];
							}
							pollmsg += "**" + realstate + "**\n"
							for(let i = 0; i < pollspercs.length; i++){
								if(!(pollspercs[i] + "").includes(".")){
									pollspercs[i] += ".0";
								}
								pollmsg += "**" + activegames[activeplayers[msg.author.id]].playerlist[i].name + "**: " + pollspercs[i] + "%; " + Number.parseFloat((data[realstate][10] * 0.46836 * pollspercs[i])/1000).toFixed(1) + "m\n";
							}
							pollmsg += "*MoE +/- 5%*"
							msg.channel.send(pollmsg);
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
					else if(activegames[activeplayers[msg.author.id]].players[msg.author.id].stage == 1){
						if(Validstate(msg.content.toUpperCase(), true)){
							let realstate = msg.content.toUpperCase();
							if(typeof msg.content == "string" && !states.includes(msg.content.toUpperCase())){
								realstate = data[msg.content.toUpperCase()];
							}
							activegames[activeplayers[msg.author.id]].players[msg.author.id].campaignstops.push(realstate);
							msg.channel.send("**You have campaigned in " + realstate + "**");
							activegames[activeplayers[msg.author.id]].players[msg.author.id].stage++;
							msg.channel.send("*You have finished Turn " + activegames[activeplayers[msg.author.id]].turn + "*");
							client.channels.cache.get(activegames[activeplayers[msg.author.id]].channel).send(msg.author.username + " has finished their turn.")
							activegames[activeplayers[msg.author.id]].CheckIfDoneTurn();
							activeplayers[msg.author.id]
						}
						else{
							msg.channel.send("That is an invalid state. Please use either the state's full name or the 2-letter postal abbreviation.")
						}
					}
				}
			}
			return;
		}
	}

	if(msg.content.substring(0, 2) == "e?" || msg.content.substring(0, 2) == "E?" ){
		const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
	
		for(let i = 0; i < args.length; i++){
			args[i] = args[i].toLowerCase();
		}

		let commandFile = "./src/commands/" + command + ".js"
		if (!fs.existsSync(commandFile)) {
			return msg.reply("That command doesn't exist!")
		}

		commandFile = "./commands/" + command
		let commandFunction = require(commandFile)
		return commandFunction.command.execute(msg)

		/*
		if(command == "create"){
			if(msg.guild == null){
				msg.reply("You cannot create a game in DM!");
			}
			else if(activegames.hasOwnProperty(msg.channel.id)){
				msg.reply("you cannot create another game. Please wait for this current one to end.");
			}
			else{
				if(args.length == 0){
					activegames[msg.channel.id] = new Game(msg.author.id, msg.channel.id, "fptp");
					msg.channel.send(`Successfully created a game. If you would like to join, type \`${config.prefix}join\` followed by a color. For information about the colors, type \`${config.prefix}colors\``)
				}
				else if(args[0] != "fptp" && args[0] != "instantrunoff" && args[0] != "popularvote" && args[0] != "popularvoteirv"){
					msg.reply("That is an invalid mode. For more information, do `e?modes`.");
				}
				else{
					activegames[msg.channel.id] = new Game(msg.author.id, msg.channel.id, args[0]);
					msg.channel.send(`Successfully created a game. If you would like to join, type \`${config.prefix}join\` followed by a color. For information about the colors, type \`${config.prefix}colors\``)
				}
			}
		}
	

		if(command == "join"){
			if(msg.guild != null && activegames[msg.channel.id] != null){
				if(activegames[msg.channel.id].players.hasOwnProperty(msg.author.id)){
					msg.reply("you have already joined this game!")
				}
				else if(activegames[msg.channel.id].started){
					msg.reply("this game has already started. Please wait for this game to end.")
				}
				else if(args.length == 0){
					msg.reply("please enter a color!")
				}
				else if(activeplayers.hasOwnProperty(msg.author.id)){
					msg.reply("you have already joined a different game! Please finish that game before starting a new one.")
				}
				else{
					args[0] = args[0].toLowerCase();
					if(args[0] == "grey"){
						args[0] = "gray";
					}
					if(!data.hasOwnProperty(args[0].toLowerCase())){
						msg.reply("that is not a valid color.");
					}
					else if(activegames[msg.channel.id].usedcolors.includes(data[args[0].toLowerCase()])){
						msg.reply("that color is already taken!")
					}
					else{
						activegames[msg.channel.id].join(msg.author, data[args[0].toLowerCase()])
						activeplayers[msg.author.id] = msg.channel.id;
						msg.reply("you have successfully joined the game.\n **Current # of Players: " + Object.keys(activegames[msg.channel.id].players).length + "**");
					
					}
				}
			}
		}
	
		if(command == "end"){
			if(msg.guild != null && activegames.hasOwnProperty(msg.channel.id) && (activegames[msg.channel.id].creator == msg.author.id || activegames[msg.channel.id].finished == true)){
				delete activegames[msg.channel.id];
				while(Object.keys(activeplayers).find(key => activeplayers[key] == msg.channel.id)){
					delete activeplayers[Object.keys(activeplayers).find(key => activeplayers[key] == msg.channel.id)];
				}
				msg.channel.send("Game end.");
			}
			else{
				msg.reply("you cannot end the game!")
			}
		}
	
		if(command == "start"){
			if(msg.guild != null && activegames.hasOwnProperty(msg.channel.id)){
				if(activegames[msg.channel.id].creator == msg.author.id && activeplayers.hasOwnProperty(msg.author.id)){
					activegames[msg.channel.id].Start();
				}
				else if(!activeplayers.hasOwnProperty(msg.author.id)){
					msg.reply("you cannot start a game without joining it!")
				}
			}
			else{
				msg.reply("You have not yet created a game!")
			}
			
		}
		
		if(command == "state"){
			if(args.length != 0 && Validstate(args[0].toUpperCase()) && activegames.hasOwnProperty(msg.channel.id) && activegames[msg.channel.id].finished){
				let pollmsg = "";
				let pollspercs = Poll(0, args[0].toUpperCase(), activegames[msg.channel.id]);
				let realstate = args[0].toUpperCase();
				if(typeof(data[realstate]) == "string"){
					realstate = data[realstate];
				}
				pollmsg += "**" + realstate + "**\n"
				for(let i = 0; i < pollspercs.length; i++){
					if(!(pollspercs[i] + "").includes(".")){
						pollspercs[i] += ".0";
					}
					pollmsg += "**" + activegames[msg.channel.id].players[Object.keys(activegames[msg.channel.id].players)[i]].name + "**: " + pollspercs[i] + "%; " + Number.parseFloat((data[realstate][10] * 0.46836 * Poll(0, args[0].toUpperCase(), activegames[msg.channel.id])[i])/1000).toFixed(1) + "m\n";
				}
				msg.channel.send(pollmsg);
			}
			else if(!activegames.hasOwnProperty(msg.channel.id)){
				msg.reply("there is no active game to poll!");
			}
			else if(!activegames[msg.channel.id].finished){
				msg.reply("you must wait for the game to end to use this command!");
			}
			else{
				msg.reply("there is no valid state to poll!");
			}
		}
		if (command == "concede"){
			if(activegames.hasOwnProperty(activeplayers[msg.author.id])){
				if(activegames[activeplayers[msg.author.id]].turn == 9){
					msg.reply("you cannot concede after voting has begun!");
				}
				else{
					let val = 0;
					for(let i = 0; i < Object.keys(activegames[activeplayers[msg.author.id]].players).length; i++){
						if(activegames[activeplayers[msg.author.id]].playerlist[i] != null){
							if(activegames[activeplayers[msg.author.id]].playerlist[i].id == msg.author.id){
								val = i;
							}
						}
					}
					let imminentend;
					activegames[activeplayers[msg.author.id]].playerlist.splice(val, 1);
					if(activegames[activeplayers[msg.author.id]].playerlist.length == 0){
						imminentend = true;
					}
					delete activegames[activeplayers[msg.author.id]].players[msg.author.id];
					if(!imminentend){
						activegames[activeplayers[msg.author.id]].CheckIfDoneTurn();
					}
					delete activeplayers[msg.author.id];
					if(imminentend){
						delete activegames[msg.channel.id];
						msg.channel.send("Game end.");
					}
				}
			}
		}	
		*/
	}
});