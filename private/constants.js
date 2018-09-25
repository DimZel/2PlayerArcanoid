var Constants = {}

Constants.kZindexBG = 0;
Constants.kZindexBat = 10;
Constants.kZindexBall = 20;

Constants.kBatStateStopped = 0;
Constants.kBatStateMoving = 1;
Constants.kBatStartY = 10;
Constants.kBatScale = 0.2;
Constants.kBatSpeed = 500.0;

Constants.kBallStateStopped = 0;
Constants.kBallStateMoving = 1;
Constants.kBallStartY = 39;
Constants.kBallScale = 0.075;
Constants.kBallSpeed = 600.0;
Constants.kBallStartAlpha = 30 * Math.PI / 180;
Constants.kBallDeltaTime = 0.015;

Constants.kLeftKey = 37;
Constants.kRightKey = 39;
Constants.kUpKey = 38;
Constants.kDownKey = 40;
Constants.kStartKey = 32;

Constants.TRUE = 1;
Constants.FALSE = 0;

module.exports = Constants;
