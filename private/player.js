var constants = require('./constants');
var res = require('./resources');

(function() {
	class Player {
		constructor(id, size) {
			this.id = id;
			this.state = constants.kBatStateStopped;
			this.speedX = 0.0;
			this.minX = 0;
			this.width = 0;
			this.height = 0;
			this.initX = size.width / 2;
			switch(id) {
				case 1:
					this.x = size.width / 2;
					this.y = constants.kBatStartY;
					this.color = res.BAT_BLACK;
					this.maxX = size.width;
					break;
				case 2:
					this.x = size.width / 2;
					this.y = size.height - constants.kBatStartY;
					this.color = res.BAT_ORANGE;
					this.maxX = size.width;
					break;
				default:
			}
		}
		
		setSpeed(speed) {
			this.speedX = speed;
		}
		
		setState(state) {
			this.state = state;
		}
		
		setColBox(msg) {
			this.width = msg.width;
			this.height = msg.height;
			this.minX = msg.minX;
			this.maxX = msg.maxX;
		}
		
		move(dt) {
			if (this.state === constants.kBatStateMoving) {
				var distance = this.speedX * dt;
				this.x = this.x + distance;
				
				if (this.x < this.minX) {
					this.x = this.minX;
					this.speedX = 0.0;
				} else if (this.x > this.maxX) {
					this.x = this.maxX;
					this.speedX = 0.0;
				}
			}
			return this.x;
		}
	}
	
	module.exports.addPlayer = function(id, size) {
		return new Player(id, size);
	}
}());
