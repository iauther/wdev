#ifndef __HDR_H__
#define __HDR_H__

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <fcntl.h>
#include <unistd.h>
#include "mongoose.h"




typedef struct mg_bind_opts             mg_bindopt_t;
typedef struct mg_connect_opts          mg_connopt_t;
typedef struct mg_serve_http_opts       mg_httpopt_t;

typedef struct mg_connection            mg_conn_t;
typedef struct mg_mgr                   mg_mgr_t;
typedef struct mg_str                   mg_str_t;
typedef struct websocket_message        mg_wsmsg_t;
typedef struct http_message             mg_httpmsg_t;


#define LOG printf
#define HTTP_PORT 80
#define WS_PORT   8899

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


typedef struct {
    int evt;
    int flag;
    int dlen;
    char data[0];
}hdr_t;



int lock_init();

int lock_on(int id);

int lock_off(int id);

int lock_free();

int tty_open(ttycfg_t *cfg);

///////////////////////////////////////
int web_init();

int web_free();

int ws_init();

int ws_free();

int ws_send(mg_conn_t *conn, hdr_t *hdr);

int ws_broadcast(mg_conn_t *conn, hdr_t *hdr);

#endif
