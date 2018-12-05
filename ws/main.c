//#include <sys/epoll.h>
#include "inc.h"



#if 0
enum {
   DEV_TTY = 0,
   DEV_NUM 
};

static int m_ep;
static int m_fds[DEV_NUM]={-1};
static ttycfg_t m_cfg = {
                           .port=1,
                           .speed=115200,
                           .bits=8,
                           .evts='N',
                           .stops=1,
                        };

static int epoll_add(int ep, int fd, long evts)
{
    int r;
    struct epoll_event ev;
    
    ev.data.fd = fd;    
    ev.events = evts;  
    r = epoll_ctl(ep, EPOLL_CTL_ADD, fd, &ev);
    if (r!=0) {
        LOG("_____ epoll add failed, %s\n", strerror(errno));
        return r;
    }
    
    return 0;
}
#endif


int main(int argc, char **argv)
{
    int fd;
    int i,nfds;
    char tmp[2000];
#if 0
    struct epoll_event events[DEV_NUM];
    
    m_ep = epoll_create(DEV_NUM);
    
    fd = tty_open(&m_cfg);
    if (fd<0) {
        LOG("___ tty open failed\n");
    }
    epoll_add(m_ep, fd, EPOLLIN|EPOLLOUT);
#endif    
    
    http_init();
    ws_init();
    
    while (1) {
        
        sleep(2000);
        #if 0
        nfds = epoll_wait(m_ep, events, DEV_NUM, 0);
        for(i=0; i<nfds; i++) {
            fd = events[i].data.fd;
            if(fd==m_fds[DEV_TTY]) {
                read(fd, tmp, sizeof(tmp));
                
                //LOG("______ tty something...\n");
            }
        }
        #endif
    }
   
    
    return 0;
}

