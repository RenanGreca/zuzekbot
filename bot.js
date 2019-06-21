// External dependecies
const Discord = require("discord.js");
const math    = require("./node_modules/mathjs");
const timer   = require("timers");

// Internal dependencies
const price             = require("./modules/getprice.js");
const argparse          = require("./modules/argparse.js");
const sentenceGenerator = require("./modules/sentencegenerator.js");
const salmon            = require("./modules/salmon.js");

// Data dependencies
const auth         = require("./jsons/auth.json");
const channels     = require("./jsons/channels.json");
const quotes       = require("./jsons/quotes.json");
const roles        = require("./jsons/roles.json");
const ids          = require("./jsons/ids.json");
const feedbacks    = require("./jsons/feedback.json");
const prints       = require("./jsons/prints.json")
const gemeosFrases = require("./jsons/gemeos.json");
const insults      = require("./jsons/insults.json");
let   tryhard      = require("./jsons/tryhard.json");
const strings      = require("./jsons/strings.json");
const emojis       = require("./jsons/extended_emojis.json");

// Global Variables
const serverID = ids.serverID;
const zuzekbotID = ids.zuzekbotID;
let isShuttingUp = false;

// Utility Functions
function defaultEmbed() {
  return new Discord.RichEmbed()
                    .setColor(0xFE494D);
}

function sendEmbed(channel, message) {
  const embed = new Discord.RichEmbed()
                           .setColor(0xFE494D)
                           .setDescription(message);
  channel.send(embed);
}

// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);

bot.once("ready", () => {
  console.log("Connected");
  console.log("Logged in as: ");
  console.log(bot.user.username + " - (" + bot.user.id + ")");

  saveToFile(bot.guilds.first().emojis.array(), "./jsons/emojis.json", function() {})


//   saveToFile(bot.guilds.first(), "./test/test-data/fusion.json", function() {})
//   saveToFile(bot.guilds.first().roles.array(), "./test/test-data/roles.json", function() {})
//   saveToFile(bot.guilds.first().channels.array(), "./test/test-data/channels.json", function() {})
});

// Listen to new members
bot.on("guildMemberAdd", member => {
  const fusion = bot.guilds.first();
  const channel = bot.channels.find(ch => ch.name === "boas-vindas");

  sendEmbed(channel, "Olá " + member + strings.welcome);

  const welcome         = require("./modules/welcome.js");
  const description = welcome.roles(fusion.roles.array());
  channel.send(defaultEmbed().setTitle(strings.roles)
                             .setDescription(description));

  channel.send("<@&410866075333296138>");
});

// Listen to Messages
bot.on("message", message => {

  const channel = message.channel;
  const author = message.author;
  const member = message.member;
  const authorID = message.author.id;
  const content = message.content;
  const authorName = message.author.username;

  console.log("user: " + authorName + " - (" + author.id + ")");
  console.log("channel: " + channel.name);
  console.log("message: " + content);

  if (content.toLowerCase().indexOf("good bot") !== -1) {
    goodbot(channel);
    return;
  }

  if (content.toLowerCase().indexOf("bad bot") !== -1) {
    badbot(channel);
    return;
  }
  
  if (content === "Pong!" && author.id == zuzekbotID) {
    message.react('🏓');
  }

  // commands start with "!"
  if (content.substring(0, 1) == "!") {
    let args = content.substring(1).split(" ");
    const cmd = args[0];

    args = args.splice(1);
    switch (cmd) {

      case "ping":
        ping(message);
        break;

      case "seed":
        seed(channel);
        break;

      case "stream":
        stream(channel);
        break;

      case "updatestream":
        updatestream(message, member, channel, args);
        break;

      case "bracket":
        bracket(channel);
        break;

      case "updatebracket":
        updatebracket(message, member, channel, args);
        break;

      case "vods":
        vods(channel);
        break;

      // We won't change youtube channel with vods any time soon
      //case "updatevods":
        //updatevods(message, member, channel, args);
        //break;

      case "camp":
        camp(channel);
        break;

      case "updatecamp":
        updatecamp(message, member, channel, args);
        break;

      case "avatar":
        avatar(author, channel, args);
        break;

      case "rank":
      case "ranking":
        showranking(channel, args);
        break;

      case "gemeos":
      case "gêmeos":
        gemeosbot(channel);
        break;

      // It's here for testing
      case "type":
        emptytypebot(channel);
        break;

      case "calc": case "c":
        calc(channel, args.join(" "), author);
        break;

      // Not working because of Missing Permissions
      case "pin":
        pin(message.channel);
        break;

      case "slap":
        slap(author, channel, args.join(" "));
        break;

      case "insult":
        insultbot(channel, args.join(" "));
        break;

      case "addquote":  case "aq":
      case "savequote": case "sq":
        savequote(channel, args);
        break;

//       case 'removequote':
//         removequote(author, channel);
//         break;

      case "quote": case "q":
        quote(author, channel, args);
        break;

      case "listquotes": case "lq":
        listquotes(channel, author, args);
        break;

      case "removequote": case "rq":
        removequote(author, channel, args);
        break;

      case "generate": case "gen":
        generatebot(channel, args);
        break;
    
      case "shuffle":
        shuffler(channel);
        break;

      case "print":
        printbot(channel);
        break;

      case "listroles": case "lr":
        listroles(channel);
        break;

      case "removeroles": case "rr":
        removeroles(author, channel, args, message.member, message);
        break;

      case "addroles": case "ar":
        addroles(author, channel, args, message.member, message);
        break;

      case "feedback":
        feedback(author, authorName, channel, args);
        break;

      case "price":
        getPrice(author, channel, args);
        break;

      case "duck": case "d":
        duck(author, channel, args);
        break;

      case "trailer": case "t":
        trailer(author, channel, args);
        break;

      case "wiki": case "w":
        wiki(author, channel, args);
        break;

      case "direct":
        direct(channel);
        break;

      case "salmon":
        getSalmon(channel);
        break;

      case "emoji": case "e":
        sendEmoji(message, channel, args.join(" "));
        break;

      case "diceroll":
        diceroll(author, channel, args);
        break;

      case "shutup":
        shutup(author, channel, args);
        break;

      case "calaboca":
        shutup(author, channel, args);
        break;

      case "comeback":
        comeback();
        break;

      case "list": case "ls":
        displayCommands(channel, true);
        break;

      case "wholelist": case "wl":
        displayCommands(channel, false);
        break;

      case "help": case "h":
        displayHelp(channel, args);
        break;
    }

    return;
  }

  if (authorID == zuzekbotID) {
    return;
  }
/*
  if (channel.id == channels.artChannel) {
    // Lucasmaster or Heartwell
    if ((authorID == 115885540494147589 
        || authorID == 192337026341797888 
        || authorID == 573820987041120257)
        && content == "") {

      message.react('🔨');
      message.react('513779475096403979');
    }
  }
*/
  if (channel.id != channels.geral 
     && channel.id != channels.memechannel 
     && channel.id != channels.testGeneral) {
    return;
  }

  // For Lucasmaster aka Discord
  if (authorID == 115885540494147589) {
    guigasbot(channel);
    return;
  }

  if (content == "") {
    return;
  }

  // emanosbot
  if (content.substring(0, 4) == "http") {
    emanosbot(channel);
    return;
  }

  if (
    content.toLowerCase().indexOf("obrigado") !== -1 ||
    content.toLowerCase().indexOf("thanks") !== -1 ||
    content.toLowerCase().indexOf("thank you") !== -1
  ) {
    yourewelcome(channel);
    return;
  }
/*
  if (content.toLowerCase().indexOf(' mestre') !== -1 ||
      content.toLowerCase().indexOf(' master') !== -1) {
    master(channel);
    return;
  }
*/
  if (content == "o/" || content == "\\o") {
    highfive(channel, content);
    return;
  }

  const randomMessageChance = Math.random();
  //   shufflebot(content, channel);
  // generatebot(channel);

  console.log("randomMessageChance: " + randomMessageChance);
  if (randomMessageChance < 0.07 && !isShuttingUp) {
    const whichMessageChance = Math.random();
    console.log("whichMessageChance: " + whichMessageChance);
    if (whichMessageChance < 0.08) {
      carabot(content, channel);
    } else if (whichMessageChance < 0.2) {
      reactbot(message);
    } else if (whichMessageChance < 0.28) {
      emojibot(channel);
    } else if (whichMessageChance < 0.31) {
      spoilerbot(channel);
    } else if (whichMessageChance < 0.47) {
      generatebot(channel);
    } else if (whichMessageChance < 0.55) {
      shufflebot(content, channel);
    } else if (whichMessageChance < 0.63) {
      printbot(channel);
    } else if (whichMessageChance < 0.75) {
      quotebot(channel, true);
    } else if (whichMessageChance < 0.77) {
      gemeosbot(channel);
    } else {
      emptytypebot(channel);
    }
  }
  //   else if (randomMessageChance < 0.2 && !isShuttingUp) {
  //     generatebot(channelID);
  //   }

});

// @Test: didn't test yet
function shutup(user, channel, args) {
  if (isNaN(args[0])) {
    displayHelp(channel, ["shutup"])
    return;
  }

  const minutes = parseInt(args[0]);
  // max one hour
  if (minutes > 60) {
    minutes = 60;
  }

  const duration = minutes * 1000 * 60;
  isShuttingUp = true;

  timer.setInterval(comeback, duration);
}

function comeback() {
  isShuttingUp = false;
}

function angry(channel) {
  channel.send(":rage:");
}

function reactbot(message) {
  const emojis = [
    "👌",                  // okhand
    "468050212837916682",  // pato
    "474061348221747200",  // sillylib
    "476498123154522112",  // zuzek
    "466272230330990603",  // will
    "513779475096403979",  // guigas
    "476503278893400079",  // geovarage
    "466283967075713024",  // emanos
    "476498159732916227",  // pikachu
    "514476225415217152",  // surprised_pikachu
    "511691954027757588",  // yoshi
  ];

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  message.react(emoji);
}

function emanosbot(channel) {
  const emanos = Math.random();

  console.log("emanos chance: " + emanos);
  if (emanos < 0.1) {
    channel.send("old");
  }
}

// It lasts 9 seconds. You can only do other multiples of 9
function emptytypebot(channel) {
  channel.startTyping();
  channel.stopTyping();
}


function showranking(channel, args) {

  if (args.length >= 1) {
    if (args[0] === "mensal") {
      channel.send(defaultEmbed().setTitle("Ranking Mensal")
                                 .setDescription("https://braacket.com/league/tryhardcwb/ranking/4AC75652-488A-49E5-9594-A2834B6CA1E1?rows=200&cols=&page=1&page_cols=1&game_character=&country=&search=&embed=1"));
      return;
    }
    if (args[0] === "points") {
      channel.send(defaultEmbed().setTitle("Ranking por Pontos")
                                 .setDescription("https://braacket.com/league/tryhardcwb/ranking/0F6FE4B8-7F44-4CC6-A4B6-6AC8FE87A681?rows=200&cols=&page=1&page_cols=1&game_character=&country=&search=&embed=1"));
      return;
    }
  }
  channel.send(defaultEmbed().setTitle("Ranking de Seed")
                             .setDescription("https://braacket.com/league/tryhardcwb/ranking/2D975CD1-73B1-474D-8A8D-93E92EE0DB1E?rows=200&cols=&page=1&page_cols=1&game_character=&country=&search=&embed=1"));

}

function avatar(author, channel, args) {

  if (!Array.isArray(args) || args.length == 0) {
    displayHelp(channel, ["avatar"]);
    return;
  }
  
  const user = argparse.parse(args).string;
  const users = bot.guilds.first().members;

  let member = null;

  const userName = user;
  member = users.find(member => {
    if (member.nickname) {
      return member.nickname.toLowerCase() === userName.toLowerCase();
    } else {
      return member.user.username.toLowerCase() === userName.toLowerCase();
    }
  });
  if (!member) {
    channel.send(defaultEmbed().setDescription("Usuário não encontrado."));
    return;
  }

  
  channel.send(defaultEmbed().setDescription("Avatar: **" + member.user.username + "**")
                             .setImage(member.user.avatarURL));
  
}

function gemeosbot(channel) {

  const index = Math.ceil( Math.random() * gemeosFrases.length );
  const phrase = gemeosFrases[index];
  channel.send(`"${phrase.sentence}" by ${phrase.name}`);
}

function carabot(message, channel) {
  const punctuation = Math.random();
  let contents = "";
  if (punctuation < 0.3) {
    contents = "Cara, " + message + "?";
  } else if (punctuation < 0.6) {
    contents = "Cara, " + message + "!";
  } else if (punctuation < 0.9) {
    contents = "Cara, " + message + ".";
  } else {
    contents = "cara";
  }

  channel.send(contents);
}

function shufflebot(message, channel) {
  if (message.length > 0) {
    channel.send(sentenceGenerator.shuffle(message));
  }
}

function generatebot(channel, args) {

  var parsed = argparse.parse(args);

  var length = Math.ceil(Math.random() * 15);
  if (parsed.length) {
    length = parsed.length;
  }

  var start = "";
  if (parsed.string) {
      start = parsed.string.split(" ")[0];
  }

  const sentence = sentenceGenerator.generateSentence(length, start);

  if (args && args.indexOf("!shuffle") != -1) {
    shufflebot(sentence, channel)
  } else {
    channel.send(sentence);
  }
}

function shuffler(channel) {
    channel.fetchMessages({ limit: 2 })
      .then( messageArray => {
        console.log("Shuffling message");
    
        const message = messageArray.last();

        shufflebot(message.content, channel);
      })
      .catch(console.error);
}

function emojibot(channel) {
  const emojicombos = [
    "<:will:466272230330990603> :ok_hand: ",
    "<:Zuzek:476498123154522112> :sweat_drops: ",
    ":hammer: <:Guigas:513779475096403979>",
    "<:geovarage:476503278893400079> :knife:",
    ":gun: <:emanos:466283967075713024>",
    "<:pk2:476498159732916227> :dagger:",
    "<:surprisedpikachu:514476225415217152>",
    ":duck:"
  ];

  const emoji = emojicombos[Math.floor(Math.random() * emojicombos.length)];

  channel.send(emoji);
}

function guigasbot(channel) {
  const guigas = Math.random();

  console.log("guigas chance: " + guigas);
  if (guigas < 0.1) {
    channel.send(":hammer: <:Guigas:513779475096403979>");
  }
}

function spoilerbot(channel) {
  channel.send("caralho, spoilers");
}

function quotebot(channel, typing) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  channel.send(quote.message + " (#" + quote.id + ")");
}

function printbot(channel) {
    const print = prints[Math.floor(Math.random() * prints.length)];
    const attachment = new Discord.Attachment(print);
    channel.send(attachment);
  }

function getSalmon(channel) {
    salmon.getSalmon(function(tweets) {
        const tweetid = tweets.statuses[0].id_str;

        channel.send("https://twitter.com/salmon_en/status/"+tweetid);
    });
}
 
function removequote(user, channel, args) {
  if (isNaN(args[0])) {
    displayHelp(channel, ["removequote"]);
    return;
  }

  const quoteID = parseInt(args[0]);
  const quoteIndex = findQuoteIndexWithID(quoteID);

  if (quoteIndex == -1) {
    channel.send(defaultEmbed().setDescription("Quote não encontrada."));
    return;
  }

  const quote = quotes[quoteIndex];

  // If there are enough votes, remove the quote
  if (quote.votes == 4) {
    channel.send("5/5 votes for the removal of quote #" + quoteID + ": " + quote.message);

    quotes.splice(quoteIndex, 1);
    saveQuotesToFile(function(err) {
      if (err) {
        console.log(err);
      } else {
        channel.send("Quote #" + quoteID + " removed.");
      }
    });

    return;
  }

  // Check to see if the user already voted for this removal
  if (quote.voters.indexOf(user.id) != -1) {
    channel.send("<:FasHitler:474060823392944130>"); //<:FasLizard:474061707258363904>'

    return;
  }

  // Otherwise, add the vote and the user to the object
  quote.votes += 1;
  quote.voters.push(user.id);
  saveQuotesToFile(function(err) {
    if (err) {
      console.log(err);
    } else {
      channel.send(quotes[quoteIndex].votes +
          "/5 votes for the removal of quote #" +
          quoteID +
          ': "' +
          quote.message + '"');
    }
  });
}

function goodbot(channel) {
  channel.send(":smile:");
}

function badbot(channel) {
  channel.send(":frowning:");
}

function pin(channel) {
  channel.fetchMessages({ limit: 2 })
    .then(messageArray => {
      console.log("Pinning message: " + messageArray.last().content);
      messageArray.last().pin();
    })
    .catch(console.error);
}

function insultbot(channel, object) {

    const idx = Math.floor(Math.random() * insults.length);

    if (object === "") {
        channel.send(insults[idx]);
    } else {
        channel.send(`***${object}***, ${insults[idx]}`);
    }
    

}

function slap(user, channel, object) {
  
  if (object === "") { 
    object = "the air";
  }
  
  let critMsg = "";
  const crit = Math.random();
  if (crit < 0.2) {
    critMsg = " *It's super effective!*";
  } else if (crit < 0.4) {
    critMsg = " *A critical hit!*";
  }
 
  channel.send(`***${user}*** *slaps* ***${object}*** *around a bit with a large trout.*${critMsg}`);
}

function savequote(channel, args) {
  let crit = Math.random();
  if (crit < 0.1) {
    channel.send("Eu não salvo qualquer merda");
    return;
  }

  let index = 2;
  if (!isNaN(args[0])) {
    index = Math.abs(parseInt(args[0])) + 1;
    if (index == 1) {
      index = 2;
    }
  }
  console.log("index: " + index);
  channel.fetchMessages({ limit: index })
         .then( messageCollection => {

      console.log("Saving message");

      const messageArray = messageCollection.array();
      const message = messageArray[messageArray.length-1];
      const authorID = message.author.id;
      const authorName = message.author.username;
      const content = message.content;

      if (authorID == zuzekbotID) {
        return;
      }

      const quoteID = quotes[quotes.length - 1].id + 1;

      const quote = {
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
          channel.send("Quote #" + quoteID + ' saved: "' + content + '" by ' + authorName);
        }
     
      });
    })
    .catch(console.error); 
}

function trouxa(user, channel) {
  sendEmbed(channel, user + ", você é trouxa?")
}

function quote(user, channel, args) {
  if (args.length == 0) {
    quotebot(channel, false);
  } else if (args.length == 1) {
    if (isNaN(args[0])) {
      // quote from user
      const userstring = args[0];
      const quotedUserID = userstring.substring(2, userstring.length - 1);
      console.log("Quoting: " + quotedUserID);

      let userQuotes = [];
      quotes.forEach(function(quote, index) {
        if (quote.userid == quotedUserID) {
          userQuotes.push(quote);
        }
      });

      if (userQuotes.length == 0) {
          channel.send(defaultEmbed().setDescription("Nenhuma quote encontrada."));
      } else {
        const quote = userQuotes[Math.floor(Math.random() * userQuotes.length)];
        channel.send(quote.message + " (#" + quote.id + ")");
      }
    } else {
      // quote with ID
      const quoteID = parseInt(args[0]);

      // @Refactor: colocar a função da quote 70 separado é uma solução melhor
      // Ex: se alguém usar !quote @yawryck tem uma chance maior de cair na quote 70
      if (quoteID == 70) { 
        channel.send("Eu não sou trouxa seu palhaço!");
        return;
      }
      
      let quoteIndex = findQuoteIndexWithID(quoteID);

      if (quoteIndex == -1) {
        channel.send(defaultEmbed().setDescription("Quote não encontrada."));
        return;
      }

      const quote = quotes[quoteIndex];

      channel.send(quote.message + " (#" + quote.id + ")");
    }
  } else {
    displayHelp(channel, ["quote"]);
  }
}

function listroles(channel) {
  fusion = bot.guilds.first();
  
  let selfAssignableRoles = ""
  let otherRoles = ""
  let matchmakingRoles = ""
  let roles = [];
  fusion.roles.array().forEach(function (value, i){
    if ( value.name !== "@everyone" &&
         value.name !== "fusion" &&
         value.name !== "membro" &&
         value.name !== "familiafusion1" &&
         value.name !== "familiafusion2" &&
         value.name !== "bot") {

      if (value.name === "singles" ||
          value.name === "doubles" ||
          value.name === "splatoon" ||
          value.name === "rivals" ||
          value.name === "mario-kart" ||
          value.name === "minecraft" ||
          value.name === "secrethitler") {

        if (matchmakingRoles !== "" ) {
          matchmakingRoles = matchmakingRoles + ", " + value.toString();
        } else {
          matchmakingRoles = value;
        }
      } else if (selfAssignableRoles !== "") {
        selfAssignableRoles = selfAssignableRoles + ", " + value.toString();
      } else {
        selfAssignableRoles = value.toString();
      }
    } else {
      if (otherRoles !== "") {
        otherRoles = otherRoles + ", " + value.toString();
      } else {
        otherRoles = value.toString();
      }
    }
  });

  channel.send(defaultEmbed().setTitle('Roles que podem ser self atribuídas:')
                             .addField('Demais Roles', otherRoles, true)
                             .setDescription("matchmaking: " +
                                             matchmakingRoles +
                                             " \n\noutros: " +
                                             selfAssignableRoles ));
}

function addroles(user, channel, args, member, message) {

  if (args.length == 0) {
    displayHelp(channel, ["addroles"]);
    message.react("❎"); 
    return;
  }
  
  let addedRoles = [];
  let rolesToAdd = [];
  args.forEach(function(roleName, index) {
    if (roles.hasOwnProperty(roleName)) {
      rolesToAdd.push(roles[roleName]);
      addedRoles.push(roleName);
    }
  });
  member.addRoles(rolesToAdd)
    .then( () => { 
      // channel.send(user+ " added to roles: " + addedRoles.join(", ") + ".");
      message.react("✅") } )
    .catch(console.error);
}
function removeroles(user, channel, args, member, message) {

  if (args.length == 0) {
    displayHelp(channel, ["removeroles"]);
    message.react("❎"); 
    return;
  }
  
  let removedRoles= [];
  let rolesToRemove = [];
  args.forEach(function(roleName, index) {
    if (roles.hasOwnProperty(roleName)) {
      rolesToRemove.push(roles[roleName]);
      removedRoles.push(roleName);
    }
  });
  member.removeRoles(rolesToRemove)
    .then( () => { 
      // channel.send(user+ " added to roles: " + removedRoles.join(", ") + ".");
      message.react("✅") } )
    .catch(console.error);
}

function feedback(user, username, channel, args) {

  if (args.length == 0) {
      displayHelp(channel, ["feedback"]);
    return;
  }

  const feedback = {
    userID: user.id,
    username: username,
    contents: args.join(" ")
  };
  feedbacks.push(feedback);

  saveFeedbacksToFile(function(err) {
    if (err) {
      console.log(err);
    }
  });

  channel.send(user + ", thank you for your feedback.");
}

function getPrice(user, channel, args) {

  if (!Array.isArray(args) || args.length == 0) {
    displayHelp(channel, ["price"]);
    return;
  }

  var parsed = argparse.parse(args);

  var curr = 'BRL'
  if (parsed.curr) {
    curr = parsed.curr;
  }

  price.findGame(parsed.url, curr, function(game_info) {
    if (!game_info) {
      channel.send(defaultEmbed().setDescription("Jogo não encontrado."));
      return;
    }

    if (parsed.country) {
        price.getGameDetails(game_info, curr, function(price_details) {
            var priceInfo = price.findSpecificCountry(price_details.digital, parsed.country);
            if (priceInfo) {
                sendPriceMessage(channel, game_info, priceInfo, curr);
            } else {
                channel.send(defaultEmbed().setDescription("Jogo não encontrado na eShop solicitada."));
            }
        });
    } else {
        price.getGameDetails(game_info, curr, function(price_details) {
            if (price_details.digital) {
                var priceInfo = price.findCheapestCountry(price_details.digital);
                if (priceInfo) {
                    sendPriceMessage(channel, game_info, priceInfo, curr);
                } else {
                    var embed = defaultEmbed()
                    .setTitle(game_info.title)
                    .setImage(game_info.imageUrl)
                    .setDescription("No price information available")
                
                    channel.send(embed);
                }
            } else {
                var embed = defaultEmbed()
                    .setTitle(game_info.title)
                    .setImage(game_info.imageUrl)
                    .setDescription("No price information available")
                
                channel.send(embed);
            }
        });
    }
  });

}

function sendPriceMessage(channel, game_info, price_info, curr) {
    const price = price_info.rawCurrentPrice.toFixed(2);
    const flag = ':flag_'+price_info.country.code.toLowerCase()+':';
    const country = price_info.country.name;
    const image = game_info.imageUrl;

    var description = '**'+price+' '+curr+'** in the '+flag+' '+country+' eShop!';

    if (price_info.hasDiscount) {
        const percentOff = price_info.discountPrice.percentOff;
        const discountEnd = new Date(price_info.discountPrice.discountEndsAt);
        const dateString = discountEnd.getDate()  + "/" + (discountEnd.getMonth()+1) + "/" + discountEnd.getFullYear();

        const regularPrice = price_info.regularPrice.rawRegularPrice.toFixed(2);


        description = "~~"+regularPrice+"~~ **"+price+" "+curr+"** in the "+flag+" "+country+" eShop!"+
                      "\n"+percentOff+"% off until "+dateString+".";
        // embed
        //   .addField('Regular Price', "**"+regularPrice+" "+curr+"**\n"+percentOff+"% off until "+dateString, true);
    }

    var embed = defaultEmbed()
                .setTitle(game_info.title)
                .setImage(image)
                .setDescription(description)

    channel.send(embed);
}

function duck(user, channel, args) {

  // There might be something more fun to do when user provides an empty query
  // maybe random 
  if (!Array.isArray(args) || args.length == 0) {
    displayHelp(channel, ["duck"]);
    return;
  }

  const query = encodeURI(args.join("+"));

  sendEmbed(channel, "https://duckduckgo.com/?q=!ducky+" + query);
}

function trailer(user, channel, args) {
  
  if (!Array.isArray(args) || args.length == 0) {
      displayHelp(channel, ["trailer"]);
    return;
  }
  
  args.push("youtube");
  args.push("trailer");
  duck(user, channel, args);
}

function wiki(user, channel, args) {
  
  if (!Array.isArray(args) || args.length == 0) {
    displayHelp(channel, ["wiki"]);
    return;
  }

  const query = encodeURI(args.join("_"));
  sendEmbed(channel, "https://en.wikipedia.org/wiki/" + query);
}

function ping(message) {
  message.react('🏓');
  message.channel.send("Pong!");
}

function stream(channel) {
  channel.send(tryhard.stream);
}

function seed(channel, author, args) {

  const pastebin        = require("./jsons/seed.json");

  channel.send(pastebin.link);
}

function bracket(channel) {
  channel.send(tryhard.bracket);
}

function vods(channel) {
  channel.send(tryhard.vods);
}

function camp(channel) {
  channel.send(tryhard.camp);
}

// @Refactor: maybe all other authors should be members instead?
// it seems to make more sense considering the API
// @Refactor: Simply copy pasted because it was simpler. We could do better.
// Although it's probably not worth changing before having a more robust way to do "command line" options
function updatestream(message, member, channel, args) {
  if (member.roles.find( role => role.id === roles.fusion) == null) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  } 

  if (!Array.isArray(args) || args.length == 0) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  }

  const newstreamlink = args[0]
  tryhard.stream = newstreamlink;
  saveToFile(tryhard, "./jsons/tryhard.json", function(err) {
    if (err) {
      console.log(err);
      message.react("❎"); 
    } else {
      message.react("✅"); 
    }
  });
}

function updatebracket(message, member, channel, args) {
  if (member.roles.find( role => role.id === roles.fusion) == null) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  } 

  if (!Array.isArray(args) || args.length == 0) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  }

  const newbracket= args[0]
  tryhard.bracket = newbracket;
  saveToFile(tryhard, "./jsons/tryhard.json", function(err) {
    if (err) {
      console.log(err);
      message.react("❎"); 
    } else {
      message.react("✅"); 
    }
  });
}

function updatevods(message, member, channel, args) {
  if (member.roles.find( role => role.id === roles.fusion) == null) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  } 

  if (!Array.isArray(args) || args.length == 0) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  }

  const newvods = args[0]
  tryhard.vods = newvods;
  saveToFile(tryhard, "./jsons/tryhard.json", function(err) {
    if (err) {
      console.log(err);
      message.react("❎"); 
    } else {
      message.react("✅"); 
    }
  });
}

function updatecamp(message, member, channel, args) {
  if (member.roles.find( role => role.id === roles.fusion) == null) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  } 

  if (!Array.isArray(args) || args.length == 0) {
    trouxa(member,channel);
    message.react("❎"); 
    return;
  }

  const newcamp = args[0]
  tryhard.camp = newcamp;
  saveToFile(tryhard, "./jsons/tryhard.json", function(err) {
    if (err) {
      console.log(err);
      message.react("❎"); 
    } else {
      message.react("✅"); 
    }
  });
}

function listquotes(channel, author, args) {

  const pastebin        = require("./jsons/pastebin.json");

  if (args.length == 1) {
    if (args[0] === "dm") {
      author.send(pastebin.link);
      return;
    }
  }
  channel.send(pastebin.link);
}

function direct(channel) {
  sendEmbed(channel, "https://www.nintendo.com/nintendo-direct/");
}

function calc(channel, args, user) {

  if (!args) {
    displayHelp(channel, ["calc"]);
    return;
  }

  if (args.toLowerCase().indexOf("mãe") !== -1) {
    channel.send(Math.random() * 34238490238 + "kg");
    return;
  }

  if (args.toLowerCase().indexOf("univers") !== -1) {
    channel.send("42");
    return;
  }

  try {
    sendEmbed(channel, math.eval(args));
  } catch (err) {
    sendEmbed(channel, err.message);
  }
}

function sendEmoji(message, channel, args) {
  const emoji = emojis.find(emoji => emoji.name === args.toLowerCase());  
  console.log(emoji);
  if (typeof emoji === 'undefined') {
    sendEmbed(channel, "Esse emoji não foi encontrado.");
    return;
  }

  message.delete();
  const attachment = new Discord.Attachment(emoji.path);
  channel.send(attachment);
}

function diceroll(user, channel, args) {
  let dicesize = 6;

  if (Array.isArray(args) && args.length != 0) {
    dicesize = parseInt(args[0]);
  }

  sendEmbed(channel, Math.ceil(Math.random() * dicesize));
}

function yourewelcome(channel) {
  channel.send("You're welcome!");
}

function master(channel) {
  channel.send( "<@!189096616043479041> is my master.");
}

function highfive(channel, content) {
    if (content == "o/") {
        channel.send("\\o");
    } else if (content == "\\o") {
        channel.send("o/");
    }
}

function findQuoteIndexWithID(quoteID) {
  let quoteIndex = -1;
  quotes.forEach(function(quote, index) {
    if (quote.id == quoteID) {
      quoteIndex = index;
      return;
    }
  });
  return quoteIndex;
}

function saveQuotesToFile(callback) {
  saveToFile(quotes, "./jsons/quotes.json", callback);
}

function saveFeedbacksToFile(callback) {
  saveToFile(feedbacks, "./jsons/feedback.json", callback);
}

function saveToFile(data, filename, callback) {
  const jsonData = JSON.stringify(data);
  const fs              = require("fs");
  fs.writeFile(filename, jsonData, callback);
}

function displayCommands(channel, simplifiedVersion) {

  const helpMessages    = require("./jsons/help.json");

  if (simplifiedVersion) {
    var text = [];

    for (var msg in helpMessages) {
        text.push ('`!'+msg+'`');
    }

    channel.send(text.join(', '));
  
  } else {

    var text = [];

    for (var msg in helpMessages) {
        text.push ('`'+helpMessages[msg].title+'`');
    }

    channel.send(text.join('\n'));
  }
}

function displayHelp(channel, args) {

  if (!Array.isArray(args) || args.length == 0) {
    args = [""];
  }

  let cmd = args[0];
  if (cmd[0] == '!') {
    cmd = cmd.slice(1,cmd.length);
  }
  
  let message = "";

  const helpMessages    = require("./jsons/help.json");

  if (cmd in helpMessages) {
    channel.send(defaultEmbed().setTitle(helpMessages[cmd].title)
                               .setDescription(helpMessages[cmd].description));
  } else {
      displayCommands(channel, true);
  }

}
