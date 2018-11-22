/*-----------------------------------------------------------------------*/
/* Low level disk I/O module skeleton for FatFs     (C)ChaN, 2016        */
/*-----------------------------------------------------------------------*/
/* If a working storage control module is available, it should be        */
/* attached to the FatFs via a glue function rather than modifying it.   */
/* This is an example of glue functions to attach various exsisting      */
/* storage control modules to the FatFs module with a defined API.       */
/*-----------------------------------------------------------------------*/
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>
#include <time.h>
#include "ffconf.h"
#include "diskio.h"		/* FatFs lower layer API */

#ifdef USE_WL
#include "diskio_wl.h"
#else
#include "diskio_std.h"
#endif

/* Definitions of physical drive number for each drive */
#define DEV_RAM		0	/* Example: Map Ramdisk to physical drive 0 */
#define DEV_MMC		1	/* Example: Map MMC/SD card to physical drive 1 */
#define DEV_USB		2	/* Example: Map USB MSD to physical drive 2 */



/*-----------------------------------------------------------------------*/
/* Get Drive Status                                                      */
/*-----------------------------------------------------------------------*/

DSTATUS disk_status (
	BYTE pdrv		/* Physical drive nmuber to identify the drive */
)
{
	return RES_OK;
}


DSTATUS disk_initialize (
	BYTE pdrv				/* Physical drive nmuber to identify the drive */
)
{
    DSTATUS r;
    
#ifdef USE_WL
    r = (DRESULT)diskio_wl_initialize(pdrv);
#else
    r = (DRESULT)diskio_wl_initialize(pdrv);
#endif
    
    return r;
}


DRESULT disk_read (
	BYTE pdrv,		/* Physical drive nmuber to identify the drive */
	BYTE *buff,		/* Data buffer to store read data */
	DWORD sector,	/* Start sector in LBA */
	UINT count		/* Number of sectors to read */
)
{
	DRESULT r;
	
#ifdef USE_WL
    r = (DRESULT)diskio_wl_read(pdrv,buff,sector,count);
#else
	r = (DRESULT)diskio_std_read(pdrv,buff,sector,count);
#endif

	return r;
}


DRESULT disk_write (
	BYTE pdrv,			/* Physical drive nmuber to identify the drive */
	const BYTE *buff,	/* Data to be written */
	DWORD sector,		/* Start sector in LBA */
	UINT count			/* Number of sectors to write */
)
{
	DRESULT r;

#ifdef USE_WL
    r = (DRESULT)diskio_wl_write(pdrv,buff,sector,count);
#else
	r = (DRESULT)diskio_std_write(pdrv,buff,sector,count);
#endif
	
	return RES_OK;
}



/*-----------------------------------------------------------------------*/
/* Miscellaneous Functions                                               */
/*-----------------------------------------------------------------------*/

DRESULT disk_ioctl (
	BYTE pdrv,		/* Physical drive nmuber (0..) */
	BYTE cmd,		/* Control code */
	void *buff		/* Buffer to send/receive control data */
)
{
	DRESULT r;

#ifdef USE_WL
    r = (DRESULT)diskio_wl_ioctl(pdrv,cmd,buff);
#else
	r = (DRESULT)diskio_std_ioctl(pdrv,cmd,buff);
#endif

	return RES_OK;
}


DWORD get_fattime(void)
{
    struct tm *tp;
    time_t t = time(NULL);
    
    tp = localtime(&t);
    int year = tp->tm_year < 80 ? 0 : tp->tm_year - 80;
    return    ((DWORD)(year) << 25)
            | ((DWORD)(tp->tm_mon + 1) << 21)
            | ((DWORD)tp->tm_mday << 16)
            | (WORD)(tp->tm_hour << 11)
            | (WORD)(tp->tm_min << 5)
            | (WORD)(tp->tm_sec >> 1);
}


void disk_flush()
{
    
}
