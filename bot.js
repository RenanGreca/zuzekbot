var Discord = require('./node_modules/discord.io');
var math = require('./node_modules/mathjs');
// var logger = require('./node_modules/winston');
var auth = require('./auth.json');
var channels = require('./channels.json');
var quotes = require('./quotes.json');
var reactions = require('./reactions.json');
var roles = require('./roles.json');
var ids = require('./ids.json');
var feedbacks = require('./feedback.json');
var price = require('./getprice.js');

var timer = require('timers');
// import {findGame} from 'getprice';

var serverID = ids.serverID;
var zuzekbotID = ids.zuzekbotID;

var isShuttingUp = false;

// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  console.log('Connected');
  console.log('Logged in as: ');
  console.log(bot.username + ' - (' + bot.id + ')');

  // var jsonData = JSON.stringify(bot.servers);
  // var fs = require('fs');
  // fs.writeFile("servers.json", jsonData, function(err) {
  //     if (err) {
  //         console.log(err);
  //     }
  // });
});

bot.on('message', function (user, userID, channelID, message, evt) {
  console.log('user: '+user + ' - (' + userID + ')');
  console.log('channel: '+channelID);
  console.log('message: '+message);

  if (message.toLowerCase().indexOf('good bot') !== -1) {
    goodbot(channelID);
    return;
  }

  if (message.toLowerCase().indexOf('bad bot') !== -1) {
    badbot(channelID);
    return;
  }

  if (message.toLowerCase().indexOf('indiano') !== -1 &&
     (userID == '447525339187380264' || userID == '484118307046162434')) {
    angry(channelID);
    return;
  }

  // commands start with "!"
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
      // !ping
      case 'ping':
        ping(channelID);
      break;

      case 'calc':
        calc(userID, channelID, args.join(' '));
      break;

      case 'pin':
        pin(channelID);
      break;

      case 'slap':
        slap(userID, channelID, args.join(' '));
      break;

      case 'savequote':
        savequote(channelID);
      break;

      case 'addquote':
        savequote(channelID);
      break;

      // case 'removequote':
      //   removequote(userID, channelID);
      // break;

      case 'quote':
        quote(userID, channelID, args);
      break;

      case 'removequote':
        removequote(userID, channelID, args);
      break;

      case 'addroles':
        addroles(userID, channelID, args);
      break;

      case 'feedback':
        feedback(user, userID, channelID, args);
      break;

      case 'price':
        getPrice(userID, channelID, args);
      break;

      case 'duck':
        duck(channelID, args);
      break;

      case 'wiki':
        wiki(channelID, args);
      break;

      case 'diceroll':
        diceroll(userID, channelID, args);
      break;

      case 'shutup':
        shutup(userID, channelID, args);
      break;

      case 'calaboca':
        shutup(userID, channelID, args);
      break;

      case 'comeback':
        comeback();
      break;

      case 'list':
        displayCommands(channelID);
      break;

      case 'help':
        displayCommands(channelID);
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

  if (message == "") {
    return;
  }

  // emanosbot
  if (message.substring(0, 4) == 'http') {
    emanosbot(channelID);
    return;
  }

  if (message.toLowerCase().indexOf('obrigado') !== -1 ||
      message.toLowerCase().indexOf('thanks') !== -1 ||
      message.toLowerCase().indexOf('thank you') !== -1) {
    yourewelcome(channelID);
    return;
  }

  if (message.toLowerCase().indexOf(' mestre') !== -1 ||
      message.toLowerCase().indexOf(' master') !== -1) {
    master(channelID);
    return;
  }

  if (message == 'o/') {
    highfive(channelID);
    return;
  }

  var randomMessageChance = Math.random()

  console.log('randomMessageChance: '+randomMessageChance)
  if (randomMessageChance < 0.04 && !isShuttingUp) {

    var whichMessageChance = Math.random()
    console.log('whichMessageChance: '+whichMessageChance)
    if (whichMessageChance < 0.3) {
      carabot(message, channelID);
    } else if (whichMessageChance < 0.4) {
      willbot(channelID);
    } else if (whichMessageChance < 0.5) {
      patobot(channelID);
    } else if (whichMessageChance < 0.55) {
      spoilerbot(channelID)
    } else {
      quotebot(channelID, true)
    }

  }

});

function shutup(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID)
    return;
  }

  var minutes = parseInt(args[0]);
  // max one hour
  if (minutes > 60) {
    minutes = 60;
  }

  var duration = minutes*1000*60;
  isShuttingUp = true;

  timer.setInterval(comeback, duration);
}

function comeback() {
  isShuttingUp = false;
}

function angry(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ':rage:',
    typing: true
  });
}

function emanosbot(channelID) {
  var emanos = Math.random();

  console.log("emanos chance: "+ emanos)
  if (emanos < 0.1) {
    bot.sendMessage({
      to: channelID,
      message: 'old',
      typing: true
    });
  }
}

function carabot(message, channelID) {
  var punctuation = Math.random();
  var contents = '';
  if (punctuation < 0.3) {
    contents = 'Cara, '+message+'?';
  } else if (punctuation < 0.6) {
    contents = 'Cara, '+message+'!';
  } else if (punctuation < 0.9) {
    contents = 'Cara, '+message+'.';
  } else {
    contents = 'cara';
  }

  bot.sendMessage({
    to: channelID,
    message: contents,
    typing: true
  });
}

function willbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: '<:will:466272230330990603> :ok_hand:',
    typing: true
  });
}

function patobot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ':duck:',
    typing: true
  });
}

function spoilerbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: 'caralho, spoilers',
    typing: true
  });
}

function quotebot(channelID, typing) {
  var quote = quotes[Math.floor(Math.random()*quotes.length)];
  bot.sendMessage({
    to: channelID,
    message: quote.message+' (#'+quote.id+')',
    typing: typing
  });
}

function removequote(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID)
    return;
  }

  var quoteID = parseInt(args[0]);
  var quoteIndex = findQuoteIndexWithID(quoteID);

  if (quoteIndex == -1) {
    trouxa(userID, channelID)
    return;
  }

  var quote = quotes[quoteIndex];

  if (quote.votes == 2) {
    bot.sendMessage({
      to: channelID,
      message: '3/3 votes for the removal of quote #'+quoteID
    });

    quotes.splice(quoteIndex, 1);
    saveQuotesToFile(function(err) {
        if (err) {
            console.log(err);
        } else {
          bot.sendMessage({
            to: channelID,
            message: 'Quote #'+quoteID+' removed.'
          });
        }
    });

    return;
  }

  quotes[quoteIndex].votes += 1;
  saveQuotesToFile(function(err) {
      if (err) {
          console.log(err);
      } else {
        bot.sendMessage({
          to: channelID,
          message: quotes[quoteIndex].votes+'/3 votes for the removal of quote #'+quoteID
        });
      }
  });
}

function goodbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ':smile:',
    typing: true
  });
}

function badbot(channelID) {
  bot.sendMessage({
    to: channelID,
    message: ':frowning:',
    typing: true
  });
}
function pin(channelID) {
  bot.getMessages( {
    channelID: channelID,
    limit: 1
  }, function(err, messageArray) {
    console.log('Pinning message');

    var messageID = messageArray[0].id;
    bot.pinMessage( {
      channelID: channelID,
      messageID: messageID
    }, function(err) {
      console.log(err);
    });
  });
}

function slap(userID, channelID, object) {
  var critMsg = '';
  var crit = Math.random();
  if (crit < 0.2) {
    critMsg = '. It\'s super effective!';
  } else if (crit < 0.4) {
    critMsg = '. A critical hit!';
  }

  bot.sendMessage({
    to: channelID,
    message: '*<@!'+userID+'> slaps '+ object +' around a bit with a large trout'+ critMsg+'*'
  });
}

function savequote(channelID) {

  var crit = Math.random();
  if (crit < 0.1) {
    bot.sendMessage({
      to: channelID,
      message: 'Eu não salvo qualquer merda'
    });
    return;
  }

  bot.getMessages( {
    channelID: channelID,
    limit: 2
  }, function(err, messageArray) {
    console.log('Saving message');

    var message = messageArray[1];
    var authorID = message.author.id;
    var authorName = message.author.username;
    var discriminator = message.author.discriminator;
    var content = message.content;

    if (authorID == zuzekbotID) {
      return;
    }

    var quoteID = quotes[quotes.length-1].id+1;

    var quote = {
      id: quoteID,
      userid: authorID,
      username: authorName,
      message: content,
      votes: 0
    };
    quotes.push(quote);

    saveQuotesToFile(function(err) {
        if (err) {
            console.log(err);
        } else {
          bot.sendMessage({
            to: channelID,
            message: 'Quote #'+quoteID+' saved: "'+content+'" by '+authorName
          });
        }
    });

  });
}

function trouxa(userID, channelID) {
  bot.sendMessage({
    to: channelID,
    message: '<@!'+userID+'>, você é trouxa?'
  });
}

function quote(userID, channelID, args) {
  if (args.length == 0) {
    quotebot(channelID, false);
  } else if (args.length == 1) {

    if (isNaN(args[0])) {
      // quote from user
      var userstring = args[0];
      var quotedUserID = userstring.substring(2, userstring.length-1);
      console.log("Quoting: "+quotedUserID);

      var userQuotes = [];
      quotes.forEach(function(quote, index) {
        if (quote.userid == quotedUserID) {
          userQuotes.push(quote);
        }
      });

      if (userQuotes.length == 0) {
        trouxa(userID, channelID);
      } else {
        var quote = userQuotes[Math.floor(Math.random()*userQuotes.length)];
        bot.sendMessage({
          to: channelID,
          message: quote.message+' (#'+quote.id+')'
        });
      }
    } else {
      // quote with ID
      var quoteID = parseInt(args[0]);
      var quoteIndex = findQuoteIndexWithID(quoteID);

      if (quoteIndex == -1) {
        trouxa(userID, channelID)
        return;
      }

      var quote = quotes[quoteIndex];

      bot.sendMessage({
        to: channelID,
        message: quote.message+' (#'+quote.id+')'
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
    message: '<@!'+userID+'> added to roles: '+addedRoles.join(', ')+'.'
  });
}

function feedback(user, userID, channelID, args) {
  var feedback = {
    userID: userID,
    username: user,
    contents: args.join(' ')
  };
  feedbacks.push(feedback);

  saveFeedbacksToFile(function(err) {
      if (err) {
          console.log(err);
      }
  });

  bot.sendMessage({
    to: channelID,
    message: '<@!'+userID+'>, thank you for your feedback.'
  });
}

function getPrice(userID, channelID, args) {
  price.getPrice(args.join(' '), function(message) {
    if (message == '') {
      trouxa(userID, channelID);
    }

    bot.sendMessage({
      to: channelID,
      message: message
    });
  });
}

function duck(channelID, args) {
  var query = encodeURI(args.join('+'));
  var url = 'https://duckduckgo.com/?q=!ducky+'+query;

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function wiki(channelID, args) {
  var query = encodeURI(args.join('_'));
  var url = 'https://en.wikipedia.org/wiki/'+query;

  bot.sendMessage({
    to: channelID,
    message: url
  });
}

function ping(channelID) {
  bot.sendMessage({
    to: channelID,
    message: 'Pong!',
    typing: true
  });
}

function calc(userID, channelID, args) {
  if (args.toLowerCase().indexOf('mãe') !== -1) {
    var peso = Math.random() * 34238490238;


    bot.sendMessage({
      to: channelID,
      message: peso+"kg"
    });

    return;
  }

  if (args.toLowerCase().indexOf('univers') !== -1) {
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
  }
  catch(err) {
    bot.sendMessage({
      to: channelID,
      message: err.message
    });
  }
}

function diceroll(userID, channelID, args) {
  if (isNaN(args[0])) {
    trouxa(userID, channelID)
    return;
  }

  var dicesize = parseInt(args[0]);
  var rng = Math.ceil(Math.random()*dicesize);

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
    message: '<@!189096616043479041> is my master.',
    typing: true
  });
}

function highfive(channelID) {
  bot.sendMessage({
    to: channelID,
    message: '\\o',
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
  var fs = require('fs');
  fs.writeFile("quotes.json", jsonData, callback);
}

function saveFeedbacksToFile(callback) {
  var jsonData = JSON.stringify(feedbacks);
  var fs = require('fs');
  fs.writeFile("feedback.json", jsonData, callback);
}

function displayCommands(channelID) {
  bot.sendMessage({
    to: channelID,
    message: '\
    ```\
!ping, \n\
!list/!help, \n\
!calc [expression], \n\
!duck [query], \n\
!wiki [query], \n\
!slap [user], \n\
!pin [message], \n\
!savequote/!addquote, \n\
!quote [user/quoteid], \n\
!removequote [quoteid], \n\
!addroles [role, ...], \n\
!diceroll [number] \n\
!price [game], \n\
!shutup/!calaboca [minutes], \n\
!comeback, \n\
!feedback [bug or feature].```'
  });
}
