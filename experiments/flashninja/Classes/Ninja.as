package
{
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.geom.ColorTransform;
	
	public class Ninja extends MovieClip
	{
		var pressingLeft:Boolean = false;
		var pressingRight:Boolean = false;
		var pressingUp:Boolean = false;
		var pressingDown:Boolean = false;
		var pressingKey1:Boolean = false;
		var pressingKey2:Boolean = false;
		
		var pressKey1Time:Number = 0;
		var pressKey2Time:Number = 10;
		
		//Vars
		var accel:Number = 2;
		var frict:Number = 1;
		var maxspeed:Number = 8;
		var rightspeed:Number = 0;
		var leftspeed:Number = 0;
		var downspeed:Number = 0;
		var upspeed:Number = 0;
		var gravity:Number = 1;
		var jumpspeed:Number = 12;
		var doublejump:Boolean = true;
		var onground:Boolean = false;
		var rolling:Boolean = false;
		var dive:Boolean = false;
		var divetime:Number = 0;
		var yoset:Number = 0;
		var sliding:Boolean = false;
		var h:Number = 52;
		var moveleft:Number = 0;
		var moveright:Number = 0;
		var walljump:Boolean = false;
		var hspeed:Number = 0;
		var vspeed:Number = 0;
		
		//attacks
		var combo:String = "";
		var co:Number = 0;
		
		//Animating Vars
		var freeze:Boolean = false;
		var xscale:Number = scaleX;
		var yscale:Number = scaleY;
		var d:Number = 1;
		var dir:Number = 1;
		var springjump:Number = 1;
		var runtime:Number = 0;
		
		var frame:Number = 1;
		var oldframe:Number = 0;
		var startframe:Number = 0;
		var endframe:Number = 0;
		
		//Other
		var starTime = 0;
		var init:Boolean = false;
		var wall:MovieClip;
		var ground:MovieClip;
		var pRcount = 0;
		var pLcount = 0;
		var keytimer = 0;
		var speedboostR = 1;
		var speedboostL = 1;
		var speedtimer = 0;
		
		var oldrightspeed = 0;
		var oldleftspeed = 0;
		
		var bywall:Boolean = false;
		
		public function Ninja(xx:Number, yy:Number)
		{
			x = xx;
			y = yy;
			gotoAndStop(1);
		}
		
		public function moveMC(pRight:Boolean, pLeft:Boolean, pUp:Boolean, pDown:Boolean, pKey1:Boolean, pKey2:Boolean)
		{
			if (!init){
				wall = MovieClip(root).wall;
				ground = MovieClip(root).ground;
				init = true;
			}
			
			oldrightspeed = rightspeed;
			oldleftspeed = leftspeed;
			
			if (pRcount>0 || pLcount>0){
				if (keytimer<10) keytimer += 1;
				else {keytimer = 0; pRcount = 0; pLcount = 0;}
				if (pRcount>1 && onground) speedboostR = 2;
				else if (pLcount>1 && onground) speedboostL = 2;
			}
			
			if (speedboostR>1 || speedboostL>1){
				if (speedtimer<20) speedtimer ++;
				else {speedtimer = 0; if (onground){speedboostR = 1; speedboostL = 1;}}
			}
			else speedtimer=0;
			
			if (pLeft && speedboostR>1) speedboostR = 1;
			if (pRight && speedboostL>1) speedboostL = 1;
			
			if (pRight){ if (!pressingRight){ pressingRight = true; pRcount ++;}}
			if (pLeft){ if (!pressingLeft) { pressingLeft = true; pLcount ++;}}
			if (pUp){pressingUp = true;}
			if (pDown){pressingDown = true;}
			if (pKey1){ //Z
				if (!pressingKey1) {
					pressingKey1 = true; 
					if (pressKey1Time==0){
						combo += "Z";
						pressKey1Time = 14;
						if (onground){
							if (dir>0) rightspeed = 6;
							else leftspeed = 6;
						}
					}
					else {
						if (pressKey1Time<7 && co<3){
							frame = 0;
							combo += String.fromCharCode(90);
							co += 1;
							pressKey1Time = 14;
						}
					}
				}
			}
			if (pKey2){pressingKey2 = true;} //C
			
			if (!pRight){pressingRight = false;}
			if (!pLeft){pressingLeft = false;}
			if (!pUp){pressingUp = false;}
			if (!pDown){pressingDown = false;}
			if (!pKey1){pressingKey1 = false;}
			if (!pKey2){
				if (pressingKey2)
				{
					pressingKey2 = false;
					if (starTime<=0){
						for (var i=0; i<Math.min(Math.max(Math.floor(pressKey2Time/12),1),3); i+=1) createStar();
						starTime = 8;
					}
					pressKey2Time = 10;
				}
			}
			
			//Keys
			if ((pressingLeft && !moveright>0) || moveleft>0){
				leftspeed = increase(leftspeed, accel, maxspeed*speedboostL);
				dir = -1;
			}
			if ((pressingRight && !moveleft>0) || moveright>0){
				rightspeed = increase(rightspeed, accel, maxspeed*speedboostR);
				dir = 1;
			}
			if (!rolling) {
				if (!pressingLeft || pressingDown){
					leftspeed = decrease(leftspeed, frict, 0);
				}
				if (!pressingRight || pressingDown){
					rightspeed = decrease(rightspeed, frict, 0);
				}
			}
			if (pressingUp && !rolling){
				if (!pressingDown || !onground){
					if (onground){
						createDust(1);
						upspeed = jumpspeed;
					}
					else if (doublejump&&downspeed>=0&&upspeed<4 && !sliding && !(instRight(this, wall, 4, 52) || instLeft(this, wall, 4, 52))){
						createDust(1);
						upspeed = jumpspeed;
						doublejump = false;
					}
				}
				else {
					if (onground){
						createDust(0);
						upspeed = jumpspeed*1.5;
						springjump = -1;
					}
				}
			}
			if (pressingDown && !onground && dive && downspeed>0 && !sliding){dive = false; divetime = 4;}
			if (divetime>0){divetime -= 1; downspeed += 10;}
			
			if (pressingKey2) pressKey2Time += 1;
			if (starTime>0) starTime -= 1;
			
			vspeed = downspeed - upspeed;
			hspeed = rightspeed - leftspeed;
			
			//Gravity
			if (!upspeed>0){ //Update Positon
			if (!instBelow(this, ground, downspeed+yoset)){
				if (!sliding){y += downspeed; downspeed += gravity;}
				else {y += downspeed/1.5; downspeed += gravity/1.5; downspeed = Math.min(downspeed, 12);}
			}
			else while (!instBelow(this,ground,1+yoset)) y += 1;
			}
			else downspeed = 0;
			downspeed = Math.min(downspeed, 16);
			
			if (upspeed>0) upspeed -= gravity;
			else upspeed = 0;
			
			//Update Position
			if (!instAbove(this, ground, Math.min(upspeed, 10))){y -= Math.min(upspeed, 10);}
			else while (!instAbove(this, ground, 1)) {y -= 1; upspeed = 0; doublejump = false;}
			
			//Height to check
			h = 52;
			if (rolling) h = 16;
			
			if (!instRight(this, wall, rightspeed, h)) x += rightspeed;
			else while (!instRight(this, wall, 1, h)) x += 1;
			if (!instLeft(this, wall, leftspeed, h)) x -= leftspeed;
			else while (!instLeft(this, wall, 1, h)) x -= 1;
			
			onground = (instBelow(this, ground, 1+yoset));
			if (onground) {doublejump = true; downspeed = 0; springjump = 1; dive = true; walljump = false;}
			
			if (onground && pressingDown && (pressingLeft && !pressingRight || pressingRight && !pressingLeft)){
				if (!bywall){
					rolling = true;
					if (instBelow(this, ground, 1)){if  (yoset==0){yoset = 14; y-=14;}}
				}
				else if (rotation<48&&rotation>-48){rolling = false;}
			}
			else if (rotation<48&&rotation>-48){rolling = false;}
		
			if (!instBelow(this, ground, 2) && onground && !rolling){if (yoset!==0 && onground) {y+=14; yoset = 0;}}
			
			bywall = (instRight(this, wall, 4, 52) || instLeft(this, wall, 4, 52));
			//Wall Jump
			if (bywall && (!onground && pressingUp)) sliding = true;
			else sliding = false;
			if (!onground && sliding){
				if (pressingLeft && instRight(this, wall, 4, 52)){
					if (pressingUp){
						upspeed = jumpspeed*1.25;
						leftspeed = jumpspeed*1.5;
						moveleft = 14;
						rightspeed = 0;
						createDust(3);
						walljump = true;
					}
				}
				if (pressingRight && instLeft(this, wall, 4, 52)){
					if (pressingUp){
						upspeed = jumpspeed*1.25;
						rightspeed = jumpspeed*1.5;
						moveright = 14;
						leftspeed = 0;
						createDust(2);
						walljump = true;
					}
				}
			}
			if (moveleft>0) moveleft -= 1;
			if (moveright>0) moveright -= 1;
			
			//Animations///////////////////
			if ((pressingLeft || pressingRight) && (rightspeed-leftspeed!=0) 
				&& (!instRight(this, wall, 1, h) && !instLeft(this, wall, 1, h))){
				runtime += 1;
				runtime = Math.min(runtime, 72*2);
			} else if (runtime>0) runtime -= 1;
			
			startframe = 0;
			endframe = 0;
			freeze = false;
			
			if (pressKey1Time>0 && onground) {
				switch (combo){
					case "Z": startframe = 131; endframe = 136;//attak 1
					break;
					case "ZZ": startframe = 131; endframe = 136;
					break;
					case "ZZZ": startframe = 131; endframe = 136;
				}
				freeze = true;
			}
			
			if (pressKey1Time>0) pressKey1Time -= 1;
			else {co = 0; combo = "";}
			
			if (!onground && upspeed>0 && doublejump || !onground && upspeed>0 && walljump){startframe = 10; endframe=15; freeze = false;} //jumping up
			if (!onground && downspeed>0){startframe = 16; endframe = 21; freeze = false;} //falling
			if (!rolling){
				if (onground){if (rightspeed>0 && pressingRight || leftspeed>0 && pressingLeft 
					&& (!instRight(this, wall, 1, h) && !instLeft(this, wall, 1, h))){if (!pressingDown){startframe = 22; endframe = 38; freeze = false;}}}//running
				if ((onground && !pressingLeft && !pressingRight && !pressingDown
					|| onground && pressingRight && pressingLeft) && !pressKey1Time>0){
					if (runtime>72){startframe = 101; endframe = 130;} //panting
					else if ((runtime<=72 && frame>=101<=103) || runtime<=0){startframe = 39; endframe = 100;} //idle
				}
			}
			
			if (!startframe>0){
				frame = 1; //normal
				if (pressingDown && onground) frame = 2; //crouch
				if (!onground && upspeed>0){if (!doublejump && !walljump) frame = 3;} //flip jump
				if (!onground && downspeed>0) frame = 1; //falling
				if (rolling) frame = 3; //roll
			}
			
			if (frame == 3 && !downspeed>0) rotation += 32*dir*springjump;
			else rotation = 0;
			scaleX = xscale*d;
			if (dir==1) d = increase(d, 0.33, dir);
			else d = decrease(d, 0.33, dir);
			//if it is animated, animate it
			if (startframe>0){
				frame += 1;
				if (frame<startframe || frame>endframe && !freeze) frame = startframe;
				if (frame>endframe && freeze) frame = endframe;
			}
			
			if (frame != oldframe) gotoAndStop(Math.floor(frame));
			oldframe = frame;
			
			//Particles
			if (sliding && (downspeed>0) && pressingUp){
				i=0;
				if (instRight(this, wall, 4, 52)){
					//createSmoke(x, y, scale, alpha, fadespeed, ontop);
					for (i=0; i<4; i+=1) createSmoke(x+Math.round(Math.random()*5-Math.random()*5)+10,y+Math.round(Math.random()*10-Math.random()*10)-30,1,0.5,0.1,true);
				} else {
					for (i=0; i<4; i+=1) createSmoke(x+Math.round(Math.random()*5-Math.random()*5)-10,y+Math.round(Math.random()*10-Math.random()*10)-30,1,0.5,0.1,true);
				}
			}
			
				//sliding dust
			if (onground && ((oldrightspeed-rightspeed>0 && rightspeed>2) || (oldleftspeed-leftspeed>0 && leftspeed>2)) && !bywall){
				if (rightspeed>0)
					for (i=0; i<4; i+=1) createSmoke(x+Math.round(Math.random()*4-Math.random()*4)+2,y+Math.round(Math.random()*5-Math.random()*5)-5,0.25+1*(rightspeed/(maxspeed*2)),0.5,0.1,true);
				else
					for (i=0; i<4; i+=1) createSmoke(x+Math.round(Math.random()*4-Math.random()*4)-2,y+Math.round(Math.random()*5-Math.random()*5)-5,0.25+1*(leftspeed/(maxspeed*2)),0.5,0.1,true);
			}
			
			//Attacks
			if (sword != null){
				sword.gotoAndStop(1);
			}
			
			//Stay on top
			parent.setChildIndex(this, parent.numChildren - 1);
			
		} // end of movemc
		
		//Functions/////////////////////////////////////////////////////
		//instBelow(object, instance, distance);
		function instBelow(o:MovieClip, g:MovieClip, d:Number){
			d = Math.max(d, 1);
			for (var i=0; i<d; i+=1){
				if (g.hitTestPoint(o.x, o.y+i, true)) return true;
			}
			return false;
		}
		//instRight(object, instance, distance, height);
		function instRight(o:MovieClip, g:MovieClip, d:Number, h:Number){
			d = Math.max(d, 1);
			for (var ii = 0; ii<h; ii+=4){
				for (var i=0; i<d; i+=1){
					if (g.hitTestPoint(o.x+i+8, o.y-ii-1, true)) return true;
				}
			}
			return false;
		}
		//instLeft(object, instance, distance, height);
		function instLeft(o:MovieClip, g:MovieClip, d:Number, h:Number){
			d = Math.max(d, 1);
			for (var ii = 0; ii<h; ii+=4){
				for (var i=0; i<d; i+=1){
					if (g.hitTestPoint(o.x-i-8, o.y-ii-1, true)) return true;
				}
			}
			return false;
		}
		//instAbove(object, instance, distance);
		function instAbove(o:MovieClip, g:MovieClip, d:Number){
			d = Math.max(d, 1);
			for (var i=0; i<d; i+=1){
				if (g.hitTestPoint(o.x, o.y-i-52, true)) return true;
			}
			return false;
		}
		//speed = increase(speed, acceleration, maxspeed);
		function increase(s:Number, a:Number, ms:Number){
			if (s+a<=ms) s += a;
			else s = ms;
			return s;
		}
		//speed = decrease(speed, acceleration, minspeed);
		function decrease(s:Number, f:Number, ms:Number){
			if (s-f>ms) s -= f;
			else s = ms;
			return s;
		}
		
		function instColor(i:MovieClip, r1:Number, g1:Number, b1:Number, a:Number, r2:Number, g2:Number, b2:Number, a2:Number){
			i.transform.colorTransform = new ColorTransform(r1/255,g1/255,b1/255,a,r2/255,g2/255,b2/255,a2/255);
		}
		//instColorReset(instance);
		function instColorReset(i:MovieClip){
			i.transform.colorTransform = new ColorTransform(1,1,1,1,0,0,0,0);
		}
		
		function createDust(t:Number){
			var a:Dust = new Dust();
			stage.addChild(a);
			a.x=x;
			a.y=y+1;
			if (!t==0) a.scaleX /= 1.5;
			a.alpha = 0.9;
			if (t==2) {a.rotation = 90; a.x -= 8;}
			if (t==3){a.rotation = -90; a.x += 8;}
			a.addEventListener(Event.ENTER_FRAME, handleDust);
			function handleDust(e:Event){
				if (a.currentFrame > 4) {if (a.parent != null) {a.parent.removeChild(a);}}
			}
		}
		//createSmoke(x, y, scale, alpha, fadespeed, ontop);
		function createSmoke(xx:Number, yy:Number, scale:Number, alph:Number, fade:Number, ontop:Boolean){
			var b:Smoke = new Smoke();
			stage.addChild(b);
			b.x=xx;
			b.y=yy;
			b.alpha = alph;
			b.scaleX = b.scaleY = scale;
			b.scaleX *= choose(1,-1);
			b.gotoAndStop(Math.floor(Math.random()*3)+1);
			if (!ontop) b.parent.setChildIndex(b, 0);
			b.addEventListener(Event.ENTER_FRAME, handleSmoke);
			function handleSmoke(e:Event){
				b.alpha -= fade;
				if (b.alpha < 0){if (b.parent != null) {b.parent.removeChild(b);}}
			}
		}
		
		function createStar(){
			var s = (50 + Math.abs(hspeed))*dir;
			var c:Star = new Star();
			stage.addChild(c);
			with (c){var life = 0; var hit = false; var sp = Math.random()*8 - 6;}
			c.x = x+Math.round(Math.random()*20-Math.random()*20);
			c.y = y-20+Math.round(Math.random()*10-Math.random()*10);
			c.scaleX = c.scaleY = c.scaleX/1.25;
			c.gotoAndStop(1);
			c.addEventListener(Event.ENTER_FRAME, handleStar);
			function handleStar(e:Event){
				if (life>90){
					if (c.alpha >= 0) c.alpha -= 0.05;
					if (c.alpha < 0){if (c.parent != null) {c.parent.removeChild(c);}}
				}
				life += 1;
				if (Math.abs(s)!=s){
					if (!instLeft(c, wall, Math.abs(s), 1)){c.rotation -= 32; c.x += s; c.y += sp;}
					else while (!instLeft(c, wall, 1, 1)){c.x -= 1;}
				} else{
					if (!instRight(c, wall, Math.abs(s), 1)){c.rotation += 32; c.x += s; c.y+=sp;}
					else while (!instRight(c, wall, 1, 1)){c.x += 1;}
				}
			}
		}
		
		function choose(a:*, b:*)
		{
			if (Math.random()<0.5)
				return a;
			return b;
		}
	}
}