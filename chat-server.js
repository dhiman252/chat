var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection',function(client){

    console.log('Client connected...');

    client.on('join',function(name){
        console.log(name +' joins the chat.')
        client.nickname = name;
    });

    client.on('messages',function(message){
        var nickname = client.nickname;
        client.broadcast.emit("messages", nickname + ': ' +message);
        client.emit("messages", nickname + ": "+ message);
        console.log(message);
    });


});

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080);
