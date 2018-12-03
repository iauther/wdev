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
var PKT=[];
///////////////
PKT.FIX=tmp++;
PKT.HDR=tmp++;
PKT.EQ=tmp++;
PKT.DYN=tmp++;
PKT.VOL=tmp++;
PKT.UPG=tmp++;
PKT.SETUP=tmp++;
PKT.PARAS=tmp++;
//...

var fix_t={//固定头
    tp:PKT.FIX,
    st:{
        magic:  'u32.1.number',   //魔术字
        pack:   'u8.4.number',    //封包方式(1字节1类型)
        iotype: 'u8.1.number',    //io类型
        datype: 'u8.1.number',    //后面数据的类型
    }
};


/******数据类型定义 start******/
//hdr:header
var hdr_t={//第1层
    /*
        typedef struct {
            u8  datype;
            u32 len;
            u8  data[];
        }packet_t;
    */
    tp:PKT.HDR,
    st:{
        datype:'u8.1.num',
        len:   'u8.1.num',
    },
    data:null,
};

var gain_t={
    tp:PKT.VOL,
    st:{
        value:   'u8.1.num',
    },
    data:null,
};

var vol_t={
    tp:PKT.VOL,
    st:{
        port:'u8.1.number',
        type:'u8.1.number',
        flag:'u8.1.number',
    },
    data:gain_t,
};

var eq_t={
    tp:PKT.EQ,
    st:{
        aa: 'u8.1.number',
        bb: 'u8.1.number',
        cc: 'u8.1.number',
        len:'u32.1.number',
    },
    data:[
        //gain_t,
    ],
};

var setup_t={
    tp:PKT.SETUP,
    st:{
        cnt:'u16.1.num',
    },
    data:null
};

var paras_t={
    tp:PKT.PARAS,
    st:{
        ver:'u8.1.num',    //port:'u8.1.str'
        data:[
            eq_t,
            setup_t,
            //...
        ],
    },
};
/******数据类型定义 end******/

/******数据包格式定义 start******/
var PACKET={
    fix:fix_t,
    data:[
        vol_t,
        eq_t,
        setup_t,
        paras_t,
    ],
};
/******数据包格式定义 end******/

function log(s)
{
    console.log(s);
}


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
    xhr.timeout=function() {log("get"+url+"timeout");};
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

//prop:propty
function get_plen(prop)
{
    var s=prop.split('.');
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
function get_fx(pp,bin)
{
    var fx={},set,get,tl,dv;
    var s=pp.split('.');
    var l=parseInt(s[1]);
    
    switch(s[0]) {
        case's8':
        {
            tl=1*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getInt8;
            set=dv.setInt8;
        }
        break;
        
        case'u8':
        {
            tl=1*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getUint8;
            set=dv.setUint8;
        }
        break;
        
        case's16':
        {
            tl=2*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getInt16;
            set=dv.setInt16;
        }
        break;
        
        case'u16':
        {
            tl=2*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getUint16;
            set=dv.setUint16;
        }
        break;
        
        case's32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getInt32;
            set=dv.setInt32;
        }
        break;
        
        case'u32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getUint32;
            set=dv.setUint32;
        }
        break;
        
        case's64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getInt64;
            set=dv.getInt64;
        }
        break;
        
        case'u64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getUint64;
            set=dv.setUint64;
        }
        break;
        
        case'f32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getFloat32;
            set=dv.setFloat32;
        }
        break;
        
        case'f64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            get=dv.getFloat64;
            set=dv.setFloat64;
        }
        break;

        default:
        return null;
    }
    
    fx.b=b;
    fx.tl=tl;
    fx.dv=dv;
    fx.get=get;
    fx.set=set;
    
    return fx;
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

function to_bin(prop,js)
{
    var fx=get_fx(prop);
    fx.set(0,js,true);
    
    return fx.b;
}

function to_js(prop,bin)
{
    var js={};
    var fx=get_fx(prop,bin);
    
    return fx.get(0,true);
}


function bin_concat(bs,l)
{
    if(!bs || bs.length<=0) {
        return null;
    }
    
    var b=new ArrayBuffer(l);
    for(var i=0,pos=0;i<bs.length;i++) {
        if(! bs[i] instanceof ArrayBuffer) {
            continue;
        }
        
        b.set(b+pos,b[i].byteLength);
        pos += b[i].byteLength;
    }
    
    return b;
}

function print_obj(obj)
{
    for(var i in obj) {
        var p=obj[i];
        log("print:"+p);
        if(p instanceof Array) {
            for(var j=0;j<p.length;j++) {
                print_obj(p)
            }
        }
        else if(p instanceof Object) {
            print_obj(p);
        }
        else {
            log(i+':'+p);
        }
    }
}

//////////////////////////////////////////////////////////
tmp=0;
var WS={};
WS.OPEN=tmp++;
WS.MESG=tmp++;
WS.CLOSE=tmp++;
WS.ERROR=tmp++;

function mk_level(js)
{
    var lv=[];
    while(js.parent!=null) {
        lv.push(js.tp);
    }
    lv.push(TYPE.HDR);
    
    return lv;
}

function mk_paras(bin)
{
    
}


function mk_conv(cov,obj)
{
    for(var i in obj) {
        var p=obj[i];
        log(i+":"+p);
        if(p instanceof String) {
            var tp=obj.tp;
            
            if(cov[tp]) {
                log("warnning! cov["+tp+"] is already exist, skip it");
                continue;
            }
            
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
                var b=bin;
                var js={},len=0;
                var st=CONV[type].st;
                for(var p in st) {
                    if(p instanceof Object) {
                        js[p]=CONV[p.tp].b2j(b,p.tp);
                        var st2=CONV[p.tp].st;
                        b += get_slen(st2[p.tp]);
                    }
                    else if(p instanceof Array) {
                        for(i=0;i<p.length;i++) {
                            js[p]=CONV[p.tp].b2j(b,p.tp);
                            var st2=CONV[p.tp].st;
                            b += get_slen(st2[p.tp]);
                        }
                    }
                    else if(p instanceof Number) {
                        js[p]=to_js(st[p],b);
                        b += get_plen(st[p]);
                    }
                    else if(p instanceof String) {
                        //
                    }
                }
                
                return js;
            };
            
            //js to bin
            cov[tp].j2b=function(js) {
                
                var bin=[];
                var st=CONV[js.tp].st;
                var sl=CONV[js.tp].sl;
                
                for(var i in js) {
                    var k=js[i];
                    if(k instanceof Number) {
                        var b=to_bin(st[k],js[k]);
                        bin.push(b);
                    }
                    else if(k instanceof Object) {
                        var b=cov[k.type].j2b(js[k]);
                        bin.push(b);
                    }
                    else if(k instanceof Array) {
                        for(var j=0;j<k.length;j++) {
                            if(p[j] instanceof Object) {
                                var b=cov[p[j].type].j2b(p[j]);
                                bin.push(b);
                            }
                        }
                    }
                    else if(p instanceof String) {
                        
                    }
                }
                
                return bin_concat(m);
            };
        }
        else if(p instanceof Array) {
            for(var k=0;k<p.length;k++) {
                mk_conv(cov,p[k]);
            }
        }
        else if(p instanceof Object) {
            mk_conv(cov,p);
        }
    }
    
    return cov;
}
var CONVS=(function() {
    var conv=[];
    
    log("bbbb");
    mk_conv(conv,hdr_t);
    //mk_conv(conv,gain_t);
    //mk_conv(conv,vol_t);
    //mk_conv(conv,eq_t);
    //mk_conv(conv,setup_t);
    //mk_conv(conv,paras_t);
    
    //log("aaaa:"+conv);
    print_obj(conv);
    
    return conv;
}());


function mk_js(p)
{
    
}

function mk_bin(p)
{
    //var 
}

var DATA=(function() {
    
    this.js=mk_js(paras_t);
    this.bin=mk_bin(paras_t);
    /////////////////////
    
    this.fn=[];
    this.open=_open;
    this.send=_send;
    this.bind=_bind;
    this.onevt=_onevt;
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
    
    
    
    //var url="ws://192.168.2.202:8899";
    //var ws=new WebSocket(url);
    //setInterval(send, 1000);
    
    function send() {
        ws.send("___ ws test!");
        log("__send");
    }
    
}());











