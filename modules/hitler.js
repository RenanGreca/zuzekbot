var exports = module.exports = {};

// var hitlerdata = require("../jsons/hitlerdata.json");

// Game states
const State = {
    PREPARING: 0,
    STARTING: 1,
    PRESIDENT_NOMINATION: 2,
    CHANCELLOR_NOMINATION: 3,
    ELECTION: 4,
    PRESIDENT_POLICIES: 5,
    CHANCELLOR_POLICIES: 6,
    ENACT_POLICY: 7,
    LIBS_WIN: 8,
    FASC_WIN: 9,
    HEIL_HITLER: 10
}

var players = [];
var deck =  [
                    "🔵","🔵","🔵","🔵","🔵","🔵",
                    "🔴","🔴","🔴","🔴","🔴","🔴",
                    "🔴","🔴","🔴","🔴","🔴"
                ];
var discard = [];
var sentPolicies = [];
var president = 0;
var chancellor = 0;
var prevPresident = -1;
var prevChancellor = -1;
var libPoints = 0;
var fasPoints = 0;
var state = State.PREPARING;

function newGame() {
    players = [];
    deck =  [
                        "🔵","🔵","🔵","🔵","🔵","🔵",
                        "🔴","🔴","🔴","🔴","🔴","🔴",
                        "🔴","🔴","🔴","🔴","🔴"
                    ];
    discard = [];
    sentPolicies = [];
    votes = {};
    president = 0;
    chancellor = 0;
    prevPresident = -1;
    prevChancellor = -1;
    libPoints = 0;
    fasPoints = 0;
    state = State.PREPARING;

    // saveToFile();
}

function addPlayer(user) {
    if (players.length >= 10) {
        // TODO: Handle error
        console.log("Too many players.");
        return;
    }

    var player = {
        user: user,
        party: "Liberal",
        hitler: false,
        dead: false,
        cnh: false
    };
    
    players.push(player);
    // saveToFile();
}

function startGame() {
    if (players.length < 5) {
        // TODO: Handle error
        console.log("Not enough players.");
        return;
    }

    assignRoles();
    shuffle(players);
    shuffle(deck);

    players = players;
    president = 0;
    state = State.STARTING;
    // saveToFile();
}

function assignRoles() {
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
}

function showBoard() {
    var lib = ""
    lib += "🔵 ".repeat(libPoints)
    lib += "⬜️ ".repeat(4-libPoints)
    lib += "🕊 "

    var fas = ""
    fas += "🔴 ".repeat(fasPoints)
    fas += "⬜️ ".repeat(5-fasPoints)
    fas += "💀 "

    var gov = ""
    gov += "President: "+ players[president].user.username;

    return lib+"\n"+fas+"\n"+gov;
}

function sendChancellorCandidates() {

    state = State.CHANCELLOR_NOMINATION;

    var list = ""

    // TODO: skip previous chancellor only if players > 5
    for (var i = 0; i<players.length; i++) {
        if (i != president && 
            i != prevPresident && 
            i != prevChancellor) {
            list += (i+1)+". "+players[i].user.username+(players[i].cnh ? " (CNH)" : "")+"\n";
        }
    }

    return list;
}

function receiveChancellorCandidates(candidate) {

    var number = parseInt(candidate);
    if (isNaN(number)) {
        // received name of candidate
        // TODO: parse name and find the number
        // TODO until then: parse error

    } else {
        // received number of candidate

        if (number == president) {
            // TODO: parse error
            return "Chancellor cannot be the president";
        }
        if (number >= players.length) {
            // TODO: parse error
            return "Invalid candidate number";
        }

        chancellor = number;
    }

    sendPresidentPolicies();
}

function callForVotes() {

}

function receiveVote(vote) {
    if (vote.toLowerCase() == "ja") {

    } else if (vote.toLowerCase() == "nein") {
        
    } else {
        return "Invalid vote";
    }
}

function sendPresidentPolicies() {
    state = State.PRESIDENT_POLICIES;

    // TODO: if there are fewer than three items in the deck, reshuffle the discard pile

    sentPolicies = {
        arr: [],
        numLib: 0,
        numFas: 0
    }

    for (var i=0; i<3; i++) {
        var policy = deck.pop();
        sentPolicies.arr.push(policy)
        if (policy == "🔵") {
            sentPolicies.numLib += 1;
        } else if (policy == "🔴") {
            sentPolicies.numFas += 1;
        }
    }

    sentPolicies.arr.sort();

    // players[president].send("President, these are your policies: "+policies.join());

    return sentPolicies.arr.join(" ");
}

function receivePresidentPolicies(policy) {

    // var receivedPolicies = sentPolicies;
    var index = sentPolicies.arr.indexOf(policy);

    if (index == -1) {
        // TODO process cheating player
        return "Invalid policies";
    }

    sentPolicies.arr.splice(index, 1);
    if (policy == "🔵") {
        discard.push("🔵");
        sentPolicies.numLib -= 1;
    } else if (policy == "🔴") {
        discard.push("🔴");
        sentPolicies.numFas -= 1;
    }

    return sentPolicies.arr.join(" ");

    // sendChancellorPolicies();
}

function sendChancellorPolicies(policies) {
    state = State.CHANCELLOR_POLICIES;

    return sentPolicies.arr.join(" ");
}

function receiveChancellorPolicies(policy) {
    
    return receivePresidentPolicies(policy);
    // enactPolicy();
}

function enactPolicy() {
    state = State.ENACT_POLICY;

    var enacted = sentPolicies.arr[0];

    if (enacted == "🔵") {
        libPoints += 1;
    } else if (enacted == "🔴") {
        fasPoints += 1;
    }

    return enacted;

    // sendChancellorCandidates();
}

function listPlayers() {
    var list = ""
    
    players.forEach(function (player) {
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
            addPlayer(author);
            channel.send("Player "+`${author}`+" added; "+players.length+ " player(s) in the game.");
            break;
        case "new":
            newGame();
            channel.send("Game reset");
            break;
        case "start":
            startGame();
            if (state == State.STARTING) {
                var listOfPlayers = listPlayers();
                players.forEach(function (player) {
                    player.user.send("Your party affiliation is "+player.party+".");
                    if (player.hitler) {
                        player.user.send("You are Hitler.");
                    }
                    if (player.party == "Fascist" && !player.hitler) {
                        player.user.send(listOfPlayers);
                    }
                });
                channel.send(showBoard());
                
                players[president].send(sendChancellorCandidates());
            }
            break;
        case "vote":
            if (state == State.ELECTION) {
                var vote = args[1];
                receiveVote(vote);
            }
            break;
        case "debug":
            debug();
            break;
        default:
            if (state == State.PRESIDENT_POLICIES) {
                receivePresidentPolicies();
            }
            if (state == State.CHANCELLOR_POLICIES) {
                receiveChancellorPolicies();
            }
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

function debug() {
    console.log(players);
    console.log(deck);
    console.log(discard);
    console.log(sentPolicies);
    console.log(president);
    console.log(chancellor);
    console.log(prevPresident);
    console.log(prevChancellor);
    console.log(libPoints);
    console.log(fasPoints);
    console.log(state);
}

// ----- TESTS -----

function test(name, steps, assertion) {
    console.log(name);

    steps();
    
    if (assertion()) {
        console.log("OK");
    } else {
        console.log("FAILED");
    }
}

function newGameWithFivePlayers() {
    newGame();
    addPlayer({ 'username': 'Naner' });
    addPlayer({ 'username': 'Guigas' });
    addPlayer({ 'username': 'mZuzek' });
    addPlayer({ 'username': 'Yawryck' });
    addPlayer({ 'username': 'Geova' });
}

test("test reset the game", function() {

    newGame();
    addPlayer("<@189096616043479041>");
    newGame();

}, function() {
    return (players.length == 0);
});

test("test add a player", function() {

    newGame();
    addPlayer({ 'username': 'Naner' });
    
}, function() {
    return (players.length == 1);
});

test("test start a match", function() {
    newGameWithFivePlayers();
    startGame();
}, function() {
    return (players.length == 5);
});

test("test show the board", function() {
    newGameWithFivePlayers();

    libPoints = 2;
    fasPoints = 3;

}, function() {
    var board = showBoard();
    var expected = "🔵 🔵 ⬜️ ⬜️ 🕊 \n🔴 🔴 🔴 ⬜️ ⬜️ 💀 \nPresident: Naner";
    return (board == expected);
});

test("test chancellor nomination", function () {
    newGameWithFivePlayers();
}, function() {
    var list = sendChancellorCandidates();
    var expected = "2. Guigas\n3. mZuzek\n4. Yawryck\n5. Geova\n";
    return (list == expected);
})

test("test send president policies", function () {
    newGameWithFivePlayers();
}, function() {
    var policies = sendPresidentPolicies();
    var expected = "🔴 🔴 🔴";
    return (policies == expected);
})

test("test receive valid president policies", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔴','🔵','🔵'],
        numLib: 2,
        numFas: 1
    };
}, function() {
    var result = receivePresidentPolicies("🔵");
    var expected = "🔴 🔵";
    return (result == expected && discard[0] == "🔵");
})

test("test receive invalid president policies", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔴','🔵','🔵'],
        numLib: 2,
        numFas: 1
    };
}, function() {
    var result = receivePresidentPolicies("🔴 🔴");
    var expected = "Invalid policies";
    return (result == expected);
})

test("test receive valid chancellor policies", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔴','🔵'],
        numLib: 1,
        numFas: 1
    };
}, function() {
    var result = receiveChancellorPolicies("🔴");
    var expected = "🔵";
    return (result == expected && discard[0] == "🔴");
})

test("test receive invalid chancellor policies", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔵','🔵'],
        numLib: 2,
        numFas: 0
    };
}, function() {
    var result = receiveChancellorPolicies("🔴");
    var expected = "Invalid policies";
    return (result == expected);
})

test("test enact policy", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔵'],
        numLib: 1,
        numFas: 0
    };
}, function() {
    var result = enactPolicy();
    var expected = "🔵";
    return (result == expected && libPoints == 1);
})

test("test enact fascist policy", function () {
    newGameWithFivePlayers();
    sentPolicies = {
        arr: ['🔴'],
        numLib: 0,
        numFas: 1
    };
    fasPoints = 2;
}, function() {
    var result = enactPolicy();
    var expected = "🔴";
    return (result == expected && fasPoints == 3);
})