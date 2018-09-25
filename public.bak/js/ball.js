var BallSprite = cc.Sprite.extend( {
	
	state: kBallStateStopped,
	speed: 0.0,
	alpha: 0,
	boundingBox: null,
	screenWidth: 0,
	screenHeight: 0,
	processCollision: false, 
	
	ctor: function(spriteFrameName) {
		this._super(spriteFrameName);
	},
	
	UpdateBall: function(dt) {
		if (this.boundingBox === null) {
			this.boundingBox = this.getBoundingBox();
		}
		if (this.state === kBallStateMoving) {
			var distance = 0;
			var newSpeed = 0;
			
			distanceY = this.speed * dt * Math.cos(this.alpha);
			distanceX = this.speed * dt * Math.sin(this.alpha);
			
			this.y = this.y + distanceY;
			this.x = this.x + distanceX;
			
			if (this.x < this.boundingBox.width / 2) {
				// console.log('Before left edge: ' + this.alpha / Math.PI * 180);
				this.x = this.boundingBox.width / 2;
				this.alpha = -this.alpha;
				this.processCollision = true;
				// console.log('After left edge: ' + this.alpha / Math.PI * 180);
			} else if (this.x > this.screenWidth - this.boundingBox.width / 2) {
				// console.log('Before right edge: ' + this.alpha / Math.PI * 180);
				this.x = this.screenWidth - this.boundingBox.width / 2;
				this.alpha = -this.alpha;
				this.processCollision = true;
				// console.log('After right edge: ' + this.alpha / Math.PI * 180);
			} else if (this.y > this.screenHeight - this.boundingBox.height / 2) {
				// console.log('Before upper edge: ' + this.alpha / Math.PI * 180);
				this.y = this.screenHeight - this.boundingBox.height / 2;
				if (this.alpha > 0) {
					this.alpha = Math.PI - this.alpha;
				} else {
					this.alpha = -(Math.PI + this.alpha);
				}
				this.processCollision = true;
				// console.log('After upper edge: ' + this.alpha / Math.PI * 180);
			}
		}
	},
	
	ChangeAlpha: function(batX) {
		if (batX > this.x) {
			// console.log('Before left bat: ' + this.alpha / Math.PI * 180);
			if (this.alpha > 0) {
				this.alpha = -(Math.PI - this.alpha);
			} else {
				this.alpha = -(Math.PI + this.alpha);
			}
			// console.log('After left bat: ' + this.alpha / Math.PI * 180);
		} else {
			// console.log('Before right bat: ' + this.alpha / Math.PI * 180);
			if (this.alpha > 0) {
				this.alpha = Math.PI - this.alpha;
			} else {
				this.alpha = Math.PI + this.alpha;
			}
			// console.log('After right bat: ' + this.alpha / Math.PI * 180);
		}
	},
	
	MoveBall: function(batX) {
		if (this.state === kBallStateStopped) {
			this.x = batX;
		}
	},
	
	CollisionBox: function() {
		return new cc.Rect(
			this.getBoundingBox().x + 5,
			this.getBoundingBox().y + 5,
			this.getBoundingBox().width - 25,
			this.getBoundingBox().height - 25
		);
	}
	
});