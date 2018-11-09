var tmp=0;
var MAGIC=0xff338855
console.log("ggggggggggggg");
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

console.log("88888888888888888");
function myData() {
    
    
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
    
    var url="192.168.2.202:8899";
    
    var ws=new WebSocket(url);
    
    
    setInterval(send,1000);
    
/*   
    port:'u8.1',
    type:'u8.1',
    flag:'u8.1',
    len :'u32.1',
*/
console.log("9999999999999999999999");
    var js=clone(CONV[TYPE.TEST].js);
    function send() {
        js.port=9;
        js.type=8;
        js.flag=11;
        js.len=234;
        
        var bin=CONV[TYPE.TEST].j2b(js);
        
        ws.send(bin);
        console.log("ws send test");
    }
    
    
    
}