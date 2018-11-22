#ifndef __DISKIO_STD_H__
#define __DISKIO_STD_H__

#include "ffconf.h"
#include "diskio.h"		/* FatFs lower layer API */

#ifdef __cplusplus
extern "C" {
#endif


DSTATUS disk_std_status(BYTE pdrv)
{
	return RES_OK;
}


static int fno=-1;
DSTATUS disk_std_initialize(BYTE pdrv)
{
    if (fno == -1)
        fno = open(IMAGE, O_SYNC|O_RDWR, S_IRUSR|S_IWUSR);
        
    lseek(fno, 0, SEEK_SET);
    
    return RES_OK;
}


DRESULT disk_std_read(BYTE pdrv,BYTE *buff,DWORD sector,UINT count)
{
	DRESULT res;
	int r;

	//printf("fno: %d, sector: %ld count: %d\n", fno, sector, count);
	lseek(fno, sector*SSIZE, SEEK_SET);
	r = read(fno, buff, count*SSIZE);

	return RES_OK;
}


DRESULT disk_std_write(BYTE pdrv,const BYTE *buff,DWORD sector,UINT count)
{
	DRESULT res;
	int result;

	//printf("disk_write %d %ld %d\n", fno, sector, count);	
	lseek(fno, sector*SSIZE, SEEK_SET);
	write(fno, buff, count*SSIZE);
	
	return RES_OK;
}


DRESULT disk_std_ioctl(BYTE pdrv,BYTE cmd,void *buff)
{
	DRESULT res;
	int result;
	
	switch(cmd) {
	    case CTRL_SYNC:
	    break;
	    
	    case GET_SECTOR_COUNT:
	    *(DWORD*)buff = SCOUNT;
	    break;
	    
	    case GET_SECTOR_SIZE:
	    *(WORD*)buff = SSIZE;
	    break;
	    
	    default:
	    return RES_PARERR;
	}

	return RES_OK;
}



#ifdef __cplusplus
}
#endif


#endif
