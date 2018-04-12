#include "hdr.h"


static lock_t mlock = {0};

int lock_init()
{
    int i,r=0;
    
    for (i=0; i<LOCK_NUM; i++) {
        r |= pthread_mutex_init(&(mlock.mutex[i]), 0);
    }
    
    return r;
}


int lock_on(int id)
{
    int r;
    
    if (id<0 || id>=LOCK_NUM) {
        return -1;
    }
    
    r = pthread_mutex_lock(&(mlock.mutex[id]));
    
    return r;
}


int lock_off(int id)
{
    int r;
    
    if (id<0 || id>=LOCK_NUM) {
        return -1;
    }
    
    r = pthread_mutex_unlock(&(mlock.mutex[id]));
    
    return r;
}


int lock_free()
{
    int i,r=0;
    
    for (i=0; i<LOCK_NUM; i++) {
        r |= pthread_mutex_destroy(&(mlock.mutex[i]));
    }
    
    return r;
}


