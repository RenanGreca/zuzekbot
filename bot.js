var Discord = require('./node_modules/discord.io');
var math = require('./node_modules/mathjs');
// var logger = require('./node_modules/winston');
var auth = require('./auth.json');
var channels = require('./channels.json');
var quotes = require('./quotes.json');
var roles = require('./roles.json');
var ids = require('./ids.json');
var feedbacks = require('./feedback.json');
var price = require('./getprice.js');
// import {findGame} from 'getprice';

var serverID = ids.serverID;
var zuzekbotID = ids.zuzekbotID;

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

      case 'quote':
        quote(userID, channelID, args);
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

      case 'list':
        bot.sendMessage({
          to: channelID,
          message: '```!ping, !list, !calc [expression], !slap [user], !pin [message], !savequote/!addquote, !quote, !addroles [role, ...], !price [game], !feedback [bug or feature].```'
        });
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

  if (message.toLowerCase().indexOf('mestre') !== -1 ||
      message.toLowerCase().indexOf('master') !== -1) {
    master(channelID);
    return;
  }

  if (message == 'o/') {
    highfive(channelID);
    return;
  }

  var randomMessageChance = Math.random()

  console.log('randomMessageChance: '+randomMessageChance)
  if (randomMessageChance < 0.05) {

    var whichMessageChance = Math.random()
    console.log('whichMessageChance: '+whichMessageChance)
    if (whichMessageChance < 0.2) {
      carabot(message, channelID);
    } else if (whichMessageChance < 0.4) {
      willbot(channelID);
    } else if (whichMessageChance < 0.5) {
      patobot(channelID);
    } else if (whichMessageChance < 0.6) {
      spoilerbot(channelID)
    } else {
      quotebot(channelID, true)
    }

  }

});

function emanosbot(channelID) {
  var emanos = Math.random();

  console.log("emanos chance: "+ emanos)
  if (emanos < 0.2) {
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
    message: quote.message,
    typing: typing
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

    var quote = {
      userID: authorID,
      username: authorName,
      message: content
    };
    quotes.push(quote);

    var jsonData = JSON.stringify(quotes);
    var fs = require('fs');
    fs.writeFile("quotes.json", jsonData, function(err) {
        if (err) {
            console.log(err);
        } else {
          bot.sendMessage({
            to: channelID,
            message: 'Quote saved: "'+content+'" by '+authorName
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
    var userstring = args[0];
    var quotedUserID = userstring.substring(2, userstring.length-1);
    console.log("Quoting: "+quotedUserID);

    var userQuotes = [];
    quotes.forEach(function(quote, index) {
      if (quote.userID == quotedUserID) {
        userQuotes.push(quote);
      }
    });

    if (userQuotes.length == 0) {
      trouxa(userID, channelID);
    } else {
      var quote = userQuotes[Math.floor(Math.random()*userQuotes.length)];
      bot.sendMessage({
        to: channelID,
        message: quote.message
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

  var jsonData = JSON.stringify(feedbacks);
  var fs = require('fs');
  fs.writeFile("feedback.json", jsonData, function(err) {
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
