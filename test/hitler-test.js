const hitler = require("../modules/hitler.js");

QUnit.test("test reset the game", function(assert) {

    hitler.newGame();
    hitler.addPlayer("<@189096616043479041>");
    hitler.newGame();

    var players = hitler.gamedata.players;

    assert.ok(players.length == 0);

});

QUnit.test("test add a player", function(assert) {

    hitler.newGame();
    hitler.addPlayer("<@189096616043479041>");

    var players = hitler.gamedata.players;

    assert.ok(players.length == 1);
});

QUnit.test("test start a match", function(assert) {

    hitler.newGame();
    hitler.addPlayer("Naner");
    hitler.addPlayer("Guigas");
    hitler.addPlayer("mZuzek");
    hitler.addPlayer("Yawryck");
    hitler.addPlayer("Geova");
    hitler.startGame();

    var players = hitler.gamedata.players;

    console.log(players);
    assert.ok(players.length == 5);

});

QUnit.test("test show the board", function(assert) {

    hitler.newGame();
    hitler.addPlayer("Naner");
    hitler.addPlayer("Guigas");
    hitler.addPlayer("mZuzek");
    hitler.addPlayer("Yawryck");
    hitler.addPlayer("Geova");
    hitler.startGame();

    hitler.gamedata.libPoints = 2;
    hitler.gamedata.fasPoints = 3;

    console.log(hitler.showBoard());
    assert.ok(true);
});

QUnit.test("test president policies", function(assert) {

    hitler.newGame();
    hitler.addPlayer("Naner");
    hitler.addPlayer("Guigas");
    hitler.addPlayer("mZuzek");
    hitler.addPlayer("Yawryck");
    hitler.addPlayer("Geova");
    hitler.startGame();

    hitler.presidentPolicies();
    
    assert.ok(true);
});