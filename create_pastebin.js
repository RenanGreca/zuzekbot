//
// Format quotes in a readable way and save them to quotes.txt
//
const quotes = require("./quotes.json")

str = ""

quotes.forEach( function(value, idx) { 
    fs = require("fs");
    str = str + `#${value.id} ${value.username}: "${value.message}"\n`;
    fs.writeFile("quotes.txt", str,  (err) => {
        if (err) {
            return console.log(err);
        }
    });
});

//
// Upload quotes.txt to pastebin and saves the url on pastebin.json
//
const auth = require("./auth.json");

const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
      'api_dev_key':       auth.pastebinKey,
      'api_user_name':     'yawryck',
      'api_user_password': auth.pastebinPassword
    });

pastebin
    .createPasteFromFile("./quotes.txt", "Quotes", null, 1, "N")
    .then(function (data) {
        // we have succesfully pasted it. Data contains the id
        console.log(data);
        const fs = require("fs");
        fs.writeFile("pastebin.json", JSON.stringify( {"link": data}), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("Updating pastebin.json")
        });
    })
    .fail(function (err) {
        console.log(err);
    });
