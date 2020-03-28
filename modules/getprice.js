const https = require("https");

function findGame(query, curr, callback) {
  const url =
  "https://api-savecoins.nznweb.com.br/v1/games?" +
  "currency=" + curr + "&" +
  "locale=en&" +
  "filter[platform]=nintendo&" +
  "order=popularity_desc&" +
  "filter[title]=" + query;
  
  https
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
}

function getGameDetails(game_info, curr, callback) {
  
  var savecoinsurl = game_info.url.replace("http://", "https://");
  
  const url = 
  savecoinsurl + "/prices?" + 
  "currency=" + curr + "&" +
  "locale=en";
  
  https
  .get(url, res => {
    let data = "";
    
    // Concatinate each chunk of data
    res.on("data", chunk => {
      data += chunk;
    });
    
    // Once the response has finished, do something with the result
    res.on("end", () => {
      const price_list = JSON.parse(data);
      
      callback(price_list);
    });
    
    // If an error occured, return the error to the user
  })
  .on("error", err => {
    res.json("Error: " + err.message);
  });
}

function findCheapestCountry(price_details) {
  const blacklist = ["AR", "CO", "CL"];
  
  for(var i=0; i< price_details.length; i++) {
        
    if (blacklist.indexOf(price_details[i].priceInfo.country.code) == -1) {
      return price_details[i].priceInfo;
    }
    
  }
}

function findSpecificCountry(price_details, country) {
  
  for(var i=0; i<price_details.length; i++) {
    if (price_details[i].priceInfo.country.code == country.toUpperCase()) {
      return price_details[i].priceInfo;
    }
  }
  
  return 0;
}

// var query = 'smash bros.'.toLowerCase();
// findGame(query, 'BRL', function(game_info) {
//     console.log(game_info);
//     getGameDetails(game_info, 'BRL', function(details) {
//         console.log(details);
//     });
// });

module.exports = {
  findGame: function(query, curr, callback) {
    return findGame(query.toLowerCase(), curr.toUpperCase(), callback);
  },
  
  getGameDetails: function(game_info, curr, callback) {
    return getGameDetails(
      game_info,
      curr.toUpperCase(),
      callback
      );
    },
    
    findCheapestCountry: function(price_details) {
      return findCheapestCountry(price_details);
    },
    
    findSpecificCountry: function(price_details, country) {
      return findSpecificCountry(price_details, country);
    }
  };
  