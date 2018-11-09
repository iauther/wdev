
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
                port:'u8.1',
                type:'u8.1',
                flag:'u8.1',
                len :'u32.1',
           },
    }

];

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



//a:attr
function get_alen(attr)
{
    var s=attr.split('.');
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




function get_stlen(st)
{
    var len=0;
    for(var p in st) {
        len+=get_alen(st[p]);
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
        console.log(i+':'+obj[i]);
    }
}

var CONV=(function(def) {
    
    var conv=[];
    
    for(var i=0; i<def.length; i++) {
        
        var obj=def[i];
        //if(obj.hasOwnProperty('tp'))
        
        
        var j=obj.tp;
        var st=obj.st;
        var sl=get_stlen(st);
        
        conv[j]={};
        //copy attr
        for(var o in st) {
            conv[j][o]=null;
        }
        
        //conv[i].sl=sl;        //struct length
        
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
    
    console.log("___ print obj");
    //console.log(conv[0]);
    for(var i=0; i<conv.length; i++) {
        print_obj(conv[i]);
    }
        
    return conv;
})(DEF)

