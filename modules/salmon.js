const https = require("https");
const auth = require("../jsons/auth.json");

function getSalmon(callback) {
  const url =
    "https://api.twitter.com/1.1/search/tweets.json?q=from%3Asalmon_en";

  const options = {
    hostname: "api.twitter.com",
    path: "/1.1/search/tweets.json?q=from%3Asalmon_en",
    method: "GET",

    headers: {
      authorization: "Bearer " + auth.twitterBearer,
      "content-type": "application/json"
    }
  };

  https
    .request(options, res => {      
      let data = "";

      // Concatinate each chunk of data
      res.on("data", chunk => {
        data += chunk;
      });

      // Once the response has finished, do something with the result
      res.on("end", () => {
        const tweets = JSON.parse(data);

        callback(tweets);
      });
    })
    .on("error", err => {
      res.json("Error: " + err.message);
    }).end();
}

// getSalmon(function(tweets) {
//   console.log(tweets.statuses[0].id_str);
// });

module.exports = {
  getSalmon: function(callback) {
    return getSalmon(callback);
  }
};
