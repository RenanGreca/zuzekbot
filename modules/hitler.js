var exports = module.exports = {};

// var hitlerdata = require("../jsons/hitlerdata.json");

// Game states
const PREPARING = 0;
const STARTING = 1;
const CHANCELLOR_NOMINATION = 2;
const PRESIDENT_POLICIES = 3;
const CHANCELLOR_POLICIES = 4;
const ENACT_POLICY = 5;


exports.gamedata = {
    "players": 
    [
        
    ],
    "policies": [
        "🔵","🔵","🔵","🔵","🔵","🔵",
        "🔴","🔴","🔴","🔴","🔴","🔴",
        "🔴","🔴","🔴","🔴","🔴"
    ],
    "discard": [
        ""
    ],
    "president": "",
    "chancellor": "",
    "libPoints": 0,
    "fasPoints": 0,
    "state": PREPARING
};

exports.newGame = function newGame() {
    var hitlerdata = {
        "players": 
        [
            
        ],
        "policies": [
            "🔵","🔵","🔵","🔵","🔵","🔵",
            "🔴","🔴","🔴","🔴","🔴","🔴",
            "🔴","🔴","🔴","🔴","🔴"
        ],
        "discard": [
            ""
        ],
        "president": "",
        "chancellor": "",
        "libPoints": 0,
        "fasPoints": 0,
        "state": PREPARING
    };

    exports.gamedata = hitlerdata;
    // saveToFile();
}

exports.addPlayer = function addPlayer(user) {
    if (exports.gamedata.players.length >= 10) {
        console.log("Too many players.");
        return;
    }

    var player = {
        "user": user,
        "party": "Liberal",
        "hitler": false
    };
    
    exports.gamedata.players.push(player);
    // saveToFile();
}

exports.startGame = function startGame() {
    var players = exports.gamedata.players;

    if (players.length < 1) {
        console.log("Not enough players.");
        return;
    }

    shuffle(players);

    var numFascists = 1;
    if (players.length >= 5) {
        numFascists = 2;
    } else if (players.length >= 7) {
        numFascists = 3;
    } else if (players.length >= 9) {
        numFascists = 4;
    }

    players[0].hitler = true;
    for (var i=0; i<numFascists; i++) {
        players[i].party = "Fascist";
    }
    for (i; i<players.length; i++) {
        players[i].party = "Liberal";
    }

    shuffle(players);
    shuffle(exports.gamedata.policies);

    exports.gamedata.players = players;
    exports.gamedata.president = players[0].user;
    exports.gamedata.state = STARTING;
    // saveToFile();
}

exports.showBoard = function showBoard() {

    var libPoints = exports.gamedata.libPoints;
    var fasPoints = exports.gamedata.fasPoints;

    var lib = ""
    lib += "🔵 ".repeat(libPoints)
    lib += "⬜️ ".repeat(4-libPoints)
    lib += "🕊 "

    var fas = ""
    fas += "🔴 ".repeat(fasPoints)
    fas += "⬜️ ".repeat(5-fasPoints)
    fas += "💀 "

    var gov = ""
    gov += "President: "+exports.gamedata.president.username;

    return lib+"\n"+fas+"\n"+gov;
}

exports.sendPresidentPolicies = function sendPresidentPolicies() {
    exports.gamedata.state = PRESIDENT_POLICIES;

    var deck = exports.gamedata.policies;

    var policies = [deck.pop(), deck.pop(), deck.pop()];
    console.log(policies);

    exports.gamedata.president.send("President, these are your policies: "+policies.join());
}

exports.receivePresidentPolicies = function receivePresidentPolicies() {

}

exports.listPlayers = function listPlayers() {
    var list = ""
    
    this.gamedata.players.forEach(function (player) {
        list += player.user.username + ": " + (player.hitler ? "Hitler" : player.party) + "\n";
    });

    return list;
}

exports.processCommand = function processCommand(author, channel, args) {
    if (!Array.isArray(args) || args.length == 0) {
      args = [""];
    }
  
    let cmd = args[0];
    
    switch (cmd) {
        case "add":
            this.addPlayer(author);
            channel.send("Player "+`${author}`+" added; "+this.gamedata.players.length+ " player(s) in the game.");
            break;
        case "new":
            this.newGame();
            channel.send("Game reset");
            break;
        case "start":
            this.startGame();
            if (this.gamedata.state == STARTING) {
                var listOfPlayers = this.listPlayers();
                this.gamedata.players.forEach(function (player) {
                    player.user.send("Your party affiliation is "+player.party+".");
                    if (player.hitler) {
                        player.user.send("You are Hitler.");
                    }
                    if (player.party == "Fascist") {
                        player.user.send(listOfPlayers);
                    }
                });
                channel.send(this.showBoard());
                
                this.sendPresidentPolicies();
            }
            break;
    }
}

function saveToFile() {
    const jsonData = JSON.stringify(exports.gamedata);
    const fs = require("fs");
    fs.writeFile("jsons/hitlerdata.json", jsonData, 
    function(err) {
        if (err) {
            console.log(err);
            // message.react("❎"); 
        } else {
            // message.react("✅"); 
        }
    });
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// exports.newGame();
// exports.addPlayer("<@189096616043479041>");
// exports.startGame();
// console.log(exports.showBoard());