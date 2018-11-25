#ifndef __DISKIO_STD_H__
#define __DISKIO_STD_H__

#include "ffconf.h"
#include "diskio.h"		/* FatFs lower layer API */

#ifdef __cplusplus
extern "C" {
#endif


DSTATUS diskio_std_status(BYTE pdrv);

DSTATUS diskio_std_initialize(BYTE pdrv);

DRESULT diskio_std_read(BYTE pdrv,BYTE *buff,DWORD sector,UINT count);

DRESULT diskio_std_write(BYTE pdrv,const BYTE *buff,DWORD sector,UINT count);

DRESULT diskio_std_ioctl(BYTE pdrv,BYTE cmd,void *buff);

#ifdef __cplusplus
}
#endif


#endif
