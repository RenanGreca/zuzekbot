var Discord = require('./node_modules/discord.io');
// var logger = require('./node_modules/winston');
var auth = require('./auth.json');
var channels = require('./channels.json');
var quotes = require('./quotes.json');
var roles = require('./roles.json');
var ids = require('./ids.json');
var feedbacks = require('./feedback.json');

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
  console.log('substring: '+message.substring(0, 8));

  if (message.substring(0, 8) == 'good bot') {
    bot.sendMessage({
      to: channelID,
      message: ':smile:',
      typing: true
    });
    return;
  }

  if (message.substring(0, 7) == 'bad bot') {
    bot.sendMessage({
      to: channelID,
      message: ':frowning:',
      typing: true
    });
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
        bot.sendMessage({
          to: channelID,
          message: 'Pong!',
          typing: true
        });
      break;

      case 'pin':
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
      break;

      case 'slap':
        var critMsg = ''
        var crit = Math.random()
        if (crit < 0.2) {
          critMsg = '. It\'s super effective!'
        }

        bot.sendMessage({
          to: channelID,
          message: '*<@!'+userID+'> slaps '+ args.join(' ') +' around a bit with a large trout*' + critMsg
        });
      break;

      case 'savequote':
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
                  message: 'Quote saved.'
                });
              }
          });

        });
      break;

      case 'quote':

        if (args.length == 0) {
          var quote = quotes[Math.floor(Math.random()*quotes.length)];
          bot.sendMessage({
            to: channelID,
            message: quote.message
          });
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
            bot.sendMessage({
              to: channelID,
              message: '<@!'+userID+'>, você é trouxa?'
            });
          } else {
            var quote = userQuotes[Math.floor(Math.random()*userQuotes.length)];
            bot.sendMessage({
              to: channelID,
              message: quote.message
            });
          }

        } else {
          bot.sendMessage({
            to: channelID,
            message: '<@!'+userID+'>, você é trouxa?'
          });
        }
      break;

      case 'addroles':
        var addedRoles = [];
        args.forEach(function(roleName, index) {
          if (roles.hasOwnProperty(roleName)) {
            var roleID = roles[roleName];
            bot.addToRole({
              serverID: "410864161543815169",
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
      break;

      case 'feedback':
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
      break;

      case 'list':
        bot.sendMessage({
          to: channelID,
          message: '```!ping, !list, !slap [user], !pin [message], !savequote, !quote, !addroles [role, ...], !feedback [bug or feature].```'
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
    var emanos = Math.random();

    console.log("emanos chance: "+ emanos)
    if (emanos < 0.2) {
      bot.sendMessage({
        to: channelID,
        message: 'old',
        typing: true
      });
    }

    return;
  }


  // carabot
  var cara = Math.random();

  console.log("cara chance: "+ cara)
  if (cara < 0.02) {
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

    return;
  }


  // willbot
  var will = Math.random();

  console.log("will chance: "+ will)
  if (will < 0.02) {
    bot.sendMessage({
      to: channelID,
      message: '<:will:466272230330990603> :ok_hand:',
      typing: true
    });

    return;
  }


  // patobot
  var pato = Math.random();

  console.log("pato chance: "+ pato)
  if (pato < 0.02) {
    bot.sendMessage({
      to: channelID,
      message: ':duck:',
      typing: true
    });

    return;
  }


  // spoilerbot
  var spoiler = Math.random();

  console.log("spoiler chance: "+ spoiler)
  if (spoiler < 0.02) {
    bot.sendMessage({
      to: channelID,
      message: 'caralho, spoilers',
      typing: true
    });

    return;
  }


  // quotebot
  var quotebot = Math.random();

  console.log("spoiler chance: "+ quotebot)
  if (quotebot < 0.02) {

    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    bot.sendMessage({
      to: channelID,
      message: quote.message
    });

    return;
  }

  // fingerbot
  // var finger = Math.random();
  //
  // console.log("finger chance: "+ finger)
  // if (finger < 0.005) {
  //   bot.sendMessage({
  //     to: channelID,
  //     message: "",
  //     typing: true
  //   });
  //
  //   return;
  // }


});
