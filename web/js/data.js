var tmp=0;
var MAGIC=0xff338855

tmp=0;
var RW={};
RW.READ=tmp++;
RW.WRITE=tmp++;

tmp=0;
var IO={};
IO.BT=1<<tmp++;
IO.I2C=1<<tmp++;
IO.I2S=1<<tmp++;
IO.SPI=1<<tmp++;
IO.USB=1<<tmp++;
IO.GPIO=1<<tmp++;
IO.UART=1<<tmp++;
IO.ETH=1<<tmp++;
IO.WIFI=1<<tmp++;

/////////////////////////////////////
tmp=0;
var TYPE=[];
TYPE.XHDR=tmp++;
///////////////
TYPE.EQ=tmp++;
TYPE.DYN=tmp++;
TYPE.VOL=tmp++;
TYPE.UPG=tmp++;
TYPE.SETUP=tmp++;
///////////////
TYPE.XXX=tmp++;
//////////////

var DEF={//��1��֡ͷ����
    /*
            typedef struct {
                u32 magic;
                u8  iotype;
                u32 len;
                u8  data[];
            }packet_t;
    */
    tp:TYPE.XHDR,
    st:{
        magic:'u8.1.num',    //port:'u8.1.str'
        io:   'u8.1.num',
        len:  'u8.1.num',
        data:[//��2��֡ͷ����
            {
                tp:TYPE.EQ,
                st:{
                    aa: 'u8.1.num',
                    bb: 'u8.1.num',
                    cc: 'u8.1.num',
                    len:'u32.1.num',
                },
                data:[//��3��֡ͷ����
                    {
                        tp:TYPE.XXX,
                        st:{
                            gg:'s8.10.str',
                        },
                        data:null;
                    },
                ],
            },
            
            {
                tp:TYPE.VOL,
                st:{
                    port:   'u8.1.num',
                    type:   'u8.1.num',
                    flag:   'u8.1.num',
                    len :   'u32.1.num',
                },
                data:null,
            },
            
            //...
        ],
    },
};

function to_bin(str){
    var bin = [];
    var list = str.split("");
    for(var i=0;i<list.length;i++){
        if(i != 0){
            bin.push(" ");
        }
        var item = list[i];
        var bs = item.charCodeAt().toString(2);
        bin.push(bs);
    }
    
    return bin.join("");
}

function get_cnt(obj){
    var tp = typeof obj;
    if(tp == "string"){
        return obj.length;
    }else if(tp == "object"){
        var cnt=0;
        for(var i in obj){
            cnt++;
        }
        return cnt;
    }
    
    return 0;
}

//get type len
function get_tlen(tp)
{
    switch(tp) {
          case's8': return 1;
          case'u8': return 1;
          case's16':return 2;
          case'u16':return 2;
          case's32':return 4;
          case'u32':return 4;
          case's64':return 8;
          case'u64':return 8;
          case'f32':return 4;
          case'f64':return 8;
          
          default:
          return -1;
    }
}

//a:propty
function get_plen(p)
{
    var s=p.split('.');
    var l=parseInt(s[1]);
    switch(s[0]) {
          case's8':
          case'u8': return 1*l;
          
          case's16':
          case'u16':return 2*l;
          
          case's32':
          case'u32':
          case'f32':return 4*l;
          
          case's64':
          case'u64':
          case'f64':return 8*l;
          
          default:
          return 0;
    }
}

function get_fn(rw,bin,attr)
{
    var fn;
    var s=attr.split('.');
    switch(s[0]) {
          case's8' :fn=(rw=='r')?bin.getInt8:   bin.setInt8;   break;
          case'u8' :fn=(rw=='r')?bin.getUint8:  bin.setUint8;  break;
          case's16':fn=(rw=='r')?bin.getInt16:  bin.setInt16;  break;
          case'u16':fn=(rw=='r')?bin.getUint16: bin.setUint16; break;
          case's32':fn=(rw=='r')?bin.getInt32:  bin.setInt32;  break;
          case'u32':fn=(rw=='r')?bin.getUint32: bin.setUint32; break;
          case's64':fn=(rw=='r')?bin.getInt64:  bin.setInt64;  break;
          case'u64':fn=(rw=='r')?bin.getUint64: bin.setUint64; break;
          case'f32':fn=(rw=='r')?bin.getFloat32:bin.setFloat32;break;
          case'f64':fn=(rw=='r')?bin.getFloat64:bin.setFloat64;break;
          
          default:
          return null;
    }
    
    return fn;
}

function get_slen(s)
{
    var len=0;
    for(var p in s) {
        len+=get_plen(s[p]);
    }
    
    return len;
}

function bin_rw(rw,bin,offset,attr)
{
    var o={};
    var dv,fn;
    dv=new DataView(bin,offset);
    fn=get_fn(rw,dv,attr);
    o.v=fn(0,true);
    o.l=get_alen(attr);

    return o;
}

function print_obj(obj)
{
    for(var i in obj) {
        var pp=obj[i];
        if(pp instaceof Array) {
            if(pp.length>0) {
                print_obj(pp)
            }
        }
        else {
            console.log(i+':'+pp);
        }
    }
}

function do_recu(obj)
{
    var cov=[],i=0;
    for(pp in obj) {
        if(pp instaceof Array) {
            if(pp.length>0) {
                do_recu(conv,pp);
            }
        }
        else {
            var tp=obj.tp;
            var st=obj.st;
            var sl=get_slen(st);
            
            cov[tp]={};
            
            //init attr
            cov[tp].js={};
            //conv[j].sl=sl;        //struct length
            for(var o in st) {
                cov[tp].js[o]=null;
            }
            
            //bin to js
            cov[tp].b2j=function(bin) {
                var js={},len=0;
                for(var p in st) {
                    var o=bin_rw('r',bin,len,st[p]);
                    js[p]=o.v;
                    len+=o.l;
                }
                
                return js;
            };
            
            //js to bin
            cov[tp].j2b=function(js) {
                
                var len=0;
                var bin=new ArrayBuffer(slen);
                for(var p in js) {
                    var o=bin_rw('w',bin,len,st[p]);
                    len+=o.l;
                }
                
                return bin;
            };
        }
    }
    
    return cov;
}

///////////////////////////////////
var CONV=(function(def) {
    var cnt=0;
    var conv=[];

    var conv=do_recu(conv,def[i]);
    for(var i=0; i<conv.length; i++) {
        print_obj(conv[i]);
    }
        
    return conv;
})(DEF)


//////////////////////////////////////////////////////////
tmp=0;
var WS={};
WS.OPEN=tmp++;
WS.MESG=tmp++;
WS.CLOSE=tmp++;
WS.ERROR=tmp++;

var Data=(function() {
    
    
    this.JS={};
    this.BIN=[];
    /////////////////////
    
    this.fn=[];
    this.open=function(url) {
        this._ws=new WebSocket(url);
    }
    
    this.close=_close;
    
    this.send=_send;
    
    this.setfn=function(e,fn) {
        this.fn[e]=fn;
    }
    
    function _open=function(url) {
        this._ws=new WebSocket(url);
    }
    
    function _onmsg=function(e) {
        _unpack();
    }
    
    function _send=function(tp,js) {
        var bin=CONV[tp].j2b(js);
        this._ws.send(bin);
    }
    
    function _close=function() {
        this._ws.close();
    }
    
    function _pack=function(js) {
        var js=CONV[tp].b2j(e.data);
        this.fn[tp]();
    }
    
    function _unpack=function(bin) {
        for(var i; i<CONV.length; i++) {
            var obj=CONV[i];
            
            CONV[i].b2j(e.data);
        }
        var js=CONV[tp].b2j(e.data);
        this.fn[tp]();
    }
    
    var url="192.168.2.202:8899";
    
    var ws=new WebSocket(url);
    setInterval(send,1000);
    
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
    
}());