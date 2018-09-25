var res = {};

res.BG_IMAGE 	= 'images/Background/BG-HD.png';

res.BAT_BLACK 	= 'images/Bats/bat_black.png';
res.BAT_BLUE 	= 'images/Bats/bat_blue.png';
res.BAT_ORANGE 	= 'images/Bats/bat_orange.png';
res.BAT_PINK 	= 'images/Bats/bat_pink.png';
res.BAT_YELLOW 	= 'images/Bats/bat_yellow.png';

res.BALL_BLUE	= 'images/Balls/ball_blue.png';
res.BALL_GREEN	= 'images/Balls/ball_green.png';
res.BALL_ORANGE	= 'images/Balls/ball_orange.png';
res.BALL_RED	= 'images/Balls/ball_red.png';
res.BALL_SILVER	= 'images/Balls/ball_silver.png';
res.BALL_YELLOW	= 'images/Balls/ball_yellow.png';

var kZindexBG = 0;
var kZindexBat = 10;
var kZindexBall = 20;

var kBatStateStopped = 0;
var kBatStateMoving = 1;
var kBatStartY = 10;
var kBatScale = 0.2;
var kBatSpeed = 500.0;

var kBallStateStopped = 0;
var kBallStateMoving = 1;
var kBallStartY = 29;
var kBallScale = 0.075;
var kBallSpeed = 600.0;
var kBallStartAlpha = 30 * Math.PI / 180;

var kLeftKey = 37;
var kRightKey = 39;
var kUpKey = 38;
var kDownKey = 40;
var kStartKey = 32;

var TRUE = 1;
var FALSE = 0;
