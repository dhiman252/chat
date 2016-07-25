    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    var redis = require('redis');
    var redisClient = redis.createClient();
    var ioRedis = require('ioredis');
    var ioRedisClient = new ioRedis();
    var mysql      = require('mysql');

    ioRedisClient.psubscribe('*',function(err,count){
        //console.log('count',count);
        //console.log('err',err);
    });

    ioRedisClient.on('pmessage', function(subscribed, channel, data){
        var dataObj = JSON.parse(data);
        if(channel === 'Logout'){
            var userId = dataObj["data"]["userId"];
            var userIdentifier = 'user:' + userId;

            redisClient.hget(userIdentifier,'socket_id',function(err,res){
                //console.log(['res',res,'json_parse',JSON.parse(res)]);
                if(res != null){
                    var ioConnectedSockets = io.sockets.connected;
                    var connectedSockets = JSON.parse(res);
                    connectedSockets.forEach(function(socketId){
                        if(ioConnectedSockets.hasOwnProperty(socketId)){
                            ioConnectedSockets[socketId].disconnect();
                        }
                    });
                }
            });

            redisClient.srem('members', userId);
            redisClient.hdel(userIdentifier,'socket_id');
        } else {
            io.emit(channel + ':' + dataObj.event, dataObj);
        }
    });

    //var user = io.of('/')
        io.on('connection',function(socket){

            socket.on('join',function(userObj){

                socket.info = userObj;

                var userIdentifier = 'user:' + userObj.id;

                redisClient.hget(userIdentifier,'socket_id',function(err,res){
                    if(res == null){
                        redisClient.hset(userIdentifier,'socket_id', JSON.stringify([socket.id]) );
                    } else {
                        var connectedSockets = JSON.parse(res);
                        connectedSockets.push(socket.id);
                        redisClient.hset(userIdentifier,'socket_id',JSON.stringify(connectedSockets));
                    }
                });

                //socket.broadcast.emit('chatters',userObj.id);
                //socket.emit('chatters',userObj.id);
                redisClient.sadd('members', userObj.id);

                redisClient.smembers('members',function(err,id){
                    id.forEach(function(userId){
                        socket.broadcast.emit('chatters',userId);
                        socket.emit('chatters',userId);
                    });
                });
            });

            socket.on('disconnect', function (reason) {
                if(socket.info){
                    var userObj = socket.info;
                    var userIdentifier = 'user:' + userObj.id;
                    redisClient.hget(userIdentifier,'socket_id',function(err,res){
                        if(res == null){
                            redisClient.srem('members', userObj.id);
                            socket.broadcast.emit('chatters-left',userObj.id);
                        } else {
                            var connectedSockets = JSON.parse(res);
                            var index = connectedSockets.indexOf(socket.id);

                            if(index > -1){
                                connectedSockets.splice(index, 1);
                            }

                            connectedSockets.forEach(function(socketId){
                                if(typeof io.sockets.sockets[socketId] == 'undefined'){
                                    var index = connectedSockets.indexOf(socketId);
                                    if(index > -1){
                                        connectedSockets.splice(index, 1);
                                    }
                                    //console.log(['length',connectedSockets.length,index]);
                                } else {
                                    //console.log(['socketId',socketId,typeof  io.sockets.sockets[socketId]]);
                                }
                            });
                            //console.log(['connectedSockets',connectedSockets]);
                            if(connectedSockets.length == 0){
                                redisClient.hdel(userIdentifier,'socket_id');
                                redisClient.srem('members', userObj.id);
                                socket.broadcast.emit('chatters-left',userObj.id);
                            } else {
                                redisClient.hset(userIdentifier,'socket_id',JSON.stringify(connectedSockets));
                            }
                        }
                    });
                }
            });

            socket.on('chat',function(chatObj){
                //console.log(chatObj);
                //redisClient.rpush('chat',JSON.stringify(chatObj),function (err, res) {});
                var connection = mysql.createConnection({
                    host     : 'localhost',
                    user     : 'root',
                    password : '',
                    database : 'woohands'
                });

                connection.connect();

                var chat  = { 'sender_id': chatObj.id, 'quote_id': chatObj.quoteId, 'parent_id': chatObj.parentId,
                    "seen" : 0, 'message':chatObj.text,'created_at': chatObj.sent };

                var query = connection.query('INSERT INTO messages SET ?', chat, function(err, result) {
                    if (err) throw err;
                    socket.broadcast.emit('chat',chatObj);
                    socket.emit('chat',chatObj);
                });

                connection.end();
            });

        });

    /*app.get('/about', function (req, res){
        var data;
        redisClient.hget('task:1','users',function(err,res){
            data = JSON.parse(res);
            var type = typeof data;
            console.log([data.indexOf(1),type]);
        });
        res.send(data);
    });*/

    server.listen(8080);