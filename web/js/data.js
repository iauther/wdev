var tmp=0;
var MAGIC=0xff338855

tmp=0
var RW={};
RW.READ=tmp++;
RW.WRITE=tmp++;

tmp=0
var IOTYPE={};
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
    
    
    this.parse=function(type,bin,js) {  
        
    }
    
    this.pack=function(type,js,bin) {
        
    }
    
    this.bind=function(obj,evt,fn) {
        
    }
    
    function pkt_hdr() {
        this.magic=MAGIC;
        this.io=IO.UART;
        this.rw=RW.READ;
        this.len=0;
        //this.data=[];
    }
    
})()