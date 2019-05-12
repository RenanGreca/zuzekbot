var https = require("https");
var cheerio = require("cheerio");

function buildCountries($, tr, callback) {
  var countries = [];

  $(tr)
    .find("th")
    .each(function(index, th) {
      if (index == 0) {
        return;
      }

      var img = $(th).find("img")[0];

      var country = {
        name: $(img).attr("title"),
        emoji: $(img).attr("alt")
      };

      countries.push(country);
    });

  callback(countries);
}

function getTitle($, tr) {
  var th = $(tr).find("th")[0];
  var a = $(th).find("a")[0];
  var rowTitle = $(a).text();

  return rowTitle;
}

function findLowestPrice($, tr, callback) {
  $(tr)
    .find("td")
    .each(function(index, td) {
      if ($(td).attr("class") == "l") {
        // console.log($(td).text());
        var price = $(td).text();
        var country = index;

        callback(price, country);
        return;
      }
    });
}

function findGame(query, callback) {
  var title = "";
  var price = "";
  var country = {};
  var found = false;

  const url =
    "https://api-savecoins.nznweb.com.br/v1/games?currency=BRL&locale=en&filter[platform]=nintendo&order=popularity_desc&filter[title]=" +
    query;

  var req = https
    .get(url, res => {
      let data = "";

      // Concatinate each chunk of data
      res.on("data", chunk => {
        data += chunk;
      });

      // Once the response has finished, do something with the result
      res.on("end", () => {
        const game_info = JSON.parse(data).data[0];

        // console.log(game_info)
        callback(game_info);
      });

      // If an error occured, return the error to the user
    })
    .on("error", err => {
      res.json("Error: " + err.message);
    });
  // console.log('STATUS: ' + res.statusCode);
  // console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  // var bodyChunks = [];
  // res.on('data', function(chunk) {
  //   // You can process streamed parts here...
  //   bodyChunks.push(chunk);
  // }).on('end', function() {
  //   var body = Buffer.concat(bodyChunks);

  //   var $ = cheerio.load(body);

  //   var countries = []

  //   $('tr').each(function(index, tr) {
  //     if (index == 0) {

  //       buildCountries($, tr, function(countryList) {
  //         countries = countryList
  //       });

  //     }

  //     rowTitle = getTitle($, tr)

  //     if (!found && rowTitle.toLowerCase().indexOf(query) !== -1) {
  //       // console.log(title);
  //       found = true;
  //       title = rowTitle;

  //       findLowestPrice($, tr, function(foundPrice, foundCountryIndex) {
  //         price = foundPrice;
  //         country = countries[foundCountryIndex];
  //       });

  //       return;

  //     }
  //   });

  //   var message = '';
  //   if (title != '') {
  //     message = title+'\n'+price+' in the '+country.emoji+' '+country.name+' eShop!';
  //   }

  //     });

  //   });
}

// var query = 'asdasfasd'.toLowerCase();
// findGame(query, function(message) {
//   console.log(message);
// });

module.exports = {
  getPrice: function(query, callback) {
    return findGame(query.toLowerCase(), callback);
  }
};
