#include <string.h>
#include <endian.h>
#include "inc.h"
#include "data.h"
#include "mg.h"

static mg_mgr_t mgr2;
static paras_t mparas={
    .ver=11,
    .eq={
        .aa=8,
        .bb=9,
        .gain={
            .value=25,
        },
    },
    .setup={
        .lang=1,
        .cnt=2,
    },
};

static int ws_send_paras(mg_conn_t *nc);

static int is_websocket(mg_conn_t *conn) {
    int r;
    
    r = (conn->flags&MG_F_IS_WEBSOCKET)?1:0;
        
    return r;
}

static int ws_write(mg_conn_t *conn, void *data, int len)
{
    mg_send_websocket_frame(conn, WEBSOCKET_OP_BINARY, data, len);
    
    return 0;
}

static void ws_proc(mg_conn_t *nc, void *data, int len)
{
    hdr_t *hdr=data;
    
    switch(hdr->dtype) {
        
        case TYPE_GAIN:
        {
            if(hdr->dlen<=sizeof(gain_t)) {
                LOG("gain length error");
                return;
            }
            
            gain_t *g=(gain_t*)hdr->data;
            LOG("_____gain.value: %d\n", g->value);
        }
        break;
        
        case TYPE_EQ:
        {
        }
        break;
        
        case TYPE_DYN:
        break;
        
        case TYPE_SETUP:
        break;
        
        case TYPE_PARAS:
        break;
        
        default:
        return;
        break;
        
    }  
}

static void ev_handler(mg_conn_t *nc, int ev, void *p)
{
    mg_wsmsg_t *wm=(mg_wsmsg_t*)p;
    switch (ev) {
        case MG_EV_WEBSOCKET_HANDSHAKE_DONE:
        {
            LOG("___ send paras\n");
            ws_send_paras(nc);
        }
        break;

        case MG_EV_WEBSOCKET_FRAME:
        {
            ws_proc(nc, wm->data, wm->size);
        }
        break;

        case MG_EV_TIMER:
        {
            
        }
        break;

        case MG_EV_CLOSE:
        {
            
        }
        break;
    }
}


static void* ws_entry(void *arg)
{
    while(1) {
        //lock_on(LOCK_WS);
        mg_mgr_poll(&mgr2, 1000);
        //lock_off(LOCK_WS);
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


static char tmpbuf[500];
static void fill()
{
    
}
static int do_pack(int type, void *data, int len)
{
    int l;
    pack_t *pk=(pack_t*)tmpbuf;
    hdr_t *hdr=(hdr_t*)pk->data;
    
    l = len+sizeof(pack_t)+sizeof(hdr_t);
    if(l>sizeof(tmpbuf)) {
        LOG("packet buf overflow!");
        return -1;
    }
    
    pk->magic = MAGIC;
    pk->pack[0] = TYPE_HDR;
    pk->pack[1] = type;
    pk->pack[2] = -1;
    pk->pack[3] = -1;
    hdr->itype = IO_WIFI;
    hdr->dtype = type;
    hdr->dlen = len;

#if __BYTE_ORDER == __LITTLE_ENDIAN
    LOG("___little endian\n");
#elif __BYTE_ORDER == __BIG_ENDIAN
    LOG("___big endian\n");
#endif
    
    memcpy((void*)hdr->data, data, len);
    
    LOG("___magic:  %ld\n", pk->magic);
    LOG("___pack[0]: %d\n", pk->pack[0]);
    LOG("___pack[1]: %d\n", pk->pack[1]);
    LOG("___pack[2]: %d\n", pk->pack[2]);
    LOG("___pack[3]: %d\n", pk->pack[3]);
    LOG("___itype:   %d\n", hdr->itype);
    LOG("___dtype:   %d\n", hdr->dtype);
    LOG("___dlen:    %d\n", hdr->dlen);
    
    
    
    return l;
}
int ws_send(mg_conn_t *nc, int type, void *data, int len)
{
    int l;
    
    l = do_pack(type, data, len);
    LOG("ws send l: %d\n", l);
    ws_write(nc, tmpbuf, l);
    
    return 0;
}


static int ws_send_paras(mg_conn_t *nc)
{
    return ws_send(nc, TYPE_PARAS, (void*)&mparas, sizeof(paras_t));
}