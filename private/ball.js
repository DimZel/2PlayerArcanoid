var constants = require('./constants');
var res = require('./resources');

(function () {
	class Ball {
		constructor(size) {
			this.state = constants.kBallStateStopped;
			this.speed = 0.0;
			this.alpha = 0;
			this.x = size.width / 2;
			this.y = constants.kBallStartY;
			this.screenWidth = size.width;
			this.screenHeight = size.height;
			this.width = 0;
			this.height = 0;
		}
		
		SetWidth(width) {
			this.width = width;
		}
		
		SetHeight(height) {
			this.height = height;
		}
		
		Start() {
			if (this.state === constants.kBallStateStopped) {
				this.state = constants.kBallStateMoving;
				this.speed = constants.kBallSpeed;
				if (this.y === constants.kBallStartY) {
					this.alpha = constants.kBallStartAlpha;
				} else {
					this.alpha = Math.PI - constants.kBallStartAlpha;
				}
			}
		}
		
		Stop(player) {
			if (this.state === constants.kBallStateMoving) {
				this.state = constants.kBallStateStopped;
				this.speed = 0.0;
				this.alpha = 0;
				this.x = player.x;
				if (player.id === 1) {
					this.y = constants.kBallStartY;
				} else if (player.id === 2) {
					this.y = this.screenHeight - constants.kBallStartY;
				}
			}
		}
		
		BallIntersectsBat(bat) {
			var ballX1 = this.x - this.width / 2;
			var ballY1 = this.y + this.height / 2;
			var ballX2 = ballX1 + this.width;
			var ballY2 = ballY1 - this.height;
			
			var batX1 = bat.x - bat.width / 2;
			var batY1 = bat.y + bat.height / 2;
			var batX2 = batX1 + bat.width;
			var batY2 = batY1 - bat.height;
			if (ballX1 < batX2 && ballX2 > batX1 &&
				ballY1 > batY2 && ballY2 < batY1) {
				return true;
			}
			return false;
		}
		
		ChangeAlpha(batX) {
			if (batX > this.x) {
				if (this.alpha > 0) {
					this.alpha = -(Math.PI - this.alpha);
				} else {
					this.alpha = -(Math.PI + this.alpha);
				}
			} else {
				if (this.alpha > 0) {
					this.alpha = Math.PI - this.alpha;
				} else {
					this.alpha = Math.PI + this.alpha;
				}
			}
		}
		
		UpdateBall(dt, bats) {
			if (this.state === constants.kBallStateMoving) {
				if (this.y < 0) {
					return 1;
				} else if (this.y > this.screenHeight) {
					return 2;
				}
				var distanceY = this.speed * dt * Math.cos(this.alpha);
				var distanceX = this.speed * dt * Math.sin(this.alpha);
				
				this.y = this.y + distanceY;
				this.x = this.x + distanceX;
				
				for (var i = 0, len = bats.length; i < len; ++i) {
					if (this.BallIntersectsBat(bats[i])) {
						this.ChangeAlpha(bats[i].x);
					}
				}
				
				if (this.x < this.width / 2) {
					this.x = this.width / 2;
					this.alpha = -this.alpha;
				} else if (this.x > this.screenWidth - this.width / 2) {
					this.x = this.screenWidth - this.width / 2;
					this.alpha = -this.alpha;
				}
				return 0;
			}
		}
	}
	
	module.exports.Init = function(size) {
		return new Ball(size);
	}
}());
