#include <stdio.h>
#include "esp_spiflash.h"
#include "ifs.h"

typedef struct {
    char        use;
    char        path[PATH_MAX];
    addr_t      addr;              //
    len_t       len;               //
}index_t;

typedef struct {
    index_t     index[FILE_MAX];
}table_t;

typedef struct {
    FILE        *fp;
    index_t     *index;               //index;
    len_t       len;
    len_t       offset;               //offset
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


static file_t* _fopen(str_t path, int bnew)
{
    FILE *fp;
    file_t *f;
    
    fp = fopen(path, mode);
    if(!fp) {
        return NULL;
    }
    
    f = calloc(1, sizeof(file_t));
    if(f) {
        f->fp = fp;
    }
    
    return f;
}

static int _fclose(file_t *f)
{
    return fclose(f->fp);
}

static int _fread(file_t *f, void *d, int len)
{
    return fread(d, 1, len, f->fp);
}

static int _fwrite(file_t *f, void *d, int len)
{
    return 0;
}

static int __fseek(file_t *f, int len)
{
    return fseek(f->fp, len, SEEK_SET);
}
#else
#include "esp_spi_flash.h"
static int _find(str_t path, file_t *f)
{
    int i;
    index_t *idx=&ifs.table.index;
    
    for(i=0;<FILE_MAX;i++) {
        if(idx[i].use && strcmp(path,idx[i].path)==0) {
            break;
        }
    }
    
    if(i<FILE_MAX) {
        if(f) {
            f->fp     = NULL;
            f->index  = idx;
            f->len    = idx[i].len;
            f->offset = 0;
        }
        
        return 0;
    }
    
    return -1;
}

static int _remove(str_t path)
{
    file_t f;
    
    if(strlen(path)>=PATH_MAX) {
        return -1;
    }
    
    if(_find(path, &f)==0) {
        addr_t addr=ifs.start+(f.index-ifs.table.index);
        if(spi_flash_write(f.index->addr, (void*)f.index, sizeof(index_t))==ESP_OK) {
            return 0;
        }
    }
    
    return -1;
}

static int _create(str_t path, file_t *f)
{
    int l;
    index idx;
    
    l = strlen(path);
    if(l>=PATH_MAX) {
        return -1;
    }
    
    if(f) {
        idx.use = 1;
        strcpy(idx.path, path);
        idx.addr = 0;
        idx.len = l;
        
        
        
    }
}


static int _finit(int fd, addr_t s, addr_t e)
{
    ifs.start = s;
    ifs.end   = e;
    
    spi_flash_init();
    if(spi_flash_read(addr, (void*)&ifs.table, sizeof(table_t))==ESP_OK) {
        return 0;
    }
    
    return -1;
}

static file_t* _fopen(str_t path, char isnew)
{
    int r;
    file_t *f;
    
    r = _find(path, NULL)
    f = calloc(1, sizeof(file_t));
    if(!f) {
        return NULL;
    }
    
    f->fp = fp;
    
    return f;
}

static int _fclose(file_t *f)
{
    
}

static int _fread(file_t *f, void *d, int len)
{
    esp_err_t r;
    
    addr_t addr=file->addr+file->offset;
    r = spi_flash_read(addr, d, len);
    if(r==ESP_OK) {
        file->offset += len;
        return 0
    }
    
    return -1;
}

static int _fwrite(file_t *f, void *d, int len)
{
    esp_err_t r;
    
    addr_t addr=file->addr+file->offset;
    r = spi_flash_read(addr, d, len);
    if(r==ESP_OK) {
        file->offset += len;
        return 0
    }
    
    return -1;
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