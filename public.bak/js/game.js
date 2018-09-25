var GameLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		this.init();
	},
	init:function() {
		this._super();
		var size = cc.director.getWinSize();
		
		var bgsprite = cc.Sprite.create(res.BG_IMAGE);
		bgsprite.setPosition(size.width / 2, size.height / 2);
		this.addChild(bgsprite, res.kZindexBG);
		
		this._bat = new BatSprite(res.BAT_BLACK);
		this._bat.x = size.width / 2;
		this._bat.y = kBatStartY;
		this._bat.setScale(kBatScale);
		this._bat.maxX = this.width;
		this.addChild(this._bat, kZindexBat);
		
		this._ball = new BallSprite(res.BALL_YELLOW);
		this._ball.x = this._bat.x;
		this._ball.y = this._bat.y + kBallStartY;
		this._ball.setScale(kBallScale);
		this._ball.screenWidth = this.width;
		this._ball.screenHeight = this.height;
		this.addChild(this._ball, kZindexBall);
		
		this._gameStarted = FALSE;
		this._middleX = size.width / 2;	
	},
	
	onEnter: function() {
		this._super();
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: this.onKeyPressed,
			onKeyReleased: this.onKeyReleased
		}, this);

		this.schedule(this.onTick);
	},
	
	onTick: function(dt) {
		
		var gameOver = FALSE;
		
		if (this._bat.state == kBatStateMoving) {
			this._bat.MoveBat(dt);
			this._ball.MoveBall(this._bat.x);
		}
		if (this._ball.state == kBallStateMoving) {
			if (this._ball.y < 0) {
				gameOver = TRUE;
			} else {
				if (this._ball.processCollision) {
					var BallColBox = this._ball.CollisionBox();
					var BatColBox = this._bat.CollisionBox();
					if (cc.rectIntersectsRect(BatColBox, BallColBox)) {
						this._ball.ChangeAlpha(this._bat.x);
						this._ball.processCollision = false;
					}
				}
			}
			
			if (gameOver == FALSE) {
				this._ball.UpdateBall(dt);
			} else {
				this.ReEnableAfterFall();
			}
		}
	},
	
	onKeyPressed: function(keyCode, event) {
		var tar = event.getCurrentTarget();
		if (keyCode === kLeftKey) {
			tar._bat.state = kBatStateMoving;
			tar._bat.speedX = -kBatSpeed;
		} else if (keyCode === kRightKey) {
			tar._bat.state = kBatStateMoving;
			tar._bat.speedX = kBatSpeed;
		} else if (keyCode === kStartKey && tar._gameStarted === FALSE) {
			tar._ball.state = kBallStateMoving;
			tar._ball.speed = kBallSpeed;
			tar._ball.alpha = kBallStartAlpha;
			tar._gameStarted = TRUE;
		}
	},
	
	onKeyReleased: function(keyCode, event) {
		var tar = event.getCurrentTarget();
		tar._bat.state = kBatStateStopped;
		tar._bat.speedX = 0;
	},
	
	ReEnableAfterFall: function() {
		this._gameStarted = FALSE;
		this._bat.x = this._middleX;
		this._ball.state = kBallStateStopped;
		this._ball.x = this._bat.x;
		this._ball.y = this._bat.y + kBallStartY;
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
