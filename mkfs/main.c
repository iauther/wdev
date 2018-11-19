#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>
#include "ff.h"


static const char *fatfs_error_to_string(FRESULT err)
{
  switch (err) {
  case FR_OK: return "Succeeded";
  case FR_DISK_ERR: return "FATFS: A hard error occurred in the low level disk I/O layer";
  case FR_INT_ERR: return "FATFS: Assertion failed (check for corruption)";
  case FR_NOT_READY: return "FATFS: The physical drive cannot work";
  case FR_NO_FILE: return "FATFS: Could not find the file";
  case FR_NO_PATH: return "FATFS: Could not find the path";
  case FR_INVALID_NAME: return "FATFS: The path name format is invalid";
  case FR_DENIED: return "FATFS: Access denied due to prohibited access or directory full";
  case FR_EXIST: return "FATFS: Destination file already exists";
  case FR_INVALID_OBJECT: return "FATFS: The file/directory object is invalid";
  case FR_WRITE_PROTECTED: return "FATFS: The physical drive is write protected";
  case FR_INVALID_DRIVE: return "FATFS: The logical drive number is invalid";
  case FR_NOT_ENABLED: return "FATFS: The volume has no work area";
  case FR_NO_FILESYSTEM: return "FATFS: There is no valid FAT volume";
  case FR_MKFS_ABORTED: return "FATFS: f_mkfs() aborted due to a parameter error. Try adjusting the partition size.";
  case FR_TIMEOUT: return "FATFS: Could not get a grant to access the volume within defined period";
  case FR_LOCKED: return "FATFS: The operation is rejected according to the file sharing policy";
  case FR_NOT_ENOUGH_CORE: return "FATFS: LFN working buffer could not be allocated";
  case FR_TOO_MANY_OPEN_FILES: return "FATFS: Number of open files > _FS_SHARE";
  default:
  case FR_INVALID_PARAMETER: return "FATFS: Invalid parameter";
  }
}


#define FCHK(a) { FRESULT res = a; printf("call %s res %d %s\n", #a, res, fatfs_error_to_string(res)); };



int main(int argc, char **argv)
{
    int fd;
    char b[4096];
    FATFS fs;

    int fno = open("abc.dat", O_CREAT|O_SYNC|O_RDWR, S_IRUSR|S_IWUSR);
    printf("fno = %d\n", fno);
    int i = 0;
    char buf[512]={0};
    while (i < SECCOUNT) {
        //printf("size = %ld\n", write(fno, buf, 512));
        write(fno, buf, 512);
    i++;
    }
    close(fno);
    fno = -1;
    //  f_mount(&fs, "", 0); 
    //  f_mkfs("", FM_FAT, 2*512, b, 4096);
    FCHK(f_mkfs("", FM_SFD|FM_FAT, 0, b, 4096));
    
    
    
    
    
    return 0;
}

