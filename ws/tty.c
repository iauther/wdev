#include <sys/types.h>
#include <sys/stat.h>
#include <termios.h>

#include "inc.h"


static int set_opt(int fd, ttycfg_t *cfg)
{
    struct termios newtio,oldtio;
    
    if  ( tcgetattr(fd, &oldtio)  !=  0) { 
        LOG("__tcgetattr err\n");
        return -1;
    }
    
    memset(&newtio, 0, sizeof( newtio ));
    newtio.c_cflag  |=  CLOCAL | CREAD; 
    newtio.c_cflag &= ~CSIZE;

    switch( cfg->bits ){
	    case 7: newtio.c_cflag |= CS7; break;
	    case 8: newtio.c_cflag |= CS8; break;
    }

    switch( cfg->evts ) {
        case 'O':                     //??D¡ê?¨¦
            newtio.c_cflag |= PARENB;
            newtio.c_cflag |= PARODD;
            newtio.c_iflag |= (INPCK | ISTRIP);
            break;
        case 'E':                     //??D¡ê?¨¦
            newtio.c_iflag |= (INPCK | ISTRIP);
            newtio.c_cflag |= PARENB;
            newtio.c_cflag &= ~PARODD;
            break;
        case 'N':                    //?TD¡ê?¨¦
            newtio.c_cflag &= ~PARENB;
            break;
    }

    switch( cfg->speed ) {
        case 2400:
            cfsetispeed(&newtio, B2400);
            cfsetospeed(&newtio, B2400);
            break;
        case 4800:
            cfsetispeed(&newtio, B4800);
            cfsetospeed(&newtio, B4800);
            break;
        case 9600:
            cfsetispeed(&newtio, B9600);
            cfsetospeed(&newtio, B9600);
            break;
        case 115200:
            cfsetispeed(&newtio, B115200);
            cfsetospeed(&newtio, B115200);
            break;
        default:
            cfsetispeed(&newtio, B9600);
            cfsetospeed(&newtio, B9600);
            break;
    }
    
    if( cfg->stops == 1 ) {
        newtio.c_cflag &=  ~CSTOPB;
    }
    else if ( cfg->stops == 2 ) {
        newtio.c_cflag |=  CSTOPB;
    }
    newtio.c_cc[VTIME]  = 0;
    newtio.c_cc[VMIN] = 0;
    tcflush(fd,TCIFLUSH);
    
    if((tcsetattr(fd,TCSADRAIN,&newtio))!=0) {
        LOG("com set error\n");
        return -1;
    }

    return 0;
}


int tty_open(ttycfg_t *cfg)
{
    int fd,ret;
    char tmp[30];
    ttycfg_t tc;
    
    if (!cfg) {
    	tc.port = 1;
		tc.speed = 115200;
		tc.bits = 8;
		tc.evts = 'N';
		tc.stops = 1;
    }
    else {
    	tc = *cfg;
    }
    
    
    sprintf(tmp, "%s%d", TTY_PATH, tc.port);
    fd = open(tmp, O_RDWR|O_NOCTTY|O_NDELAY);
    if (fd<0) {
        LOG("____ tty open err, %s\n", strerror(errno));
        return -1;
    }
    

    ret = fcntl(fd, F_SETFL, 0);
    if(ret<0) {
        LOG("fcntl failed!\n");
        return -1;
    }
    
    ret = set_opt(fd, &tc);
    if(ret<0) {
        LOG("____ set_opt err\n");
        return -1;
    }
    
    return fd;
}


