package
{
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.ui.Keyboard;
	import flash.events.KeyboardEvent;
	
	public class NinjaGame extends MovieClip
	{
		public var ninja;
		
		var pressingLeft:Boolean = false;
		var pressingRight:Boolean = false;
		var pressingUp:Boolean = false;
		var pressingDown:Boolean = false;
		var pressingZ:Boolean = false;
		var pressingC:Boolean = false;
		
		var pressingA:Boolean = false;
		var pressingD:Boolean = false;
		var pressingW:Boolean = false;
		var pressingS:Boolean = false;
		
		var roomW = 550;
		var roomH = 400;
		
		var startx = 0;
		var starty = 0;
		
		public function NinjaGame()
		{
			ninja = new Ninja(100, 100);
			addChild(ninja);
			startx = ninja.x;
			starty = ninja.y;
			
			stage.addEventListener(Event.ENTER_FRAME, updateGame);
			
			stage.addEventListener(KeyboardEvent.KEY_DOWN,keyPressed);
			stage.addEventListener(KeyboardEvent.KEY_UP,keyReleased);
		}
		
		public function updateGame(e:Event)
		{
			ninja.moveMC(pressingRight, pressingLeft, pressingUp, pressingDown, pressingZ, pressingC);
			//x = (-ninja.x+startx);
			//y = (-ninja.y+starty);
		}
		
		function keyPressed(key:KeyboardEvent):void{
			if (key.keyCode == Keyboard.RIGHT){pressingRight = true;}
			if (key.keyCode == Keyboard.LEFT){pressingLeft = true;}
			if (key.keyCode == Keyboard.UP){pressingUp = true;}
			if (key.keyCode == Keyboard.DOWN){pressingDown = true;}
			if (key.keyCode == 90){pressingZ = true;}
			if (key.keyCode == 67){pressingC = true;}
			if (key.keyCode == 87){pressingW = true;}
			if (key.keyCode == 65){pressingA = true;}
			if (key.keyCode == 83){pressingS = true;}
			if (key.keyCode == 68){pressingD = true;}
		}
		function keyReleased(key:KeyboardEvent):void{
			if (key.keyCode == Keyboard.RIGHT){pressingRight = false;}
			if (key.keyCode == Keyboard.LEFT){pressingLeft = false;}
			if (key.keyCode == Keyboard.UP){pressingUp = false;}
			if (key.keyCode == Keyboard.DOWN){pressingDown = false;}
			if (key.keyCode == 90){pressingZ = false;}
			if (key.keyCode == 67){pressingC = false;}
			if (key.keyCode == 87){pressingW = false;}
			if (key.keyCode == 65){pressingA = false;}
			if (key.keyCode == 83){pressingS = false;}
			if (key.keyCode == 68){pressingD = false;}
		}
	}
}