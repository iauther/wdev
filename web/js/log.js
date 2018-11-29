var log={
    this.buf=[];
    this.max=5000;
    this.enable=true;
    
    this.cfg=function(max) {
        this.max=max;
    }
    
    this.save=function() {
        
    }
    
    this.clear=function() {
        console.clear();
        for(var i=0;i<this.buf.length;i++>) {
            //
        }
    }
    
    this.en=function(flag) {
        this.enable=flag;
    }
    
    this.dbg=function(str) {
        if(this.enable) {
            console.log(str);
            //console.error
            //console.warn
            //console.info
            //console.assert
        }
    }
};

function 