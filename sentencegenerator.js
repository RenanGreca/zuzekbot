var words = require("./words.json");

function generateSentenceOfLength(length, start) {

    // Picks a random property of the dictionary to start off
    function pickRandomProperty(obj) {
      var result;
      var count = 0;
      for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
      return result;
    }
  
    // Picks a random element of an array
    function pickRandomObject(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // Checks if a word is a preposition
    function isPreposition(word) {
        var prepositions = [
            "o", "a", "os", "as", "um", "uns", "uma", "umas",                         // Artigos
            "em", "no", "na", "nos", "nas", "num", "nuns", "numa", "numas",           // Em
            "de", "do", "da", "dos", "das", "dum", "duma", "duns", "dumas",           // De
            "para", "pro", "pros", "pra", "pras", "prum", "pruns", "pruma", "prumas", // Para
            "pelo", "pela", "pelos", "pelas",                                         // Pelo
            "entre", "ante", "com", "desde", "por", "sob", "sobre",                   // Preposições
            "e", "ou", "mas", "que", "porém", "senão", "se", "porque",                // Conectivos
            "tão", "bem", "tem", "têm", "são"
        ];
        return prepositions.indexOf(word) != -1;
    }
  
    var word = pickRandomProperty(words);
    if (words[start]) {
        word = start
    }
    console.log(word)
    var sentence = word;
    var lastword = ""
    var nextword = ""

    for (var i = 1; i < length; i++) {
      var rng = Math.random();
      
      if (words[lastword+" "+word] != null && words[lastword+" "+word].length > 0 && rng < 0.7) {
        nextword = pickRandomObject(words[lastword+" "+word]);
      } else if (words[word] != null && words[word].length > 0) {
        nextword = pickRandomObject(words[word]);
      } else {
        break;
      }
  
      var sentence = sentence + " " + nextword;
      lastword = word;
      word = nextword;

      if (i == length-1 && isPreposition(word)) {
          i -= 1;
      }
    }
  
    return sentence;
  }

console.log(generateSentenceOfLength(4, "O"))

module.exports = {
    generateSentence: function(length, word) {
       return generateSentenceOfLength(length, word);
    }
 }