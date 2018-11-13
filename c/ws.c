#include <string.h>
#include "hdr.h"


static mg_mgr_t mgr2;

static int is_websocket(mg_conn_t *conn) {
    int r;
    
    r = (conn->flags&MG_F_IS_WEBSOCKET)?1:0;
        
    return r;
}



static int ws_proc(mg_conn_t *conn, void *data, int len)
{
    
    LOG("_____ %s\n", (char *)data);
    
    return 0;
}


static int ws_write(mg_conn_t *conn, void *data, int len)
{
    mg_send_websocket_frame(conn, WEBSOCKET_OP_BINARY, data, len);
    
    return 0;
}


static void ev_handler(mg_conn_t *conn, int ev, void *ev_data)
{
       
    switch (ev) {
        case MG_EV_WEBSOCKET_HANDSHAKE_DONE:
        {
            //LOG("connected", conn);
        }
        break;
        
        case MG_EV_WEBSOCKET_FRAME:
        {
            mg_wsmsg_t *wm = (mg_wsmsg_t *)ev_data;
            
            LOG("_____ ws->size: %d\n", wm->size);
            //ws_proc(conn, wm->data, wm->size);
            
        }
        break;
        
        case MG_EV_TIMER:
        {
            
        }
        break;
        
        case MG_EV_CLOSE:
        {
            if (is_websocket(conn)) {
                //LOG("closed", conn);
            }
        }
        break;
    }
}


static void* ws_entry(void *arg)
{
    while(1) {
        lock_on(LOCK_WS);
        mg_mgr_poll(&mgr2, 0);
        lock_off(LOCK_WS);
    }
    LOG("___ ws_loop quit\n");
    
    return NULL;
}


int ws_init()
{
    int r;
    pthread_t id;
    char addr[60]={0};
    mg_conn_t *conn=NULL;
    mg_bindopt_t opt={0};
    
    mg_mgr_init(&mgr2, NULL);
    sprintf(addr, ":%d", WS_PORT);
    opt.user_data = NULL;
    
    conn = mg_bind_opt(&mgr2, addr, ev_handler, opt);
    if (!conn) {
        LOG("___ws_main, mg_bind_opt failed %s\n", *opt.error_string);
        return -1;
    }
    
    // Set up HTTP server parameters
    mg_set_protocol_http_websocket(conn);
    
    r = pthread_create(&id, NULL, ws_entry, NULL);
    
    return r;
}


int  ws_free()
{
    mg_mgr_free(&mgr2);
    //pthread_kill();
    
    return 0;
}


int ws_send(mg_conn_t *conn, hdr_t *hdr)
{
    int l;
    char *p;
    
    if (!hdr) {
        LOG("___ ws_send wrong paras\n");
        return -1;
    }
    
    l = hdr->dlen+sizeof(hdr_t);
    p = malloc(l);
    if (!p) {
        return -1;
    }
    memcpy(p, hdr, sizeof(hdr_t));
    
    lock_on(LOCK_WS);
    ws_write(conn, p, l);
    lock_off(LOCK_WS);
    
    free(p);
    
    return 0;
}


int ws_broadcast(mg_conn_t *conn, hdr_t *hdr)
{
    int l;
    char *p;
    int r=-1;
    mg_conn_t *c;
    
    if (!hdr) {
        LOG("___ ws_broadcast wrong paras\n");
        return -1;
    }
    
    l = hdr->dlen+sizeof(hdr_t);
    p = malloc(l);
    if (!p) {
        return -1;
    }
    memcpy(p, hdr, sizeof(hdr_t));
    
    lock_on(LOCK_WS);
    for (c = mg_next(&mgr2, NULL); c != NULL; c = mg_next(&mgr2, c)) {
        if (c==conn) {
            continue;
        }
        
        ws_write(c, p, l);
        r = 0;
    }
    lock_off(LOCK_WS);
    
    free(p);
    
    return r;
}