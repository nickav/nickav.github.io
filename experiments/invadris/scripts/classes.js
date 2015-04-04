// Ship Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Ship.prototype.superConstructor = Instance;
/** @constructor */
function Ship(x, y)
{
	this.superConstructor(x,y);
	this.shoot = function(){
		if (this.absorb!=0)
		{
			new Bullet(this.x+this.width/4 - 9, this.y + 8, 0);
			new Bullet(this.x+this.width*3/4 - 6, this.y + 8, 0);
			play(snd_shoot);
		}
		else{
			var a = new Beam(this.x, -10, [shiplaser0, shiplaser1, shiplaser2], 1, 54, this.y+40);
			a.alpha = 0;
			bullets.push(a);
			new Beam(this.x, -10, [shiplaser0, shiplaser1, shiplaser2, shiplaser3, shiplaser4, shiplaser5, shiplaser6], 1, 54, this.y+40);
			this.y += this.maxSpeed;
			this.dSpeed = this.maxSpeed;
			this.absorb = -1;
		}
		this.guns.yoffset = 8 - this.shootFast;
		this.shot = true;
	};
	this.explode = function(){
		if (this.shield<=0)
		{
			new Explosion(this.x, this.y, 1, 0.75);
			this.fade = 0;
			this.flash = true;
			shipLives --;
			lifeExp = new Explosion(lives[shipLives].x, lives[shipLives].y,0.5, 0.75);
			updateLives();
			this.shield = 0;
			this.absorb = -1;
		}
		else if (this.shield>0) this.shield--;
	};
	
	this.damage = function(){
		if (this.absorb>=0) this.absorb --;
		else this.explode();
	};
	
	this.alpha = 0;
	this.fade = 1;
	this.shot = false;
	
	this.maxSpeed = 7*FACTOR;
	this.rSpeed = 0;
	this.lSpeed = 0;
	this.uSpeed = 0;
	this.dSpeed = 0;
	this.accel = (this.maxSpeed/2);
	this.frict = (this.maxSpeed/3);
	
	this.moving = false;
	this.image(shipbody);
	
	this.fire = new Fire(this, [shipfire0, shipfire1, shipfire2, shipfire3, shipfire2]);
	this.fire.alpha = 0;
	var g = this.guns = new Instance(this.x, this.y, 0);
	g.image(shipguns, 52, 60);
	g.ship = this;
	g.yoffset = 0;
	
	this.flash = false;
	this.timer = 0;
	this.flashtime = FRAMERATE*4;
	
	this.moveDelay = 4*INVFACTOR;
	this.moveRightDelay = 0;
	this.moveLeftDelay = 0;
	this.moveDownDelay = 0;
	
	this.shootFast = false;
	this.shootFastTime = 10*FRAMERATE;
	this.shootFastTimer = 0;
	this.shield = 0;
	this.absorb = -1;
	this.invtimer = 0;
	
	this.destroy = function(){this.guns.destroy(); this.fire.destroy(); destroyInst(this);};
	this.closeBlocks = [];
	this.closeToBlock = false;
	
	this.cantShoot = false;
};

Ship.prototype.move = function()
{
	if (this.alpha<1) this.alpha += 0.075;
	if (this.fade<1) this.fade += 0.075;
	
	if (this.flash)
	{
		if (this.timer<this.flashtime) this.timer++;
		else {this.timer=0; this.flash = false;}
		
		this.alpha = (Math.sin(this.timer*(this.timer/(this.flashtime*2)*50)/this.flashtime)*0.33 + 0.33)*this.fade;
	}
	
	this.moving = (pressingRight || pressingLeft || pressingUp || pressingDown);
	
	var canMoveRight = !(this.x+this.rSpeed-this.lSpeed>=SCREENWIDTH-this.width),
	canMoveLeft = !(this.x+this.rSpeed-this.lSpeed<=SCREENLEFT),
	canMoveDown = !(this.y+this.dSpeed-this.uSpeed>=SCREENHEIGHT-this.height),
	canMoveUp = !(this.y+this.dSpeed-this.uSpeed<=SCREENTOP);
	
	if (!canMoveRight) this.x = SCREENWIDTH-this.width;
	if (!canMoveLeft) this.x = SCREENLEFT;
	if (!canMoveUp) this.y = SCREENTOP;
	if (!canMoveDown) this.y = SCREENHEIGHT-this.height;
	
	if (this.closeToBlock)
	{
		this.closeToBlock = false;
		this.closeBlocks.length = 0;
	}
	if (!this.flash)
	{
		for (var i=0, il=groups.length; i<il; i++)
		{
			if ((groups[i].stick || groups[i].blocks.length==4) && !groups[i].number==0)
			{
				var group = groups[i];
				if (distance(this.x+this.width/2, this.y+this.height/2, group.x+group.width/2, group.y+group.height/2)<=GRIDSIZE*3.2+this.width) //e
				{
					this.closeToBlock = true;
					this.closeBlocks.push(group);
				}
			}
			else
			{
				for (var j=0, jl=groups[i].blocks.length; j<jl; j++)
				{
					var block = groups[i].blocks[j];
					if (distance(this.x+this.width/2, this.y+this.height/2, block.x+block.width/2, block.y+block.height/2)<=GRIDSIZE*1.2+this.width) //e
					{
						this.closeToBlock = true;
						this.closeBlocks.push(groups[i]);
						break;
					}
				}
			}
		}
	}
	
	if (!this.flash && groups.length>0 && this.closeToBlock)
	{
		var woset = 6, hoset = 8;
		for (var i=0, il=this.closeBlocks.length; i<il; i++)
		{
			for (var j=0, jl=this.closeBlocks[i].blocks.length; j<jl; j++)
			{
				var group = this.closeBlocks[i], block = group.blocks[j];
				
				if (this.x+woset+1<block.x && collision(this, block, this.rSpeed+this.accel, 0, woset, hoset))
				{
					while(!collision(this, block, 1, 0, woset, hoset)) this.x ++;
					this.rSpeed = 0;
				}
				if (this.x-woset-1>block.x && collision(this, block, -this.lSpeed-this.accel, 0, woset, hoset))
				{
					while (!collision(this, block, -1, 0, woset, hoset)) this.x --;
					this.lSpeed = 0;
				}
				if (this.y+hoset+1<block.y && collision(this, block, 0, this.dSpeed+this.accel, woset, hoset))
				{
					while (!collision(this, block, 0, 1, woset, hoset)) this.y ++;
					this.dSpeed = 0;
				}
				if (this.y-hoset-1>block.y && collision(this, block, 0, -this.uSpeed-this.accel, woset, hoset))
				{
					while (!collision(this, block, 0, -1, woset, hoset)) this.y --;
					this.uSpeed = 0;
				}
				
				if (collision(this, block, 1, 0, woset, hoset))
					canMoveRight = false;
				if (collision(this, block, -1, 0, woset, hoset))
					canMoveLeft = false;
				if (collision(this, block, 0, 1, woset, hoset))
					canMoveDown = false;
				if (collision(this, block, 0, -1, woset, hoset))
					canMoveUp = false;
				
				if (collision(block, this, 0, 0, GRIDSIZE*0.5, GRIDSIZE*0.5)) stuck = true;
				
				if (canMoveRight || canMoveLeft || canMoveUp || canMoveDown)
				{
					if (collision(this, block, 1, 0, woset, hoset))
						if (pressingRight)
						{
							if (this.moveRightDelay<this.moveDelay) this.moveRightDelay ++;
							else
							{
								if (group.stick)
								{
									if (group.canMove(GRIDSIZE, 0) && group.canMove(0, GRIDSIZE))
									{
										group.x += GRIDSIZE;
										group.moveX();
									}
								}
								else
								{
									block.moveTouches(GRIDSIZE, 0);
								}
								
								this.moveRightDelay -= this.moveDelay/2 + 1;
							}
						}
					if (collision(this, block, -1, 0, woset, hoset))
						if (pressingLeft)
						{
							if (this.moveLeftDelay<this.moveDelay) this.moveLeftDelay ++;
							else
							{
								if (group.stick)
								{
									if (group.canMove(-GRIDSIZE, 0) && group.canMove(0, GRIDSIZE))
									{
										group.x -= GRIDSIZE;
										group.moveX();
										this.moveLefttDelay -= this.moveDelay/2 + 1;
									}
								}
								else
								{
									block.moveTouches(-GRIDSIZE, 0);
								}
								
								this.moveLeftDelay -= this.moveDelay/2 + 1;
							}
						}
						
					if (collision(this, block, 0, 1, woset, hoset))
						if (pressingDown)
							if (this.moveDownDelay<this.moveDelay) this.moveDownDelay ++;
							else
							{
								if (group.stick)
								{
									if (group.canMove(0, GRIDSIZE))
									{
										group.moveY(GRIDSIZE);
									}
								}
								else
								{
									block.moveTouches(0, GRIDSIZE);
								}
								
								this.moveDownDelay -= this.moveDelay/4 + 1;
							}
					}
				}
		} //end for closeBlocks i

			if (!canMoveRight && !canMoveLeft && !canMoveUp && !canMoveDown)
			{
				if (this.shield<=0)
					this.explode();
				else canMoveRight = canMoveLeft = canMoveUp = canMoveDown = true;
			}
			
			if (!pressingRight) this.moveRightDelay = 0;
			if (!pressingLeft) this.moveLeftDelay = 0;
			if (!pressingDown) this.moveDownDelay = 0;
	}
	
	if (pressingRight && canMoveRight)
		this.rSpeed = inc(this.rSpeed, this.accel, this.maxSpeed);
	else if (this.rSpeed>0)
		this.rSpeed = dec(this.rSpeed, this.frict, 0);
		
	if (pressingLeft && canMoveLeft)
		this.lSpeed = inc(this.lSpeed, this.accel, this.maxSpeed);
	else
		this.lSpeed = dec(this.lSpeed, this.frict, 0);
		
	if (pressingUp && canMoveUp)
		this.uSpeed = inc(this.uSpeed, this.accel, this.maxSpeed);
	else
		this.uSpeed = dec(this.uSpeed, this.frict, 0);
		
	if (pressingDown && canMoveDown)
		this.dSpeed = inc(this.dSpeed, this.accel, this.maxSpeed);
	else
		this.dSpeed = dec(this.dSpeed, this.frict, 0);
	
	this.x += (this.rSpeed - this.lSpeed);
	this.y += (this.dSpeed - this.uSpeed);
	
	if (pressingShoot && !this.flash && this.alpha>=1 && this.guns.yoffset==0 && !this.shot && !this.cantShoot)
	{
		this.shoot();
		if (!this.shootFast) pressingShoot = false;
	}
	
	if (this.shootFast)
	{
		if (this.shootFastTimer < this.shootFastTime)
			this.shootFastTimer ++;
		else {this.shootFastTimer = 0; this.shootFast = false;}
	}
	
	if (!this.flash)
		for (var i=0, il=enemybullets.length; i<il; i++)
			if (collision(enemybullets[i],this, 0, 0, 6, 4))
			{
				if ((this.absorb==-1 || typeof enemybullets[i].indestructable == "undefined") && this.invtimer==0) this.damage();
				if (typeof enemybullets[i].indestructable == "undefined") enemybullets[i].destroy();
				else if (this.absorb>0){this.absorb = 0; this.invtimer = 4; this.shoot();}
			};
			
	if (this.invtiemr>0) this.invtimer --;
	
	if (this.shot){ if (this.guns.yoffset > -1) this.guns.yoffset -= 2 + this.shootFast*4; else this.shot = false;}
	else {if (this.guns.yoffset < 0) this.guns.yoffset += 1 + this.shootFast*2; else if (this.guns.yoffset!=0) this.guns.yoffset = 0;}
	
	this.guns.x = this.x;
	this.guns.y = this.y + this.guns.yoffset;
	this.guns.alpha = this.alpha;
	this.rotation = ship.rSpeed - ship.lSpeed;
	this.fire.rotation = ship.rotation;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Bullet Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Bullet.prototype.superConstructor = Instance;
/** @constructor */
function Bullet(x,y)
{
	this.superConstructor(x, y, 0);
	this.move = function(){
		if (this.wait>0) this.wait --; else if (!this.alive) this.alive = true;
		if (this.y>SCREENTOP-12*2) this.y -= this.speed; else this.destroy();
	};
	this.destroy = function(){destroyInst(this); bullets.splice(bullets.indexOf(this), 1);}
	this.image(bullet);
	this.speed = 12*FACTOR;
	this.alive = false;
	this.wait = 1;
	bullets.push(this);
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Block Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Block.prototype.superConstructor = Instance;
/** @constructor */
function Block(x, y, direction, group, length)
{
	this.superConstructor(x, y, 0);
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.group = group;
	this.length = length;
	this.width = GRIDSIZE;
	this.height = GRIDSIZE;
	this.square = false;
	this.oldy = this.y;
	this.canFall = true;
	
	switch (this.group.number)
	{
		case 0: this.image(cyanblock); break;
		case 1: this.image(orangeblock); break;
		case 2: this.image(greenblock); break;
		case 3: this.image(yellowblock); break;
		case 4: this.image(redblock); break;
		case 5: this.image(purpleblock); break;
		case 6: this.image(blueblock); break;
	}
	
	this.destroy = function(){
		destroyInst(this);
		if (this.group) this.group.blocks.splice(this.group.blocks.indexOf(this), 1);
		blocks.splice(blocks.indexOf(this), 1);
	};
	this.destroy2 = function(){
		destroyInst(this);
		if (!this.destroyed) blocks.splice(blocks.indexOf(this), 1);
	}
	
	blocks.push(this);
};

Block.prototype.move = function()
{
	if (this.square)
		for (var i=0, il=squares.length; i<il; i++)
			for (var j=0, jl=squares[i].length; j<jl; j++)
			{
				var square = squares[i][j];
				if ((this.x==square.x && (this.y+GRIDSIZE==square.y || this.y-GRIDSIZE==square.y)) || (this.y==square.y && (this.x+GRIDSIZE==square.x || this.x-GRIDSIZE==square.x)))
					square.square = true;
			}
	if (this.square && this.alpha!=0.5)	this.alpha = 0.5;
	
	if (dowork)
	{
		for (var i=0, il=squares.length; i<il; i++)
			if (squares[i][0].square) new Shine(squares[i][0].x, squares[i][0].y);
		dowork = false;
	}
};

Block.prototype.setPosition = function()
{
	var xx, yy;
	if (this.direction>=0){
		xx = Math.round(Math.cos(DEGTORAD*this.direction))*this.length + 1;
		yy = Math.round(Math.sin(DEGTORAD*this.direction))*this.length + 1;
	}
	else{
		xx = this.length;
		yy = this.length;
	}
	this.x = this.group.x+xx*GRIDSIZE-GRIDSIZE/2;
	this.y = this.group.y+yy*GRIDSIZE;
};

Block.prototype.rotate = function(direction)
{
	if (this.direction>=0) this.direction += direction;
	this.direction = this.direction % 360;
	this.setPosition();
};

Block.prototype.canMove = function(newX, newY)
{
	if (this.x+newX<SCREENLEFT || this.x+newX>=SCREENWIDTH || this.y+newY>=SCREENHEIGHT)
		return false;
	for (var i=0, il=blocks.length; i<il; i++)
	{
		if (blocks[i]!=this)
		{
			var other = blocks[i];
			if (this.x+newX==other.x && this.y+newY==other.y && (this.group!=other.group || !other.canMove(newX, newY)) || this.y+newY>=SCREENHEIGHT || this.x+newX>=SCREENWIDTH || this.x+newX<SCREENLEFT)
				return false;
		}
	}
	return true;
};

Block.prototype.canMoveBlock = function(newX, newY)
{
	if (this.x+newX>=SCREENWIDTH || this.x+newX<SCREENLEFT || this.y+newY>=SCREENHEIGHT)
		return false;
	for (var i=0, il=groups.length; i<il; i++)
		for (var j=0, jl=groups[i].blocks.length; j<jl; j++)
		{
			if (groups[i].blocks[j]!=this)
			{
				if (this.x+newX==groups[i].blocks[j].x && this.y+newY==groups[i].blocks[j].y)// || this.y+newY>=SCREENHEIGHT || this.x+newX>=SCREENWIDTH || this.x+newX<SCREENLEFT
				{
					if (this.group == groups[i])
					{
						var tblocks = this.getTouching();
						for (var k=0, kl=tblocks.length; k<kl; k++)
							if (tblocks[k].x+newX >= SCREENWIDTH || tblocks[k].x+newX < SCREENLEFT || tblocks[k].y+newY >= SCREENHEIGHT || !tblocks[k].canMove(newX, newY))
								return false;
					}
					else return false;
				}
			}
		}
	return true;
};

Block.prototype.touching = function()
{
	return (this.getTouching().length > 0);
};

Block.prototype.getTouching = function()
{
	var touches = [];
	for (var i=0, il=this.group.blocks.length; i<il; i++)
	{
		if (this.group.blocks!=this)
		{
			var other = this.group.blocks[i];
			if ((this.x==other.x && (this.y+GRIDSIZE==other.y || this.y-GRIDSIZE==other.y)) || (this.y==other.y && (this.x+GRIDSIZE==other.x || this.x-GRIDSIZE==other.x)))
				touches.push(other);
		}
	}
	return touches;
};

Block.prototype.moveTouches = function(newX, newY)
{
	if (!this.touching())
	{
		if (this.canMoveBlock(newX, newY) && this.canMoveBlock(0, GRIDSIZE))
		{
			this.x += newX;
			this.y += newY;
		}
	}
	else
	{
		var touches = this.getAllTouches();
		
		var can = true;
		for (var i=0, il=touches.length; i<il; i++)
			if (!touches[i].canMoveBlock(newX, newY) || !touches[i].canMoveBlock(0, GRIDSIZE))
			{
				can = false;
				break;
			}
		
		if (can)
			for (var i=0, il=touches.length; i<il; i++)
			{
				touches[i].x += newX;
				touches[i].y += newY;
			}
		touches.push(this);
		return touches;
	}
	return this;
};

Block.prototype.getAllTouches = function()
{
	var touches = this.getTouching();
	for (var i=0, il=touches.length; i<il; i++)
	{
		var t = touches[i].getTouching();
		
		for (var j=0, jl=t.length; j<jl; j++)
			if (!findIn(touches, t[j]))
				touches.push(t[j]);
	}
	return touches;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Group Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Group.prototype.superConstructor = Instance;
/** @constructor */
function Group(x, y, number)
{
	this.superConstructor(x, y);
	this.blocks = new Array();
	this.x += GRIDSIZE/2;
	this.oldx = this.x;
	this.oldy = this.y;
	this.checkedblocks = false;
	this.number = number % 7;
	this.direction = 0;
	this.stick = true;
	this.numblocks = this.blocks.length;
	
	number %= 7;
	this.addBlock(-1);
	switch (number)
	{
		case 0:	this.addBlock(0); this.addBlock(180); this.addBlock(180, 2); break;
		case 1:	this.addBlock(0); this.addBlock(180); this.addBlock(225); break;
		case 2:	this.addBlock(0); this.addBlock(180); this.addBlock(315); break;
		case 3:	this.addBlock(180); this.addBlock(225); this.addBlock(270); break;
		case 4:	this.addBlock(0); this.addBlock(90); this.addBlock(135); break;
		case 5: this.addBlock(135); this.addBlock(90); this.addBlock(45); break;
		case 6:	this.addBlock(180); this.addBlock(90); this.addBlock(45); break;
	}
	
	this.setHeight();
	this.setWidth();
	//this.sort();
	
	this.destroy = function(){for (var i=0, il=this.blocks.length; i<il; i++) this.blocks[i].destroy2(); destroyInst(this); groups.splice(groups.indexOf(this), 1);}
	
	groups.push(this);
};

Group.prototype.move = function()
{	
	if (!this.checkedblocks)
	{
		var passed = true;
		for (var i=0, il=this.blocks.length; i<il; i++)
		{
			if (this.blocks[i].x >= SCREENWIDTH){this.x -= GRIDSIZE; this.moveX(); passed = false; break;}
			if (this.blocks[i].x < SCREENLEFT){this.x += GRIDSIZE; this.moveX(); passed = false; break;}
		}
		if (passed) this.checkedblocks = true;
	}
	
	if (time==0)
	{
		for (var i=0, il=this.blocks.length; i<il; i++)
			this.blocks[i].oldy = this.blocks[i].y;
	}
	
	if (this.numblocks!=this.blocks.length)
	{
		this.setHeight();
		this.setWidth();
		if (this.stick)
		{
			for (var i=0, il=this.blocks.length; i<il; i++)
				if (!this.blocks[i].touching())
				{
					this.stick = false;
					break;
				}
		}
		this.numblocks = this.blocks.length;
	}
	
	if (time==0)
	{
		if (this.stick)
		{
			if (this.y<SCREENHEIGHT-this.height && this.canMove(0, GRIDSIZE))
			{	
				if (this.oldx!=this.x)
					this.moveX();
				
				this.moveY(GRIDSIZE);
			}
		}
		else
		{
			for (var i=0, il=this.blocks.length; i<il; i++)
			{
				if (this.blocks[i].y<SCREENHEIGHT-this.blocks[i].height && this.blocks[i].canMoveBlock(0,GRIDSIZE))
				{
					if (!this.blocks[i].touching())
						this.blocks[i].y += GRIDSIZE;
					else
					{
						var touches = this.blocks[i].getAllTouches(), can = true;
						for (var j=0, jl=touches.length; j<jl; j++)
							if (!touches[j].canMove(0,GRIDSIZE))
							{
								can = false;
								break;
							}
						if (can) this.blocks[i].y += GRIDSIZE;
					}
				}
			}
		}
	}
	
	if (this.blocks.length==0)
		this.destroy();
};

Group.prototype.moveX = function()
{
	for (var i=0, il=this.blocks.length; i<il; i++)
		this.blocks[i].x += this.x-this.oldx;
	this.oldx = this.x;
};

Group.prototype.moveY = function(height)
{
	this.y += height;
		for (var i=0, il=this.blocks.length; i<il; i++)
			this.blocks[i].y += height;
	this.oldy =  this.y;
};

Group.prototype.rotate = function()
{
	for (var i=0, il=this.blocks.length; i<il; i++)
		this.blocks[i].rotate(90);
		
	this.setHeight();
	this.setWidth();
	this.direction += 90;
	//this.sort();
};

Group.prototype.setHeight = function()
{
	if (this.blocks.length>0)
	{
		this.height = this.blocks[0].y;
		for (var i=1, il=this.blocks.length; i<il; i++)
			if (this.blocks[i].y>this.height) this.height = this.blocks[i].y;
		this.height += GRIDSIZE;
		this.height -= this.y;
	}
	else this.height = 0;
};

Group.prototype.setWidth = function()
{
	if (this.blocks.length>0)
	{
		var minX = this.blocks[0].x;
		var maxX = minX;
		for (var i=0, il=this.blocks.length; i<il; i++)
		{
			if (this.blocks[i].x < minX) minX = this.blocks[i].x;
			if (this.blocks[i].x > maxX) maxX = this.blocks[i].x;
		}
		this.width = maxX - minX + GRIDSIZE;
	}
	else this.width = 0;
};

Group.prototype.addBlock = function(direction, length)
{
	var len = 1;
	if (typeof length != "undefined") len = length;
	var b = new Block(this.x, this.y, direction, this, len);
	this.blocks.push(b);
	b.setPosition();
	return b;
};

Group.prototype.canMove = function(newX, newY)
{
	for (var i=0, n=this.blocks.length; i<n; i++)
		if (!this.blocks[i].canMove(newX, newY)) return false;
		
	for (var i=0, il=groups.length; i<il; i++)
	{
		if (groups[i]!=this)//&& collision(this, groups[i], 0, 1)
		{
			for (var j=0, jl=groups[i].blocks.length; j<jl; j++)
			{
				var other = groups[i].blocks[j];
				for (var k=0, kl=this.blocks.length; k<kl; k++)
				{
					if ((this.blocks[k].x+newX==other.x && this.blocks[k].y+newY==other.y) || this.blocks[k].x+newX>=SCREENWIDTH || this.blocks[k].x+newX<SCREENLEFT || this.blocks[k].y+newY>=SCREENHEIGHT)
						return false;
				}
			}
		}
	}
	return true;
};

/*
Group.prototype.sort = function()
{
	for (var i=0, n=this.blocks.length; i<n; i++)
	{
		var index = 0;
		for (var j=0; j<n; j++)
			if (this.blocks[j].y>this.blocks[index].y) index = j;
			
		var b = this.blocks[i];
		this.blocks[i] = this.blocks[index];
		this.blocks[index] = b;
	}
};
*/
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// EnemyBullet Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
EnemyBullet.prototype.superConstructor = Instance;
/** @constructor */
function EnemyBullet(x, y, image, speed)
{
	this.superConstructor(x, y, 0);
	this.image(image);
	this.speed = speed*FACTOR;
	this.move = function(){if (this.y<SCREENHEIGHT+this.height+this.speed) this.y += this.speed; else this.destroy();};
	this.destroy = function (){destroyInst(this); enemybullets.splice(enemybullets.indexOf(this), 1);} 
	enemybullets.push(this);
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Enemy Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Enemy.prototype.superConstructor = Instance;
Enemy.enemies = 0;
Enemy.totalKilled = 0;
/** @constructor */
function Enemy(x, y)
{
	this.superConstructor(x, y);
	this.size = 0.5;
	this.value = 1;
	this.destroy = function(){Enemy.enemies--; this.kill();};
	this.shoot = function(){
		new EnemyBullet(this.x + 3, this.y + 12, enemy1bullet, 8);
		new EnemyBullet(this.x + this.width - 19, this.y + 12, enemy1bullet, 8);
	};
	this.explode = function(){
		this.destroy();
		new Animation(this.x - 5, this.y - 8,[enemy1explosion0, enemy1explosion1, enemy1explosion2, enemy1explosion3, enemy1explosion4, enemy1explosion5],.75,50,48).repeat = false;
	};
	
	this.delay = FRAMERATE*0.5;
	this.timer = 0;
	this.chance = Math.max(200-level*10, 50);
	this.shootTime = 0;
	this.shootTimer = 0;
	this.moving = true;
	this.image(enemy1);
	this.health = 1;
	
	this.xspeed = 0;
	this.yspeed = 0;
	this.xforce = 0;
	this.yforce = 0;
	this.speed = 10;
	this.accel = 4;
	this.frict = 2;
	this.prevxforce = 0;
	this.turn = 0;
	this.dist = 0;
	
	this.movement = -1;
	this.movementtime = randomInt(20,100);
	this.movementtimer = 0;
	this.movetime = 0;
	this.stoptime = randomInt(30,50);
	this.maxheight = Math.min(110+level*4, 150);
	
	if (this instanceof Enemy)
	{
		this.fire = new Fire(this, [enemy2fire0, enemy2fire1, enemy2fire2, enemy2fire3, enemy2fire1], 0.75, 21, 18, 9, -4);
		Enemy.enemies ++;
	}
	
	enemies.push(this);
};

Enemy.prototype.move = function()
{
	this.update();
	
	if (this.timer>=this.delay)
		if (this.shootTimer==this.shootTime || this.chance<=1)
		{
			if (this.movement!=0) this.shoot();
			this.timer = 0;
		}
	if (this.timer<this.delay) this.timer ++;
	
	if (this.movement!=0 && this.y>this.maxheight-this.dist && this.yforce>0) {this.yforce = 0; }
	if (this.y>SCREENHEIGHT) {this.y = -this.height; this.turn = false; this.xforce = 0; this.movement = -1;}
	
	if (this.y>ship.y+ship.height*0.5 && this.movement == 0) this.yforce = 12;
	
	if (this.movement<0){
		if (this.movetime != 0) this.movetime = 0;
		
		if (this.movementtimer<this.movementtime) this.movementtimer ++;
		else{
			this.movement = this.movementtime % 3;
			switch (this.movement)
			{
				case 0:
					var dir = directionTo(this,ship)*DEGTORAD;
					this.xforce = this.speed*Math.cos(dir);
					this.yforce = this.speed;
				break;
				case 1:
					this.xforce = this.speed;
				break;
				case 2:
					this.xforce = -this.speed;
				break;
			}
			
			this.movementtime = randomInt(20,100); 
			this.movementtimer = 0;
		}
		
		if (this.movementtimer>=this.movementtime-FRAMERATE*0.5 && this.movementtime%3==0) {this.xforce = 0; this.yforce = 4*((Math.floor(this.movementtimer/2)%2)*2 - 1);}
	}
	else
	{
		this.movetime ++;	
		if (this.movetime>=this.stoptime && this.movement!=0){this.movetime = 0; this.movement = -1; this.xforce = this.yforce = 0; this.stoptime = randomInt(30,50);}
	}
};

Enemy.prototype.update = function()
{
	if (bullets.length>0)
	{
		for (var b=0, bl=bullets.length; b<bl; b++)
			if (collision(this, bullets[b], 0, 0, 4, 8-this.yspeed/2))
			{
				if (--this.health>0) new Explosion(bullets[b].x, bullets[b].y, 0.5);
				if (typeof bullets[b].indestructable == "undefined") bullets[b].destroy();
				else this.health = 0;
				if (this.health==0) {
					addScore(level*this.value);
					localStorage.ekill = ++enemiesKilled; //!!
					if (enemiesKilled>ENEMIESTOKILL && skipToLevel && !waveMode) {waveMode = true; tellthem = true;}
					this.explode();
				}
			}
	}
	
	if (this.shootTimer<this.shootTime) this.shootTimer ++;
	else{this.shootTimer = 0; this.shootTime = Math.floor(Math.random()*this.chance);}
	
	this.y += this.yspeed;
	this.x += this.xspeed;
	
	if (this.xforce!=0) this.xspeed = incTo(this.xspeed, this.accel, this.xforce);
	else this.xspeed = incTo(this.xspeed, this.frict, 0);
	if (this.yforce!=0) this.yspeed = incTo(this.yspeed, this.accel, this.yforce);
	else this.yspeed = incTo(this.yspeed, this.frict, 0);
	
	this.dist = stoppingDist(this.xspeed, this.frict)+Math.abs(this.xspeed);
	if (!this.turn && this.x>=SCREENWIDTH-this.width-this.dist && this.xforce>0 
	|| this.x<=SCREENLEFT+this.dist && this.xforce<0 && this.size!=1.5) {this.prevxforce = this.xforce; this.xforce = 0; this.turn = true;}
	
	if (this.turn && this.xspeed==0 && this.yspeed==0 && this.size!=1.5)
	{
		this.turn = false;
		this.xforce = this.prevxforce*-1;
	}
	
	if (this.x+this.width>SCREENWIDTH) this.x = SCREENWIDTH-this.width;
	if (this.x<SCREENLEFT) this.x = SCREENLEFT;
	
	if (this.movement==-1 && this.y<this.maxheight-this.dist) this.yforce = this.speed;
	else if (this.movement == -1) this.yforce = 0;
	
	this.rotation = -this.xspeed*this.size;
	this.fire.rotation = this.rotation;
};

Enemy.prototype.kill = function()
{
	this.fire.fade = true;
	destroyInst(this);
	enemies.splice(enemies.indexOf(this), 1);
	Enemy.totalKilled ++;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Enemy2 Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Enemy2.prototype.superClass = Enemy;
Enemy2.prototype.superConstructor = Enemy.prototype.superConstructor;
Enemy2.prototype.kill = Enemy.prototype.kill;
Enemy2.prototype.update = Enemy.prototype.update;
Enemy2.enemies = 0;
/** @constructor */
function Enemy2(x, y)
{
	this.superClass(x, y);
	this.destroy = function(){Enemy2.enemies--; this.kill();};
	this.size = 1;
	this.value = 5;
	this.shoot = function(){
		new EnemyBullet(this.x + 5 - 11*(!this.guns), this.y + 12, enemy2bullet, 12);
		new EnemyBullet(this.x + this.width - 32 + 11*(!this.guns), this.y + 12, enemy2bullet, 12);
		this.guns = !this.guns;
	};
	this.explode = function(){
		this.destroy();
		new Animation(this.x - 11, this.y - 8,[enemy2explosion0, enemy2explosion1, enemy2explosion2, enemy2explosion3, enemy2explosion4, enemy2explosion5, enemy2explosion6],.75,77,56).repeat = false;
	};
	this.guns = true;
	this.chance = Math.max(200-level*10, 35);
	this.health = 3;
	this.image(enemy2);
	this.fire = new Fire(this, [enemy1fire0, enemy1fire1, enemy1fire2, enemy1fire3, enemy1fire4, enemy1fire1], 0.5, 25, 21, 16, 0);
	this.speed = 10;
	this.accel = 4;
	this.frict = 2;
	this.maxheight = Math.min(70+level*2, 100);
	this.movementtime = randomInt(10,50);
	this.movementtimer = 0;
	
	Enemy2.enemies++;
};

Enemy2.prototype.move = function()
{
	if (this.movement!=0 && this.y>this.maxheight-this.dist && this.yforce>0) {this.yforce = 0; }
	if (this.y>SCREENHEIGHT) {this.y = -this.height; this.turn = false; this.xforce = 0; this.movement = -1;}
	
	if (this.movement==0){
		if (Math.abs(this.x-ship.x)<GAMEWIDTH/3)
		{
			if (this.y>ship.y) this.yforce = this.speed;
			
			if (this.y<ship.y+ship.height*0.5)
			{
				var dir = directionTo(this,ship)*DEGTORAD;
				this.xforce = this.speed*Math.cos(dir);
				this.yforce = Math.min(Math.max(this.speed*Math.sin(dir)*1.25, this.speed*0.4),this.speed);
			}
			else this.yforce = this.speed;
		}
		else
		{
			this.xforce = this.speed*sign(ship.x-this.x);
		}
	}
	
	if (this.movement<0){
		if (this.movetime != 0) this.movetime = 0;
		
		if (this.movementtimer<this.movementtime) this.movementtimer ++;
		else{
			this.movement = this.movementtime % 3;
			switch (this.movement)
			{
				case 0:
				break;
				case 1:
					this.xforce = this.speed;
				case 2:
					this.xforce = -this.speed;
				break;
			}
			this.movementtime = randomInt(15,60); 
			this.movementtimer = 0;
		}
	}
	else
	{
		this.movetime ++;	
		if (this.movetime>=this.stoptime && this.movement!=0){this.movetime = 0; this.movement = -1; this.xforce = this.yforce = 0; this.stoptime = randomInt(30,50);}
	}
	
	this.update();
	
	if ((!this.guns && this.timer>=FRAMERATE*4/9) || (this.shootTime==this.shootTimer && this.timer>=this.delay) && this.movement!=0)
	{
		this.shoot();
		this.timer = 0;
	}
	if (this.timer<this.delay) this.timer ++;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Enemy3 Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Enemy3.prototype.superClass = Enemy;
Enemy3.prototype.superConstructor = Enemy.prototype.superConstructor;
Enemy3.prototype.kill = Enemy.prototype.kill;
Enemy3.prototype.update = Enemy.prototype.update;
Enemy3.enemies = 0;
/** @constructor */
function Enemy3(x, y)
{
	this.superClass(x, y);
	this.destroy = function(){Enemy3.enemies--; this.kill();};
	this.size = 1.5;
	this.value = 10;
	this.shoot = function(){
		new EnemyBullet(this.x + 6 + 4, this.y + 24, enemy3bullet, 16);
		new EnemyBullet(this.x + this.width - 15 - 16, this.y + 24, enemy3bullet, 16);
	};
	this.explode = function(){
		this.destroy();
		new Animation(this.x - 16, this.y - 5,[enemy3explosion0, enemy3explosion1, enemy3explosion2, enemy3explosion3, enemy3explosion4, enemy3explosion5, enemy3explosion6],0.75,101,70).repeat = false;
	};
	this.chance = Math.max(200-level*10, 25);
	this.image(enemy3);
	this.health = 6;
	this.fire = new Fire(this, [enemy3fire0, enemy3fire1, enemy3fire2, enemy3fire3, enemy3fire4, enemy3fire3], 0.5, 45, 21, 14, 7);
	this.rapid = false;
	this.timer = 0;
	this.rapidtime = FRAMERATE*1;
	this.speed = 10;
	this.accel = 4;
	this.frict = 2;

	this.maxheight = Math.min(level, 20);
	
	this.decide = true;
	this.dectime = 0;
	this.dtimer = 0;
	this.dtime = Math.max(FRAMERATE - level*2 + 8, 1);
	
	this.movementtimer = 0;
	this.movementtime = randomInt(70,180);
	this.chargetime = 2*FRAMERATE;
	this.chargetimer = 0;
	this.resumetimer = 0;
	
	Enemy3.enemies++;
};

Enemy3.prototype.move = function()
{	
	this.update();
	
	if (this.shootTimer==this.shootTime && this.resumetimer==0)
	{
		this.shoot();
	}
	
	if (this.movementtimer<this.movementtime) this.movementtimer ++;
	else{
		this.resumetimer = 2;
		this.xforce = this.yforce = 0;
		if (this.chargetimer<this.chargetime)
		{
			this.chargetimer ++;
			this.yforce = 4*((Math.floor(this.chargetimer/2)%2)*2 - 1);
		}
		else{
			var yy = 480;
			if (collisionRect(ship, this.x, this.y+this.height-5, this.x+this.width, GAMEHEIGHT) && ship.absorb>=0) yy = ship.y - this.y - ship.height;
			var a = new Beam(this.x+13, this.y+this.height-5, [enemy3laser0, enemy3laser1, enemy3laser2], 1, 49, yy + ship.height);
			a.alpha = 0;
			enemybullets.push(a);
			new Beam(this.x+13, this.y+this.height-5, [enemy3laser0, enemy3laser1, enemy3laser2, enemy3laser3, enemy3laser4, enemy3laser5, enemy3laser6, enemy3laser7], 1, 49, yy);
			this.chargetimer = 0;
			this.resumetimer = 10;
			this.movementtimer = 0;
			this.movementtime = randomInt(70,180);
		}
	}
	if (this.resumetimer>0) this.resumetimer --;
	
	if (this.movement<0 && this.resumetimer==0)
	{
		if (this.decide)
			for (var i=0, n=bullets.length; i<n; i++)
			{
				if (collisionRect(bullets[i], this.x, 0, this.width/2, SCREENHEIGHT))
				{
					if (SCREENWIDTH-(this.x+this.width)>=this.width)
						this.xforce = this.speed;
					else this.xforce = -this.speed;
					this.decide = false;
					this.dectime = 5;
				}
				else if (collisionRect(bullets[i], this.x+this.width*0.5, 0, this.width/2, SCREENHEIGHT))
				{
					if (this.x-SCREENLEFT>=this.width)
						this.xforce = -this.speed;
					else this.xforce = this.speed;
					this.decide = false;
					this.dectime = 5;
				}
			}
		if (this.dectime>0) this.dectime --;
		else if (!this.decide && this.dtimer==0){this.xforce = 0; this.dtimer = this.dtime;}
	} //end if (this.movement<0)
	if (this.dtimer==1) this.decide = true;
	if (this.dtimer > 0) this.dtimer--;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Animation Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Animation.prototype.superConstructor = Instance;
/** @constructor */
function Animation(x, y, images, animationSpeed, width, height)
{
	this.superConstructor(x, y);
	this.speed = animationSpeed || 1;
	this.animate = true;
	this.repeat = true;
	this.timer = 0;
	this.index = 0;
	this.images = images;
	this.image(images[0], width || images[0].width, height || images[0].height);
};

Animation.prototype.move = function()
{
	if (this.timer+this.speed<1)
		this.timer += this.speed;
	else if (this.animate){
		this.index ++;
		if (this.index>=this.images.length){if (this.repeat) this.index = 0; else this.destroy();}
		this.image(this.images[this.index], this.width, this.height);
		this.timer = 0;
	}
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Explosion Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Explosion.prototype.superClass = Animation;
Explosion.prototype.superConstructor = Animation.prototype.superConstructor;
Explosion.prototype.move = Animation.prototype.move;
/** @constructor */
function Explosion(x, y, size, speed)
{
	this.superClass(x, y, [explosion0, explosion1, explosion2, explosion3, explosion4, explosion5], speed || 1, 64*(size || 1), 64*(size || 1));
	this.repeat = false;
	this.x -= 8*(size || 1);
	this.y -= 8*(size || 1);
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Fire Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Fire.prototype.superClass = Animation;
Fire.prototype.superConstructor = Animation.prototype.superConstructor;
Fire.prototype.superMove = Animation.prototype.move;
/** @constructor */
function Fire(parent, images, animationSpeed, width, height, xoffset, yoffset)
{
	this.superClass(parent.x, parent.y, images, animationSpeed || 0.25, width || images[0].width, height || images[0].height);
	this.parent = parent;
	this.xoffset = xoffset || 0;
	this.yoffset = yoffset || 0;
	this.fade = false;
};

Fire.prototype.move = function()
{
	this.x = this.parent.x + this.xoffset;
	this.y = this.parent.y + this.yoffset;
	if (this.fade){if (this.alpha>0) {this.alpha -= 0.25; this.y -= 2;} else this.destroy();}
	else this.alpha = this.parent.alpha;
	this.animate = (this.parent.moving || this.index>0);
	
	this.superMove();
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//time - does one of the following: 1) speeds up time around you. 2) slows down time around you. 3) freezes time around you for 5 seconds. 4) freezes you.
//life
//shield around ship for one hit (pink bubble)
//wide shots
//repetetive shooting and shoot faster
//energy absorber

// PowerUp Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
PowerUp.prototype.superClass = Animation;
PowerUp.prototype.superConstructor = Animation.prototype.superConstructor;
PowerUp.prototype.superMove = Animation.prototype.move;
PowerUp.items = [0, 0, 0, 0, 0];
/** @constructor */
function PowerUp(x, y, number)
{
	this.superClass(x, y, [powerup0, powerup1, powerup2, powerup3, powerup5,powerup6,powerup7], 0.25, 24, 24);
	if (typeof number == "undefined")
		do{
			number = randomInt(1,4);
		}
		while (PowerUp.items[number]>0);
	if (number==1) number = 0;

	if (this.x == 0) this.x = randomInt(SCREENLEFT, SCREENWIDTH-this.img.width);
	this.y = -this.img.height;
	this.number = number;
	this.spd = 4*FACTOR;
	
	this.move = function(){
		if (collision(ship, this, 0, 0, 4, 6))
		{
			switch (this.number)
			{
				case 0:
					shipLives ++;
					if (shipLives>MAXSHIPLIVES) shipLives = MAXSHIPLIVES;
					else new Grower(ship.x+ship.width*0.5, ship.y+ship.height*0.5);
				break;
				case 1: ship.shootFast = true; break;
				case 2:
					PowerUp.items[2] ++;
					var can = (ship.shield==0);
					ship.shield = 6;
					if (can)
					{
						var s = new Instance(0,0);
						s.image(shipshield);
						s.aW = s.width;
						s.aH = s.height;
						s.a = 0;
						s.oldShield = ship.shield;
						s.grow = s.fade = 0;
						s.move = function(){var extra = Math.sin(this.a ++/3)*15 - 10; if (this.oldShield!=ship.shield){this.oldShield = ship.shield; this.grow = 40;}
							if (this.grow>0) this.grow -= 4;
							if (this.fade<1) this.fade += 0.1;
							this.width = this.aW + extra + this.grow; this.height = this.aH + extra + this.grow;
							this.alpha = ship.alpha*this.fade*ship.shield/6; this.x = ship.x-this.width*0.5+ship.width*0.5; this.y = ship.y-this.height*0.5+ship.height*0.5+2;
							if (this.alpha<=0 && ship.shield==0) {this.destroy(); PowerUp.items[2] --;}
						};
						s.move();
					}
				break;
				case 3:
					var can = (ship.absorb==-1);
					ship.absorb = 6;
					if (can)
					{
						var a = new Absorber(ship);
						a.move();
					}
				break;
				case 4:
					if (!ship.cantShoot) new Expander(ship.x+ship.width*0.5, ship.y+ship.height*0.5, ship);
				break;
			}
			this.destroy();
		}
		
		for (var i=0, il=enemybullets.length; i<il; i++)
			if (collision(enemybullets[i],this, 0, 0, 6, 4))
			{
				if (typeof enemybullets[i].indestructable == "undefined") enemybullets[i].destroy();
				this.destroy();
			};
		
		if (this.y < SCREENHEIGHT) this.y += this.spd;
		else this.destroy();
		
		this.superMove();
	};
};

// Shine Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Shine.prototype.superConstructor = Instance;
/** @constructor */
function Shine(x, y)
{
	this.superConstructor(x,y);
	this.image(shine);
	this.fadein = true;
	this.alpha = 0;
	this.move = function(){ if (this.fadein) {if (this.alpha<.8) this.alpha += 0.25; else {this.fadein = false; this.alpha = .8;}} else {if (this.alpha>0) this.alpha-=0.2; else this.destroy();}}
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Button Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Button.prototype.superConstructor = Instance;
/** @constructor */
function Button(x, y, images, press)
{
	this.superConstructor(x, y);
	this.images = images;
	this.width = images[0].width;
	this.height = images[0].height;
	this.image(this.images[0]);
	
	this.pressing = function(){return (collisionRectangles(touchX, touchY, 1, 1, this.x, this.y, this.width, this.height) || collisionRectangles(mX, mY, 1, 1, this.x, this.y, this.width, this.height));}; //**
	this.press = press;
	this.pressed = false;
	this.index = 0;
	this.move = function(){
		if (this.pressing() && !this.pressed) {this.image(this.images[1+this.index]); this.press(); play(snd_click); this.pressed = true;}
		else if (!this.pressing() && this.pressed) {this.image(this.images[0+this.index]); this.pressed = false;}
	};
	this.cycle = function(){
		this.index += 2;
		if (this.index>=this.images.length-1)
			this.index = 0;
		this.image(this.images[this.index+(this.pressing()*1)]);
	};
	this.destroy = function(){
		buttons.splice(buttons.indexOf(this), 1);
		destroyInst(this);
	};
	buttons.push(this);
};
//static method
Button.removeAll = function()
{
	for (var i=0, n=buttons.length; i<n; i++)
		buttons[i].remove();
};

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Absorber Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Absorber.prototype.superClass = Animation;
Absorber.prototype.superConstructor = Animation.prototype.superConstructor;
Absorber.prototype.superMove = Animation.prototype.move;
Absorber.index = 3;
/** @constructor */
function Absorber(parent)
{
	this.superClass(parent.x, parent.y, [shipabsorb0, shipabsorb1, shipabsorb2, shipabsorb3, shipabsorb4, shipabsorb5, shipabsorb6, shipabsorb9], 1);
	this.parent = parent;
	this.spin = false;
	this.fade = 0;
	this.width *= 0.85;
	this.height *= 0.85;
	this.die = false;
	PowerUp.items[Absorber.index] ++;
};

Absorber.prototype.move = function()
{
	if (!this.spin)
	{
		this.index = 6 - this.parent.absorb;
		if (this.index==6)
			this.spin = true;
	}
	else
		this.rotation += 36;
	
	if (this.parent.absorb<0)
		this.die = true;
	
	if (this.die)
	{
		if (this.fade==0) this.parent.explode();
		if (this.fade>0) this.fade -= 0.2;
		else {this.destroy(); PowerUp.items[Absorber.index] --;}
	}
	else if (this.fade<1) this.fade += 0.2;
		
	this.alpha = this.parent.alpha*this.fade;
	this.x = this.parent.x-this.width*0.5+this.parent.width*0.5;
	this.y = this.parent.y-this.height*0.5+this.parent.height*0.5+4;
	
	this.timer = 1;
	this.superMove();
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Grower Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Grower.prototype.superConstructor = Instance;

function Grower(x, y, image, life, speed, growamt)
{
	this.superConstructor(x, ship.y+ship.height*0.5);
	this.image(image || oneup);
	this.alpha = 0;
	this.fadein = true;
	this.speed = speed || 0.15;
	this.growamt = growamt || 0.15;
	this.startX = this.x;
	this.startY = this.y;
	this.wait = wait || 4;
};

Grower.prototype.move = function()
{
	if (this.fadein){
		if (this.alpha<1) this.alpha += this.speed*2;
		else
		{
			if (this.wait>0) this.wait --;
			else this.fadein = false;
		}
	}
	else{
		if (this.alpha>0) this.alpha -= this.speed;
		else this.destroy();
		this.width *= 1 + this.growamt;
		this.height *= 1 + this.growamt;
	}
	this.x = this.startX - this.width*0.5;
	this.y = this.startY - this.height*0.5;
};

// Expander Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Expander.prototype.superConstructor = Instance;
Expander.prototype.superClass = Grower;
Expander.prototype.superMove = Grower.prototype.move;
Expander.index = 4;

function Expander(x, y, parent)
{
	this.superClass(x, y, shipexpander, 0, 0.05, 0.75);
	this.timer = 5;
	this.parent = parent;
	this.go = false;
	this.parent.cantShoot = true;
	this.die = false;
	this.width *= 0.8;
	this.height *= 0.8;
	this.candie = (!parent.flash);
	PowerUp.items[Expander.index] ++;
};

Expander.prototype.move = function()
{
	if (pressingShoot) this.go = true;
	if (this.go)
	{
		this.superMove();
		if (this.timer>0) this.timer --;
	}
	else if (this.alpha<1 && !this.die) this.alpha += this.speed*2;
	this.rotation += 30;
	
	if (this.timer==1)
	{
		for (var i=0, n=enemies.length; i<n; i++)
			new WillDamage(enemies[i], i);
	};
	this.x = this.parent.x-this.parent.width*0.5;
	this.y = this.parent.y-this.parent.height*0.5;
	
	this.x = this.parent.x-this.width*0.5+this.parent.width*0.5;
	this.y = this.parent.y-this.height*0.5+this.parent.height*0.5;
	if (this.width>this.img.width*2 && this.parent.cantShoot) this.parent.cantShoot = false;
	
	if (this.parent.alpha<1 && this.candie) this.die = true;
	else if (!this.candie)
	{
		if (this.parent.alpha>=1) this.candie = true;
		this.alpha = this.parent.alpha;
	}
	
	if (this.die)
	{
		if (this.alpha>0) this.alpha -= this.speed;
		else {this.destroy(); this.parent.cantShoot = false; PowerUp.items[Expander.index] --;}
	}
};

// WillDamage Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
WillDamage.prototype.superConstructor = Instance;
WillDamage.prototype.superClass = Bullet;

function WillDamage(instance, time)
{
	this.superClass(-500,0);
	this.time = time;
	this.e = instance;
	this.alpha = 0;
	this.move = function()
	{
		if (this.time>0) this.time --;
		else{
			this.x = this.e.x + this.e.width*0.5;
			this.y = this.e.y + this.e.height*0.5;
		}
	};
};

// Beam Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
Beam.prototype.superClass = Animation;
Beam.prototype.superConstructor = Animation.prototype.superConstructor;
Beam.prototype.move = Animation.prototype.move;
/** @constructor */
function Beam(x, y, images, animationSpeed, width, height)
{
	this.superClass(x, y, images, animationSpeed, width, height);
	
	this.destroy = function(){
		if (enemybullets.indexOf(this)>-1) enemybullets.splice(enemybullets.indexOf(this), 1);
		if (bullets.indexOf(this)>-1) bullets.splice(bullets.indexOf(this), 1);
		destroyInst(this);
	};
	this.repeat = false;
	this.indestructable = 0;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// HighscoreTable Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
/** @constructor */
function HighscoreTable(name)
{
	this.name = name || "";
	for (var i=0; i<10; i++)
	{
		if (localStorage.getItem(this.name + "score" + i)==null)
			localStorage.setItem(this.name + "score" + i, 0);
		if (localStorage.getItem(this.name + "name" + i)==null)
			localStorage.setItem(this.name + "name" + i, "");
	}
};

//attempts to add a score in the table and returns the index the score was added to, returns -1 it fails
HighscoreTable.prototype.add = function(name, score)
{
	var i = this.index(score);
	
	var scores = [], names = [];
	
	for (var j=0; j<10; j++)
	{
		scores[j] = localStorage.getItem(this.name + "score" + j);
		names[j] = localStorage.getItem(this.name + "name" + j);
	}
	
	for (var j=i+1; j<10; j++)
	{
		localStorage.setItem(this.name + "score" + j, scores[j-1]);
		localStorage.setItem(this.name + "name" + j, names[j-1]);
	}
	
	localStorage.setItem(this.name + "name" + i, name);
	localStorage.setItem(this.name + "score" + i, score);
	
	return i;
};

HighscoreTable.prototype.getScore = function(index)
{
	var s = localStorage.getItem(this.name + "score" + index);
	if (!s) s = -1;
	return s;
};

HighscoreTable.prototype.getName = function(index)
{
	return localStorage.getItem(this.name + "name" + index);
};

//returns the potential index in the highscore table for the score, or -1 if the score cannot be added to the table
HighscoreTable.prototype.index = function(score)
{
	for (var i=0; i<10; i++)
		if (score>localStorage.getItem(this.name + "score" + i))
			break;
	if (i==10) return -1;
	return i;
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\