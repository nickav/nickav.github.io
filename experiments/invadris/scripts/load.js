var waitInterval;
var canvas, can, topCanvas, topCan, input;
var table, waveTable;

function load()
{
	//images
	loadedImages = 0;
	numberImages = 0;
	
	button1a = loadImage('images/button1a.png');
	button1b = loadImage('images/button1b.png');
	button2aa = loadImage('images/button2aa.png');
	button2ab = loadImage('images/button2ab.png');
	button2ba = loadImage('images/button2ba.png');
	button2bb = loadImage('images/button2bb.png');
	button2ca = loadImage('images/button2ca.png');
	button2cb = loadImage('images/button2cb.png');
	button3a1 = loadImage('images/button3a1.png');
	button3b1 = loadImage('images/button3b1.png');
	button3a2 = loadImage('images/button3a2.png');
	button3b2 = loadImage('images/button3b2.png');
	button4a1 = loadImage('images/button4a1.png');
	button4b1 = loadImage('images/button4b1.png');
	button4a2 = loadImage('images/button4a2.png');
	button4b2 = loadImage('images/button4b2.png');
	button5a = loadImage('images/button5a.png');
	button5b = loadImage('images/button5b.png');
	button6a1 = loadImage('images/button6a1.png');
	button6b1 = loadImage('images/button6b1.png');
	button6a2 = loadImage('images/button6a2.png');
	button6b2 = loadImage('images/button6b2.png');
	button7a = loadImage('images/button7a.png');
	button7b = loadImage('images/button7b.png');
	button8a = loadImage('images/button8a.png');
	button8b = loadImage('images/button8b.png');
	button9a = loadImage('images/button9a.png');
	button9b = loadImage('images/button9b.png');
	
	pausetext = loadImage('images/pausetext.png');
	oneup = loadImage('images/oneup.png');
	
	shipabsorb0 = loadImage('images/shipabsorb0.png');
	shipabsorb1 = loadImage('images/shipabsorb1.png');
	shipabsorb2 = loadImage('images/shipabsorb2.png');
	shipabsorb3 = loadImage('images/shipabsorb3.png');
	shipabsorb4 = loadImage('images/shipabsorb4.png');
	shipabsorb5 = loadImage('images/shipabsorb5.png');
	shipabsorb6 = loadImage('images/shipabsorb6.png');
	shipabsorb7 = loadImage('images/shipabsorb7.png');
	shipabsorb8 = loadImage('images/shipabsorb8.png');
	shipabsorb9 = loadImage('images/shipabsorb9.png');
	
	shiplaser0 = loadImage('images/shiplaser0.png');
	shiplaser1 = loadImage('images/shiplaser1.png');
	shiplaser2 = loadImage('images/shiplaser2.png');
	shiplaser3 = loadImage('images/shiplaser3.png');
	shiplaser4 = loadImage('images/shiplaser4.png');
	shiplaser5 = loadImage('images/shiplaser5.png');
	shiplaser6 = loadImage('images/shiplaser6.png');
	
	tutp1 = loadImage('images/tutp1.png');
	tutp2 = loadImage('images/tutp2.png');
	tutp3 = loadImage('images/tutp3.png');
	tutp4 = loadImage('images/tutp4.png');
	tutp5 = loadImage('images/tutp5.png');
	tutp6 = loadImage('images/tutp6.png');
	tutp7 = loadImage('images/tutp7.png');
	tutp8 = loadImage('images/tutp8.png');
	tutp9 = loadImage('images/tutp9.png');
	tutp10 = loadImage('images/tutp10.png');
	tutp11 = loadImage('images/tutp11.png');
	
	enemy3laser0 = loadImage('images/enemy3laser0.png');
	enemy3laser1 = loadImage('images/enemy3laser1.png');
	enemy3laser2 = loadImage('images/enemy3laser2.png');
	enemy3laser3 = loadImage('images/enemy3laser3.png');
	enemy3laser4 = loadImage('images/enemy3laser4.png');
	enemy3laser5 = loadImage('images/enemy3laser5.png');
	enemy3laser6 = loadImage('images/enemy3laser6.png');
	enemy3laser7 = loadImage('images/enemy3laser7.png');
	shipshield = loadImage('images/shipshield.png');
	bg = loadImage('images/bg.png');
	blueblock = loadImage('images/blueblock.png');
	bullet = loadImage('images/bullet.png');
	enemy1 = loadImage('images/enemy1.png');
	enemy1bullet = loadImage('images/enemy1bullet.png');
	enemy1explosion0 = loadImage('images/enemy1explosion0.png');
	enemy1explosion1 = loadImage('images/enemy1explosion1.png');
	enemy1explosion2 = loadImage('images/enemy1explosion2.png');
	enemy1explosion3 = loadImage('images/enemy1explosion3.png');
	enemy1explosion4 = loadImage('images/enemy1explosion4.png');
	enemy1explosion5 = loadImage('images/enemy1explosion5.png');
	enemy1fire0 = loadImage('images/enemy1fire0.png');
	enemy1fire1 = loadImage('images/enemy1fire1.png');
	enemy1fire2 = loadImage('images/enemy1fire2.png');
	enemy1fire3 = loadImage('images/enemy1fire3.png');
	enemy1fire4 = loadImage('images/enemy1fire4.png');
	enemy2 = loadImage('images/enemy2.png');
	enemy2bullet = loadImage('images/enemy2bullet.png');
	enemy2explosion0 = loadImage('images/enemy2explosion0.png');
	enemy2explosion1 = loadImage('images/enemy2explosion1.png');
	enemy2explosion2 = loadImage('images/enemy2explosion2.png');
	enemy2explosion3 = loadImage('images/enemy2explosion3.png');
	enemy2explosion4 = loadImage('images/enemy2explosion4.png');
	enemy2explosion5 = loadImage('images/enemy2explosion5.png');
	enemy2explosion6 = loadImage('images/enemy2explosion6.png');
	enemy2fire0 = loadImage('images/enemy2fire0.png');
	enemy2fire1 = loadImage('images/enemy2fire1.png');
	enemy2fire2 = loadImage('images/enemy2fire2.png');
	enemy2fire3 = loadImage('images/enemy2fire3.png');
	enemy3 = loadImage('images/enemy3.png');
	enemy3bullet = loadImage('images/enemy3bullet.png');
	enemy3explosion0 = loadImage('images/enemy3explosion0.png');
	enemy3explosion1 = loadImage('images/enemy3explosion1.png');
	enemy3explosion2 = loadImage('images/enemy3explosion2.png');
	enemy3explosion3 = loadImage('images/enemy3explosion3.png');
	enemy3explosion4 = loadImage('images/enemy3explosion4.png');
	enemy3explosion5 = loadImage('images/enemy3explosion5.png');
	enemy3explosion6 = loadImage('images/enemy3explosion6.png');
	enemy3fire0 = loadImage('images/enemy3fire0.png');
	enemy3fire1 = loadImage('images/enemy3fire1.png');
	enemy3fire2 = loadImage('images/enemy3fire2.png');
	enemy3fire3 = loadImage('images/enemy3fire3.png');
	enemy3fire4 = loadImage('images/enemy3fire4.png');
	explosion0 = loadImage('images/explosion0.png');
	explosion1 = loadImage('images/explosion1.png');
	explosion2 = loadImage('images/explosion2.png');
	explosion3 = loadImage('images/explosion3.png');
	explosion4 = loadImage('images/explosion4.png');
	explosion5 = loadImage('images/explosion5.png');
	greenblock = loadImage('images/greenblock.png');
	keypad = loadImage('images/keypad.png');
	laser = loadImage('images/laser.png');
	laser0 = loadImage('images/laser0.png');
	laser1 = loadImage('images/laser1.png');
	orangeblock = loadImage('images/orangeblock.png');
	pixel = loadImage('images/pixel.gif');
	powerup0 = loadImage('images/powerup0.png');
	powerup1 = loadImage('images/powerup1.png');
	powerup2 = loadImage('images/powerup2.png');
	powerup3 = loadImage('images/powerup3.png');
	powerup4 = loadImage('images/powerup4.png');
	powerup5 = loadImage('images/powerup5.png');
	powerup6 = loadImage('images/powerup6.png');
	powerup7 = loadImage('images/powerup7.png');
	purpleblock = loadImage('images/purpleblock.png');
	redblock = loadImage('images/redblock.png');
	shine = loadImage('images/shine.png');
	ship = loadImage('images/ship.png');
	shipbody = loadImage('images/shipbody.png');
	shipfire0 = loadImage('images/shipfire0.png');
	shipfire1 = loadImage('images/shipfire1.png');
	shipfire2 = loadImage('images/shipfire2.png');
	shipfire3 = loadImage('images/shipfire3.png');
	shipguns = loadImage('images/shipguns.png');
	shiplife = loadImage('images/shiplife.png');
	sidebar = loadImage('images/sidebar.png');
	yellowblock = loadImage('images/yellowblock.png');
	cyanblock = loadImage('images/cyanblock.png');
	title = loadImage('images/title.png');
	
	loading = loadImage('images/loading.png');
	
	shipexpander = loadImage('images/shipexpander.png');
	
	waitInterval = setInterval(wait, MSECS/2);
};

function loadImage(filepath)
{
	var img = new Image();
	img.src = filepath;
	img.onload = function(){loadedImages ++;};
	numberImages ++;
	return img;
};

function wait()
{
	if (loadedImages==numberImages)
	{
		clearInterval(waitInterval);
		
		canvas = get("canvas");
		can = canvas.getContext("2d");
		topCanvas = get("topCanvas");
		topCan = topCanvas.getContext("2d");
		
		if (localStorage.audio!=null) //!!
			audioOn = (localStorage.audio=="true");
		else audioOn = true;
		if (localStorage.keypad!=null)//!!
			keypadOn = (localStorage.keypad=="true");
		else keypadOn = true;
		if (localStorage.effic!=null)//!!
			efficient = (localStorage.effic=="true");
		else efficient = false;
		
		// skipToLevel = (localStorage.skip!=null); //!!
		// mode = (localStorage.mode || 0); //!!
		// enemiesKilled = (localStorage.ekill || 0); //!!
		skipToLevel = true;
		mode = 3;
		enemiesKilled = ENEMIESTOKILL;
		waveMode = (enemiesKilled>=ENEMIESTOKILL);
		
		//Load Sounds
		snd_shoot = new Media('sounds/shoot.wav');
		snd_click = new Media('sounds/click.wav');
		
		table = new HighscoreTable(); //!!
		waveTable = new HighscoreTable("wave"); //!!
		
		menu();
	}
}