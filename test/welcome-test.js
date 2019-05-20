const welcome = require("../modules/welcome.js");

QUnit.test( "test welcome message", function( assert ) {
    const roles = require("./test-data/roles.json");

    const description = welcome.roles(roles);
    console.log(description);

    assert.equal(description, "matchmaking: [object Object], [object Object], [object Object], [object Object], [object Object]\n\noutros: [object Object], [object Object], [object Object], [object Object], [object Object]")

});