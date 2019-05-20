const getprice = require("../getprice.js");

QUnit.test( "test find game", function( assert ) {
    const query = 'smash bros.'.toLowerCase();
    const curr = 'BRL';

    var done = assert.async();
    getprice.findGame(query, curr, function(game_info) { 
        assert.equal("Super Smash Bros. Ultimate", game_info.title);
        done();
    })

});

QUnit.test( "test get game details", function( assert ) {
    const game_info = require("./test-data/smashbros.json");
    const curr = 'BRL'; 

    var done = assert.async();
    getprice.getGameDetails(game_info, curr, function(price_info) {
        assert.ok(price_info.digital.length() > 0)
        done();
    })

});