// Instance Class /////////////////////////////////////////////
///////////////////////////////////////////////////////////
/** @constructor */
Instance.prototype.constructor = Instance;
function Instance(x, y, z)
{
	(typeof x != "undefined") ? this.x = x : this.x = 0;
	(typeof y != "undefined") ? this.y = y : this.y = 0;
	//this.id = instances.length;
	this.destroy = destroyInstance;
	this.remove = removeInstance; //DON'T CALL THIS METHOD
	this.image = setImage;
	this.img;
	this.rotation = 0;
	
	this.alpha = 1;
	this.visible = true;
	this.destroyed = false;
	
	if (typeof z != "undefined") this.z = z;
	tempinstances.push(this);
};
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/** @constructor */
function Inst(x, y, html)
{
	this.x = x;
	this.y = y;
	
	this.destroy = destroyInstance;
	this.remove = removeAnInst;
	this.setAlpha = setInstanceAlpha;
	this.text = setInstanceHTML;
	
	this.alpha = 1;
	this.visible = true;
	this.destroyed = false;
	//add
	this.parent = get("instanceField");
	this.element = document.createElement('div');
	if (typeof html != "undefined")	this.element.innerHTML = html;
	this.element.className = "instance";
	this.parent.appendChild(this.element);
	//
	this.element.style.left = x;
	this.element.style.top = y;
	
	insts.push(this);
};

function updateInstances()
{
	addInstances();
	
	for (var i=0, il=instances.length; i<il; i++)
		if (instances[i].move) instances[i].move();
	
	addInstances();
	destroyInstances();
};

function clearInstances()
{
	for (var i=0, il=instances.length; i<il; i++)
		instances[i].destroy();
};

function clearInsts()
{
	for (var i=0, il=insts.length; i<il; i++)
		insts[i].destroy();
};

function destroyInstances()
{
	if (destroys.length>0)
	{
		for (var d=0, dl=destroys.length; d<dl; d++)
			destroys[d].remove();
		destroys.length = 0;
	}
};

function addInstances()
{
	for (var i=0, n=tempinstances.length; i<n; i++)
	{
		var tmp = tempinstances[i];
		if (typeof tmp.z != "undefined") instances.unshift(tmp);
		else instances.push(tmp);
	}
	tempinstances.length = 0;
};

function removeInstance(){
	instances.splice(instances.indexOf(this), 1);
	delete this;
};

function removeInst(){
	delete this;
};

function removeAnInst(){
	insts.splice(insts.indexOf(this), 1);
	this.parent.removeChild(this.element);
	delete this;
};

function destroyInstance(){
	destroyInst(this);
};

function destroyInst(inst){
	if (!inst.destroyed) {destroys.push(inst); inst.destroyed = true;}
};

function setImage(image, width, height){
	this.img = image;
	if (typeof width != "undefined") this.width = width;
	else this.width = image.width;
	if (typeof height != "undefined") this.height = height;
	else this.height = image.height;
};

function setInstanceHTML(html)
{
	this.element.innerHTML = html;
};

function setInstanceAlpha(alpha)
{
	this.element.style.opacity = alpha;
	this.alpha = alpha;
};