
var tmp=0;
var TYPE={};
TYPE.TEST=tmp++;
TYPE.EQ=tmp++;
TYPE.VOL=tmp++;
TYPE.UPG=tmp++;
//...

var DEF=[
    {
        tp:TYPE.TEST,
        
        st:{
                port:'u8',
                type:'u8',
                flag:'u8',
                len :'u32',
           },
    }

];



function get_tplen(tp)
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

function get_fn(rw,bin,tp)
{
    var fn;
    switch(tp) {
        
          case's8': fn=(rw=='r')?bin.getInt8:bin.setInt8;break;
          case'u8': fn=(rw=='r')?bin.getUint8:bin.setUint8;break;
          case's16':fn=(rw=='r')?bin.getInt16:bin.setInt16;break;
          case'u16':fn=(rw=='r')?bin.getUint16:bin.setUint16;break;
          case's32':fn=(rw=='r')?bin.getInt32:bin.setInt32;break;
          case'u32':fn=(rw=='r')?bin.getUint32:bin.setUint32;break;
          case's64':fn=(rw=='r')?bin.getInt64:bin.setInt64;break;
          case'u64':fn=(rw=='r')?bin.getUint64:bin.setUint64;break;
          case'f32':fn=(rw=='r')?bin.getFloat32:bin.setFloat32;break;
          case'f64':fn=(rw=='r')?bin.getFloat64:bin.setFloat64;break;
          
          default:
          return null;
    }
    
    return fn;
}


function get_stlen(st)
{
    var len=0;
    for(var p in st) {
        len+=get_tplen(st[p]);
    }
    
    return len;
}




function bin_rw(rw,bin,offset,tp)
{
    var o={};
    var dv,fn,len;
    dv=new DataView(bin,offset);
    fn=get_fn(rw,dv,tp);
    o.v=fn(0,true);
    o.l=get_tplen(tp);

    return o;
}


var CONV=(function(def) {
    
    var conv=[];
    for(var i=0; j<def.length-1; j++) {
        //if(obj.hasOwnProperty('type'))
        var j=def[i].tp;
        var st=def[i].st;
        var stlen=get_stlen(st);
        
        //conv[i].stlen=stlen;
        //bin to js
        conv[j].b2j=function(bin) {
            var js={};
            var len=0;
            for(var p in st) {
                var o=bin_rw('r',bin,len,st[p]);
                js[p]=o.v;
                len+=o.l;
            }
            
            return js;
        };
        
        //js to bin
        conv[j].j2b=function(js) {
            
            var len=0;
            var bin=new ArrayBuffer(stlen);
            for(var p in js) {
                var o=bin_rw('w',bin,len,st[p]);
                len+=o.l;
            }
            
            return bin;
        };
    }
        
    return conv;
})(DEF)

