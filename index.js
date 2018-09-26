var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var constants = require('./private/constants');
var player = require('./private/player.js');
var ball = require('./private/ball.js');

const PORT = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var curBall = null;
var players = [];
var timerID;

io.on('connection', function(socket){
	console.log('a user connected');
	
	socket.on('init', function(msg) {
		var id = players.length + 1
		var newPlayer = player.addPlayer(id, msg.size);
		players.push(newPlayer);
		if (curBall === null) {
			curBall = ball.Init(msg.size);
		}
		console.log(id);
		io.emit('init', id, players, curBall);
	});
	
	socket.on('setColBox', function(msg) {
		var curPlayer = players[msg.id - 1];
		curPlayer.setColBox(msg);
	});
	
	socket.on('keyMove', function(msg) {
		var curPlayer = players[msg.id - 1];
		curPlayer.setSpeed(msg.speedX);
		curPlayer.setState(msg.state);
		var x = curPlayer.move(msg.dt);
		if (curBall.state === constants.kBallStateStopped) {
			if (curBall.y === constants.kBallStartY) {
				if (msg.id === 1) {
					curBall.x = curPlayer.x;
				}
			} else {
				if (msg.id === 2) {
					curBall.x = curPlayer.x;
				}
			}
		}
		io.emit('keyMove', msg.id, x, curBall.x);
	});
	
	socket.on('start', function(msg) {
		console.log('started');
		curBall.SetWidth(msg.width);
		curBall.SetHeight(msg.height);
		curBall.Start();
		io.emit('start', 1);
		timerID = setInterval(function() {
			var fall = curBall.UpdateBall(constants.kBallDeltaTime, players);
			if (fall === 0) {
				io.emit('moveBall', curBall.x, curBall.y);
			} else {
				clearInterval(timerID);
				for (var i = 0, len = players.len; i < len; ++i) {
					players[i].x = players[i].initX;
				}
				var curPlayer = players[fall - 1];
				curBall.Stop(curPlayer);
				io.emit('stop', curBall, players);
			}
		}, constants.kBallDeltaTime * 1000);
		
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		players.pop();
	});
});

http.listen(PORT, function(){
	console.log(`Listening on ${ PORT }`);
});
