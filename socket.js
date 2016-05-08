/**
 * Created by Mohit on 4/30/2016.
 */
var server = require('http').Server();

var io = require('socket.io')(server);

var Redis = require('ioredis');
var redis = new Redis();

io.on('connection',function(socket){
    //console.log('socket',socket);
});

redis.psubscribe('*',function(err,count){
    //console.log('count',count);
    //console.log('err',err);
});

redis.on('pmessage',function(subscribed,channel,data){
    //message = JSON.parse(message);
    console.log('subscribed',subscribed);
    console.log('channel',channel);
    var dataObj = JSON.parse(data);
    console.log(dataObj);
    io.emit(channel + ':' + dataObj.event,dataObj.data);
})

server.listen(3000,function(){
    console.log('server up and running');
});

/*client side start*/
	/*
	$(document).ready(function(){
		$('#post-message').click(function(){
			$.ajax({
				url: "{{url("task/contact-professional/{$task->id}/{$quote->id}")}}",
				method:'POST',
				data:{'chat_message' : $('#chat_message').val()},
				success:function(data){
					console.log('ajax-response',data);
				}
			});
		});


		var socket = io('http://localhost:3000/');

		socket.on("notifications_to_3" + ":App\\Events\\NotifyMessage", function(data){
			//this.messages.push(data.message);
			console.log('--data--',data);

		}.bind(this));

	})
	*/
/*client side end*/