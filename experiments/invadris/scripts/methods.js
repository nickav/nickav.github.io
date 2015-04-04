const PI = 3.141, DEGTORAD = Math.PI/180, RADTODEG = 180/Math.PI;

function get(element)
{
	return document.getElementById(element);
};

function centerMiddleText(text, width, height)
{
	return '<div style="display: table; width:' + width + 'px; height: ' + height + 'px;  #position: fixed; overflow: hidden;"><div style="#position: absolute; #top: 50%; display: table-cell; text-align:center; vertical-align: middle;"><div style=" #position: absolute; #top: -50%">' + text + '</div></div></div>';
};

function center(text, width)
{
	return '<div style="width:' + width + 'px;"><center>' + text + '</center></div>';
};

function image(image, width, height)
{
	return '<img src = '+image.src+' width = "'+width+'" height="'+height+'"/>';
};

function rectangle(width, height)
{
	return '<img src="images/pixel.gif" height="' + height + '" width="'+ width + '" />';
};

function keyReset()
{
	pressingRight = false;
	pressingUp = false;
	pressingDown = false;
	pressingLeft = false;
};

function inc(s, a, ms)
{
	if (s+a<=ms) s += a;
	else s = ms;
	return s;
};

function dec(s, f, ms)
{
	if (s-f>ms) s -= f;
	else s = ms;
	return s;
};

function incTo(s, a, ns)
{
	if (s<ns) s = inc(s, a, ns);
	else if (s>ns) s = dec(s, a, ns);
	return s;
};

//checks for a rectangular collision between the two instances
//collision(instacne1, instance2, relative new x for inst1, relative y , shrink width rectangle for inst1, shrink height);
function collision(inst1, inst2, newX, newY, shrinkw, shrinkh)
{
	var newx = 0, newy = 0, sw = 0, sh = 0;
	if (typeof newX != "undefined") newx = newX;
	if (typeof newY != "undefined") newy = newY;
	if (typeof shrinkw != "undefined") sw = shrinkw;
	if (typeof shrinkh != "undefined") sh = shrinkh;
	
	if ((inst1.x+inst1.width+newx-sw >= inst2.x) && (inst1.x+newx+sw <= inst2.x + inst2.width) && (inst1.y+inst1.height+newy-sh >= inst2.y) && (inst1.y+newy+sh <= inst2.y + inst2.height))
		return true;
	return false;
};

//checks for a collision with an instance in a rectangle
function collisionRect(inst1, x, y, width, height)
{
	var xx = 0, yy = 0, w = 0, h = 0;
	if (typeof x != "undefined") xx = x;
	if (typeof y != "undefined") yy = y;
	if (typeof width != "undefined") w = width;
	if (typeof height != "undefined") h = height;
	
	if ((inst1.x+inst1.width >= x) && (inst1.x <= x + w) && (inst1.y+inst1.height >= y) && (inst1.y <= y + h))
		return true;
	return false;
};

function collisionRectangles(inst1x, inst1y, inst1width, inst1height, x, y, width, height)
{
	var xx = 0, yy = 0, w = 0, h = 0;
	if (typeof x != "undefined") xx = x;
	if (typeof y != "undefined") yy = y;
	if (typeof width != "undefined") w = width;
	if (typeof height != "undefined") h = height;
	
	if ((inst1x+inst1width >= x) && (inst1x <= x + w) && (inst1y+inst1height >= y) && (inst1y <= y + h))
		return true;
	return false;
};

function distance(x1, y1, x2, y2)
{
	return Math.sqrt((y2-y1)*(y2-y1) + (x2-x1)*(x2-x1));
}

function distanceTo(inst1, inst2)
{
	return distance(inst1.x+inst1.width/2, inst1.y+inst1.height/2, inst2.x+inst2.width/2, inst2.y+inst2.height/2);
}

function direction(x1, y1, x2, y2)
{
	return Math.atan2(y2-y1,x2-x1)*(180/PI);
};

function directionTo(inst1, inst2)
{
	var x1 = inst1.x + inst1.width*0.5, y1 = inst1.y + inst1.height*0.5, x2 = inst2.x + inst2.width*0.5, y2 = inst2.y + inst2.height*0.5;
	return direction(x1, y1, x2, y2);
};

function blocksAt(x1,y1,x2,y2,x3,y3)
{
	var blocksA = [];
	if (groups.length>0)
	{
		for (var i=0, il=blocks.length; i<il; i++)
		{
			var block = blocks[i];
			
			if (block.x == x1 && block.y == y1 || block.x == x2 && block.y == y2 || block.x == x3 && block.y == y3)
				blocksA.push(block);
		}
	}
	return blocksA;
};

function floorTo(number, value)
{
	return Math.floor(number/value)*value;
};

function randomInt(low, high)
{
	return low + Math.floor(Math.random()*(high + 1 - low));
};

function findIn(array, key)
{
	for (var i=0, il=array.length; i<il; i++)
		if (array[i] === key)
			return true;
	return false;
};

function openings(width)
{
	var opens = [];

	var o = true;
	for (var xx=SCREENLEFT; xx<SCREENWIDTH-width; xx+=GRIDSIZE)
	{
		o = true;
		for (var i=0, il=blocks.length; i<il; i++)
			if (collisionRect(blocks[i], xx + 1, -GRIDSIZE*4, xx+width - 1, GRIDSIZE*5 - 1))
			{
				o = false;
				break;
			}
		if (o) opens.push(xx + 12);
	}
	return opens;
};

function removeSpaces(str)
{
	return str.replace(new RegExp("\\s", "gi"), "");
};

function sign(number)
{
	if (number<0) return -1;
	return 1;
};

function stoppingDist(speed, friction)
{
	return (speed*speed)/(2*friction);
};

//Sound Functions
function play(sound, loop)
{
	if (audioOn)
	{
		if (typeof loop == "undefined") loop = false;
		
		if (!loop)
			sound.play();
		else
			sound.play({numberOfLoops:100});
	}
};

function stop(sound)
{
	sound.stop();
};

function setAudioOn(bool)
{
	audioOn = bool;
	localStorage.audio = bool; //!!
};
//end of Sound Functions

function setKeypadOn(bool)
{
	keypadOn = bool;
	localStorage.keypad = bool; //!!
};

function setEfficient(bool)
{
	efficient = bool;
	localStorage.effic = bool; //!!
};

function setMode(num)
{
	mode = num % (3 - (!skipToLevel*1) - (!waveMode*1));
	localStorage.mode = mode; //!!
};