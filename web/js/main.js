
function Area(x,y,w,h)
{
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}

function Circle(x,y,r,fc,lc,lw)
{
    this.x=x;
    this.y=y;
    this.r=w;
    this.fc=fc; //fill color
    this.lc=lc; //line color
    this.lw=lw; //ling width
}

function extend(dst,src) {
    for (var p in src)
      dst[p]=src[p];
    return dst;
}

function clone(obj) {
    return extend({},obj);
}


function myTitle(parent,area,txt,data)
{
    
}


function myMenu(parent,area,txt,data)
{
    
    
    
}



function loadAll()
{
    var flag=0;
    var imgs=[
                "../res/img/button.png",
                "../res/img/progressbar.png",
            ]
    Laya.loader.load(imgs, Laya.Handler.create(this, onLoaded));
    
    while(!flag);
    
    function onLoaded() {
		flag=1;
		console.log("____ all loaded");
	}
}


function myInit()
{
    var STAGE       = Laya.Stage;
    var EVENT       = Laya.Event;
    var WEBGL       = Laya.WebGL;
    var BROWSER     = Laya.Browser;
    
    var Stage       = Laya.stage;
    Laya.init(BROWSER.clientWidth, BROWSER.clientHeight, WEBGL);
    Stage.alignV     = STAGE.ALIGN_MIDDLE;
    Stage.alignH     = STAGE.ALIGN_CENTER;
	Stage.scaleMode  = STAGE.SCALE_SHOWALL;
	Stage.screenMode = STAGE.SCREEN_HORIZONTAL;
}


////////////subedit///////////////
function myFader(parent,area,txt,data)
{
    var sp=new Laya.Sprite();
    
    var bt=new Laya.Button("../res/img/button.png");
    bt.pos(20, 40);
    bt.on(Laya.Event.MOUSE_DOWN, bt, onDown);
    bt.on(Laya.Event.MOUSE_UP,   bt, onUp);
    sp.addChild(bt);
    
    var hs = new Laya.HSlider("../res/img/progressbar.png");
    hs.width = area.w/2;
	hs.pos(20, 80);
	hs.size(area.w/2, 30);
	hs.min = 0;
	hs.max = 100;
	hs.value = 50;
	hs.tick = 1;
    hs.on(Laya.Event.MOUSE_DOWN, hs, onDown);
    hs.on(Laya.Event.MOUSE_UP,   hs, onUp);
    hs.on(Laya.Event.MOUSE_MOVE, hs, onMove);
    sp.addChild(hs);
    
    parent.addChild(sp);
    
    function onDown() {
        console.log("_____Down");
    }
    
    function onUp() {
        console.log("_____Up");
    }
    
    function onMove() {
        console.log("_____Move");
    }
    console.log("_____2222222222");
    
    return sp;
}


function myRing(parent,pot,c1,c2)
{
    var flag=0;
    var sp=new Laya.Sprite();
    
    sp.c1=clone(c1);
    sp.c2=clone(c2);
    
    sp.addChild(bt);
    sp.addChild(hs);
    parent.addChild(sp);
    
    sp.get=function(id) {
        if (id==0)
            return sp.c1;
        else
            return sp.c2;
    }
    
    sp.set=function(id,c) {
        if (id==0)
            sp.c1=c;
        else
            sp.c2=c;
    }
    
    sp.update=function(x,y) {
        sp.c1.x=sp.c2.x=x;
        sp.c1.y=sp.c2.y=y;
    }
    
    sp.paint=function() {
        sp.graphics.clear();
        sp.graphics.drawCircle(sp.c1.x,sp.c1.y,sp.c1.r,sp.c1.fc,sp.c1.lc,sp.c1.lw);
        sp.graphics.drawCircle(sp.c2.x,sp.c2.y,sp.c2.r,sp.c2.fc,sp.c2.lc,sp.c2.lw);
    }
    
    sp.on(Laya.Event.MOUSE_DOWN, this, onDown);
    //sp.on(Laya.Event.DRAG_START, this, onDown);

    sp.on(Laya.Event.MOUSE_UP,   this, onUp);
    //sp.on(Laya.Event.DRAG_END,   this, onUp);
    
    sp.on(Laya.Event.MOUSE_MOVE, this, onMove);
    //sp.on(Laya.Event.DRAG_MOVE,  this, onMove);
    //Laya.Event.DRAG_START
    
    function onDown(e) {
        if (sp.hitTestPoint(e.stageX, e.stageY)) {
            flag=1;
        }
    }
    
    function onUp(e) {
        flag=0;
    }
    
    function onMove(e) {
        if (falg && sp.hitTestPoint(e.stageX, e.stageY)) {
            var p=sp.globalToLocal(Laya.Point(e.stageX, e.stageY));
            var p2=sp.toParentPoint(p);
            
            sp.update(p2.x, p2.y);
        }
    }
    
    return sp;  
}

function myEqualizer(parent,area,txt,data)
{
    var sp=new Laya.Sprite();
    
    sp.graphics.drawCircle(pot.x,pot.y,radius,fillcolor,linecolor,linewidth);
    sp.graphics.drawCircle(pot.x,pot.y,radius,fillcolor,linecolor,linewidth);
    
    sp.addChild(bt);
    sp.addChild(hs);
    parent.addChild(sp);
   
}
function myDynamic(parent,area,txt,data)
{
    
}
function myChannel(parent,area,txt,data)
{
    var eq,dyn,fader;
    var sp=new Laya.Sprite();
    
    //eq    = new myEqualizer();
    //dyn   = new myDynamic();
    var fd = new myFader(sp, Area(), "fader");
    
}
////////////////////////////////////
function myEdit(area,txt,data)
{
    
}


function mySetup(area,txt,data)
{
    
}


function myUpgrade(area,txt,data)
{
    
}


///////////////////////////////////////////



console.log("00000000000000000000");
(function uuu() {
    var i,data;
    
    myInit();
    
    var st=Laya.stage;
    //this.tt = new myTitle(st,   Area(200,200,600,400), data);
    //this.mn = new myMenu(st,    Area(0,0,0,0), data);
    //this.et = new myEdit(st,    Area(0,0,0,0), data);
    //this.ug = new myUpgrade(st, Area(0,0,0,0), data);
    
    var fd = new myFader(st, Area(200,200,600,400), "fader");
    conso
    
})()



