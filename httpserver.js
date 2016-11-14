/*
  Web Server (HTTP) for Speech Recognition Module and OTT Video Playback 
  ----------------------------------------------------------------------

  This file instansiates a Web Server that serves up the player.html page performing
  speech to text conversion.The results are then returned to this server via 
  a websocket connection (socket.io).This also sends playlist to the client for 
  the video streams stored in /video directory and also streams out video to the Client . 
  You can host as many videos in /video directory in mp4,webm,ogg format.
  Fill in cmdstr for the actions you want to support for the player.e.g some actions like 
  "room" is also added for "zoom" as speech recoginition logic may detect it this way.
  Run this Webserver with the command "node httpserver.js".
*/

// Dependancies and declarations
var express = require('express');
var app = express();
var fs = require('fs');

var server = require('http').createServer( handler);
var io = require('socket.io').listen(server);
var path = require('path');
var log = true;

var fs = require('fs'),
    url = require('url'),
    path = require('path');


var cmdstr = "back play stop top bak zoom room forward mute next";
var arrayString= cmdstr.split(" ");

// Handles socket.io communication
io.on('connection', function(socket){

  // Commands received from HTML page
  socket.on('command', function(msg){

    // Log command if desired
    if (Boolean(log)){
      console.log('Received Command from HTML page [' + msg + '].');
    }
  if(msg!=null || msg!='')
  {  
     for(var i=0;i<=arrayString.length -1;i++)
     {
        var tomatch = arrayString[i];
        var result=msg.toLowerCase().indexOf(tomatch);
       if(result >= 0)
       {  
         io.sockets.emit('new-message', tomatch);
         break;
       } 
      
    }
     msg=null;
  }
     
  
  });
});


var indexPage;
fs.readFile(path.resolve(__dirname,"player.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
 
// create http server
function handler(req, res) {
    
    var reqResource = url.parse(req.url).pathname;
    console.log("Resource: " + reqResource);

    if(reqResource == "/"){
    
        console.log(req.headers)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();

    }
   else if(reqResource == "/video") 
   {
      var items   = []; 
      fs.readdir("./video", function(err, items) {
      console.log(items);
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(items));
      res.end();
     
      });    
  }
  else if(reqResource == "/genie.png")
  {
       console.log(req.headers)
       var img = fs.readFileSync('./images/genie.png');
       res.writeHead(200, {'Content-Type': 'image/png' });
       res.end(img, 'binary');
  }
  else  if(reqResource == "/favicon.ico")
  {
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end();

  }
  else 
  {
         // Get the filename
    var movieFileName = "";

    if (url.parse(req.url).pathname) {
        movieFileName = url.parse(req.url).pathname;
    }

    var streamPath = path.resolve("./video" + movieFileName);
    //Calculate the size of the file
    var stat = fs.statSync(streamPath);
    var total = stat.size;
    var file;
    var contentType = "video/mp4";

    if (endsWith(movieFileName, ".ogg")) {
        contentType = "video/ogg";
    }

    if (endsWith(movieFileName, ".webm")) {
        contentType = "video/webm";
    }
    if (endsWith(movieFileName, ".mkv")) {
        contentType = "video/mkv";
    }

    // Chunks based streaming
    if (req.headers.range) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end - start) + 1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

        file = fs.createReadStream(streamPath, {
            start: start,
            end: end
        });
        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': contentType
        });
        res.openedFile = file;
        file.pipe(res);
    } else {
        console.log('ALL: ' + total);
        file = fs.createReadStream(streamPath);
        res.writeHead(200, {
            'Content-Length': total,
            'Content-Type': contentType
        });
        res.openedFile = file;
        file.pipe(res);
    }

    res.on('close', function() {
        console.log('response closed');
        if (res.openedFile) {
            res.openedFile.unpipe(this);
            if (this.openedFile.fd) {
                fs.close(this.openedFile.fd);
            }
        }
    });
  }
};

server.listen(8080, "0.0.0.0"); 



