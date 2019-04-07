var Discord = require("./node_modules/discord.io");
var math = require("./node_modules/mathjs");
// var logger = require('./node_modules/winston');
var auth = require("./auth.json");
var channels = require("./channels.json");
var quotes = require("./quotes.json");
var reactions = require("./reactions.json");
var roles = require("./roles.json");
var ids = require("./ids.json");
var feedbacks = require("./feedback.json");
var price = require("./getprice.js");
var prints = require("./prints.json")
var sentenceGenerator = require("./sentencegenerator.js");
var words = require("./words.json");

var timer = require("timers");
// import {findGame} from 'getprice';

var serverID = ids.serverID;
var zuzekbotID = ids.zuzekbotID;

var isShuttingUp = false;

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on("ready", function(evt) {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.username + " - (" + bot.id + ")");

  // var jsonData = JSON.stringify(bot.servers);
  // var fs = require('fs');
  // fs.writeFile("servers.json", jsonData, function(err) {
  //     if (err) {
  //         console.log(err);
  //     }
  // });
});

bot.on("message", function(user, userID, channelID, message, evt) {
  console.log("user: " + user + " - (" + userID + ")");
  console.log("channel: " + channelID);
  console.log("message: " + message);

  if (message.toLowerCase().indexOf("good bot") !== -1) {
    goodbot(channelID);
    return;
  }

  if (message.toLowerCase().indexOf("bad bot") !== -1) {
    badbot(channelID);
    return;
  }

  if (
    message.toLowerCase().indexOf("indiano") !== -1 &&
    (userID == "447525339187380264" || userID == "484118307046162434")
  ) {
    angry(channelID);
    return;
  }

  // commands start with "!"
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      // !ping
      case "ping":
        ping(channelID);
        break;

      case "calc":
        calc(userID, channelID, args.join(" "));
        break;

      case "pin":
        pin(channelID);
        break;

      case "slap":
        slap(userID, channelID, args.join(" "));
        break;

      case "savequote":
        savequote(channelID);
        break;

      case "addquote":
        savequote(channelID);
        break;

      // case 'removequote':
      //   removequote(userID, channelID);
      // break;

      case "quote":
        quote(userID, channelID, args);
        break;

      case "listquotes":
        listquotes(channelID);
        break;

      case "removequote":
        removequote(userID, channelID, args);
        break;

      case "generate":
        generatebot(channelID, args);
        break;
    
      case "shuffle":
        shuffler(channelID);
        break;

      case "print":
        printbot(channelID);
        break;

      case "addroles":
        addroles(userID, channelID, args);
        break;

      case "feedback":
        feedback(user, userID, channelID, args);
        break;

      case "price":
        getPrice(userID, channelID, args);
        break;

      case "duck":
        duck(channelID, args);
        break;

      case "trailer":
        trailer(channelID, args);
        break;

      case "wiki":
        wiki(channelID, args);
        break;

      case "direct":
        direct(channelID);
        break;

      case "diceroll":
        diceroll(userID, channelID, args);
        break;

      case "shutup":
        shutup(userID, channelID, args);
        break;

      case "calaboca":
        shutup(userID, channelID, args);
        break;

      case "comeback":
        comeback();
        break;

      case "list":
        displayCommands(channelID);
        break;

      case "help":
        displayHelp(userID, channelID, args);
        break;
    }

    return;
  }

  if (userID == zuzekbotID) {
    return;
  }

  if (channelID != channels.geral && channelID != channels.memechannel) {
    return;
  }

  if (userID == 115885540494147589) {
    guigasbot(channelID);
    return;
  }

  if (message == "") {
    return;
  }

  // emanosbot
  if (message.substring(0, 4) == "http") {
    emanosbot(channelID);
    return;
  }

  if (
    message.toLowerCase().indexOf("obrigado") !== -1 ||
    message.toLowerCase().indexOf("thanks") !== -1 ||
    message.toLowerCase().indexOf("thank you") !== -1
  ) {
    yourewelcome(channelID);
    return;
  }

  //if (message.toLowerCase().indexOf(' mestre') !== -1 ||
  //    message.toLowerCase().indexOf(' master') !== -1) {
  //  master(channelID);
  //  return;
  //}

  if (message == "o/") {
    highfive(channelID);
    return;
  }

  var randomMessageChance = Math.random();
  //   shufflebot(message, channelID);
  // generatebot(channelID);

  console.log("randomMessageChance: " + randomMessageChance);
  if (randomMessageChance < 0.05 && !isShuttingUp) {
    var whichMessageChance = Math.random();
    console.log("whichMessageChance: " + whichMessageChance);
    if (whichMessageChance < 0.2) {
      carabot(message, channelID);
    } else if (whichMessageChance < 0.35) {
      emojibot(channelID);
    } else if (whichMessageChance < 0.37) {
      spoilerbot(channelID);
    } else if (whichMessageChance < 0.56) {
      generatebot(channelID);
    } else if (whichMessageChance < 0.7) {
      shufflebot(message, channelID);
    } else {
      quotebot(channelID, true);
    }
  }
  //   else if (randomMessageChance < 0.2 && !isShuttingUp) {
  //     generatebot(channelID);
  //   }
});

function shutup(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID);
    return;
  }

  var minutes = parseInt(args[0]);
  // max one hour
  if (minutes > 60) {
    minutes = 60;
  }

  var duration = minutes * 1000 * 60;
  isShuttingUp = true;

  timer.setInterval(comeback, duration);
}

function comeback() {
  isShuttingUp = false;
}

function angry(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ":rage:",
    typing: true
  });
}

function emanosbot(channelID) {
  var emanos = Math.random();

  console.log("emanos chance: " + emanos);
  if (emanos < 0.1) {
    bot.sendMessage({
      to: channelID,
      message: "old",
      typing: true
    });
  }
}

function carabot(message, channelID) {
  var punctuation = Math.random();
  var contents = "";
  if (punctuation < 0.3) {
    contents = "Cara, " + message + "?";
  } else if (punctuation < 0.6) {
    contents = "Cara, " + message + "!";
  } else if (punctuation < 0.9) {
    contents = "Cara, " + message + ".";
  } else {
    contents = "cara";
  }

  bot.sendMessage({
    to: channelID,
    message: contents,
    typing: true
  });
}

function shufflebot(message, channelID) {
  function isVowel(a) {
    var vowels = "aáàâãeéêiíoóôõuúüyAÁÀÂÃEÉÊIÍOÓÔÕUÚÜY".split("");
    return vowels.indexOf(a) != -1;
  }

  function isPunctuation(a) {
    var punctuation = " .,!?:;\"'`".split("");
    return punctuation.indexOf(a) != -1;
  }

  function isConsonant(a) {
    var consonants = "bcdfghjklmnpqrstvwxzçBCDFGHJKLMNPQRSTVWXZÇ".split("");
    return consonants.indexOf(a) != -1;
  }

  String.prototype.shuffle = function() {
    var a = this.split(""),
      n = a.length;

    for (var i = n - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));

      // Don't swap punctuation
      if (isPunctuation(a[i]) || isPunctuation(a[j])) {
        continue;
      }

      if (
        (isVowel(a[i]) && isVowel(a[j])) ||
        (isConsonant(a[i]) && isConsonant(a[j]))
      ) {
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
    }
    return a.join("");
  };

  bot.sendMessage({
    to: channelID,
    message: message.shuffle(),
    typing: true
  });
}

function generatebot(channelID, args) {
  // choose sentence length and starting word
  var length = Math.ceil(Math.random() * 15);
  var start = "";
  if (args && args.length > 0 && !isNaN(args[0]) && args[0] > 0) {
    length = args[0];
  }

  if (args && args.length > 0 && isNaN(args[0])) {
    start = args[0];
  } else if (args && args.length > 1) {
    start = args[1];
  }

  var sentence = sentenceGenerator.generateSentence(length, start);

  if (args.indexOf("!shuffle") != -1) {
      shufflebot(sentence, channelID)
  } else {
    bot.sendMessage({
        to: channelID,
        message: sentence,
        typing: true
    });
  }
}

function shuffler(channelID) {
    bot.getMessages(
        {
          channelID: channelID,
          limit: 2
        },
        function(err, messageArray) {
          console.log("Saving message");
    
          var message = messageArray[1];

          shufflebot(message.content, channelID);
        }
    );
}

function emojibot(channelID) {
  var emojicombos = [
    "<:will:466272230330990603> :ok_hand: ",
    "<:Zuzek:476498123154522112> :sweat_drops: ",
    ":hammer: <:Guigas:513779475096403979>",
    "<:geovarage:476503278893400079> :knife:",
    ":gun: <:emanos:466283967075713024>",
    "<:pk2:476498159732916227> :dagger:",
    "<:surprisedpikachu:514476225415217152>",
    ":duck:"
  ];

  var emoji = emojicombos[Math.floor(Math.random() * emojicombos.length)];

  bot.sendMessage({
    to: channelID,
    message: emoji,
    typing: true
  });
}

function guigasbot(channelID) {
  var guigas = Math.random();

  console.log("guigas chance: " + guigas);
  if (guigas < 0.1) {
    bot.sendMessage({
      to: channelID,
      message: ":hammer: <:Guigas:513779475096403979>",
      typing: true
    });
  }
}

function spoilerbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: "caralho, spoilers",
    typing: true
  });
}

function quotebot(channelID, typing) {
  var quote = quotes[Math.floor(Math.random() * quotes.length)];
  bot.sendMessage({
    to: channelID,
    message: quote.message + " (#" + quote.id + ")",
    typing: typing
  });
}

function printbot(channelID) {
    var print = prints[Math.floor(Math.random() * prints.length)];

    bot.sendMessage({
      to: channelID,
      message: print,
      typing: false
    });
  }

function removequote(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID);
    return;
  }

  var quoteID = parseInt(args[0]);
  var quoteIndex = findQuoteIndexWithID(quoteID);

  if (quoteIndex == -1) {
    trouxa(userID, channelID);
    return;
  }

  var quote = quotes[quoteIndex];

  // If there are enough votes, remove the quote
  if (quote.votes == 4) {
    bot.sendMessage({
      to: channelID,
      message:
        "5/5 votes for the removal of quote #" + quoteID + ": " + quote.message
    });

    quotes.splice(quoteIndex, 1);
    saveQuotesToFile(function(err) {
      if (err) {
        console.log(err);
      } else {
        bot.sendMessage({
          to: channelID,
          message: "Quote #" + quoteID + " removed."
        });
      }
    });

    return;
  }

  // Check to see if the user already voted for this removal
  if (quote.voters.indexOf(userID) != -1) {
    bot.sendMessage({
      to: channelID,
      message: "<:FasHitler:474060823392944130>" //<:FasLizard:474061707258363904>'
    });

    return;
  }

  // Otherwise, add the vote and the user to the object
  quote.votes += 1;
  quote.voters.push(userID);
  saveQuotesToFile(function(err) {
    if (err) {
      console.log(err);
    } else {
      bot.sendMessage({
        to: channelID,
        message:
          quotes[quoteIndex].votes +
          "/5 votes for the removal of quote #" +
          quoteID +
          ": " +
          quote.message
      });
    }
  });
}

function goodbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ":smile:",
    typing: true
  });
}

function badbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ":frowning:",
    typing: true
  });
}
function pin(channelID) {
  bot.getMessages(
    {
      channelID: channelID,
      limit: 1
    },
    function(err, messageArray) {
      console.log("Pinning message");

      var messageID = messageArray[0].id;
      bot.pinMessage(
        {
          channelID: channelID,
          messageID: messageID
        },
        function(err) {
          console.log(err);
        }
      );
    }
  );
}

function slap(userID, channelID, object) {
  var critMsg = "";
  var crit = Math.random();
  if (crit < 0.2) {
    critMsg = ". It's super effective!";
  } else if (crit < 0.4) {
    critMsg = ". A critical hit!";
  }

  bot.sendMessage({
    to: channelID,
    message:
      "*<@!" +
      userID +
      "> slaps " +
      object +
      " around a bit with a large trout" +
      critMsg +
      "*"
  });
}

function savequote(channelID) {
  var crit = Math.random();
  if (crit < 0.1) {
    bot.sendMessage({
      to: channelID,
      message: "Eu não salvo qualquer merda"
    });
    return;
  }

  bot.getMessages(
    {
      channelID: channelID,
      limit: 2
    },
    function(err, messageArray) {
      console.log("Saving message");

      var message = messageArray[1];
      var authorID = message.author.id;
      var authorName = message.author.username;
      var discriminator = message.author.discriminator;
      var content = message.content;

      if (authorID == zuzekbotID) {
        return;
      }

      var quoteID = quotes[quotes.length - 1].id + 1;

      var quote = {
        id: quoteID,
        userid: authorID,
        username: authorName,
        message: content,
        votes: 0,
        voters: []
      };
      quotes.push(quote);

      saveQuotesToFile(function(err) {
        if (err) {
          console.log(err);
        } else {
          bot.sendMessage({
            to: channelID,
            message:
              "Quote #" + quoteID + ' saved: "' + content + '" by ' + authorName
          });
        }
      });
    }
  );
}

function trouxa(userID, channelID) {
  bot.sendMessage({
    to: channelID,
    message: "<@!" + userID + ">, você é trouxa?"
  });
}

function quote(userID, channelID, args) {
  if (args.length == 0) {
    quotebot(channelID, false);
  } else if (args.length == 1) {
    if (isNaN(args[0])) {
      // quote from user
      var userstring = args[0];
      var quotedUserID = userstring.substring(2, userstring.length - 1);
      console.log("Quoting: " + quotedUserID);

      var userQuotes = [];
      quotes.forEach(function(quote, index) {
        if (quote.userid == quotedUserID) {
          userQuotes.push(quote);
        }
      });

      if (userQuotes.length == 0) {
        trouxa(userID, channelID);
      } else {
        var quote = userQuotes[Math.floor(Math.random() * userQuotes.length)];
        bot.sendMessage({
          to: channelID,
          message: quote.message + " (#" + quote.id + ")"
        });
      }
    } else {
      // quote with ID
      var quoteID = parseInt(args[0]);
      var quoteIndex = findQuoteIndexWithID(quoteID);

      if (quoteIndex == -1) {
        trouxa(userID, channelID);
        return;
      }

      var quote = quotes[quoteIndex];

      bot.sendMessage({
        to: channelID,
        message: quote.message + " (#" + quote.id + ")"
      });
    }
  } else {
    trouxa(userID, channelID);
  }
}

function addroles(userID, channelID, args) {
  var addedRoles = [];
  args.forEach(function(roleName, index) {
    if (roles.hasOwnProperty(roleName)) {
      var roleID = roles[roleName];
      bot.addToRole({
        serverID: serverID,
        userID: userID,
        roleID: roleID
      });
      addedRoles.push(roleName);
    }
  });
  bot.sendMessage({
    to: channelID,
    message: "<@!" + userID + "> added to roles: " + addedRoles.join(", ") + "."
  });
}

function feedback(user, userID, channelID, args) {
  var feedback = {
    userID: userID,
    username: user,
    contents: args.join(" ")
  };
  feedbacks.push(feedback);

  saveFeedbacksToFile(function(err) {
    if (err) {
      console.log(err);
    }
  });

  bot.sendMessage({
    to: channelID,
    message: "<@!" + userID + ">, thank you for your feedback."
  });
}

function getPrice(userID, channelID, args) {
  price.getPrice(args.join(" "), function(message) {
    if (message == "") {
      trouxa(userID, channelID);
    }

    bot.sendMessage({
      to: channelID,
      message: message
    });
  });
}

function duck(channelID, args) {
  var query = encodeURI(args.join("+"));
  var url = "https://duckduckgo.com/?q=!ducky+" + query;

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function trailer(channelID, args) {
  args.push("youtube");
  args.push("trailer");
  duck(channelID, args);
}

function wiki(channelID, args) {
  var query = encodeURI(args.join("_"));
  var url = "https://en.wikipedia.org/wiki/" + query;

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function ping(channelID) {
  bot.sendMessage({
    to: channelID,
    message: "Pong!",
    typing: true
  });
}

function listquotes(channelID) {
  var url = "<#562442227880558623>";

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function direct(channelID) {
  var url = "https://www.nintendo.com/nintendo-direct/";

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function calc(userID, channelID, args) {
  if (args.toLowerCase().indexOf("mãe") !== -1) {
    var peso = Math.random() * 34238490238;

    bot.sendMessage({
      to: channelID,
      message: peso + "kg"
    });

    return;
  }

  if (args.toLowerCase().indexOf("univers") !== -1) {
    bot.sendMessage({
      to: channelID,
      message: "42"
    });

    return;
  }

  try {
    var result = math.eval(args);

    bot.sendMessage({
      to: channelID,
      message: result
    });
  } catch (err) {
    bot.sendMessage({
      to: channelID,
      message: err.message
    });
  }
}

function diceroll(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID);
    return;
  }

  var dicesize = parseInt(args[0]);
  var rng = Math.ceil(Math.random() * dicesize);

  bot.sendMessage({
    to: channelID,
    message: rng
  });
}

function yourewelcome(channelID) {
  bot.sendMessage({
    to: channelID,
    message: "You're welcome!",
    typing: true
  });
}

function master(channelID) {
  bot.sendMessage({
    to: channelID,
    message: "<@!189096616043479041> is my master.",
    typing: true
  });
}

function highfive(channelID) {
  bot.sendMessage({
    to: channelID,
    message: "\\o",
    typing: true
  });
}

function findQuoteIndexWithID(quoteID) {
  var quoteIndex = -1;
  quotes.forEach(function(quote, index) {
    if (quote.id == quoteID) {
      quoteIndex = index;
      return;
    }
  });
  return quoteIndex;
}

function saveQuotesToFile(callback) {
  var jsonData = JSON.stringify(quotes);
  var fs = require("fs");
  fs.writeFile("quotes.json", jsonData, callback);
}

function saveFeedbacksToFile(callback) {
  var jsonData = JSON.stringify(feedbacks);
  var fs = require("fs");
  fs.writeFile("feedback.json", jsonData, callback);
}

// function generateSentenceOfLength(length, start) {

//     // Picks a random property of the dictionary to start off
//     function pickRandomProperty(obj) {
//       var result;
//       var count = 0;
//       for (var prop in obj) if (Math.random() < 1 / ++count) result = prop;
//       return result;
//     }
  
//     // Picks a random element of an array
//     function pickRandomObject(arr) {
//       return arr[Math.floor(Math.random() * arr.length)];
//     }

//     // Checks if a word is a preposition
//     function isPreposition(word) {
//         var prepositions = [
//             "o", "a", "os", "as", "um", "uns", "uma", "umas",                         // Artigos
//             "em", "no", "na", "nos", "nas", "num", "nuns", "numa", "numas",           // Em
//             "de", "do", "da", "dos", "das", "dum", "duma", "duns", "dumas",           // De
//             "para", "pro", "pros", "pra", "pras", "prum", "pruns", "pruma", "prumas", // Para
//             "pelo", "pela", "pelos", "pelas",                                         // Pelo
//             "entre", "ante", "com", "desde", "por", "sob", "sobre",                   // Preposições
//             "e", "ou", "mas", "que", "porém", "senão", "se", "porque",                // Conectivos
//             "tão", "bem", "tem", "têm", "são"
//         ];
//         return prepositions.indexOf(word) != -1;
//     }
  
//     var word = pickRandomProperty(words);
//     if (words[start]) {
//         word = start
//     }
//     console.log(word)
//     var sentence = word;
//     var lastword = ""
//     var nextword = ""

//     for (var i = 1; i < length; i++) {
//       var rng = Math.random();
      
//       if (words[lastword+" "+word] != null && words[lastword+" "+word].length > 0 && rng < 0.7) {
//         nextword = pickRandomObject(words[lastword+" "+word]);
//       } else if (words[word] != null && words[word].length > 0) {
//         nextword = pickRandomObject(words[word]);
//       } else {
//         break;
//       }
  
//       var sentence = sentence + " " + nextword;
//       lastword = word;
//       word = nextword;

//       if (i == length-1 && isPreposition(word)) {
//           i -= 1;
//       }
//     }
  
//     return sentence;
//   }

function displayCommands(channelID) {
  bot.sendMessage({
    to: channelID,
    message:
      "\
    ```\
!ping, \n\
!list, \n\
!help [command], \n\
!calc [expression], \n\
!duck [query], \n\
!trailer [query], \n\
!wiki [query], \n\
!slap [user], \n\
!pin [message], \n\
!savequote/!addquote, \n\
!quote [user/quoteid], \n\
!removequote [quoteid], \n\
!listquotes, \n\
!generate [length], \n\
!addroles [role, ...], \n\
!direct, \n\
!diceroll [number] \n\
!price [game], \n\
!shutup/!calaboca [minutes], \n\
!comeback, \n\
!feedback [bug or feature].```"
  });
}

function displayHelp(userID, channelID, args) {
  var cmd = args[0];

  var message = "";

  switch (cmd) {
    case "ping":
      message = '```!ping \n\
Eu respondo "Pong!".```';
      break;

    case "calc":
      message =
        "```!calc [expression] \n\
Calculo o valor de sua mãe, digo, de uma expressão matemática.\
Referência: https://mathjs.org/.```";
      break;

    case "pin":
      message = "```!pin [message] \n\
Fixo uma mensagem ao canal.```";
      break;

    case "slap":
      message =
        "```!slap [user] \n\
Faço o trabalho sujo por você. Espero que goste de trutas.```";
      break;

    case "savequote":
      message =
        "```!savequote \n\
Salvo a mensagem anterior no meu acervo. Idêntico ao !addquote.```";
      break;

    case "addquote":
      message =
        "```!addquote \n\
Salvo a mensagem anterior no meu acervo. Idêntico ao !savequote.```";
      break;

    case "quote":
      message =
        "```!quote [user/quoteid] \n\
Puxo uma mensagem aleatória do meu acervo. Cite um usuário para trazer\
uma citação dele, ou use um identificador para acessar uma citação específica.```";
      break;

    case "listquotes":
      message = "```!listquotes \n\
Posto um link para a lista de citações.```";
      break;

    case "removequote":
      message =
        "```!removequote [quoteid] \n\
Registro seu voto para a remoção da quote correspondente ao id fornecido.\
5 votos são necessários para a remoção.```";
      break;

    case "generate":
      message =
        "```!generate [length] \n\
Gero uma frase aleatória com o número de palavras solicitado.```";
      break;

    case "addroles":
      message =
        "```!addroles [role, ...] \n\
Concedo as roles fornecidas a você.\
Múltiplas roles podem ser adicionadas de uma vez.\
As roles atuais são @smash, @splatoon, @pokémon, @mariokart e @overwatch.\
Exemplo para ser adicionado em smash e splatoon: \n\
!addroles smash splatoon```";
      break;

    case "feedback":
      message =
        "```!feedback [message] \n\
Guardo uma sugestão ao meu mestre.```";
      break;

    case "price":
      message =
        "```!price [game] \n\
Consulto o preço do jogo fornecido na eShop mais barata por meio do https://eshop-prices.com/.```";
      break;

    case "duck":
      message =
        "```!duck [query] \n\
Busco o primeiro resultado encontrado na internet para a sua pergunta.```";
      break;

    case "trailer":
      message =
        "```!trailer [query] \n\
Procuro o trailer do que você pedir no YouTube.```";
      break;

    case "wiki":
      message =
        "```!wiki [query] \n\
Procuro a página da Wikipédia para sua busca.```";
      break;

    case "direct":
      message = "```!direct \n\
Nintendo Direct!```";
      break;

    case "diceroll":
      message =
        "```!diceroll [number] \n\
Retorno um número aleatório entre 1 e o fornecido.```";
      break;

    case "shutup":
      message =
        "```!shutup [minutes] \n\
Cala minha boca pelos próximos minutos de acordo com o fornecido.```";
      break;

    case "calaboca":
      message =
        "```!calaboca [minutes] \n\
    Cala minha boca pelos próximos minutos de acordo com o fornecido.```";
      break;

    case "comeback":
      message = "```!comeback \n\
Me tira do castigo.```";
      break;

    case "list":
      message = "```!list \n\
Lista todos os meus comandos.```";
      break;

    case "help":
      message =
        "```!help [command] \n\
Forneço uma breve descrição do comando solicitado.```";
      break;

    default:
      trouxa(userID, channelID);
  }

  bot.sendMessage({
    to: channelID,
    message: message
  });
}
