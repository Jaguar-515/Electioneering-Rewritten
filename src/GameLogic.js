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

exports.Player = Player