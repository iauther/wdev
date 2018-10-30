
var Widget=(function() {
    var _proto=Widget.prototype;
    
    var STAGE       = Laya.Stage;
    var EVENT       = Laya.Event;
    var WEBGL       = Laya.WebGL;
    var BROWSER     = Laya.Browser;
    
    var Stage       = Laya.stage;
	var Handler     = Laya.Handler;
	var Utils       = Laya.Utils;
	
	var Box         = Laya.Box;
	var Text        = Laya.Text;
	var List        = Laya.List;
    var Clip        = Laya.Clip;
    var Label       = Laya.Label;
    var Sprite      = Laya.Sprite;
    var Image       = Laya.Image;
    var Panel       = Laya.Panel;
    var Label       = Laya.Label;
    var Button      = Laya.Button;
    var Dialog      = Laya.Dialog;
    var ComboBox    = Laya.ComboBox;
    var CheckBox    = Laya.CheckBox;
    
    var ColorPicker = Laya.ColorPicker;
    var ProgressBar = Laya.ProgressBar;
    var TextInput   = Laya.TextInput;
    var HScrollBar  = Laya.HScrollBar;
	var VScrollBar  = Laya.VScrollBar;
    var TextArea    = Laya.TextArea;
    var RadioGroup  = Laya.RadioGroup;
	//LayaRender
    
    
    
    //sp = new Sprite();
    //Stage.addChild(sp);
    //sp.graphics.drawLine
    //sp.scale(scaleValue, scaleValue);
    //Stage.addChild(sp);
	//sp.pivot(55, 72);
	//sp.size();
    
    Laya.init(BROWSER.clientWidth, BROWSER.clientHeight, WEBGL);
    Stage.alignV = STAGE.ALIGN_MIDDLE;
    Stage.alignH = STAGE.ALIGN_CENTER;
	Stage.scaleMode = STAGE.SCALE_SHOWALL;
	Stage.screenMode = STAGE.SCREEN_HORIZONTAL;//STAGE.SCREEN_VERTICAL;
	Stage.bgColor = "#232628";
    
    _proto.Line=function() {
        
    }
    
    _proto.Rect=function() {
        
    }
    
    _proto.Circle=function() {
        
    }
    
    _proto.Ring=function() {
        
    }

    _proto.Tips=function() {
        
    }

    _proto.Progress=function() {
        
    }

    _proto.ListBox=function() {
        
    }
    
    _proto.Tree=function() {
        
    }
    
    _proto.Scroller=function() {
        
    }
    
    _proto.CheckBox=function() {
        
    }
    
    _proto.ComboBox=function() {
        
    }
    
    _proto.Menu=function() {
        
    }
    
    _proto.Table=function() {
        
    }

    _proto.Button=function() {
        
    }

    _proto.Select=function() {
        
    }

    _proto.MultiSelect=function() {
        
    }

    _proto.Slider=function () {
        
    }

    _proto.Text=function() {
        
    }

    _proto.Label=function() {
        
    }

    _proto.TextArea=function() {
        
    }

    _proto.Dialog=function() {
        
    }
    
    _proto.Window=function() {
        
    }
    
    //Stage.addChild(btn);
})()





















