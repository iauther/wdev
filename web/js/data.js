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
///////////////
TYPE.FIX=tmp++;
TYPE.HDR=tmp++;
TYPE.EQ=tmp++;
TYPE.DYN=tmp++;
TYPE.VOL=tmp++;
TYPE.UPG=tmp++;
TYPE.SETUP=tmp++;
TYPE.PARAS=tmp++;
//...

var fix_t={//固定头
    tp:TYPE.FIX,
    st:{
        magic:   'u32.1.num',   //魔术字
        pack:    'u8.4.num',    //封包方式
    }
};


/******数据类型定义 start******/
//hdr:header
var hdr0_t={//第1层
    /*
            typedef struct {
                u32 magic;
                u8  iotype;
                u8  subtype;
                u32 len;
                u8  data[];
            }packet_t;
    */
    tp:TYPE.HDR,
    ptp:null,
    st:{
        iotype:  'u8.1.num',
        subtype: 'u8.1.num',
        len:     'u8.1.num',
    },
    data:null,
};

var gain_t={
    tp:TYPE.VOL,
    st:{
        value:   'u8.1.num',
    },
    data:null,
};

var vol_t={
    tp:TYPE.VOL,
    st:{
        port:   'u8.1.num',
        type:   'u8.1.num',
        flag:   'u8.1.num',
    },
    data:tp_gain,
};

var eq_t={
    tp:TYPE.EQ,
    st:{
        aa: 'u8.1.num',
        bb: 'u8.1.num',
        cc: 'u8.1.num',
        len:'u32.1.num',
    },
    data:[
        tp_gain,
    ],
};

var setup_t={
    tp:TYPE.SETUP,
    st:{
        cnt:'u16.1.num',
    },
    data:null
};

var paras_t={
    tp:TYPE.PARAS,
    st:{
        ver:'u8.1.num',    //port:'u8.1.str'
        data:[//第2层帧头定义
            vol_t,
            eq_t,
            setup_t,
            //...
        ],
    },
};
/******数据类型定义 end******/

/******数据包格式定义 start******/
var PACKET={
    hdr:tp_hdr,
    data:[
        tp_gain,
        tp_vol,
        tp_eq,
        tp_setup,
        tp_paras,
    ],
};
/******数据包格式定义 end******/

function bin_copy(bin)  {
    var dst = new ArrayBuffer(bin.byteLength);
    new Uint8Array(dst).set(new Uint8Array(bin));
    return dst;
}


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


function get_json(url)
{
    var o;
    var xhr=new XMLHttpRequest();
    xhr.open('GET',url,false);
    xhr.timeout=function() {console.log("get"+url+"timeout");};
    xhr.send(null);
    return JSON.parse(xhr.responseText);
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

//p:propty
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


//暂未实现字符串,已预留作后续处理
function get_fn(rw,bin,prop)
{
    var fn;
    var s=prop.split('.');
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

function get_slen(st)
{
    var len=0;
    for(var i in st) {
        var pp=st[i];
        if(pp instanceof String) {
            len+=get_plen(pp);
        }
        else if(pp instanceof Array) {
            for(var k=0;k<pp.length;k++) {
                if(!pp[i].st) {
                    //log("error, "+v.name+" not initialized");
                    return 0;
                }
                len+=get_slen(pp[i].st);
            }
        }
        else if(pp instanceof Object) {
            if(!pp.st) {
                //log("error, "+v.name+" not initialized");
                return 0;
            }
            len+=get_slen(pp.st);
        }
        
    }
    
    return len;
}

function bin_rw(rw,bin,offset,prop)
{
    var o={};
    var dv,fn;
    dv=new DataView(bin,offset);
    fn=get_fn(rw,dv,prop);
    o.v=fn(0,true);
    o.l=get_alen(prop);

    return o;
}

function bin_join(b1,b2)
{
    if(!b1 && !b2) {
        return null;
    }
    
    if(b1 && !b2) {
        return b1;
    }
    
    if(b2 && !b1) {
        return b2;
    }
    
    var b=new ArrayBuffer(b1.byteLength+b2.byteLength);
    b.set(b1,b1.byteLength);
    b.set(b2,b1.byteLength);
    return b;
}

function print_obj(obj)
{
    for(var i in obj) {
        var pp=obj[i];
        if(pp instanceof Array) {
            if(pp.length>0) {
                print_obj(pp)
            }
        }
        else {
            console.log(i+':'+pp);
        }
    }
}

function mk_conv(cov,obj)
{
    for(var i in obj) {
        var pp=obj[i];
        if(pp instanceof String) {
            var tp=obj.tp;
            
            cov[tp]={};
            cov[tp].js={};
            
            //init attr
            cov[tp].st=obj.st;
            cov[tp].sl=get_slen(obj.st);        //struct length
            
            for(var o in obj.st) {
                cov[tp].js[o]=null;
            }
            cov[tp].js.type=tp;
            
            //bin to js
            cov[tp].b2j=function(bin,type) {
                var js={},len=0;
                var st=CONV[type].st;
                for(var p in st) {
                    if(p instanceof Object) {
                        js[p]=CONV[p.tp].st;
                    }
                    else if(p instanceof Array) {
                        
                    }
                    else if(p instanceof Number) {
                        var o=bin_rw('r',bin,len,st[p]);
                        js[p]=o.v;
                        len+=o.l;
                    }
                    else if(p instanceof String) {
                        
                    }
                }
                
                return js;
            };
            
            //js to bin
            cov[tp].j2b=function(js) {
                
                var b1,b2,len=0;
                var st=CONV[type].st;
                var sl=CONV[type].sl;
                
                b1=new ArrayBuffer(slen);
                for(var p in js) {
                    if(p instanceof Object) {
                        b2=cov[p.type].j2b(js[p]);
                    }
                    else if(p instanceof Array) {
                        
                    }
                    else if(p instanceof Number) {
                        var o=bin_rw('w',bin,len,st[p]);
                        len+=o.l;
                    }
                    else if(p instanceof String) {
                        
                    }
                }
                
                return bin_join(b1,b2);
            };
        }
        else if(pp instanceof Array) {
            if(pp.length>0) {
                for(var k=0;k<pp.length;k++) {
                    mk_conv(cov,pp[k]);
                }
            }
        }
        else if(pp instanceof Object) {
            mk_conv(cov,pp);
        }
    }
    
    return conv;
}

//////////////////////////////////////////////////////////
tmp=0;
var WS={};
WS.OPEN=tmp++;
WS.MESG=tmp++;
WS.CLOSE=tmp++;
WS.ERROR=tmp++;

var CONVS=(function() {
    var conv=[];
    
    mk_conv(conv,tp_hdr);
    mk_conv(conv,tp_gain);
    mk_conv(conv,tp_vol);
    mk_conv(conv,tp_eq);
    mk_conv(conv,tp_setup);
    
    return conv;
}());

function mk_js(desc)
{
    
}

function mk_bin(desc)
{
    //var 
}

var DATA=(function() {
    
    this.js=mk_js(tp_all);
    this.bin=mk_bin(tp_all);
    /////////////////////
    
    this.fn=[];
    this.open=_open;
    this.send=_send;
    this.bind=_bind;
    this.onevt=onevt;
    this.close=_close;
    
    function _onevt(e,fn) {
        this.fn[e]=fn;
    }
    
    function _open(url) {
        this._ws=new WebSocket(url);
    }
    
    /////////////////////////////////
    function _unpack(bin) {
        CONVS[TYPE.HDR].b2j();
        for(var i; i<CONV.length; i++) {
            var obj=CONV[i];
            
            CONV[i].b2j(e.data);
        }
        var js=CONV[tp].b2j(e.data);
        //this.fn[tp]();    //通知界面刷新
    }
    function _onmsg(e) {
        _unpack(e.data);
    }
    
    ///////////////////////////////
    function _pack(js) {
        var bin=CONV[js.tp].b2j(e.data);
        return bin;
    }
    function _send(js) {
        var bin=_pack(js);
        this._ws.send(bin);
    }
    
    function _close() {
        this._ws.close();
    }
    
    /*
     *   recv_fn:收到二进制数据并转成js后需要调用
                 的函数,比如设置界面刷新标记
     *   send_fn:修改了js需要调用的函数,比如发送数据
    */
    function _bind(js,recv_fn,send_fn) {
        if(js) {
            //log(" js null!");
            return;
        }
        
        js.recv_fn=recv_fn;
        js.send_fn=send_fn;
    }
    
    
    
    var url="ws://192.168.2.202:8899";
    var ws=new WebSocket(url);
    
    setInterval(send, 1000);
    
    function send() {
        ws.send("___ ws test!");
        console.log("__send");
    }
    
}());











