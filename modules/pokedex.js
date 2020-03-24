const https = require("https");

function findPokemon(query, callback) {
  const url = "https://pokeapi.co/api/v2/pokemon/"+query;
  
  https
  .get(url, res => {
    let data = "";
    
    // Concatinate each chunk of data
    res.on("data", chunk => {
      data += chunk;
    });
    
    // Once the response has finished, do something with the result
    res.on("end", () => {
      if (data != "Not Found") {
        const pokemon_info = JSON.parse(data);
        callback(pokemon_info);
      } else {
        callback(null);
      }
    });
    // If an error occured, return the error to the user
  })
  .on("error", err => {
    res.json("Error: " + err.message);
  });
}

function capitalize(str) {
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

// var query = "sobble"
// findPokemon(query, function(pokemon_info) {
//   console.log(pokemon_info);
// });

var type_colors = {
  "Normal": 0xA9A87C,
  "Fire": 0xF47C3A,
  "Fighting": 0xC4282A,
  "Water": 0x5D92EB,
  "Flying": 0xA591EB,
  "Grass": 0xA591EB,
  "Poison": 0xA13E9C,
  "Electric": 0xFCCF4A,
  "Ground": 0xE3BF71,
  "Psychic": 0xFC5286,
  "Rock": 0xBB9F45,
  "Ice": 0x94D9D8,
  "Bug": 0xABB83B,
  "Dragon": 0x673BF1,
  "Ghost": 0x6E5895,
  "Dark": 0x715749,
  "Steel": 0xB7B8CF,
  "Fairy": 0xF197AB
}

module.exports = {
  findPokemon: function(query, callback) {
    return findPokemon(query.toLowerCase(), callback);
  },
  capitalize: function(str) {
    return capitalize(str);
  },
  type_colors: type_colors
}