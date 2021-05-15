console.log("Starting Electioneering Bot...");

const Discord = require("discord.js");
const config = require("./config.json");
const data = require("./data.json");
const client = new Discord.Client();
const { createCanvas, loadImage } = require('canvas')


let activegames = {};
let activeplayers = {};

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
	
		if(command == "modes" || command == "mode"){
			msg.channel.send("**__FPTP__**: The real-life system of U.S. Presidential elections.\n**__InstantRunoff__**: If nobody hits 270 electoral votes, the person with the fewest votes is eliminated. This repeats until someone hits 270.\n**__PopularVote__**: The person with the most votes wins.\n**__PopularVoteIRV__**: If nobody recieves 50% of the votes, the person with the fewest votes is eliminated. This is repeated until someone hits 50%.\n")
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
	
		if(command == "version"){
			msg.reply("Electioneering is on version **0.2.2**.")
		}
	
		if(command == "server"){
			msg.reply("__Join the server to report bugs, suggest features, and play the game with others!__\n https://discord.gg/mvR2fEwntu")
		}
	
		if(command == "help"){
			msg.reply("coming soon...");
		}
	
		if(command == "regionmap" || command == "regionsmap"){
			msg.channel.send("__Regions Map__", {files: ["./assets/RegionMap.png"]})
		}
		if(command == "statemap" || command == "statesmap"){
			msg.channel.send("__State Map__", {files: ["./assets/statemap.png"]})
		}
		if (command == "incomemap"){
			msg.channel.send("__Income Map__", {files: ["./assets/IncomeMap.png"]})
		}
		if (command == "colors"){
			msg.channel.send("__Colors__\n**Red**\n**Blue**\n**Green**\n**Yellow**\n**Gray**\n**Pink**\n**Purple**\n**Brown**");
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
	}
});

function Poll(moe, state, game){
	let realstate = state;
	if(typeof(data[state]) == "string"){
		realstate = data[state];
	}
	let scores = [];
	let player;
	let campaignlength;
	if(game.turn >= game.stages.length){
		if(game.players.hasOwnProperty[Object.keys(game.players)[0]]){
			campaignlength = game.players[Object.keys(game.players)[0]].campaignstops.length;
		}
	}
	else{
		campaignlength = game.turn - 1;
	}
	let scoretotal = 0;
	for(let i = 0; i < Object.keys(game.players).length; i++){
		player = game.players[Object.keys(game.players)[i]];
		scores.push(10000/(1500+(1*Math.pow(player.stats[data.PVI] - data[realstate][data.PVI], 2)) + (5000*Math.pow(player.stats[data.Urban]-data[realstate][data.Urban], 2)) + (75000*Math.pow(player.stats[data.Education]-data[realstate][data.Education], 2)) + (10000*Math.pow(player.stats[data.Religion]-data[realstate][data.Religion], 2))))
		for(let j = 0; j < campaignlength; j++){
			if(player.campaignstops[j] == realstate){
				scores[i] += .75;
			}
			else if(player.campaignstops[j] == data[realstate][data.Region].toUpperCase()){
				scores[i] += .23;
			}
		}
		if(player.stats[data.Income] == data[realstate][data.Income]){
			scores[i] += 1;
		}
		if(player.stats[data.Region] == data[realstate][data.Region]){
			scores[i] += 1;
		}
		scoretotal += scores[i];
	}

	let percentages = [];
	let randoms = [];
	let randomsum = 0;
	for(let i = 0; i < scores.length; i++){
		percentages.push(Math.round((scores[i]*1000)/scoretotal)/1000);
		randoms.push(Math.random());
		randomsum += randoms[i];
	}

	for(let i = 0; i < randoms.length; i++){
		randoms[i] = randoms[i] - (randomsum/randoms.length);
		randoms[i] *= moe/randomsum;
	}

	for(let i = 0; i < randoms.length; i++){
		percentages[i] += randoms[i]/100;
		percentages[i] = Number(Number.parseFloat(percentages[i] * 100).toFixed(1));
	}
	
	return percentages;

}

function Validstate(state, campaign = false){
	if(state == "DC" || state == "D.C." || state == "DISTRICT OF COLUMBIA" || state == "WASHINGTON D.C." || state == "WASHINGTON DC"){
		return true;
	}
	if(!campaign){
		if(state != "MIDWEST" && state != "NORTHWEST" && state != "OLD SOUTH" && state != "SOUTHWEST" && state != "NORTHEAST" && data.hasOwnProperty(state)){
			return true;
		}
	}
	
	if(campaign){
		if(state == "MIDWEST" || state == "NORTHWEST" || state == "OLD SOUTH" || state == "SOUTHWEST" || state == "NORTHEAST" || data.hasOwnProperty(state)){
			return true;
		}
	}
	
	return false;
}

class Game{
	constructor(creator_, channel_, type_){
		this.creator = creator_;
		this.channel = channel_;
		this.players = {};
		this.playerlist = [];
		this.started = false;
		this.startedreal = false;
		this.turn = 1;
		this.stages = [4, 2, 2, 2, 2, 2, 2, 4];
		this.usedcolors = [];
		this.finished = false;
		this.type = type_;
		this.canvas = createCanvas(612, 384);
		this.ctx = this.canvas.getContext('2d');
		this.blankstatefill = null;
		loadImage("./assets/blankstatefill.png").then((img)=>{
			this.blankstatefill = img;
			this.ctx.drawImage(this.blankstatefill, 0, 0, img.width, img.height);
})
	}

	join(player, color_){
		this.usedcolors.push(color_);
		this.players[player.id] = new Player(player.id, player.username, color_);
	}

	Start(){
		for(let i = 0; i < Object.keys(this.players).length; i++){
			this.playerlist.push(this.players[Object.keys(this.players)[i]])
		}
		this.started = true;
		Object.keys(this.players).forEach(player => {
			client.users.cache.get("" + player).send("To play, your character must have **6** stats. \n**1**: How far __left__/__right__ you are.\n**2**: How much you appeal to __urban__ or __rural__ voters.\n**3**: How much you appeal to __college educated__ or __non college educated__ voters.\n**4**: How much you appeal to __religion__.\n**5**: What __income__ bracket you appeal to.\n**6**: What __region__ you appeal to.");
			client.users.cache.get("" + player).send("With 100% being far right and 0% being far left, what is your general ideology?\n*Please respond in the format: xx%*");
			if(activegames.hasOwnProperty(activeplayers[player])){
				activegames[activeplayers[player]].players[player].prompt = 0;
			}
		});
	}

	PrintStats(){
		let printmessage = "";
		Object.keys(this.players).forEach(player => {
			printmessage += `__**${this.players[player].name}**__\n**Left/Right**: ${this.players[player].rawstats[1]}%\n**Urban**: ${this.players[player].rawstats[0]}%\n**Educated**: ${this.players[player].rawstats[2]}%\n**Religiousity**: ${this.players[player].rawstats[3]}%\n**Income**: ${this.players[player].rawstats[4].charAt(0).toUpperCase() + this.players[player].rawstats[4].slice(1)}\n**Region**: ${this.players[player].rawstats[5].charAt(0).toUpperCase() + this.players[player].rawstats[5].slice(1)}\n\n`;
		});
		client.channels.cache.get(this.channel).send(printmessage);
	}

	Turn(){
		if(this.turn == 1){
			let addstring = "\n";
			Object.keys(this.players).forEach(player => {
				addstring += "<@"+this.players[player].playerid+"> ";
			});
			client.channels.cache.get(this.channel).send("__**TURN 1**__\nEvery player gets 3 polls and 1 campaign stop for the first turn. Please DM your 3 poll requests to me in separate messages." + addstring)
		}
		else if(this.turn == 8){
			for(let i = 0; i < states.length; i++){
				let mappolls = Poll(10, states[i], this);
				let max = 0;
				let secondmax = 0;
				let val;
				for(let j = 0; j < mappolls.length; j++){
					if(mappolls[j] > max){
						val = j;
						secondmax = max;
						max = mappolls[j];
					}
					if(mappolls[j] > secondmax && mappolls[j] < max){
						secondmax = mappolls[j];
					}
				}
				let res = (max - secondmax);
				let colordepth = 0;
				if(res < 5){
					colordepth = 3;
				}
				else if(res < 10){
					colordepth = 2;
				}
				else if(res < 15){
					colordepth = 1;
				}
				this.ctx.fillStyle = this.playerlist[val].color[colordepth];
				for(let j = 0; j < data[states[i] + "Coords"].length; j+=2){
					this.ctx.fillRect(data[states[i] + "Coords"][j], data[states[i] + "Coords"][j + 1], 1, 1);
				}
			}

			client.channels.cache.get(this.channel).send("Turn 8 Polls\n*MoE +/- 10%*", new Discord.MessageAttachment(this.canvas.toBuffer(), 'turn8polls.png'));

			let evs = [];
			let popularvotes = [];
			for(let i = 0; i < this.playerlist.length; i++){
				evs.push(0);
				popularvotes.push(0);
			}
			let temppoll = [];
			for(let i = 0; i < states.length; i++){
				temppoll = Poll(0, states[i], this);
				let max = 0;
				let val = 0;
				for(let j = 0; j < temppoll.length; j++){
					if(temppoll[j] > max){
						val = j;
						max = temppoll[j];
					}
					popularvotes[j] += data[states[i]][10] * 0.46836 * temppoll[j];
				}
				evs[val] += data[states[i]][9];
			}
			let evandvotesstring = "";
			for(let i = 0; i < this.playerlist.length; i++){
				evandvotesstring += "**" + this.playerlist[i].name + "**: " + evs[i] + "; " + Number.parseFloat(popularvotes[i]/1000).toFixed(1) + "m\n";
			}

			client.channels.cache.get(this.channel).send(evandvotesstring);

			let addstring = "\n";
			let campaignstring = "\n";
			Object.keys(this.players).forEach(player => {
				addstring += "<@"+this.players[player].playerid+"> ";
				campaignstring += "**"+this.players[player].name+"** campaigned in " + this.players[player].campaignstops[this.turn - 2] + ".\n";
			});
			
			client.channels.cache.get(this.channel).send("__**TURN 8**__\nEvery player gets 1 poll and 3 campaign stops for the final turn." + addstring)
		}
		else if(this.turn == 9){
			let statesresults = [];
			let tempresults = [];
			for(let i = 0; i < states.length; i++){
				tempresults = Poll(0, states[i], this);
				let max = tempresults[0];
				let secondmax = 0;
				let val = 0;
				for(let j = 0; j < tempresults.length; j++){
					if(tempresults[j] > max){
						val = j;
						secondmax = max;
						max = tempresults[j];
					}
					if(tempresults[j] > secondmax && tempresults[j] < max){
						secondmax = tempresults[j];
					}
				}
				let res = (max - secondmax);
				statesresults.push([states[i], res, val]);
			}
			let statesbymargin = statesresults.sort(function(a, b){
				return b[1] - a[1];
			});
			let addstring = "";
			Object.keys(this.players).forEach(player => {
				addstring += "<@"+this.players[player].playerid+"> ";
			});
			client.channels.cache.get(this.channel).send("**ELECTION NIGHT**\n" + addstring);
			setTimeout(() =>{
				this.ctx.clearRect(0, 0, 1000, 1000);
				this.ctx.drawImage(this.blankstatefill, 0, 0, this.canvas.width, this.canvas.height);	
				for(let i = 0; i < 15; i++){
					this.ctx.fillStyle = this.playerlist[statesbymargin[i][2]].color[0];
					this.playerlist[statesbymargin[i][2]].evs += data[statesbymargin[i][0]][9];
					for(let j = 0; j < this.playerlist.length; j++){
						this.playerlist[j].popularvote += data[statesbymargin[i][0]][10] * 0.46836 * Poll(0, statesbymargin[i][0], this)[j];
					}
					for(let j = 0; j < data[statesbymargin[i][0] + "Coords"].length; j+=2){
						this.ctx.fillRect(data[statesbymargin[i][0] + "Coords"][j], data[statesbymargin[i][0] + "Coords"][j + 1], 1, 1);
					}
				}
				client.channels.cache.get(this.channel).send("Polls across the country have closed. We're ready to make some calls...", new Discord.MessageAttachment(this.canvas.toBuffer(), 'results1.png'));
				let addstring = "";
				Object.keys(this.players).forEach(player => {
					addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
					if((this.type == "fptp" || this.type == "instantrunoff") && this.players[player].evs >= 270 && this.players[player].winner == false){
						this.players[player].winner = true;
						client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
					}
					else if((this.type == "popularvote" || this.type == "popularvoteirv") && this.players[player].popularvote > 76550 && this.players[player].winner == false){
						this.players[player].winner = true;
						client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
					}
				});
				client.channels.cache.get(this.channel).send("**__CURRENT STANDINGS__**\n" + addstring);
				setTimeout(() =>{
					for(let i = 15; i < 30; i++){
						this.ctx.fillStyle = this.playerlist[statesbymargin[i][2]].color[0];
						this.playerlist[statesbymargin[i][2]].evs += data[statesbymargin[i][0]][9];
						for(let j = 0; j < this.playerlist.length; j++){
							this.playerlist[j].popularvote += data[statesbymargin[i][0]][10] * 0.46836 * Poll(0, statesbymargin[i][0], this)[j];
						}
						for(let j = 0; j < data[statesbymargin[i][0] + "Coords"].length; j+=2){
							this.ctx.fillRect(data[statesbymargin[i][0] + "Coords"][j], data[statesbymargin[i][0] + "Coords"][j + 1], 1, 1);
						}
					}
					client.channels.cache.get(this.channel).send("The counting has gone on longer, and we've seen enough in some of the less tight races.", new Discord.MessageAttachment(this.canvas.toBuffer(), 'results2.png'));
					let addstring = "";
					Object.keys(this.players).forEach(player => {
						addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
						if((this.type == "fptp" || this.type == "instantrunoff") && this.players[player].evs >= 270 && this.players[player].winner == false){
							this.players[player].winner = true;
							client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
						}
						else if((this.type == "popularvote" || this.type == "popularvoteirv") && this.players[player].popularvote > 76550 && this.players[player].winner == false){
							this.players[player].winner = true;
							client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
						}
					});
					client.channels.cache.get(this.channel).send("**__CURRENT STANDINGS__**\n" + addstring);
					setTimeout(() =>{
						for(let i = 30; i < 45; i++){
							this.ctx.fillStyle = this.playerlist[statesbymargin[i][2]].color[0];
							this.playerlist[statesbymargin[i][2]].evs += data[statesbymargin[i][0]][9];
							for(let j = 0; j < this.playerlist.length; j++){
								this.playerlist[j].popularvote += data[statesbymargin[i][0]][10] * 0.46836 * Poll(0, statesbymargin[i][0], this)[j];
							}
							for(let j = 0; j < data[statesbymargin[i][0] + "Coords"].length; j+=2){
								this.ctx.fillRect(data[statesbymargin[i][0] + "Coords"][j], data[statesbymargin[i][0] + "Coords"][j + 1], 1, 1);
							}
						}
						client.channels.cache.get(this.channel).send("More calls! This race is coming to a close, only a few more contests left...", new Discord.MessageAttachment(this.canvas.toBuffer(), 'results3.png'));
						let addstring = "";
						Object.keys(this.players).forEach(player => {
							addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
							if((this.type == "fptp" || this.type == "instantrunoff") && this.players[player].evs >= 270 && this.players[player].winner == false){
								this.players[player].winner = true;
								client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
							}
							else if((this.type == "popularvote" || this.type == "popularvoteirv") && this.players[player].popularvote > 76550 && this.players[player].winner == false){
								this.players[player].winner = true;
								client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
							}
						});
						client.channels.cache.get(this.channel).send("**__CURRENT STANDINGS__**\n" + addstring);
						setTimeout(() =>{
							for(let i = 45; i < statesbymargin.length; i++){
								this.ctx.fillStyle = this.playerlist[statesbymargin[i][2]].color[0];
								this.playerlist[statesbymargin[i][2]].evs += data[statesbymargin[i][0]][9];
								for(let j = 0; j < this.playerlist.length; j++){
									this.playerlist[j].popularvote += data[statesbymargin[i][0]][10] * 0.46836 * Poll(0, statesbymargin[i][0], this)[j];
								}
								for(let j = 0; j < data[statesbymargin[i][0] + "Coords"].length; j+=2){
									this.ctx.fillRect(data[statesbymargin[i][0] + "Coords"][j], data[statesbymargin[i][0] + "Coords"][j + 1], 1, 1);
								}
							}
							client.channels.cache.get(this.channel).send("And it is over!", new Discord.MessageAttachment(this.canvas.toBuffer(), 'results4.png'));
							this.finished = true;
							
							
							setTimeout(()=>{
								let addstring = "";
								Object.keys(this.players).forEach(player => {
									addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
									if((this.type == "fptp" || this.type == "instantrunoff") && this.players[player].evs >= 270 && this.players[player].winner == false){
										this.players[player].winner = true;
										client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
									}
									else if((this.type == "popularvote" || this.type == "popularvoteirv") && this.players[player].popularvote > 76550 && this.players[player].winner == false){
										this.players[player].winner = true;
										client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
									}
								});
								client.channels.cache.get(this.channel).send("**__RESULTS__**\n" + addstring);
								if(this.type == "popularvote"){
									let max = 0;
									let winner;
									Object.keys(this.players).forEach(player => {
										if(this.players[player].popularvote > max){
											max = this.players[player].popularvote;
											winner = player;
										}
									})
									if(this.players[winner].winner == false){
										this.players[winner].winner = true;
										client.channels.cache.get(this.channel).send("<@"+this.players[winner].playerid+"> **HAS WON THE ELECTION!!**");
									}
								}
								else if(this.type == "popularvoteirv"){
									let nowinner = true;
									for(let i = 0; i < Object.keys(this.players).length; i++){
										if(this.players[Object.keys(this.players)[i]].winner || (this.players[Object.keys(this.players)[i]].popularvote > 76550 && Object.keys(this.players).length == 2)){
											nowinner = false;
										}
									}
									if(nowinner){
										client.channels.cache.get(this.channel).send("**It appears nobody has won 50% of the popular vote, leading to a runoff... What will the results be?**");
										this.turn++;
										setTimeout(()=>{
											this.Turn();
										}, 15000);
									}
								}
								else if(this.type != "fptp"){
									let nowinner = true;
									for(let i = 0; i < Object.keys(this.players).length; i++){
										if(this.players[Object.keys(this.players)[i]].winner || (this.players[Object.keys(this.players)[i]].evs == 269 && Object.keys(this.players).length == 2)){
											nowinner = false;
										}
									}
									if(nowinner){
										this.turn++;
										client.channels.cache.get(this.channel).send("**It appears nobody has won 270 votes, leading to a runoff... What will the results be?**");
										
										setTimeout(()=>{
											this.Turn();
										}, 15000);
									}
								}
								else {
									this.finished = true;
								}
								
							}, 2*1000);
							
						}, 20*1000)
					}, 20*1000)
				}, 20*1000)
			}, 20*1000)
		}
		else if(this.turn == 10){
			if(this.type == "instantrunoff"){
				let leastplayer = Object.keys(this.players)[0];
				for(let i = 0; i < Object.keys(this.players).length; i++){
					if(this.players[Object.keys(this.players)[i]].evs <= this.players[leastplayer].evs){
						leastplayer = Object.keys(this.players)[i];
					}
				}
				delete this.players[leastplayer];
				for(let i = 0; i < Object.keys(this.players).length; i++){
					this.players[Object.keys(this.players)[i]].evs = 0;
					this.players[Object.keys(this.players)[i]].popularvote = 0;
				}
				let statesresults = [];
				let tempresults = [];
				for(let i = 0; i < states.length; i++){
					tempresults = Poll(0, states[i], this);
					let max = tempresults[0];
					let secondmax = 0;
					let val = 0;
					for(let j = 0; j < tempresults.length; j++){
						if(tempresults[j] > max){
							val = j;
							secondmax = max;
							max = tempresults[j];
						}
						if(tempresults[j] > secondmax && tempresults[j] < max){
							secondmax = tempresults[j];
						}
					}
					let res = (max - secondmax);
					statesresults.push([states[i], res, val]);
				}
				for(let i = 0; i < statesresults.length; i++){
					this.ctx.fillStyle = this.players[Object.keys(this.players)[statesresults[i][2]]].color[0];
					this.players[Object.keys(this.players)[statesresults[i][2]]].evs += data[statesresults[i][0]][9];
					for(let j = 0; j < Object.keys(this.players).length; j++){
						this.players[Object.keys(this.players)[j]].popularvote += data[statesresults[i][0]][10] * 0.46836 * Poll(0, statesresults[i][0], this)[j];
					}
					for(let j = 0; j < data[statesresults[i][0] + "Coords"].length; j+=2){
						this.ctx.fillRect(data[statesresults[i][0] + "Coords"][j], data[statesresults[i][0] + "Coords"][j + 1], 1, 1);
					}
				}
				client.channels.cache.get(this.channel).send("And with the runoff, we see the results are:", new Discord.MessageAttachment(this.canvas.toBuffer(), 'resultsrunoff.png'));
				let addstring = "";
				Object.keys(this.players).forEach(player => {
					addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
					if(this.players[player].evs >= 270 && this.players[player].winner == false){
						this.players[player].winner = true;
						client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
						this.finished = true;
					}
				});
				client.channels.cache.get(this.channel).send("**__RUNOFF RESULTS__**\n" + addstring);
				let nowinner = true;
				for(let i = 0; i < Object.keys(this.players).length; i++){
					if(this.players[Object.keys(this.players)[i]].winner || (this.players[Object.keys(this.players)[i]].evs == 269 && Object.keys(this.players).length == 2)){
						nowinner = false;
					}
				}
				if(nowinner){
					client.channels.cache.get(this.channel).send("**It appears still nobody has won 270 votes, leading to another runoff... What will the results be?**");			
					setTimeout(()=>{
						this.Turn();
					}, 15000);
				}
			}
			else if(this.type == "popularvoteirv"){
				let low = 500000;
				let loser;
				Object.keys(this.players).forEach(player => {
					if(this.players[player].popularvote < low){
						low = this.players[player].popularvote;
						loser = player;
					}
				});
				delete this.players[loser];
				for(let i = 0; i < Object.keys(this.players).length; i++){
					this.players[Object.keys(this.players)[i]].evs = 0;
					this.players[Object.keys(this.players)[i]].popularvote = 0;
				}
				let statesresults = [];
				let tempresults = [];
				for(let i = 0; i < states.length; i++){
					tempresults = Poll(0, states[i], this);
					let max = tempresults[0];
					let val = 0;
					for(let j = 0; j < tempresults.length; j++){
						if(tempresults[j] > max){
							val = j;
							max = tempresults[j];
						}
					}
					statesresults.push([states[i], max, val]);
				}
				for(let i = 0; i < statesresults.length; i++){
					this.ctx.fillStyle = this.players[Object.keys(this.players)[statesresults[i][2]]].color[0];
					this.players[Object.keys(this.players)[statesresults[i][2]]].evs += data[statesresults[i][0]][9];
					for(let j = 0; j < Object.keys(this.players).length; j++){
						this.players[Object.keys(this.players)[j]].popularvote += data[statesresults[i][0]][10] * 0.46836 * Poll(0, statesresults[i][0], this)[j];
					}
					for(let j = 0; j < data[statesresults[i][0] + "Coords"].length; j+=2){
						this.ctx.fillRect(data[statesresults[i][0] + "Coords"][j], data[statesresults[i][0] + "Coords"][j + 1], 1, 1);
					}
				}
				client.channels.cache.get(this.channel).send("And with the runoff, we see the results are:", new Discord.MessageAttachment(this.canvas.toBuffer(), 'resultsrunoff.png'));
				let addstring = "";
				Object.keys(this.players).forEach(player => {
					addstring += this.players[player].name + ": " + this.players[player].evs + "; " + Number.parseFloat(this.players[player].popularvote/1000).toFixed(1) + "m\n";
					if(this.players[player].popularvote >= 76550 && this.players[player].winner == false){
						this.players[player].winner = true;
						client.channels.cache.get(this.channel).send("<@"+this.players[player].playerid+"> **HAS WON THE ELECTION!!**");
						this.finished = true;
					}
				});
				client.channels.cache.get(this.channel).send("**__RUNOFF RESULTS__**\n" + addstring);
				let nowinner = true;
				for(let i = 0; i < Object.keys(this.players).length; i++){
					if(this.players[Object.keys(this.players)[i]].winner){
						nowinner = false;
					}
				}
				if(nowinner){
					client.channels.cache.get(this.channel).send("**It appears still nobody has won a majority of votes, leading to another runoff... What will the results be?**");			
					setTimeout(()=>{
						this.Turn();
					}, 15000);
				}
			}
		}
		else{
			let addstring = "\n";
			let campaignstring = "\n";
			Object.keys(this.players).forEach(player => {
				addstring += "<@"+this.players[player].playerid+"> ";
				campaignstring += "**"+this.players[player].name+"** campaigned in " + this.players[player].campaignstops[this.turn - 2] + ".\n";
			});
			client.channels.cache.get(this.channel).send(campaignstring + "\n__**TURN " + this.turn + "**__\nEvery player gets 1 poll and 1 campaign stop." + addstring)
		}
	}

	CheckIfDoneTurn(){
		let done = true;
		Object.keys(this.players).forEach(player =>{
			if(this.players[player].stage != this.stages[this.turn - 1]){
				done = false;
			}
		});
		if(done){
			this.turn++;
			Object.keys(this.players).forEach(player =>{
				this.players[player].stage = 0;
			});
			this.Turn()
		}
	}

	Respond(playerid, value){
		if(this.players[playerid].prompt == 0){
			if(!isNaN(value)){
				if(value >= 0 && value <= 100){
					if(Number.isInteger(Number(value))){
						this.players[playerid].rawstats[1] = value;
						this.players[playerid].stats[1] = (value * 0.3) - 15;
						this.players[playerid].prompt = 1;
						client.users.cache.get("" + playerid).send("With 100% being totally urban and 0% being totally rural, which do you appeal to more?\n*Please respond in the format: xx%*");
					}
					else{
						client.users.cache.get("" + playerid).send("Please enter a whole number.");
					}
				}
				else{
					client.users.cache.get("" + playerid).send("Please enter a number between 0 and 100.");
				}
			}
			else{
				client.users.cache.get("" + playerid).send("Please enter a number.");
			}
		}
		else if(this.players[playerid].prompt == 1){
			if(!isNaN(value)){
				if(value >= 0 && value <= 100){
					if(Number.isInteger(Number(value))){
						this.players[playerid].rawstats[0] = value;
						this.players[playerid].stats[0] = (value / 200) + 0.49;
						this.players[playerid].prompt = 2;
						client.users.cache.get("" + playerid).send("With 100% being totally college educated and 0% being totally un-college educated, which do you appeal to more?\n*Please respond in the format: xx%*");
					}
					else{
						client.users.cache.get("" + playerid).send("Please enter a whole number.");
					}
				}
				else{
					client.users.cache.get("" + playerid).send("Please enter a number between 0 and 100.");
				}
			}
			else{
				client.users.cache.get("" + playerid).send("Please enter a number.");
			}
			
		}
		else if(this.players[playerid].prompt == 2){
			if(!isNaN(value)){
				if(value >= 0 && value <= 100){
					if(Number.isInteger(Number(value))){
						this.players[playerid].rawstats[2] = value;
						this.players[playerid].stats[2] = (value / 1000) + 0.31;
						this.players[playerid].prompt = 3;
						client.users.cache.get("" + playerid).send("With 0% being publicly atheist, 100% being a fundamentalist Christian, and 50% being faithful but secular, how much do you appeal to religion?\n*Please respond in the format: xx%*");
					}
					else{
						client.users.cache.get("" + playerid).send("Please enter a whole number.");
					}
				}
				else{
					client.users.cache.get("" + playerid).send("Please enter a number between 0 and 100.");
				}
			}
			else{
				client.users.cache.get("" + playerid).send("Please enter a number.");
			}	
		}
		else if(this.players[playerid].prompt == 3){
			if(!isNaN(value)){
				if(value >= 0 && value <= 100){
					if(Number.isInteger(Number(value))){
						this.players[playerid].rawstats[3] = value;
						this.players[playerid].stats[3] = (value / 400) + 0.53;
						this.players[playerid].prompt = 4;
						client.users.cache.get("" + playerid).send(`Do you appeal most to poor states, middle class states, or wealthy states?\n*Please respond by saying only one of the following: 'poor', 'middle', or 'wealthy'. For a map, type* \`${config.prefix}incomemap\``);
					}
					else{
						client.users.cache.get("" + playerid).send("Please enter a whole number.");
					}
				}
				else{
					client.users.cache.get("" + playerid).send("Please enter a number between 0 and 100.");
				}
			}
			else{
				client.users.cache.get("" + playerid).send("Please enter a number.");
			}
		}
		else if(this.players[playerid].prompt == 4){
			if(value.toUpperCase() == "WEALTHY" || value.toUpperCase() == "MIDDLE" || value.toUpperCase() == "POOR"){
				this.players[playerid].rawstats[4] = value.toUpperCase();
				this.players[playerid].stats[4] = value.toUpperCase();
				this.players[playerid].prompt = 5;
				client.users.cache.get("" + playerid).send(`Which region is your home region?\n*Please respond by saying only one of the following: 'northeast', 'old south', 'midwest', 'southwest' or 'northwest'. For a map, type* \`${config.prefix}regionmap\``);
			}
		}
		else if(this.players[playerid].prompt == 5){
			if(value.toUpperCase() == "NORTHEAST" || value.toUpperCase() == "MIDWEST" || value.toUpperCase() == "OLD SOUTH" || value.toUpperCase() == "SOUTHWEST" || value.toUpperCase() == "NORTHWEST"){
				this.players[playerid].rawstats[5] = value.toUpperCase();
				this.players[playerid].stats[5] = value.toUpperCase();
				this.players[playerid].prompt = -1;
				client.users.cache.get("" + playerid).send("Thank you! Please wait for the other players to finish entering their stats.");
				client.channels.cache.get(this.channel).send(this.players[playerid].name + " has finished their stats.");
				let done = true;
				Object.keys(this.players).forEach(player =>{
					if(this.players[player].prompt != -1){
						done = false;
					}
				});
				if(done){
					this.startedreal = true;
					this.PrintStats();
					this.Turn();
				}
			}
		}
	}
}

class Player{
	constructor(playerid_, name_, color_){
		this.name = name_;
		this.playerid = playerid_;
		this.stats = [0, 0, 0, 0, "", ""];
		this.rawstats = [0, 0, 0, 0, "", ""];
		this.prompt = -1;
		this.stage = 0;
		this.campaignstops = [];
		this.color = color_;
		this.evs = 0;
		this.popularvote = 0;
		this.winner = false;
	}
}