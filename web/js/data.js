
function header(data) {
            var tmp, len, length=0;
            
            len = 4;
            tmp = new DataView(data, length, len);
            length += len;
            this.evt = tmp.getInt32(0,true);
            
            len = 4;
            tmp = new DataView(data, length, len);
            length += len;
            this.flag = tmp.getInt32(0,true);
            
            len = 4;
            tmp = new DataView(data, length, len);
            length += len;
            this.dlen = tmp.getInt32(0,true);
            
            //this.data = ;
        }


var Data=(function() {
    var _proto=Data.prototype;
    
    
    _proto.bin2js=function(id,bin,js) {
        
    }
    
    _proto.js2bin=function(id,js,bin) {
        
    }
    
    _proto.bind=function() {
        
    }
    
})()