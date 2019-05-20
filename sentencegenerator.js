var exports = module.exports = {};

var words = require("./jsons/words.json");

exports.shuffle = function shuffle(string) {
    function isVowel(a) {
        const vowels = "aáàâãeéêiíoóôõuúüyAÁÀÂÃEÉÊIÍOÓÔÕUÚÜY".split("");
        return vowels.indexOf(a) != -1;
    }
    
    function isPunctuation(a) {
        const punctuation = " .,!?:;\"'`".split("");
        return punctuation.indexOf(a) != -1;
    }
    
    function isConsonant(a) {
        const consonants = "bcdfghjklmnpqrstvwxzçBCDFGHJKLMNPQRSTVWXZÇ".split("");
        return consonants.indexOf(a) != -1;
    }
    
    const a = string.split(""),
    n = a.length;
    
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        // Don't swap punctuation
        if (isPunctuation(a[i]) || isPunctuation(a[j])) {
            continue;
        }
        
        if ((isVowel(a[i]) && isVowel(a[j])) ||
        (isConsonant(a[i]) && isConsonant(a[j]))) {
            const tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
    }
    return a.join("");
}

exports.generateSentence = function generateSentenceOfLength(length, start) {
    
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
    if (words[start.toLowerCase()]) {
        word = start
    }
    console.log(word)
    var sentence = word;
    var lastword = ""
    var nextword = ""
    
    for (var i = 1; i < length; i++) {
        var rng = Math.random();
        
        var index = (lastword+" "+word).toLowerCase();
        if (words[index] != null && words[index].length > 0 && rng < 0.7) {
            nextword = pickRandomObject(words[index]);
        } else {
            index = word.toLowerCase();
            if (words[index] != null && words[index].length > 0) {
                nextword = pickRandomObject(words[index]);
            } else {
                break;
            }
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

// console.log(generateSentenceOfLength(4, "EMANOS"))