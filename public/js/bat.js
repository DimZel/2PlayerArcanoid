var BatSprite = cc.Sprite.extend( {
	
	state: kBatStateStopped,
	speedX: 0.0,
	minX: 0,
	maxX: 0,
	colBoxOnServer: FALSE,
	
	ctor: function (spriteFrameName) {
		this._super(spriteFrameName);
	},
	
	MoveBat: function(dt) {
		if (this.state === kBatStateMoving) {
			var distance = 0;
			
			distance = this.speedX * dt;
			
			this.x = this.x + distance;
			
			if (this.x < this.minX) {
				this.x = this.minX;
				this.speedX = 0.0;
			} else if (this.x > this.maxX) {
				this.x = this.maxX;
				this.speedX = 0.0;
			}
		}
	},
	
	SetMinMax: function() {
		if (this.minX === 0) {
			this.minX = this.getBoundingBox().width / 2;
			this.maxX = this.maxX - this.getBoundingBox().width / 2;
		}
	},
	
	CollisionBox: function() {
		return new cc.Rect(
			this.getBoundingBox().x,
			this.getBoundingBox().y + 5,
			this.getBoundingBox().width,
			this.getBoundingBox().height - 30
		);
	}
});