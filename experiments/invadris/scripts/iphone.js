document.addEventListener("touchstart", touchStart, false);
document.addEventListener("touchmove", touchMove, false);
document.addEventListener("gesturestart", gestureStart, false);
document.addEventListener("gesturechange", gestureChange, false);

function touchStart(event) {
	event.preventDefault();
};
function touchMove(event) {
	event.preventDefault();
};
function gestureStart(event) {
	event.preventDefault();
};
function gestureChange(event) {
	event.preventDefault();
};

function keypadPress(event)
{
	if (keypadOn)
	{
		for (var i=0; i<2; i++)
		{
			var touch = event.touches[i];
			var dist = distance(touch.pageX, touch.pageY, 40, 440);
			
			if (dist>10 && dist<75)
			{
				var dir = Math.round(direction(touch.pageX, touch.pageY, 40, 440)) + 180;
				
				keyReset();
		
				if (dir>=45 && dir<135)	pressingDown = true;
				if (dir>=135 && dir<225) pressingLeft = true;
				if (dir>=225 && dir<315) pressingUp = true;
				if (dir>=315 || dir<45)	pressingRight = true;
			}
		}
	}
	getTouchCoords(event);
};

function keypadRelease()
{
	if (keypadOn)
		keyReset();
	resetTouchCoords();
};

var touchX = -1, touchY = -1;
var prevTouchX = -1, prevTouchY = -1;
var startX = -1, startY = -1;

function gameScreenStart(event)
{
	pressingShoot = true;
	
	getTouchCoords(event);
};

function gameScreenEnd()
{
	pressingShoot = false;
	resetTouchCoords();
};

function getTouchCoords(event)
{
	prevTouchX = touchX;
	prevTouchY = touchY;
	touchX = event.touches[0].pageX;
	touchY = event.touches[0].pageY;
	
	if (startX<0)
	{
		startX = touchX;
		startY = touchY;
	}
};

function resetTouchCoords()
{
	touchX = touchY = prevTouchX = prevTouchY = startX = startY = -1;
};

//Accelerometer
var xAccel = 0;
var yAccel = 0;
var zAccel = 0;
var sens = 5.5;

var watchAccel = function()
{
	var suc = function(a){
		xAccel = roundDec(a.x)*sens;
		yAccel = roundDec(a.y+0.5)*sens*1.4;
		zAccel = roundDec(a.z)*sens;
	};
	var fail = function(){};
	var opt = {};
	opt.frequency = Math.floor(MSECS);
	timer = navigator.accelerometer.watchAcceleration(suc,fail,opt);
};

var clearAccel = function()
{
	navigator.accelerometer.clearWatch(timer);
};

function roundDec(num) {
	var dec = 3;
	return result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
};
