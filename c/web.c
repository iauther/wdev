

#include "hdr.h"

static mg_mgr_t mgr1;
static mg_httpopt_t mopt;

static void ev_handler(mg_conn_t *conn, int ev, void *p) {
    
    mg_httpmsg_t *hmsg = p;
    
    switch(ev) {
        case MG_EV_HTTP_REQUEST:
        mg_serve_http(conn, hmsg, mopt);
        break;
    }
}


static void* web_entry(void *arg)
{
    while(1) {
        mg_mgr_poll(&mgr1, 50);
    }
    
    LOG("___ web_loop quit\n");
    
    return NULL;
}


int web_init()
{
    int r;
    char port[20];
    pthread_t id;
    mg_bindopt_t opt={0};
    mg_conn_t *conn;
    
    mopt.document_root = "./web";  // server root directory
    mopt.enable_directory_listing = "no";
    
    mg_mgr_init(&mgr1, NULL);
    
    sprintf(port, "%d", HTTP_PORT);
    opt.user_data = NULL;
    conn = mg_bind_opt(&mgr1, port, ev_handler, opt);
    if (!conn) {
        LOG("web mg_bind_opt failed\n");
        return -1;
    }

    mg_set_protocol_http_websocket(conn);
    
    r = pthread_create(&id, NULL, web_entry, NULL);
    
    return r;
}


int web_free()
{
    mg_mgr_free(&mgr1);
    //pthread_kill();
    
    return 0;
}