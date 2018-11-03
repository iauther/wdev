var tmp=0;
var MAGIC=0xff338855

var RW={tmp=0};
RW.READ=tmp++;
RW.WRITE=tmp++;

var IOTYPE={tmp=0};
IOTYPE.BT=1<<tmp++;
IOTYPE.I2C=1<<tmp++;
IOTYPE.I2S=1<<tmp++;
IOTYPE.SPI=1<<tmp++;
IOTYPE.USB=1<<tmp++;
IOTYPE.GPIO=1<<tmp++;
IOTYPE.UART=1<<tmp++;
IOTYPE.ETH=1<<tmp++;
IOTYPE.WIFI=1<<tmp++;

/*
    typedef struct {
        u32 magic;
        u8  iotype;
        u32 len;
        u8  data[];
    }packet_t;
*/



var Data=(function() {
    var _proto=Data.prototype;
    
    _proto.parse=function(type,bin,js) {
        
        swtich() {
            
        }
        
    }
    
    _proto.pack=function(type,js,bin) {
        swtich() {
            
        }
    }
    
    _proto.bind=function(obj,evt,fn) {
        
    }
    
    function pkt_hdr() {
        this.magic=MAGIC;
        this.io=IO.UART;
        this.rw=RW.READ;
        this.len=0;
        this.data=[];
    }
    
})()