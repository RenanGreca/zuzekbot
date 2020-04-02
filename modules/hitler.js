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
var votes = {};
var president = 0;
var chancellor = 0;
var prevPresident = -1;
var prevChancellor = -1;
var libPoints = 0;
var fasPoints = 0;
var electionTracker = 0;
var state = State.PREPARING;
var gameChannel;

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
    electionTracker = 0;
    state = State.PREPARING;
    gameChannel = null;

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
        isHitler: false,
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
        return "Not enough players";
    }

    assignRoles();
    shuffle(players);
    shuffle(deck);

    players = players;
    president = 0;
    state = State.STARTING;

    return "Game starting";
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

    players[0].isHitler = true;
    for (var i=0; i<numFascists; i++) {
        players[i].party = "Fascist";
    }
    for (i; i<players.length; i++) {
        players[i].party = "Liberal";
    }
}

function showBoard() {
    var board = ""
    board += "🔵 ".repeat(libPoints)
    board += "⬜️ ".repeat(4-libPoints)
    board += "🕊 \n"

    board += "🔴 ".repeat(fasPoints)
    board += "⬜️ ".repeat(5-fasPoints)
    board += "💀 \n"

    board += "Election tracker: "+electionTracker+"\n";
    board += "President: "+ players[president].user.username+"\n";

    return board;
}

function selectNextPresident() {
    prevPresident = president;
    prevChancellor = chancellor;
    president = (president+1) % players.length;
}

function sendChancellorCandidates() {
    var list = ""

    // TODO: skip previous president only if players > 5
    for (var i = 0; i<players.length; i++) {
        if (i != president && 
            (i != prevPresident || players.length == 5) && 
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
        
        return "Invalid argument";
    } else {
        // received number of candidate

        if (number == president) {
            // TODO: parse error
            return "Chancellor cannot be the president";
        }
        if (number > players.length) {
            // TODO: parse error
            return "Invalid candidate number";
        }

        chancellor = number-1;
        return "Set new chancellor: "+players[chancellor].user.username;
    }

}

function callForVotes() {

}

function receiveVote(userid, vote) {
    if (vote.toLowerCase() == "ja") {
        votes[userid] = 1;
        return "Your vote was: Ja";
    }
    
    if (vote.toLowerCase() == "nein") {
        votes[userid] = 0;
        return "Your vote was: Nein";
    }

    return "Invalid vote";
}

function listVotes() {
    var list = "";

    Object.keys(votes).forEach(function(userid) {
        list += userid+": "+(votes[userid] ? "Ja": "Nein")+"\n";
    });

    return list;
}

function countJaVotes() {
    var count = 0;

    Object.keys(votes).forEach(function(userid) {
        count += votes[userid];
    });

    return count;
}

function sendPresidentPolicies() {
    // TODO: if there are fewer than three items in the deck, reshuffle the discard pile

    sentPolicies = {
        arr: [],
        numLib: 0,
        numFas: 0
    }

    if (deck.length < 3) {
        deck = deck.concat(discard);
        shuffle(deck);
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

    // players[president].send("> "+"President, these are your policies: "+policies.join());

    return sentPolicies.arr.join(" ");
}

function receivePresidentPolicies(policy) {
    var index = sentPolicies.arr.indexOf(policy);

    if (index == -1) {
        // TODO process cheating player
        return 0;
    }

    sentPolicies.arr.splice(index, 1);
    if (policy == "🔵") {
        discard.push("🔵");
        sentPolicies.numLib -= 1;
    } else if (policy == "🔴") {
        discard.push("🔴");
        sentPolicies.numFas -= 1;
    }

    return 1;
}

function sendChancellorPolicies() {
    return sentPolicies.arr.join(" ");
}

function receiveChancellorPolicies(policy) {
    
    return receivePresidentPolicies(policy);
    // enactPolicy();
}

// TODO(Refactor): This code is almost the same from sendPresidentPolicies
function peekPolicy() {

    sentPolicies = {
        arr: [],
        numLib: 0,
        numFas: 0
    }

    if (deck.length < 3) {
        deck = deck.concat(discard);
        shuffle(deck);
    }

    for(int i=0; i<3; ++i) {
        const policy deck[deck.length-i-1];
        sentPolicies.arr.push(policy);
        if (policy == "🔵") {
            sentPolicies.numLib += 1;
        } else if (policy == "🔴") {
            sentPolicies.numFas += 1;
        }
    }

    var message = "President, there are the next 3 policies in order.";
    message += sentPolicies.arr.join(" ")+"\n";
    players[president].user.send("> "+message);
}

function investigate() {

    var list = "";
    players.filter(index => index != president);
    players.forEach(function (player) {
       list += player.user.username+"\n";
    });

    var message = "President, please choose a player to investigate."
    message += list;
    
    players[president].user.send("> "+message);

    
}

function checkFascistPowers() {

    if (players.length < 7 && (fasPoints == 3) {
    }
    
    if (players.length < 9) {
        if (fasPoints == 2) investigate();
        if (fasPoints == 3) chooseNextPresident();
    }

    if (fasPoints == 4 || fasPoints == 5) kill();
}

function enactPolicy(enacted) {
    state = State.ENACT_POLICY;

    if (enacted == "🔵") {
        libPoints += 1;
    } else if (enacted == "🔴") {
        fasPoints += 1;
    }

    return enacted;

    // sendChancellorCandidates();
}

function checkForWinState() {
    if (libPoints == 5) {
        return State.LIBS_WIN;
    }
    if (fasPoints == 6) {
        return State.FASC_WIN;
    }
    if (fasPoints >= 3 && players[chancellor].isHitler) {
        return State.HEIL_HITLER;
    }

    return state;
}

function listPlayers() {
    var list = ""
    
    players.forEach(function (player) {
        list += player.user.username + ": " + (player.isHitler ? "Hitler" : player.party) + "\n";
    });

    return list;
}

exports.processCommand = function processCommand(author, channel, args) {
    if (!Array.isArray(args) || args.length == 0) {
      args = [""];
    }
  
    let cmd = args[0];
    
    switch (cmd) {
        // group chat commands
        case "add":
            if (state == State.PREPARING) {
                addPlayer(author);
                channel.send("> "+"Player "+`${author}`+" added; "+players.length+ " player(s) in the game.");
            }
            break;
        case "new": case "reset":
            newGame();
            channel.send("> "+"Game reset");
            break;
        case "start":
            gameChannel = channel;

            gameChannel.send("> "+startGame());
            if (state == State.STARTING) {
                var listOfPlayers = listPlayers();
                players.forEach(function (player) {
                    player.user.send("> "+"Your party affiliation is "+player.party+".");
                    if (player.isHitler) {
                        player.user.send("> "+"You are Hitler.");
                    }
                    if (player.party == "Fascist" && !player.isHitler) {
                        player.user.send("> "+listOfPlayers);
                    }
                    if (player.isHitler && players.length <=6) {
                        player.user.send("> "+listOfPlayers);
                    }
                });
                channel.send("> "+showBoard());
                
                state = State.CHANCELLOR_NOMINATION;
                var message = "Time to nominate a Chancellor. Here are the candidates:\n";
                message += sendChancellorCandidates()+"\n";
                message += "Please select your choice with `!hitler chancellor [number]`.";
                gameChannel.send("> "+message);
            }
            break;
        case "view": case "show": case "board":
            channel.send("> "+showBoard());
            break;
        case "chancellor":

            if (state == State.CHANCELLOR_NOMINATION &&
                author.id == players[president].user.id) {
                gameChannel.send("> "+receiveChancellorCandidates(args[1]));

                state = State.ELECTION;
                players.forEach(function (player) {
                    var message = "Please vote Ja or Nein for the government of:\n";
                    message += "President: "+players[president].user.username+"\n";
                    message += "Chancellor: "+players[chancellor].user.username+"\n";
                    message += "Please vote with `!hitler vote [ja/nein]`";

                    player.user.send("> "+message);
                });
                // callForVotes();
            } else {
                channel.send("> "+"Corruption!");
            }
            
            break;

        // private commands
        case "vote":
            if (args.length < 2) {
                author.send("> "+"Please specify a vote.");
                break;
            }

            if (state == State.ELECTION) {
                var vote = args[1];
                var msg = receiveVote(author.username, vote);
                author.send("> "+msg);
            }

            // Check if all players have voted
            if (Object.keys(votes).length == players.length) {
                gameChannel.send("> "+"All votes received:");
                gameChannel.send("> "+listVotes());

                var count = countJaVotes();
                votes = {};

                if (count > players.length/2) {


                    // Ja wins, chancellor is selected
                    state = checkForWinState();
                    if (state == State.HEIL_HITLER) {
                        gameChannel.send("> "+"Heil Hitler! ");
                        break;
                    }

                    if (fasPoints > 3 && !players[chancellor].isHitler) {
                        players[chancellor].cnh = true;
                    }

                    state = State.PRESIDENT_POLICIES;
                    gameChannel.send("> "+"The president is selecting policies.");

                    var message = "President, please select the policy you wish to **discard**.";
                    message += sendPresidentPolicies()+"\n";
                    message += "Please select with `!hitler discard [🔵/🔴]`"
                    players[president].user.send("> "+message);

                    break;
                } else {
                    // Nein wins, government is skipped

                    gameChannel.send("> "+"Government was denied.");

                    state = State.PRESIDENT_NOMINATION;
                    electionTracker += 1;

                    if (electionTracker >= 3) {
                        if (deck.length == 0) {
                            deck = deck.concat(discard);
                            shuffle(deck);
                        }

                        var policy = deck.pop();

                        enactPolicy(policy);
                        discard.push(policy);
                        electionTracker = 0;

                        state = checkForWinState();
                        if (state == State.LIBS_WIN) {
                            gameChannel.send("> "+"Liberals win!");
                            break;
                        }
                        if (state == State.FASC_WIN) {
                            gameChannel.send("> "+"Fascists win!");
                            break;
                        }
                        gameChannel.send("> "+showBoard());

                        checkFascistPowers();
                    }

                    selectNextPresident();
                    gameChannel.send("> "+showBoard());

                    state = State.CHANCELLOR_NOMINATION;
                    var message = "Time to nominate a Chancellor. Here are the candidates:\n";
                    message += sendChancellorCandidates()+"\n";
                    message += "Please select your choice with `!hitler chancellor [number]`.";
                    gameChannel.send("> "+message);

                    break;
                }
                
            }
            break;

        case "discard":
            if (args.length < 2) {
                author.send("> "+"Please select a policy to discard.");
                break;
            }

            if (state == State.PRESIDENT_POLICIES &&
                author.id == players[president].user.id) {

                if (!receivePresidentPolicies(args[1])) {
                    author.send("> "+"Invalid policy");
                }

                state = State.CHANCELLOR_POLICIES;
                gameChannel.send("> "+"The chancellor is selecting policies.");

                var message = "Chancellor, please select the policy you wish to **discard**.";
                message += sendChancellorPolicies()+"\n";
                message += "Please select with `!hitler discard [🔵/🔴]`"
                players[chancellor].user.send("> "+message);

                break;
            }
            if (state == State.CHANCELLOR_POLICIES &&
                author.id == players[chancellor].user.id) {

                if (!receiveChancellorPolicies(args[1])) {
                    author.send("> "+"Invalid policy");
                }

                state = State.ENACT_POLICY;
                enactPolicy(sentPolicies.arr[0]);

                state = checkForWinState();
                if (state == State.LIBS_WIN) {
                    gameChannel.send("> "+"Liberals win!");
                    gameChannel.send("> "+showBoard());
                    break;
                }
                if (state == State.FASC_WIN) {
                    gameChannel.send("> "+"Fascists win!");
                    gameChannel.send("> "+showBoard());
                    break;
                }

                state = State.PRESIDENT_NOMINATION;
                selectNextPresident();
                gameChannel.send("> "+showBoard());

                state = State.CHANCELLOR_NOMINATION;
                var message = "Time to nominate a Chancellor. Here are the candidates:\n";
                message += sendChancellorCandidates()+"\n";
                message += "Please select your choice with `!hitler chancellor [number]`.";
                gameChannel.send("> "+message);

                break;
            }
            break;
        case "investigate":
            
            break;
            
        case "debug":
            debug();
            break;
        default:
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

function debug() {
    console.log("Players: "+players);
    console.log("Deck: "+deck);
    console.log("Discard pile: "+discard);
    console.log("Sent policies: "+sentPolicies);
    console.log("Votes: "+votes);
    console.log("Election tracker: "+electionTracker);
    console.log("Current president: "+president);
    console.log("Current chancellor: "+chancellor);
    console.log("Previous president: "+prevPresident);
    console.log("Previous chancellor: "+prevChancellor);
    console.log("Lib points: "+libPoints);
    console.log("Fas points: "+fasPoints);
    console.log("State: "+state);
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

    newGame();
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

test("test list players", function() {
    newGameWithFivePlayers();
}, function() {
    var list = listPlayers();
    var expected = "Naner: Liberal\nGuigas: Liberal\nmZuzek: Liberal\nYawryck: Liberal\nGeova: Liberal\n";
    return (list == expected);
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

test("test select president 1", function() {
    newGameWithFivePlayers();
    president = 1;
    selectNextPresident();
}, function() {
    return (president == 2);
});

test("test select president 2", function() {
    newGameWithFivePlayers();
    president = 4;
    selectNextPresident();
}, function() {
    return (president == 0);
});

test("test chancellor nomination", function () {
    newGameWithFivePlayers();
}, function() {
    var list = sendChancellorCandidates();
    var expected = "2. Guigas\n3. mZuzek\n4. Yawryck\n5. Geova\n";
    return (list == expected);
})

test("test chancellor selection", function() {
    newGameWithFivePlayers();
    receiveChancellorCandidates(4);
}, function() {
    var expected = 3;
    return (chancellor == expected);
});

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

test("test receive vote", function () {
    newGameWithFivePlayers();
}, function() {
    receiveVote("Naner", "Ja");
    return (Object.keys(votes).length);
});

test("test list votes", function () {
    newGameWithFivePlayers();
    receiveVote("Naner", "Ja");
    receiveVote("Guigas", "Nein");
}, function() {
    var list = listVotes();
    var expected = "Naner: Ja\nGuigas: Nein\n";
    return (list == expected);
});

test("test count votes", function() {
    newGameWithFivePlayers();
    receiveVote("Naner", "Ja");
    receiveVote("Guigas", "Nein");
    receiveVote("Yawryck", "Ja");
}, function() {
    var count = countJaVotes();
    var expected = 2;
    return (count == expected);
});
