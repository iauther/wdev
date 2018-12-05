var tmp=0;
var MAGIC=0xffeebbaa

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
TYPE.HDR=tmp++;
TYPE.GAIN=tmp++;
TYPE.EQ=tmp++;
TYPE.DYN=tmp++;
TYPE.UPG=tmp++;
TYPE.SETUP=tmp++;
TYPE.PARAS=tmp++;
//...

/******数据类型定义 start******/
//hdr:header
var hdr_t={//第1层
    tp:TYPE.HDR,
    st:{
        magic:'u32.1.number',   //魔术字
        pack: 'u32.1.number',    //封包方式(1字节1类型)
        itype:'u32.1.number',   //io类型
        dtype:'u32.1.number',   //data类型
        dlen: 'u32.1.number',
    },
    data:null,
};

var gain_t={
    tp:TYPE.GAIN,
    st:{
        value:   's16.1.num',
    },
    data:null,
};

var eq_t={
    tp:TYPE.EQ,
    st:{
        aa: 'u8.1.number',
        bb: 'u8.1.number',
    },
    data:[
        gain_t,
    ],
};

var setup_t={
    tp:TYPE.SETUP,
    st:{
        lang:'u8.1.num',
        cnt:'u16.1.num',
    },
    data:null
};

var paras_t={
    tp:TYPE.PARAS,
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
    hdr:hdr_t,
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

function isNumber(o)
{
    return ((typeof o) === 'number');
}

function isString(o)
{
    return ((typeof o) === 'string');
}

function isArray(o)
{
    return Array.isArray(o);
}

function isObject(o)
{
    return (!o && (typeof o)==='object');
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
    
    if(!st) {
        log("st not initialized");
        return 0;
    }
    
    for(var i in st) {
        var p=st[i];
        if(isString(p)) {
            len+=get_plen(p);
        }
        else if(isArray(p)) {
            for(var k=0;j<p.length;j++) {
                len+=get_slen(p[j].st);
            }
        }
        else if(isObject(p)) {
            len+=get_slen(p.st);
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

function print_obj(o)
{
    //var nm=(isObject(o))?(o.constructor.name):"";
    for(var i in o) {
        var p=o[i];
        if(isArray(p)) {
            for(var j=0;j<p.length;j++) {
                print_obj(p[j])
            }
        }
        else if(isObject(p)) {
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


function mk_conv(cov,obj,type)
{
    var i,j,p,tp=null;
    
    for(i in obj) {
        p=obj[i];
        if(i === 'tp') {
            tp=p;
        }
        else if(i === 'st') {
            if(!cov[tp]) {
                cov[tp]={};
                cov[tp].st=p;
                cov[tp].sl=get_slen(p);
                cov[tp].tp=tp;
            }
                    
            //bin to js
            cov[tp].b2j=function(bin,type) {
                var b=bin;
                var js={},len=0;
                var st=CONV[type].st;
                
                js.tp=type;
                for(var p in st) {
                    if(isNumber(p)) {
                        js[p]=to_js(st[p],b);
                        b+=get_plen(st[p]);
                    }
                    else if(isString(p)) {
                        //
                    }
                    else if(isArray(p)) {
                        for(i=0;i<p.length;i++) {
                            js[p]=CONV[p.tp].b2j(b,p.tp);
                            var st2=CONV[p.tp].st;
                            b+=get_slen(st2[p.tp]);
                        }
                    }
                    else if(isObject(p)) {
                        js[p]=CONV[p.tp].b2j(b,p.tp);
                        var st2=CONV[p.tp].st;
                        b+=get_slen(st2[p.tp]);
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
                    var p=js[i];
                    if(isNumber(p)) {
                        var b=to_bin(st[p],js[p]);
                        bin.push(b);
                    }
                    else if(isString(p)) {
                        
                    }
                    else if(isArray(p)) {
                        for(var j=0;j<p.length;j++) {
                            if(isObject(p[j])) {
                                var b=cov[p[j].tp].j2b(p[j]);
                                bin.push(b);
                            }
                        }
                    }
                    else if(isObject(p)) {
                        var b=cov[p.tp].j2b(js[p]);
                        bin.push(b);
                    } 
                }
                
                return bin_concat(bin);
            };
        }
        else if(i === 'data') {
            if(isArray(p)) {
                for(var j=0;j<p.length;j++) {
                    mk_conv(cov,p[j],tp);
                }
            }
            else if(isObject(p)) {
                mk_conv(cov,p,tp);
            }
        }
    }
    
    return cov;
}
var CONVS=(function() {
    var cv=[];
    mk_conv(cv,hdr_t);
    //mk_conv(cv,gain_t);
    //mk_conv(cv,vol_t);
    //mk_conv(cv,eq_t);
    //mk_conv(cv,setup_t);
    //mk_conv(cv,paras_t);
    
    //print_obj(cv);
    log(cv);
    
    return cv;
}());


function mk_js(p)
{
    
}

function mk_bin(p)
{
    //var 
}

var DATA=(function() {
    
    this.paras=null;
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
    
    function to_array(v,n)
    {
        var a=[];
        for(var i=0;i<n;i++) {
            a[i]=(v>>(8*i))&0xff;
        }
        
        return a;
    }
    /////////////////////////////////
    function _unpack(bin) {
        return CONVS[TYPE.HDR].b2j(bin,TYPE.HDR);
    }
    function _onmsg(e) {
        var hdr=_unpack(e.data);
        switch(hdr.dtype) {
            case TYPE.GAIN:
            var g=hdr.data;
            log("____gain:"+g.value);
            break;
            
            case TYPE.EQ:
            break;
            
            case TYPE.SETUP:
            break;
            
            case TYPE.PARAS:
            DATA.paras=o.data;
            //ui refresh ?
            break;  
        }
    }
    
    ///////////////////////////////
    function _pack(js) {
        var bin=CONV[js.tp].j2b(js);
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
     *   update_fn:界面更新函数:通知ui刷新
    */
    function _bind(js,update_fn) {
        if(js) {
            //log(" js null!");
            return;
        }
        
        js.update_fn=update_fn;
    }
    
}());











