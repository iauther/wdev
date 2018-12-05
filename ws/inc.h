#ifndef __INC_H__
#define __INC_H__

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <fcntl.h>
#include <unistd.h>

#define LOG printf
#define HTTP_PORT 80
#define WS_PORT   8191

#define TTY_PATH "/dev/ttyS2"
typedef struct
{
	int  	port;
	int  	speed;
	int  	bits;
	int 	evts;
	int  	stops;
}ttycfg_t;


enum {
    LOCK_WS = 0,
    LOCK_NUM
};

typedef struct {
    pthread_mutex_t mutex[LOCK_NUM];
}lock_t;

int lock_init();

int lock_free();

int http_init();

int http_free();

int ws_init();

int ws_free();

#endif
