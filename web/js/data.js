var tmp=0;
var MAGIC=0xffeebbaa

tmp=0;
var RW={};
RW.READ=tmp++;
RW.WRITE=tmp++;

tmp=0;
var IO={};
IO.BT=(1<<tmp++);
IO.I2C=(1<<tmp++);
IO.I2S=(1<<tmp++);
IO.SPI=(1<<tmp++);
IO.USB=(1<<tmp++);
IO.GPIO=(1<<tmp++);
IO.UART=(1<<tmp++);
IO.ETH=(1<<tmp++);
IO.WIFI=(1<<tmp++);


/////////////////////////////////////
var BASE=[];
BASE['s8' ]={nm:'s8', tp:Int8Array,   sz:1,get:'getInt8',   set:'setInt8'   };
BASE['u8' ]={nm:'u8', tp:Uint8Array,  sz:1,get:'getUint8',  set:'setUint8'  };
BASE['s16']={nm:'s16',tp:Int16Array,  sz:2,get:'getInt16',  set:'setInt16'  };
BASE['u16']={nm:'u16',tp:Uint16Array, sz:2,get:'getUint16', set:'setUint16' };
BASE['s32']={nm:'s32',tp:Int32Array,  sz:4,get:'getInt32',  set:'setInt32'  };
BASE['u32']={nm:'u32',tp:Uint32Array, sz:4,get:'getUint32', set:'setUint32' };
BASE['f32']={nm:'f32',tp:Float32Array,sz:4,get:'getFloat32',set:'setFloat32'};
BASE['f64']={nm:'f64',tp:Float64Array,sz:8,get:'getFloat64',set:'setFloat64'};


/////////////////////////////////////
tmp=0;
var TYPE=[];
///////////////
TYPE.PACK=tmp++;
TYPE.HDR=tmp++;
TYPE.GAIN=tmp++;
TYPE.EQ=tmp++;
TYPE.DYN=tmp++;
TYPE.UPG=tmp++;
TYPE.SETUP=tmp++;
TYPE.PARAS=tmp++;
//...
TYPE.MAX=tmp;

var pack_t={
    _tp_:TYPE.PACK,
    magic:'u32.1',    //魔术字
    pack: 's16.4',     //封包方式(1字节1类型)
};


/******数据类型定义 start******/
//hdr:header
var hdr_t={//第1层
    _tp_:TYPE.HDR,
    itype:'u32.1',   //io类型
    dtype:'u32.1',   //data类型
    dlen: 'u32.1',
};

var gain_t={
    _tp_:TYPE.GAIN,
    value:'s16.1',
};

var eq_t={
    _tp_:TYPE.EQ,
    aa:'u8.1',
    bb:'u8.1',
    gain:gain_t,
};

var setup_t={
    _tp_:TYPE.SETUP,
    lang:'u8.1',
    cnt:'u16.1',
};

var paras_t={
    _tp_:TYPE.PARAS,
    ver:'u8.1',    //port:'u8.1.str'
    eq:eq_t,
    setup:setup_t,
};
/******数据类型定义 end******/

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
    return (o && (typeof o === 'object'));
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


function xhr_get(url,type,sync)
{
    var o;
    var xhr=new XMLHttpRequest();
    xhsr.responseType=type;       //arraybuffer blob document json text
    xhr.open('GET',url,false);
    xhr.timeout=function() {log("get"+url+"timeout");};
    xhr.send(null);
    return JSON.parse(xhr.responseText);
}


//prop:propty
function get_plen(prop)
{
    var s=prop.split('.');
    var l=parseInt(s[1]);
    
    return BASE[s[0]].sz*l;
}


//暂未实现字符串,已预留作后续处理
function info(pp)
{
    var f={};
    var s=pp.split('.');
    var n=parseInt(s[1]);
    
    f.t=s[0];
    f.n=n;
    
    return f;
}


function get_tlen(obj)
{
    var len=0;
    
    if(!obj) {
        log("obj is null!");
        return 0;
    }
    
    for(var i in obj) {
        var p=obj[i];
        if(isString(p)) {
            len+=get_plen(p);
        }
        else if(isObject(p)) {
            len+=get_tlen(p);
        }
    }
    
    return len;
}

function _j2b(prop,js)
{
    var inf=info(prop);
    var bin=new ArrayBuffer(js.tlen);
    var dv=new DataView(bin);
    var id=BASE[inf.t].set;
    var sz=BASE[inf.t].sz;
    
    if(isArray(js)) {
        for(var i=0;i<js.length;i++) {
            dv[id](i*sz,js[i],true);
        }
    }
    else {
        dv[id](0,js,true);
    }
    
    return bin;
}

function _b2j(prop,bin)
{
    var js;
    var inf=info(prop);
    var dv=new DataView(bin,bin.offset);
    var id=BASE[inf.t].get;
    var sz=BASE[inf.t].sz;
    
    if(inf.n>1) {
        js=[];
        for(var i=0;i<inf.n;i++) {
            js[i]=dv[id](i*sz,true); //little endian
        }
    }
    else {
        js=dv[id](0,true);   //little endian
        //log("___js:"+js);
    }   
    
    return js;
}

function _bconcat(bs)
{
    if(!bs || bs.length<=0) {
        return null;
    }
    
    var len=0,pos=0;
    for(var i=0;i<bs.length;i++) {
        len += bs[i].byteLength;
    }
    
    var b=new ArrayBuffer(len);
    for(var i=0;i<bs.length;i++) {
        if(! bs[i] instanceof ArrayBuffer) {
            continue;
        }
        
        b.set(bs[i],pos);
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

function mk_conv(fn,obj)
{
    var i,j,p,tp=obj._tp_;
    
    if(!fn[tp]) {
        fn[tp]={};
        fn[tp].desc=obj;
        fn[tp].tlen=0;
        fn[tp].tp=tp;
    }
    
    for(i in obj) {
        p=obj[i];
        if(isString(p)) {
            fn[tp].tlen+=get_plen(p); 
        }
        else if(isArray(p)) {
            for(var j=0;j<p.length;j++) {
                mk_conv(fn,p[j]);
            }
        }
        else if(isObject(p)) {
            mk_conv(fn,p);
        }
    }
    
    //bin to js
    fn[tp].b2j=function(type,bin) {
        var l;
        var js={};
        var desc=FUNC[type].desc;
        
        js.tp=type;
        js.tlen=FUNC[type].tlen;
        for(var i in desc) {
            p=desc[i];
            if(isString(p)) {
                l=get_plen(p);
                js[i]=_b2j(p,bin);
                bin.offset+=l;
            }
            else if(isArray(p)) {
                for(var j=0;k<j.length;j++) {
                    //
                }
            }
            else if(isObject(p)) {
                var tp=p._tp_;
                js[i]=FUNC[tp].b2j(tp,bin);
            }
        }
        
        return js;
    };
    
    //js to bin
    fn[tp].j2b=function(js) {
        
        var bin=[];
        var desc=FUNC[js.tp].desc;
        var tl=FUNC[js.tp].tlen;
        
        for(var i in desc) {
            var p=js[i];
            if(isNumber(p)) {
                var b=_j2b(p,js[p]);
                bin.push(b);
            }
            else if(isString(p)) {
                //??
            }
            else if(isArray(p)) {
                for(var j=0;j<p.length;j++) {
                    var q=p[j];
                    var b=func[q.tp].j2b(q);
                    bin.push(b);
                }
            }
            else if(isObject(p)) {
                var b=func[p.tp].j2b(p);
                bin.push(b);
            } 
        }
        
        return _bconcat(bin);
    };
    
    //constructor
    fn[tp].create=function(type) {
        var l;
        var js={};
        var desc=FUNC[type].desc;
        
        js.tp=type;
        js.tlen=FUNC[type].tlen;
        for(var i in desc) {
            p=desc[i];
            if(isString(p)) {
                var l=get_plen(p);
                if(l==1) {
                    js[i]=null;
                }
                else if(l>1) {
                    js[i]=new Array(l);
                }
            }
            else if(isObject(p)) {
                var tp=p._tp_;
                js[i]=FUNC[tp].b2j(tp,bin);
            }
        }
        
        return js;
    }
    
    return fn;
}
var FUNC=(function() {
    var fn=[];
    
    mk_conv(fn,pack_t);
    mk_conv(fn,hdr_t);
    mk_conv(fn,gain_t);
    mk_conv(fn,eq_t);
    mk_conv(fn,setup_t);
    mk_conv(fn,paras_t);
    
    //print_obj(fn);
    //log(cv);
    
    return fn;
}());


var DATA=(function() {
    var dt={};
    
    dt.head=null;
    dt.paras=null;
    /////////////////////
    
    dt.fn=[];
    dt.open=_open;
    
    function _onevt(e,fn) {
        dt.fn[e]=fn;
    }
    
    function _open(url) {
        dt._ws=new WebSocket(url);
        if(dt._ws) {
            dt.send=_send;
            dt.bind=_bind;
            dt.onevt=_onevt;
            dt.close=_close;
            
            dt._ws.onmessage=_onmsg;
            dt._ws.binaryType="arraybuffer";
        }
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
    function _tojs(hdr)
    {
        
    }
    function _unpack(bin)
    {
        var h,d;
        bin.offset=0;
        var p=FUNC[TYPE.PACK].b2j(TYPE.PACK,bin);
        for(var i=0;i<p.pack.length;i++) {
            var tp=p.pack[i];
            if(tp>=0 && tp<TYPE.MAX) {
                switch(tp) {
                    case TYPE.HDR:
                    h=FUNC[tp].b2j(tp,bin);
                    break;
                    
                    default:
                    d=FUNC[tp].b2j(tp,bin);
                    break;
                }
            }
        }
        bin.offset=null;
        
        return {pk:p,hdr:h,dat:d};
        
    }
    function _onmsg(e) {
        //log(e.data);
        
        var r=_unpack(e.data);
        switch(r.hdr.dtype) {
            case TYPE.GAIN:
            var g=r.dat.eq.gain;
            log("____gain:"+g.value);
            break;
            
            case TYPE.EQ:
            break;
            
            case TYPE.SETUP:
            break;
            
            case TYPE.PARAS:
            {
                DATA.paras=r.dat;
            }
            break;  
        }
    }
    
    ///////////////////////////////
    function _packet() {
        var p=FUNC[TYPE.PACK].create(TYPE.PACK);
        var h=FUNC[TYPE.HDR].create(TYPE.HDR);
        return {pk:p,hdr:h};
    }
    function _pack(js) {
        var p=_packet();
        log(p);
        p.pk.magic=MAGIC;
        p.pk.pack[0]=TYPE.HDR;
        p.pk.pack[1]=js.tp;
        p.pk.pack[2]=-1;
        p.pk.pack[3]=-1;
        
        p.hdr.itype=IO.WIFI;
        p.hdr.dtype=js.type;
        p.hdr.dlen =js.tlen;
        var b=[],ar=[p.pk,p.hdr,js];
        for(var i=0,j=0;i<ar.length;i++) {
            var tp=ar[i].tp;
            if(tp>=0 && tp<TYPE.MAX) {
                b[j++]=FUNC[tp].j2b(ar[i]);
            }
        }
        
        return _bconcat(b);
    }
    function _send(js) {
        var bin=_pack(js);
        log("bytelength:"+bin.byteLength);
        dt._ws.send(bin);
    }
    
    function _close() {
        dt._ws.close();
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
    
    return dt;
}());











