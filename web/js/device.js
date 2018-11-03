
var Device=(function() {
    var _proto=Device.prototype;
    
    _proto.bt=function() {
        var __proto=_proto.i2c.prototype;
    }
    
    _proto.i2c=function(speed) {
        var __proto=_proto.i2c.prototype;
    }
    
    _proto.i2s=function(n,hl) {
        var __proto=_proto.i2s.prototype;
    }
    
    _proto.spi=function(mode,speed) {
        var __proto=_proto.spi.prototype;
    }
    
    _proto.usb=function() {
        var __proto=_proto.usb.prototype;
    }
    
    _proto.gpio=function(n,hl) {
        var __proto=_proto.gpio.prototype;
        
        __proto.config=function(n,io) {
            
        }
        
        __proto.set_level=function(n,hl) {
            
        }
        
        __proto.get_level=function(n) {
            
        }
    }
    
    _proto.uart=function(rate) {
        var __proto=_proto.gpio.prototype;
        
        __proto.config=function(n,rate) {
            
        }
        
        __proto.write=function(n,da) {
            
        }
        
        __proto.write=function(n,rate) {
            
        }
        
        
    }
    
    _proto.eth=function() {
        var __proto=_proto.gpio.prototype;
    }
    
    _proto.wifi=function(url,port) {
        var __proto=_proto.inet.prototype;        
        
        __proto.connect=function() {
            
        }
    }
    
    _proto.ws=function(url,port) {
        var __proto=_proto.ws.prototype;
        
    
    }
    
})()







