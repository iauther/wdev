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
    _tp_:TYPE.HDR,
    magic:'u32.1.number',   //魔术字
    pack: 'u32.1.number',    //封包方式(1字节1类型)
    itype:'u32.1.number',   //io类型
    dtype:'u32.1.number',   //data类型
    dlen: 'u32.1.number',
};

var gain_t={
    _tp_:TYPE.GAIN,
    value:'s16.1.num',
};

var eq_t={
    _tp_:TYPE.EQ,
    aa:'u8.1.number',
    bb:'u8.1.number',
    g:gain_t,
};

var setup_t={
    _tp_:TYPE.SETUP,
    lang:'u8.1.num',
    cnt:'u16.1.num',
};

var paras_t={
    _tp_:TYPE.PARAS,
    ver:'u8.1.num',    //port:'u8.1.str'
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
    var fx={},rd,wt,tl,dv;
    var s=pp.split('.');
    var l=parseInt(s[1]);
    
    switch(s[0]) {
        case's8':
        {
            tl=1*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getInt8;
            wt=dv.setInt8;
        }
        break;
        
        case'u8':
        {
            tl=1*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getUint8;
            wt=dv.setUint8;
        }
        break;
        
        case's16':
        {
            tl=2*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getInt16;
            wt=dv.setInt16;
        }
        break;
        
        case'u16':
        {
            tl=2*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getUint16;
            wt=dv.setUint16;
        }
        break;
        
        case's32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getInt32;
            wt=dv.setInt32;
        }
        break;
        
        case'u32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            //log("8888:"+b+" :9999");
            dv=new DataView(b,0);
            rd=dv.getUint32;
            wt=dv.setUint32;
        }
        break;
        
        case's64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getBigInt64;
            wt=dv.getBigInt64;
        }
        break;
        
        case'u64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getBigUint64;
            wt=dv.setBigUint64;
        }
        break;
        
        case'f32':
        {
            tl=4*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getFloat32;
            wt=dv.setFloat32;
        }
        break;
        
        case'f64':
        {
            tl=8*l;
            b=bin?bin:new ArrayBuffer(tl);
            dv=new DataView(b,0);
            rd=dv.getFloat64;
            wt=dv.setFloat64;
        }
        break;

        default:
        return null;
    }
    
    fx.b=b;
    fx.tl=tl;
    fx.dv=dv;
    fx.rd=rd;
    fx.wt=wt;
    
    return fx;
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

function to_bin(prop,js)
{
    var fx=get_fx(prop);
    fx.wt.bind(fx.dv)(0,js,true);
    
    return fx.b;
}

function to_js(prop,bin)
{
    var fx=get_fx(prop,bin);
    return fx.rd.bind(fx.dv)(0,true);
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


function mk_conv(cov,obj)
{
    var i,j,p,tp=obj.tp;
    for(i in obj) {
        p=obj[i];
        if(isString(p)) {
            if(!cov[tp]) {
                cov[tp]={};
                cov[tp].desc=p;
                cov[tp].tlen=0;
                cov[tp].tp=tp;
            }
                 
            cov[tp].tlen+=get_plen(p); 
              
            //bin to js
            cov[tp].b2j=function(bin,type) {
                var b=bin;
                var offset=0,l;
                var js={},len=0;
                var desc=CONVS[type].desc,ds;
                
                //log(st);
                //log(b);
                
                js.tp=type;
                for(var i in desc) {
                    p=desc[i];
                    if(isString(p)) {
                        l=get_plen(p);
                        b=b.slice(b,offset,l);
                        js[p]=to_js(p,b);
                        offset+=l;
                        log(b);
                    }
                    else if(isArray(p)) {
                        for(var j=0;j<p.length;j++) {
                            //
                        }
                    }
                    else if(isObject(p)) {
                        js[p]=CONVS[p.tp].b2j(b,p.tp);
                        ds=CONVS[p.tp].desc;
                        l=CONVS[p.tp].tlen;
                        offset+=l;
                        b=b.slice(b,offset,l);
                    }
                }
                
                return js;
            };
            
            //js to bin
            cov[tp].j2b=function(js) {
                
                var bin=[];
                var desc=CONVS[js.tp].desc;
                var tl=CONVS[js.tp].tlen;
                
                for(var i in desc) {
                    var p=js[i];
                    if(isNumber(p)) {
                        var b=to_bin(p,js[p]);
                        bin.push(b);
                    }
                    else if(isString(p)) {
                        //??
                    }
                    else if(isArray(p)) {
                        for(var j=0;j<p.length;j++) {
                            //
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
        else if(isArray(p)) {
            for(var j=0;j<p.length;j++) {
                mk_conv(cov,p[j]);
            }
        }
        else if(isObject(p)) {
            mk_conv(cov,p);
        }
    }
    
    return cov;
}
var CONVS=(function() {
    var cv=[];
    
    mk_conv(cv,hdr_t);
    mk_conv(cv,gain_t);
    mk_conv(cv,eq_t);
    mk_conv(cv,setup_t);
    mk_conv(cv,paras_t);
    
    //print_obj(cv);
    //log(cv);
    
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
    var dt={};
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
    function _unpack(bin) {
        return CONVS[TYPE.HDR].b2j(bin,TYPE.HDR);
    }
    function _onmsg(e) {
        
        var hdr=_unpack(e.data);
        log(hdr);
        log("dtype:"+hdr.dtype);
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
        var bin=CONVS[js.tp].j2b(js);
        return bin;
    }
    function _send(js) {
        var bin=_pack(js);
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











