/*
 *  written by guohui, all right be reserved. 
 *  chengdu/sichuan/china. iauther@163.com
 *  2018/11/3 16:08:28
*/
function object(o)
{
    function F(){};
    F.prototype=o;
    return new F();
}
function inherit(sup,sub)
{
    var p=object(sup.prototype); //创建父类原型的一个副本 等同于使用Object.create(superType.prototype)
    p.constructor=sub;            //为副本添加constructor属性,弥补重写原型而失去的constructor属性
    sub.prototype=p;              //将创建的对象(副本)赋值给子类的原型
}

function Pot(x,y)
{
   this.x = x;
   this.y = y; 
}

function Area(x,y,w,h)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function tStyle(font,size,width,color,bold)
{
    this.font = font;
    this.size = size;
    this.color = color;
    this.width = width;
    this.bold = bold;
}




var Widget=(function() {
    var _proto=Widget.prototype;
    
    _proto.Line=function(pot1,pot2,linecolor,linewidth) {
        var sp=new Sprite();
        
        sp.graphics.drawLine(pot1.x, pot1.y, pot2.x, pot2.y, linecolor, linewidth);
        parent.addChild(sp);
        
        return sp; 
    }
    
    _proto.Rect=function(parent,area,linecolor,fillcolor,linewidth,roundradius) {
        var sp=new Sprite();
        
        sp.graphics.drawLine(pot1.x, pot1.y, pot2.x, pot2.y, linecolor, linewidth);
        parent.addChild(sp);
        
        return sp;
    }
    
    _proto.Circle=function(pot,radius,fillcolor,linecolor,linewidth) {
        var sp=new Sprite();
        
        sp.graphics.drawCircle(pot.x,pot.y,radius,fillcolor,linecolor,linewidth);
        parent.addChild(sp);
        
        return sp;
    }

    _proto.Tips=function() {
        var sp=new Sprite();
    }

    _proto.Progress=function(parent,area,skin) {
        var sp=new Sprite();
        
        var pb=new ProgressBar(skin);
        
		pb.x = area.x;
		pb.y = area.y;
		pb.width = area.w;

		//pb.sizeGrid = "5,5,5,5";
		//pb.changeHandler = new Handler(this, onChange);
		//inherit(sup, sub);
		
		//this.on
    }   
    
    _proto.ListBox=function() {
        var sp=new Sprite();
    }
    
    _proto.Dialog=function() {
        var sp=new Sprite();
    }
    
    _proto.CheckBox=function() {
        var sp=new Sprite();
    }
    
    _proto.ComboBox=function() {
        var sp=new Sprite();
    }
    
    _proto.Tree=function() {
        var sp=new Sprite();
    }
    
    _proto.ScrollBar=function() {
        var sp=new Sprite();
    }
    
    _proto.Button=function(parent,area,txt,skin) {
        var sp=new Sprite();        
        
        parent.addChild(sp);
        return sp;
    }

    _proto.Selecter=function(parent,area,sel,multi) {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }

    _proto.Slider=function (parent,area,min,max,val,tik,skin,fn) {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }

    _proto.Label=function(parent,area,txt,tStyle) {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }

    _proto.TextArea=function(parent,area,txt,skin,tStyle) {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }
    
    _proto.Menu=function() {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }
    
    _proto.Table=function() {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }
    
    _proto.Window=function() {
        var sp=new Sprite();
        
        parent.addChild(sp);
        return sp;
    }
    
})()





















