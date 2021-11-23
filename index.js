//===================
//||    IMPORTS    ||
//===================

//web framework
//Source: https://github.com/expressjs/express
var express = require('express');

//http webpage setup
//Source: NodeJS default API
var http = require('http');

//file nav
//Source: NodeJS default API
var path = require('path');

//Advanced server management (multiplayer)
//Source: https://github.com/socketio/socket.io
var socketIO = require('socket.io');

var fs = require('fs');

//================================
//||    PRIMARY SERVER SETUP    ||
//================================

//Calls the main express function.
var app = express();

//uses the express function to generate a server with http
var server = http.Server(app);

//Sets up the multiplayer feature with socketIO
var io = socketIO(server);


//
//
//

function initSetup(port, html, script, template){
  
  fs.mkdir ("./static",{recursive:true}, (err) => {
    if (err){
      return console.error(err);
    }
  })
  fs.readFile(template, 'utf8',function(err, data){
    if (err) {throw err};
    fs.writeFile('./' + html,data,function(){});
  });

  fs.readFile(script, 'utf8', function(err, data){
    fs.writeFile('./static/' + script,data,function(){})
  });
  fs.mkdir("./Database",{recursive:true}, (err) => {
    if(err){
      return console.error(err);
    }
  })
  fs.mkdir("./Database/World",{recursive:true}, (err) => {
    if(err){
      return console.error(err);
    }
  })
  fs.mkdir("./Database/Members",{recursive:true}, (err) => {
    if(err){
      return console.error(err);
    }
  })
  fs.mkdir("./Database/Backups",{recursive:true}, (err) => {
    if(err){
      return console.error(err);
    }
  })
  fs.writeFile("./Database/Members/archive.json","{}", function(){})

  app.set('port', port);
  app.use(('/static'), express.static(("./"+'/static')))
  app.get('/', function(request, response) {
    response.sendFile(html,{root:("./")});
  });
  server.listen(port, function() {
    console.log('Starting server on port:'+ port);
  });
}

var players={};
function initPlayer(){
  console.log('hai')
  players={};
  io.on('connection', function(socket) {
    console.log("a user connected");
    socket.on("disconnect", () => {
      delete players[socket.id];
    });
    socket.on('new player', function(userdata){
      console.log("a user connected");
      players[socket.id] = userdata;
      console.log(userdata);
    })
    socket.on('msgClick', function(msgr){
      var player = players[socket.id];
      player.msg = msgr;
    })
    
  });
  setInterval(function() {
    io.sockets.emit('state', players);
    console.clear();
    console.log(players)
  }, 1000 / 60);

  
  
  //
}

//initServer(8000, "voidtests","voidtest.html","./lobbyformat.html");

function configModeration(commands, rankjson, permissions){
  //
}
module.exports = {initSetup,initPlayer};


//initSetup(8000,"lobby.html","./script.js","./lobbyformat.html")

//initPlayer();