
var Size=function(w,h)
{
    var sz={};
    
    sz.w=w;
    sz.h=h;
    
    return sz;
}

var Point=function(x,y)
{
    var po={};
    
    po.x=x;
    po.y=y;
    
    return po;
}

var Area=function(x,y,w,h)
{
    var ar={};
    
    ar.x=x;
    ar.y=y;
    ar.w=w;
    ar.h=h;
    
    return ar;
    
}

/*
   ratio value:
   0 :
   1 :
   <0:
*/
var Ratio=function(rx,ry,rw,rh)
{
    var ra={};
    
    ra.x=rx;
    ra.y=ry;
    ra.w=rw;
    ra.h=rh;
    
    return ra;
    
}

//width height to area
function wh2a(o,w,h)
{
    var x,y,w,h;
    
    x=w*o.ratio.x;
    y=h*o.ratio.y;
    w=w*o.ratio.w;
    h=h*o.ratio.h;
    return Area(x,y,w,h);
}

//width height to ratio
function wh2r(o,w,h)
{
    var x,y,w,h;
    
    x=o.area.x/w;
    y=o.area.y/h;
    w=o.area.w/w;
    h=o.area.h/h;
    return Ratio(x,y,w,h);
}


//ratio to area
function r2a(o,ratio)
{
    var x,y,w,h;
    
    if(!o) {
        return null;
    }
    
    var p=o.parent;
    if(!p) {
        return o.area;
    }
    
    x=pw*obj.ratio.x;
    y=ph*obj.ratio.y;
    w=pw*obj.ratio.w;
    h=ph*obj.ratio.h;
    
    return Area(x,y,w,h);
}

//area to ratio
function a2r(o,area)
{
    var x,y,w,h;
    
    if(!o) {
        return null;
    }
    
    var p=o.parent;
    if(!p) {
        return o.ratio;
    }
    
    x=area.x/p.area.x;
    y=area.y/p.area.y;
    w=area.w/p.area.w;
    h=area.h/p.area.h;
    
    return Ratio(x,y,w,h);
}

var Trig=function(e,fn)
{
    var tr={};
    
    return tr;
}

var Font=function()
{
    var f={};
    
    
    return f;
}

var Style=function()
{
    var st={};
    
    st.font=font;
    st.readonly=false;
    
    return st;
}

function LS(fn,once) {
    var ls={};
    ls.fn=fn;
    ls.once=once||false;

    return ee;
}
var Emitter=function() {
    
    var em={};
    
    em.eles=[];
    em.evts=[];
    em.on=function(e,fn,once) {
        //em.evts[e]=LS(fn,once);
        document.addEventListener(e,fn);
    }
    
    em.off=function(e,fn) {
        document.removeEventListener(e,fn);
    }
}

var View=function()
{
    var vw={};
    
    vw.parent=null;
    vw.ratio=null;
    vw.area=null;
    vw.childs=[];
    vw.enabled=true;
    
    vw.addChild=function(obj) {
        obj.parent=vi;
        vw.childs.push(obj);
    }
    
    vw.rmChild=function(obj) {
        obj.parent=null;
        vw.childs.pop(obj);
    }
    
    vw.enable=function(flag) {
        vw.enabled=flag;
    }
    
    vw.paint=function() {
        for(var i=0;i<vi.childs.length;i++) {
            vi.childs[i].paint();
        }
    }
    
    vw.clear=function() {
        for(var i=0;i<vw.childs.length;i++) {
            vw.childs[i].clear();
        }
    }
    
    vw.resize=function() {
        
        vw.area=ratio_to_area(vi,);
        for(var i=0;i<vw.childs.length;i++) {
            vw.childs[i].resize(w,h);
        }
        
        return Area(x,y,w,h);
    }
    
    return vw;
}

var Text=function(ratio,text,style)
{
    var txt={};
    
    txt.style=style;
    txt.text=text;
    
    txt.paint=function() {
        //ctx.font = "bold 40px '字体','字体','微软雅黑','宋体'";
        //ctx.fillStyle = '#09f955';
        //ctx.strokeStyle = '#980fff';
        //ctx.textBaseline = 'hanging'; top(顶部对齐) hanging（悬挂） middle（中间对齐） bottom（底部对齐） alphabetic(默认值)是
        //ctx.fillText (text, x,y,[maxwidth]);
        //ctx.strokeText (text, x,y,[maxwidth]);
    }
    
    txt.clear=function() {
        
    }
    
    txt.resize=function()
    {
        
    }
    
    return txt;
}

var Image=function()
{
    var img={};
    
    img.paint=function() {
        //context.drawImage(image,x,y);
    }
    
    img.clear=function() {
        
    }
    
    img.resize=function()
    {
        
    }
    
    return img;
}

var Graph=function()
{
    var grp={};
    
    grp.paint=function() {
        //ctx.lineWidth=10;
        //ctx.strokeStyle="blue";
        //ctx.moveTo(0,0);
        //ctx.lineTo(800,600);
        //ctx.stroke();
    }
    
    grp.clear=function() {
        
    }
    
    grp.resize=function()
    {
        
    }
    
    return grp;
}



