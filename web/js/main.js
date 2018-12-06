
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



function loadRes()
{
    var flag=0;
    var imgs=[
                "./res/img/fader_line.png",
                "./res/img/fader_line$bar.png",
                "./res/img/fader_bg.png",
            ];
    Laya.loader.load(imgs, Laya.Handler.create(this,onload));
    function onload()
    {
        log("all loaded!");
    }
}


////////////subedit///////////////
function myFader(parent,area,txt,data)
{
    var sp=new Laya.Sprite();
    sp.loadImage('./res/img/fader_bg.png');
    var bg=Laya.loader.getRes('./res/img/fader_bg.png');
    var line=Laya.loader.getRes('./res/img/fader_line.png');
    sp.pos((parent.width-bg.width)/2,(parent.height-bg.height)/2);
    
    var vs=new Laya.VSlider();
    vs.skin="./res/img/fader_line.png";
    vs.min=0;
	vs.max=100;
	vs.value=data.value;
	vs.tick=1;
	vs.x=(bg.width-line.width)/2;
	vs.y=(bg.height-line.height)*vs.value/100;
    vs.changeHandler=new Laya.Handler(this,onChange);
    sp.addChild(vs);   
    parent.addChild(sp);
    
    function onChange(v) {
        //log("clip value:"+v);
        data.value=v;
        DATA.send(js);
    }
    
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
    var fd = new myFader(sp, Area(), "fader",data);
    
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

function myAll()
{
    var i;
    
    var STAGE       = Laya.Stage;
    var EVENT       = Laya.Event;
    var WEBGL       = Laya.WebGL;
    var BROWSER     = Laya.Browser;
    
    Laya.init(BROWSER.clientWidth, BROWSER.clientHeight, WEBGL);
    Laya.stage.alignV     = STAGE.ALIGN_MIDDLE;
    Laya.stage.alignH     = STAGE.ALIGN_CENTER;
    Laya.stage.scaleMode  = STAGE.SCALE_SHOWALL;
    Laya.stage.screenMode = STAGE.SCREEN_HORIZONTAL;
    
    var st=Laya.stage;
    //var url="ws://192.168.4.1:8191"
    var url="ws://192.168.2.108:8191"
    
    loadRes();
    log(DATA);
    DATA.open(url);
    
    Laya.timer.loop(100, this, paras_chk);
    function paras_chk()
    {
        if(DATA.paras) {
            Laya.timer.clear(this, paras_chk);
            myInit();
        }
    }
    
    function myInit() {
        //this.tt = new myTitle(st,   Area(200,200,600,400), data);
        //this.mn = new myMenu(st,    Area(0,0,0,0), data);
        //this.et = new myEdit(st,    Area(0,0,0,0), data);
        //this.ug = new myUpgrade(st, Area(0,0,0,0), data);
        
        var fd = new myFader(st,new Area(200,200,600,400),"fader", DATA.paras.eq.g);
        log("myInit");
    }
    
}




