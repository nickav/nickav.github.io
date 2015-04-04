var MAX_SPEED = 10; //max particle speed
var PADDING = 0.05; //don't make particles in the percent padding
var SPEED_BOOST = 0.1; //speed boost when pressing screen
var SENS_X = 20, SENS_Y = 25; //accelerometer sensetivity
var TILT_OFFSET = 6; //the accelerometer offset in calculating the normal position
var MIN_Z = 0.25; //min particle z

var WIDTH, HEIGHT, HALFWIDTH, HALFHEIGHT, MIN_X, MIN_Y, X_RANGE, Y_RANGE;
var FULLCIRC = Math.PI*2, RADTODEG = 180/Math.PI, DEGTORAD = Math.PI/180;

var repeat;
var canvas, ctx;
var objs = [];
Particle.amount = 150; //number of particles
var dx = 0, dy = 0;
var touching = false;
var speed = 0; //global particle speed
var speedBoost = 0;
var accel = {x:0, y:0, z:0}; //accelerometer data
var deviceAccel = false;

function init()
{
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		window.addEventListener("devicemotion", didAccelerate, false);
		document.addEventListener("touchstart",  touchStart,  false);
		document.addEventListener("touchend",  touchEnd,  false);
	}
	else {
		window.addEventListener("mousemove", mouseMoveAccelerate, false);
		document.addEventListener("mousedown", touchStart, false);
		document.addEventListener("mouseup", touchEnd, false);
	}

	canvas = document.createElement('canvas');
	canvas.width = document.width || window.outerWidth;
    canvas.height = document.height || window.outerHeight;
	document.getElementById("canvas").appendChild(canvas);
	ctx = canvas.getContext("2d");
	
	WIDTH = canvas.width;
	HEIGHT = canvas.height;
	HALFWIDTH = WIDTH/2;
	HALFHEIGHT = HEIGHT/2;
	MIN_X = WIDTH*PADDING;
	MIN_Y = HEIGHT*PADDING;
	X_RANGE = WIDTH - MIN_X*2;
	Y_RANGE = HEIGHT - MIN_Y*2;

	for (var i=0; i<Particle.amount; i++)
		new Particle(MIN_X + X_RANGE*Math.random(), MIN_Y + Y_RANGE*Math.random());
		
	repeat = setInterval(update, 33);
}

function draw()
{
	ctx.globalAlpha = 1;
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fillRect(0,0,WIDTH,HEIGHT);

	for (var i=0; i<objs.length; i++)
	{
		objs[i].move();
		objs[i].draw(ctx);
	}
}

function update()
{
	//accelerometer values
	//if (deviceAccel) {
		dx = accel.x*SENS_X;
		dy = (accel.y - TILT_OFFSET)*SENS_Y;
		if (dy>0) dy *= 2;
	//}
	
	speed = distance(0, 0, dx, dy)/10;
	speed = Math.min(Math.max(speed, -MAX_SPEED), MAX_SPEED);
	
	if (Math.abs(speed)>MAX_SPEED/4) {
		speedBoost = SPEED_BOOST*(speed)/MAX_SPEED;
	} else speedBoost = 0;
	
	if (touching) speedBoost = SPEED_BOOST;
	
	draw();
}

Particle.width = 4;
function Particle(x, y)
{
	var x = x || HALFWIDTH,
	y = y || HALFHEIGHT,
	z = (1-MIN_Z)*Math.random() + MIN_Z,
	xprev = x,
	yprev = y,
	dir = 0,
	dist = 0,
	color = "rgb(" + randomInt(255) + "," + randomInt(255) + "," + randomInt(255) + ")",
	life = 1;
	
	this.draw = function(c){
		c.globalAlpha = Math.min(((life - 1)/(2+z*3)), 1);
		c.strokeStyle = color;
		c.lineWidth = z*Particle.width;
		c.beginPath();
		c.moveTo(x, y);
		c.lineTo(xprev, yprev);
		c.stroke();
	};
	
	this.move = function(){
		var d = direction(0, 0, dx, dy);
		dir = direction(HALFWIDTH, HALFHEIGHT, x, y);
		dist = distance(HALFWIDTH, HALFHEIGHT, x, y);
		var amt = dist*life*life*(z+1)*(z+1)*z >> 10; // /1000 or >> 10
		xprev = x;
		yprev = y;
		
		x += Math.cos(d)*speed + Math.cos(dir)*amt;
		y += Math.sin(d)*speed + Math.sin(dir)*amt;
		
		if (x<-speed || x>WIDTH+speed || y<-speed || y>HEIGHT+speed)
		{
			//adjust new position based on the tilt
			x = (MIN_X + X_RANGE*Math.random()) - (speed/MAX_SPEED)*Math.cos(d)*MIN_X*2;
			y = (MIN_Y + Y_RANGE*Math.random()) - (speed/MAX_SPEED)*Math.sin(d)*MIN_Y*2;
			xprev = x;
			yprev = y;
			life = 1 + speed/50;
			z = (1-MIN_Z)*Math.random() + MIN_Z;
		}
		life *= 1.025 + speedBoost;
	};
	
	objs.push(this);
}

function direction(x1, y1, x2, y2)
{
	return Math.atan2(y2-y1,x2-x1);
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

function randomInt(high)
{
	return Math.floor(Math.random()*high);
}

function didAccelerate(event) {
	accel.x = -event.accelerationIncludingGravity.x;
	accel.y = -event.accelerationIncludingGravity.y;

	deviceAccel = true;
}

function touchStart(event) {
	touching = true;
	event.stopPropagation();
	return false;
}

function touchEnd(event) {
	touching = false;
	event.stopPropagation();
	return false;
}

window.addEventListener("load", init, false);

function mouseMoveAccelerate(event) {
	accel.x = (event.screenX - HALFWIDTH);
	accel.y = (event.screenY - HALFHEIGHT);
}