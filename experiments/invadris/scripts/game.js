const FRAMERATE = 15;
const MSECS = 1000/FRAMERATE;
const SPEED = 30;
const FACTOR = SPEED/FRAMERATE;
const INVFACTOR = FRAMERATE/SPEED;

const SCREENWIDTH = 320;
const SCREENHEIGHT = 480;
const SCREENLEFT = 80;
const SCREENTOP = 0;
const GRIDSIZE = 24;
const GAMEWIDTH = SCREENWIDTH - SCREENLEFT;
const GAMEHEIGHT = SCREENHEIGHT;

var interval;

var inGame = false;
var audioOn, keypadOn, skipToLevel;
const STARTLEVEL = 8, LEVELPOINTS = 5000;
var waveMode = false, enemiesKilled = 0;
const ENEMIESTOKILL = 99;

var tellthem = false;

var score = 0;
var highscore = 0;
var level = 1;
var blockscleared = 0;
var totalblockscleared = 0;
var wave = false;

var shipLives = 3;
const MAXSHIPLIVES = 9;
//fading in
var fadealpha = 1;
var fadespeed = 0.2*FACTOR;
var fadewait = 4;
var fadecolor = "#000";

var time = 1;
var secondtime = 0;
var maxMoveTime = 18;
var movetime = maxMoveTime;
var randomTimer = 0, randomTime = 0;
var enemy1Num = 0, enemy2Num = 0, enemy3Num = 0;

var limitTime = 0;
var limiter = 0;
var minTime = 30;

var endGame = false;
var endGameTimerTime = 15;
var endGameTimer = 0, endGameTime = endGameTimerTime;

var efficient = false;
var mode = 0;

//Arrays
var instances = new Array();
var tempinstances = new Array();
var destroys = new Array();
var enemies = new Array();
var enemybullets = new Array();
var groups = new Array();
var blocks = new Array();
var bullets = new Array();
var lives = new Array();
var squares = new Array();
var insts = new Array();
var buttons = new Array();

var pressingRight = false;
var pressingLeft = false;
var pressingUp = false;
var pressingDown = false;
var pressingShoot = false;
var paused = false;

var ship;
var pauseText;
var group;
var line, line1, line2;
var lineA, lineA1, lineA2;
var dowork = false;
var explode = false;
var clearedText;
var scoreText;
var name = "";

var  pTimer = 0, pTime = 0;

//**
var frames = 0;
var fpsText;
var secondInterval;
//**

function initGame()
{
	clearInsts();
	clearInstances();
	destroyInstances();
	
	//reset vars
	score = 0;
	highscore = 0;
	level = 1;
	blockscleared = 7;
	totalblockscleared = 0;
	wave = false;
	shipLives = 3;
	time = 1;
	secondtime = 0;
	movetime = maxMoveTime-2;
	randomTimer = 0;
	randomTime = 0;
	enemy1Num = 1;
	enemy2Num = 0;
	enemy3Num = 0;
	limiter = 0;
	limitTime = 0;
	endGame = false;
	endGameTimer = 0;
	endGameTime = endGameTimerTime;
	Enemy.totalKilled = 0;
	pTimer = 0;
	pTime = 0;
	///
	//remove old elements from arrays
	lives.length = squares.length = 0;
	///
	
	ship = new Ship(SCREENLEFT + (GAMEWIDTH >> 1), GAMEHEIGHT - SCREENLEFT);
	ship.x -= ship.width >> 1;
	
	scoreText = new Inst(2, 32, "", "topLayer");
	scoreText.score = 0;
	scoreText.highscore = 0;
	scoreText.totalblockscleared = 0;
	scoreText.level = 0;
	scoreText.remaining = 0;
	scoreText.move = function(){
		if (this.score != score || this.totalblockscleared!=totalblockscleared || this.level!=level || this.highscore!=highscore || this.remaining!=Math.max(10-blockscleared,0))
		{
			var rem = "Cleared<br/><b>" + totalblockscleared + "</b><br/><br/>Remaining<br/><b>" + (Math.max(10-blockscleared,0)) + "</b>";
			if (mode==2) rem = "Killed<br/><b>" + Enemy.totalKilled + "</b>";
			this.text('<div class = "coolness">' + centerMiddleText("Highscore <br/> <b>" + highscore + "</b>" + "<br/><br/>" + "Score <br/> <b>" + score + "</b>" + "<br/><br/>" +
			"Level <br/> <b>" + level + "</b>" + "<br/><br/>" + rem) + '</div>');
			this.score = score;
			this.highscore = highscore;
			this.totalblockscleared = totalblockscleared;
			this.level = level;
			this.highscore = highscore;
			this.remaining = Math.max(10-blockscleared,0);
		}
	};
	scoreText.move();
	
	pauseText = new Inst(80,0, '<div class = "paused"><b>' + centerMiddleText("PAUSED", GAMEWIDTH, GAMEHEIGHT) + '</b></div>', "topLayer");
	pauseText.visible = false;
	pauseText.move = function(){ if (this.visible) this.setAlpha(1); else this.setAlpha(0);}
	pauseText.move();
	
	//Laser
	line = new Instance(SCREENLEFT, GAMEHEIGHT - GRIDSIZE*3 - 6);
	line.image(laser, GAMEWIDTH, 11);
	line.a = 0;	line.fade = 0; line.fadespeed = 0.01*FACTOR; line.out = true;
	line.alpha = line.fade;
	line.move = function(){this.alpha = (Math.sin(this.a ++/10)*0.4 + 0.8)*this.fade; if (this.out && mode!=2){if (this.fade<1) this.fade += this.fadespeed;} else {if (this.fade>0) this.fade -= this.fadespeed; else this.fade=0;} line1.move(); line2.move();};
	
	line1 = new Instance(SCREENLEFT - 7, GAMEHEIGHT - GRIDSIZE*3 - 6);
	line1.image(laser0, 6, 11);
	line1.move = function(){if (line.out && mode!=2) {if (this.x<SCREENLEFT) this.x+=0.25;} else if (this.x>SCREENLEFT-this.width && line.fade<0.2) this.x-=0.25; this.y = line.y;};
	
	line2 = new Instance(SCREENLEFT + GAMEWIDTH - 6 + 7, GAMEHEIGHT - GRIDSIZE*3 - 6);
	line2.image(laser1, 6, 11);
	line2.move = function(){this.x = (line1.x-SCREENLEFT*2-GAMEWIDTH+this.width)*-1; this.y = line.y};
	
	//Laser
	lineA = new Instance(SCREENLEFT, GAMEHEIGHT - GRIDSIZE*3 - 6);
	lineA.image(laser, GAMEWIDTH, 11);
	lineA.alpha = lineA.fade;
	lineA.move = function(){this.alpha = line.alpha; lineA1.move(); lineA2.move(); };
	
	lineA1 = new Instance(SCREENLEFT - 7, GAMEHEIGHT - GRIDSIZE*3 - 6);
	lineA1.image(laser0, 6, 11);
	lineA1.move = function(){this.x = line1.x; this.y = lineA.y;};
	
	lineA2 = new Instance(SCREENLEFT + GAMEWIDTH - 6 + 7, GAMEHEIGHT - GRIDSIZE*3 - 6);
	lineA2.image(laser1, 6, 11);
	lineA2.move = function(){this.x = line2.x; this.y = lineA.y};
	
	lineA.y = GRIDSIZE*5 - 6;
	
	clearedText = new Inst(SCREENLEFT, 24);
	clearedText.move = function (){
		if (this.old!=this.cleared){this.text('<div class = "paused"><font size="5">' + centerMiddleText(this.cleared, GAMEWIDTH, GAMEHEIGHT) + '</font></div>'); this.old=this.cleared;}
		if (this.fadein)
		{
			if (this.alpha<2) this.alpha += 0.25;
			else this.fadein = false;
			this.setAlpha(this.alpha);
		}
		else {if (this.alpha>0){ this.alpha -= 0.05; this.setAlpha(this.alpha);} else this.setAlpha(0);}
	};
	clearedText.cleared = 0;
	clearedText.old = 0;
	clearedText.alpha = 0;
	clearedText.fadein = false;
	
	//lives
	for (var i=0; i<MAXSHIPLIVES; i++){
		var j = i % 3;
		var life = new Instance(24*j+j, Math.floor(i/3)*4);
		//life.image(shiplife, 24, 22);
		lives.push(life);
	}
	updateLives();
	
	//**
	clearInterval(secondInterval);
	secondInterval = setInterval(second, 1000);
	fpsText = new Inst(0, SCREENHEIGHT-GRIDSIZE*7, 'fps');
	//**

	if (mode!=2)
		highscore = table.getScore(0); //!!
	else highscore = waveTable.getScore(0); //!!
	highscore = highscore || 0;
	
	inGame = true;
	inMenu = false;
	
	if (!keypadOn)
	{
		try
		{
			watchAccel();
		}
		catch(e)
		{
		}
	}
	
	switch (mode)
	{
		case 1:
			level = STARTLEVEL-1;
			wave = true;
			enemy1Num = 0;
			score = LEVELPOINTS;
		break;
	}
	
	updateInstances();
	fadeIn(update);
};

//**
function second()
{	
	fpsText.text(frames + "/" + FRAMERATE);
	frames = 0;
};
//**

function pause()
{
	if (!inMenu && fadealpha<=0 && !endGame)
	{
		if (!paused)
		{
			clearInterval(interval);
			interval = setInterval(updatePause, MSECS);
			paused = true;
			can.drawImage(pausetext, SCREENWIDTH-pausetext.width, Math.floor(pausetext.height/2));
			updatePause();
		}
		else
		{
			clearInterval(interval);
			interval = setInterval(update, MSECS);
			paused = false;
			updatePause();
		}
	}
}

function updatePause()
{
	frames ++; //**
	codeBox(); //**
	
	pauseText.visible = paused;
	pauseText.move();
	
	if (touchX>=SCREENWIDTH-32 && touchY<=16 || mX>=SCREENWIDTH-32 && mY<=10) //**
		if (confirm("Really Quit?"))
			fadeOut(menu);
		else resetTouchCoords();
};

function update()
{
	frames ++; //**
	
	if (blockscleared>=10 && !wave) {wave = true; line.out = false; randomTime = 0; setEnemyAmount();}
	
	scoreText.move(); //e
	clearedText.move(); //e
	
	//handle bullets hitting blocks
	if (groups.length>0 && (bullets.length>0 || enemybullets.length>0))
	{
		for (var i=0, il=blocks.length; i<il; i++)
		{
			var other = blocks[i];
			
			if (other.y>=0)
			{
				for (var k=0, kl=bullets.length; k<kl; k++)
					if (collision(other, bullets[k], 0, 0, 2, -12) && (bullets[k].alive || typeof bullets[k].alive == "undefined"))
					{
						new Explosion(other.x, other.y, 0.5);
						other.destroy();
						if (typeof bullets[k].indestructable == "undefined") bullets[k].destroy();
					}
					
				for (var k=0, kl=enemybullets.length; k<kl; k++)
					if (collision(other, enemybullets[k], 0, 0, 2, -12))
					{
						new Explosion(other.x, other.y, 0.5);
						other.destroy();
						if (typeof enemybullets[k].indestructable == "undefined")enemybullets[k].destroy();
					}
			}
		}
	}
		
	//check ship hitting enemies
	if (!ship.flash && enemies.length>0)
		for (var i=0, il=enemies.length; i<il; i++)
		{
			var enemy = enemies[i];
			if (collision(ship, enemy, 0, 0, 4, 6))
			{
				enemy.explode();
				if (ship.shield>0)
					addScore(enemy.value * level);
				ship.explode();
			}
		}
	//check for squares
	if (!wave && (time==0 || secondtime==0)){
		
		if (squares.length>0)
		{
			var squaredest = 0;
			
			for (var i=0, il=squares.length; i<il; i++)
			{
				var add = true;
				for (var j=0, jl=squares[i].length; j<jl; j++)
					if (!squares[i][j].square)
					{
						add = false;
						break;
					}
				if (add) squaredest ++;
			}
			
			for (var i=0, il=squares.length; i<il; i++)
				for (var j=0, jl=squares[i].length; j<jl; j++)
				{
					if (squares[i][j].square)
					{
						squares[i][j].destroy();
						squares[i][j].square = false;
					}
				}
			if (squaredest>0) 
			{
				blockscleared += squaredest;
				totalblockscleared += squaredest;
				
				if (squaredest > 4) {clearedText.cleared = squaredest; clearedText.fadein = true;}
				
				addScore(level * (squaredest * 10 + 5*(squaredest - 1))); //THE equation
			}
			
			squares.length = 0;
		} //end if (squares.length>0)
		
		if (groups.length>0)
		{
			for (var j=0, jl=blocks.length; j<jl; j++)
			{
				var block = blocks[j];
				var blocksIn = blocksAt(block.x+GRIDSIZE, block.y, block.x, block.y+GRIDSIZE, block.x+GRIDSIZE, block.y+GRIDSIZE);
				
				if (blocksIn.length==3)
				{
					blocksIn.unshift(block);
					squares.push(blocksIn);
				}
			}
		}//end if groups.length>0
		
		if (squares.length>0)
		{
			for (var i=0, il=squares.length; i<il; i++)
			{
				if (squares[i][0].y < line.y && squares[i][0].y > lineA.y - GRIDSIZE)
				{
					var can = false;
					for (var j=0, jl=squares[i].length; j<jl; j++)
						if (squares[i][j].oldy!=squares[i][j].y || squares[i][j].y<0) {can = true; break;} ///
					if (!can)
					{
						squares[i][0].square = true;
						explode = true;
					}
				}
			}
		}//end if squares.length>0
		
		if (explode)
		{
			for (var k=0; k<15; k++)
				for (var i=0, il=blocks.length; i<il; i++)
						blocks[i].move();
			dowork = true;
			explode = false;
			secondtime = 5;
		}
	} //end of time==0
	
	if (time<movetime) time ++;
	else time = 0;
	if (secondtime>-1) secondtime --;
	
	//create enemies
	if (wave || level>=3)
	{
		if (randomTimer>=randomTime)
		{
			var times = 1;
			if (wave && ((enemy1Num%2==0 && enemy1Num>0) || (enemy2Num%2==0 && enemy2Num>0) || (enemy3Num%2==0 && enemy3Num>0)))
				times = 2;
			
			if (times==2) var rand = Math.random();
			
			for (var i=0; i<times; i++)
			{
				var e = null;
				if (enemy1Num>0 && Enemy.enemies<4) {e = new Enemy(SCREENLEFT, -100); enemy1Num --;}
				else if (enemy2Num>0 && Enemy2.enemies<2){e = new Enemy2(SCREENLEFT, -100); enemy2Num--;}
				else if (enemy3Num>0 && Enemy3.enemies<1){e = new Enemy3(SCREENLEFT, -100); enemy3Num--;}
				
				if (e!=null)
				{
					if (times==1) e.x += (GAMEWIDTH - e.width)/2;
					else{
						if (i==0) e.x += Math.max(Math.floor((e.width + rand*(GAMEWIDTH + 1 - e.width) - e.width*2)/2),0);
						else e.x += Math.min(Math.floor(GAMEWIDTH - (e.width + rand*(GAMEWIDTH + 1 - e.width))/2),GAMEWIDTH-e.width);
					}
				}
			}
			
			randomTimer = 0;
			randomTime = Math.floor(Math.random()*(Math.max((100-level*5)*(!wave + 1), FRAMERATE*(!wave + 1)))) + (!wave)*100;
		}
		else randomTimer ++;
		
		if (wave && enemies.length == 0 && enemy1Num==0 && enemy2Num==0 && enemy3Num==0)
		{
			wave = false;
			line.out = true;
			blockscleared = Math.max(10-level-1, 0);
			if (level==STARTLEVEL && !skipToLevel) {localStorage.skip = "true"; skipToLevel = true; tellthem = true;} //!!
			level ++;
			setEnemyAmount(-1);
			line.y = GAMEHEIGHT - GRIDSIZE*(Math.min(2 + Math.floor((level+1)/2), 10)) - 6;
			movetime = Math.max(5, maxMoveTime - (level+2));
		}
	}
	
	if (mode==2) wave = true;
	
	//create blocks
	if (!wave)
	{
		if (limiter<limitTime) limiter ++;
		else
		{
			var num = randomInt(0,7);
			var g = new Group(SCREENLEFT, -GRIDSIZE*10, num);
			var rInt = randomInt(0,3);
			for (var i=0; i<rInt; i++)
				g.rotate();

			var opens = openings(g.width);
			if (opens.length>0)
				g.x = opens[randomInt(0, opens.length-1)];
			else g.destroy();
			
			g.moveY(GRIDSIZE*6);
			
			limiter = 0;
			limitTime = randomInt(Math.max(minTime+100-(level+2)*7, minTime), Math.max(50, 230-(level+2)*10));
		}
		
	}
	
	//create power ups
	if (pTimer<pTime) pTimer ++;
	else{
		if (pTime!=0)
			new PowerUp();
		pTime = randomInt(FRAMERATE*45, FRAMERATE*180);
		pTimer = 0;
	}
	
	if (endGame){
		if (endGameTimer<endGameTime) {endGameTimer ++; clearInterval(interval); interval = setInterval(update, MSECS+endGameTimer*endGameTimer);}
		else {fadeOut(gameOver, 0.1); clearAccel();}
	}
	
	//watch acceleration
	if (!keypadOn)
	{
		//right x = 1, left x = -1, down y = -1, up y = 1
		if (xAccel>1){keyReset(); pressingRight = true;}
		else if (xAccel<-1){keyReset(); pressingLeft = true;}
		else if (yAccel>1){keyReset(); pressingUp = true;}
		else if (yAccel<-1){keyReset(); pressingDown = true;}
		else {keyReset();}
	};
	
	updateInstances();
	
	drawClear();
	draw();
};

var lifeExp;

function drawInstance(inst)
{
	if (inst.img)
	{
		can.save();
		can.globalAlpha = Math.min(Math.max(inst.alpha, 0), 1);
		if (inst.rotation!=0)
		{
			can.translate(inst.x + (inst.width >> 1), inst.y + (inst.height >> 1));
			can.rotate(inst.rotation * PI/180);
			can.drawImage(inst.img, -(inst.width >> 1), -(inst.height >> 1), inst.width, inst.height);
		}
		else can.drawImage(inst.img, inst.x, inst.y, inst.width, inst.height);
		can.restore();
	}
};

function draw()
{
	if ((inGame && !efficient) || inScores) can.drawImage(bg, 0, 0);
	
	for (var i=0, n=instances.length; i<n; i++)
	{
		drawInstance(instances[i]);
	}
	
	if (inGame)
	{
		can.drawImage(sidebar, 0, 0);
		if (keypadOn) can.drawImage(keypad, 0, 400);
		
		for (var i=0; i<shipLives; i++)
			can.drawImage(shiplife, lives[i].x, lives[i].y, 24, 22);
		
		if (lifeExp!=null && lifeExp.destroyed!=true) drawInstance(lifeExp);
	}
};

//must be called with the draw method
function drawClear()
{
	can.clearRect(0,0,320, 480);
};

function setEnemyAmount(oset)
{
	oset = oset || 0;
	if (mode==2) oset = 0;
	enemy1Num = Math.floor((level+oset)/2) + 1;
	enemy2Num = Math.floor((level+oset)/4);
	enemy3Num = Math.floor((level+oset)/8);
};

var entered = false, cleared = false;
function gameOver()
{
	inGame = false;
	clearInsts();
	clearInterval(secondInterval); //**
	clearInstances();
	destroyInstances();
	drawClear();
	
	var tables = [table, waveTable], tab = 0 + (mode==2);
	
	var index = -1;
	if (score>0 && tables[tab].index(score)!=-1)
	{
		var changed = false;
		do {
			changed = false;
			name = prompt("Enter Your Name", name) || "";
			if (name.length>15){name = name.substring(0, 15); changed = true;}
		} while (removeSpaces(name).length<2 || changed)
		index = tables[tab].add(name, score);
	}
	
	highscoreTable(index);
	
	fadeIn(updateHighscoreTable);
};

var pressText, inScores = false;
function highscoreTable(index)
{
	inScores = true;
	
	var color, hs, str = "", tables = [table, waveTable], tab = 0 + (mode==2);
	if (tab>0) str = "Wave";
	var inst = new Inst(0,0,center('<div class = "hstitle"><b>' + str + 'Highscores</b></div>',320));
	for (var i=0; i<10; i++)
	{
		var cyan = "rgb(" + (0) + "," + (255-i*20) + "," + (255-i*0) + ")";
		hs = tables[tab].getScore(i);
		if (hs>0)
		{
			var img = "";
			if (i==index) {color = "yellow"; img =  image(shiplife, 24, 24);}
			else color = null;

			var inst = new Inst(0, 64+40*i, '<div class = "hstext">' + center(img + '&nbsp;<b><font size = "+2">' + tables[tab].getName(i).fontcolor(color || cyan) + '</b>&nbsp;&nbsp;&nbsp;' + tables[tab].getScore(i).fontcolor(color || "white") + '</font>&nbsp;' + img, 320) + '</div>');
			inst.style = inst.element.style;
		}
	}
	pressText = new Inst(0,460,center('<font size = "-1"><b>Press To Continue</b></font>', 320));
	pressText.style = pressText.element.style;
	pressText.a = 0;
};

function updateHighscoreTable()
{	
	pressText.style.opacity = Math.sin(pressText.a++/2) + 1;
	
	if (pressingScreen())
		fadeOut(menu);
};

function fadeIn(funct, speed, color, wait)
{
	fadealpha = 1;
	if (typeof wait != "undefined") fadewait = wait;
	else fadewait = 4;
	if (typeof speed != "undefined") fadespeed = speed;
	if (typeof color != "undefined") fadecolor = color;
	clearInterval(interval);
	updateFadeIn(funct);
};

function updateFadeIn(funct)
{
	drawClear();
	draw();
	
	topCan.clearRect(0,0,320,480);
	topCan.fillStyle = fadecolor;
	topCan.globalAlpha = Math.max(fadealpha, 0);
	topCan.fillRect(0,0,320,480);
	
	addInstances();
	
	if (fadewait>0) {fadewait --; setTimeout("updateFadeIn(" + funct +")", MSECS);}
	else{
		if (fadealpha>0) {fadealpha -= fadespeed; setTimeout("updateFadeIn(" + funct + ")", MSECS);}
		else {interval = setInterval(funct, MSECS);}
	}
};

function fadeOut(funct, speed, color, wait)
{
	fadealpha = 0
	if (typeof wait != "undefined") fadewait = wait;
	else fadewait = 0;
	if (typeof speed != "undefined") fadespeed = speed;
	else fadespeed = 0.2*FACTOR;
	if (typeof color != "undefined") fadecolor = color;
	else fadecolor = "#000";
	clearInterval(interval);
	
	updateFadeOut(funct);
};

function updateFadeOut(funct)
{
	drawClear();
	draw();
	
	topCan.clearRect(0,0,320,480);
	topCan.fillStyle = fadecolor;
	topCan.globalAlpha = Math.max(fadealpha, 0);
	topCan.fillRect(0,0,320,480);
	
	if (fadewait>0) {fadewait --; setTimeout("updateFadeOut(" + funct + ")", MSECS);}
	else{
		if (fadealpha<1) {fadealpha += fadespeed; setTimeout("updateFadeOut(" + funct + ")", MSECS);}
		else {funct();}
	}
};

function updateLives()
{
	for (var i=0, il=lives.length; i<il; i++)
		lives[i].alpha = (shipLives>i)*1;
	if (shipLives<=0) endGame = true;
};

var inMenu = false;
var titleImage;

var spacing = 40, yy = 320, xx = 132;
function menu()
{
	clearInsts();
	clearInstances();
	destroyInstances();
	
	inScores = inGame = false;
	inMenu = true;
	fadeIn(updateMenu);
	
	titleImage = new Instance(0,0);
	titleImage.image(title);
		
	new Button(xx, yy-30, [button1a, button1b], function(){fadeOut(initGame);});
	var b = new Button(xx+24, yy+10, [button2aa, button2cb, button2ba, button2ab, button2ca, button2bb], function(){
		if (skipToLevel && this.index==0 || waveMode) this.cycle();
		else if (this.index==2 && !waveMode){this.index = 4; this.cycle();}
		setMode(++mode);
	});
	var oldmode = mode;
	for (var i=0; i<mode; i++)
		b.cycle();
	setMode(oldmode);
	new Button(xx, yy+spacing, [button7a, button7b], function(){score = -1; fadeOut(gameOver);});
	new Button(xx, yy+spacing*2, [button8a, button8b], function(){fadeOut(tutorial);});
	//new Button(xx, yy+spacing*3, [button9a, button9b], function(){fadeOut(option);});
};

function updateMenu()
{
	if (tellthem)
	{
		try
		{
			navigator.notification.alert('New Mode Unlocked!', 'Click the button under "Play" to change modes', 'Dang!');
		}
		catch(e)
		{
			alert("Congrats, you've unlocked a new mode!");
		}
		tellthem = false;
	};
	drawClear();
	draw();
	
	updateInstances();
	
	//**
	if (pressingUp) {instances[1].press(); pressingUp = false;}
	if (pressingLeft) {instances[2].press(); pressingLeft = false;}
	if (pressingDown) {instances[3].press(); pressingDown = false;}
	if (pressingRight) {instances[4].press(); pressingRight = false;}
	//**
};

function option()
{
	clearInsts();
	clearInstances();
	destroyInstances();
	
	new Instance(0,0).image(bg);
	
	var b;
	b = new Button(xx, yy+spacing*0, [button4a1, button4b1, button4a2, button4b2], function(){setKeypadOn(!keypadOn); this.cycle();});
	if (!keypadOn) b.cycle();
	b = new Button(xx, yy+spacing*1, [button6a1, button6b1, button6a2, button6b2], function(){setAudioOn(!audioOn); this.cycle();});
	if (!audioOn) b.cycle();
	b = new Button(xx, yy+spacing*2, [button3a1, button3b2, button3a2, button3b1], function(){setEfficient(!efficient); this.cycle();});
	if (!efficient) b.cycle();
	new Button(xx, yy+spacing*3, [button5a, button5b], function(){fadeOut(menu);});
	
	fadeIn(updateOption);
};

function updateOption()
{
	drawClear();
	draw();
	
	updateInstances();
};

var tutinsts = [];
var page = 0;

function tutorial()
{
	clearInsts();
	clearInstances();
	destroyInstances();
	
	//**
	clearInterval(secondInterval);
	secondInterval = setInterval(second, 1000);
	fpsText = new Inst(0, SCREENHEIGHT-GRIDSIZE*7, 'fps');
	//**

	page = 0;
	var tutimgs = [tutp1, tutp2, tutp3, tutp4, tutp5, tutp6, tutp7, tutp8, tutp9, tutp10, tutp11];
	tutinsts.length = 0;
	for (var i=0, n=tutimgs.length; i<n; i++)
	{
		var inst = new Instance(i*SCREENWIDTH, 0);
		inst.image(tutimgs[i], SCREENWIDTH, SCREENHEIGHT);
		tutinsts.push(inst);
	}
	
	fadeIn(updateTutorial);
	
	topCan.drawImage(loading, (SCREENWIDTH-loading.width)/2, (SCREENHEIGHT-loading.height)/2);
};

function updateTutorial()
{
	frames ++; //**
	//**
	if (pressingRight) {page ++; pressingRight = false;}
	if (pressingLeft) {page --; pressingLeft = false;}
	//**
	
	drawClear();
	for (var i=page-1; i<=page+1; i++)
	{
		if (i>=0 && i<tutinsts.length)
		{
			drawInstance(tutinsts[i]);
			tutinsts[i].x = (i-page)*SCREENWIDTH;
		}
	}
	
	if (touchX>=0)
	{
		if (touchX<SCREENWIDTH/2) page --;
		else page ++;
		resetTouchCoords();
	};
	
	if (page<0)
		fadeOut(menu);
	if (page>=tutinsts.length)
		fadeOut(initGame);
};

function addScore(points)
{
	if (!endGame) score += points;
	if (score>highscore) {highscore = score;}
};

function pressingScreen()
{
	return (pressingRight || pressingUp || pressingDown || pressingLeft || pressingShoot || touchX>=0);
};