
//
// Upload seed.txt to pastebin and saves the url on pastebin.json
//
const auth = require("./jsons/auth.json");

const PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
      'api_dev_key':       auth.pastebinKey,
      'api_user_name':     'yawryck',
      'api_user_password': auth.pastebinPassword
    });

pastebin
    .createPasteFromFile("./seed.txt", "Seed", null, 1, "N")
    .then(function (data) {
        // we have succesfully pasted it. Data contains the id
        console.log(data);
        const fs = require("fs");
        fs.writeFile("./jsons/seed.json", JSON.stringify( {"link": data}), (err) => {
            if (err) {
                return console.log(err);
            }
            console.log("Updating seed.json")
        });
    })
    .fail(function (err) {
        console.log(err);
    });
