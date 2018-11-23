#ifndef __IFS_H__
#define __IFS_H__

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

//#define BLOCK_SIZE      512


#define INVALID_HND     (-1)
#define INVALID_ADDR    (0xffffffff)

#define PATH_LEN        (100)
#define FILE_MAX        (100)

typedef uint32_t hnd_t
typedef uint32_t addr_t
typedef uint32_t len_t
typedef char*    str_t

int ifs_init(addr_t s, addr_t e);

hnd_t ifs_open(str_t path, uint_32 e);

int ifs_read(hnd_t h, void *d, len_t l);

int ifs_write(hnd_t h, void *d, len_t l);

int ifs_seek(hnd_t h, uint_32 l);

int ifs_close(hnd_t h);


#ifdef __cplusplus
}
#endif

#endif
