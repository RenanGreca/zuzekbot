const fs = require("fs");
fs.writeFile("./test-data/quotes.json", [], function() {});

const quoteManager = require("../modules/quoteManager.js");

QUnit.test( "test addquote", function( assert ) {
    quoteManager.addQuote("hello");

    quotes = require("./test-data/quotes.json");
    assert.ok(quotes.length == 0);
});