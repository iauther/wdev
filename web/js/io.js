
function io_gpio()
{
    this.gpio = 0;
    this.
}


function io_i2c(speed)
{
    this.speed = speed;
    
    this.read  = _read;
    this.write = _write;
    
    funtion _read(addr,buf,len) {
        
    }
    
    funtion _write(addr,buf,len) {
        
    }
}


function io_i2s(speed,format)
{
    this.speed = speed;
    this.fomat = format; //pcm or pdd
    
    funtion _read(buf,len) {
        
    }
    
    funtion _write(buf,len) {
        
    }
}


function io_spi(mode,speed)
{
    this.mode = mode;
    this.speed = speed;
    
    this.read  = _read;
    this.write = _write;
    
    funtion _read(buf,len) {
        
    }
    
    funtion _write(buf,len) {
        
    }
}


function io_usb()
{
    funtion _read(buf,len) {
        
    }
    
    funtion _write(buf,len) {
        
    }
}






