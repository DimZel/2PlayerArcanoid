var GameLayer = cc.Layer.extend({
	_id: 0,
	
	ctor:function() {
		this._super();
		this.init();
	},
	init:function() {
		this._super();
		var size = cc.director.getWinSize();		
		
		this._socket = io();
		var req = { size: size };
		this._socket.emit('init', req);
		this._bats = [];
		var _this = this;
		this._socket.on('init', function(id, players, ball){
			console.log(id);
			if (_this._id === 0) {
				_this._id = id;
			} else {
				_this.removeAllChildren(true);
			}
			var bgsprite = cc.Sprite.create(res.BG_IMAGE);
			bgsprite.setPosition(size.width / 2, size.height / 2);
			_this.addChild(bgsprite, res.kZindexBG);
			
			_this._bats = players.map(function(player) {
				var bat = new BatSprite(player.color);
				bat.x = player.x;
				bat.y = player.y;
				bat.setScale(kBatScale);
				bat.maxX = size.width;
				return bat;
			});
			
			_this._bats.forEach(function(bat) {
				_this.addChild(bat, kZindexBat);
			});
			
			_this._ball = new BallSprite(res.BALL_YELLOW);
			_this._ball.x = ball.x;
			_this._ball.y = ball.y;
			_this._ball.setScale(kBallScale);
			_this.addChild(_this._ball, kZindexBall);
			
			_this._gameStarted = FALSE;
			_this._middleX = size.width / 2;
		});
	},
	
	onEnter: function() {
		this._super();
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this.onKeyPressed,
			onKeyReleased: this.onKeyReleased
		}, this);

		this.schedule(this.onTick);
		var _this = this;
		this._socket.on('keyMove', function(id, batX, ballX) {
			_this.getBat(id).x = batX;
			_this._ball.x = ballX;
		});
		this._socket.on('moveBall', function(x, y) {
			if (_this._ball) {
				_this._ball.x = x;
				_this._ball.y = y;
			}
		});
		this._socket.on('stop', function(ball, bats) {
			_this._ball.x = ball.x;
			_this._ball.y = ball.y;
			for (var i = 0, len = bats.length; i < len; ++i) {
				_this._bats[i].x = bats[i].x;
			}
			_this._gameStarted = FALSE;
		});
	},
	
	getBat: function(id) {
		if (id) return this._bats[id - 1];
		return this._bats[this._id - 1];
	},
	
	onTick: function(dt) {
		
		var gameOver = FALSE;
		
		if (this._id !== 0) {
			var _this = this;
			if (this.getBat().colBoxOnServer === FALSE) {
				this.getBat().SetMinMax();
				if (this.getBat().minX !== 0) {
					var req = {
						id: this._id,
						width: this.getBat().getBoundingBox().width,
						height: this.getBat().getBoundingBox().height / 3
					};
					this._socket.emit('setColBox', req);
				}
				this._socket.on('setColBox', function(id) {
					_this.getBat(id).colBoxOnServer = TRUE;
				});
			}
			if (this.getBat().state == kBatStateMoving) {
				var req = {
					id: this._id,
					state: this.getBat().state, 
					speedX: this.getBat().speedX,
					dt: dt
				};
				this._socket.emit('keyMove', req);
			}
		}
	},
	
	onKeyPressed: function(keyCode, event) {
		var tar = event.getCurrentTarget();
		if (keyCode === kLeftKey) {
			tar.getBat().state = kBatStateMoving;
			tar.getBat().speedX = -kBatSpeed;
		} else if (keyCode === kRightKey) {
			tar.getBat().state = kBatStateMoving;
			tar.getBat().speedX = kBatSpeed;
		} else if (keyCode === kStartKey && tar._gameStarted === FALSE) { 
			var req = {
				id: tar._id,
				width: tar._ball.getBoundingBox().width,
				height: tar._ball.getBoundingBox().height
			};
			tar._socket.emit('start', req);
			tar._socket.on('start', function(started) {
				tar._gameStarted = started;
			});
		}
	},
	
	onKeyReleased: function(keyCode, event) {
		var tar = event.getCurrentTarget();
		tar.getBat().state = kBatStateStopped;
		tar.getBat().speedX = 0;
	},
	
	ReEnableAfterFall: function() {
		this._gameStarted = FALSE;
		this.getBat().x = this._middleX;
		this._ball.state = kBallStateStopped;
		this._ball.x = this.getBat().x;
		this._ball.y = this.getBat().y + kBallStartY;
		this._ball.processCollision = false;
	}
});

GameLayer.scene = function() {
	var scene = new cc.Scene();
	var layer = new GameLayer();
	scene.addChild(layer);
	return scene;
}

window.onload = function(){
	
	var targetWidth = 960;
	var targetHeight = 640;
	
	cc.game.onStart = function(){
		
		cc.view.adjustViewPort(false);
		cc.view.setDesignResolutionSize(targetWidth, targetHeight, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
		
		//load resources
		cc.LoaderScene.preload(["images/HelloWorld.png"], function () {
			cc.director.runScene(GameLayer.scene());
		}, this);
	};
	cc.game.run("gameCanvas");
};
