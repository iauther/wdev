
function Area(x,y,w,h)
{
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
}



function myTitle(area,txt,data)
{
    
}


function myMenu(area,txt,data)
{
    
}


////////////subedit///////////////
function myFader(area,txt,data)
{
    
}
function myEqualizer(area,txt,data)
{
    
}
function myDynamic(area,txt,data)
{
    
}
function myChannel(area,txt,data)
{
    var eq,dyn,fader;
    
    eq    = new myEq();
    dyn   = new myDyn();
    fader = new myFader();
    
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




var scr=(function myScr() {
    var i,data;
    var st=Laya.stage;
    
    this.tt = new myTitle(st,   Area(200,200,600,400), data);
    //this.mn = new myMenu(st,    Area(0,0,0,0), data);
    //this.et = new myEdit(st,    Area(0,0,0,0), data);
    //this.ug = new myUpgrade(st, Area(0,0,0,0), data);
    
})()
