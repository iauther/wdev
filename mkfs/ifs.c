#include <stdio.h>
#include "esp_spiflash.h"
#include "ifs.h"


#define ALIGN   (1<<5)


typedef struct {
    char        use;
    addr_t      addr;
    //addr_t      next;
}block_t;

typedef struct {
    char        use;
    char        path[PATH_LEN];
    addr_t      addr;              //
    len_t       len;               //
}index_t;

typedef struct {
    index_t     idx[FILE_CNT];
}table_t;

typedef struct {
    FILE        *fp;
    index_t     *pi;                //index;
    len_t       ofs;                //offset
}file_t;


typedef struct {
    int         fd;
    addr_t      start;
    addr_t      end;
    table_t     table;
}ifs_t;

static ifs_t ifs;
////////////////////////////////////////////
#ifdef USE_STD
#include <stdio.h>
static int _finit(int fd, addr_t s, addr_t e)
{
    ifs.start = s;
    ifs.end   = e;
    
    return 0;
}

static file_t* _fopen(str_t path, char *mode)
{
    FILE *fp;
    file_t *f;
    
    fp = open(path, mode);
    if(!fp) {
        return NULL;
    }
    
    f = calloc(1, sizeof(file_t));
    if(f) {
        f->fp = fp;
    }
}

static int _fclose(file_t *f)
{
    
}

static int _fread(file_t *f, void *d, int len)
{
    return 0;
}

static int _fwrite(file_t *f, void *d, int len)
{
    return 0;
}

static int __fseek(file_t *f, int len, int mode)
{
    return 0;
}
#else
#include <stdio.h>
static int _finit(int fd, addr_t s, addr_t e)
{
    ifs.start = s;
    ifs.end   = e;
    
    fread(f, );
    
    return 0;
}

static file_t* _fopen(str_t path)
{
    
}

static int _fclose(file_t *f)
{
    
}

static int _fread(file_t *f, void *d, int len)
{
    return 0;
}

static int _fwrite(file_t *f, void *d, int len)
{
    return 0;
}

static int __fseek(file_t *f, int len, int mode)
{
    return 0;
}
#endif

/////////////////////////////////////////



int ifs_init(addr_t s, addr_t e)
{
    
    
    return 0;
}


hnd_t ifs_open(str_t path, uint_32 e)
{
    return 0;
}


int ifs_read(hnd_t h, void *d, len_t l)
{
    
    
}

int ifs_write(hnd_t h, void *d, len_t l)
{
    
    return 0;
}

int ifs_seek(hnd_t h, uint_32 l)
{
    
    return 0;
}

int ifs_close(hnd_t h)
{
    
    return 0;
}