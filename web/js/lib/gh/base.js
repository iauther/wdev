
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
    var vi={};
    
    vi.parent=null;
    vi.ratio=null;
    vi.area=null;
    vi.childs=[];
    vi.enabled=true;
    
    vi.addChild=function(obj) {
        obj.parent=vi;
        vi.childs.push(obj);
    }
    
    vi.rmChild=function(obj) {
        obj.parent=null;
        vi.childs.pop(obj);
    }
    
    vi.enable=function(flag) {
        vi.enabled=flag;
    }
    
    vi.clear=function() {
        for(var i=0;i<vi.childs.length;i++) {
            vi.childs[i].clear();
        }
    }
    
    vi.resize=function() {
        
        vi.area=ratio_to_area(vi,);
        for(var i=0;i<vi.childs.length;i++) {
            vi.childs[i].resize(w,h);
        }

        
        return Area(x,y,w,h);
    }
    
    vi.paint=function() {
        for(var i=0;i<vi.childs.length;i++) {
            vi.childs[i].paint();
        }
    }
    
    return vi;
}

var Text=function(ratio,text,style)
{
    var tx={};
    
    View.call(tx);
    
    tx.style=style;
    tx.text=text;
    
    tx.paint=function() {
        
    }
    
    tx.resize=function()
    {
        tx
    }
    
    tx.clear=function() {
        
    }
    
    return tx;
}

var Image=function()
{
    var im={};
    
    View.call(im);
    
    return im;
}

var Graph=function()
{
    var gr={};
    View.call(gr);
    
    return gr;
}



