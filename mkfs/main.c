#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <unistd.h>
#include <fcntl.h>
#include <dirent.h>
#include <string.h>
#include <errno.h>
#include "ff.h"

typedef struct {
    int     id;
    char    *str;
}fatfs_error_t;

static fatfs_error_t ffs_err[]={
    {FR_OK,                     "Succeeded"},
    {FR_DISK_ERR,               "A hard error occurred in the low level disk I/O layer"},
    {FR_INT_ERR,                "Assertion failed (check for corruption)"},
    {FR_NOT_READY,              "The physical drive cannot work"},
    {FR_NO_FILE,                "Could not find the file"},
    {FR_NO_PATH,                "Could not find the path"},
    {FR_INVALID_NAME,           "The path name format is invalid"},
    {FR_DENIED,                 "Access denied due to prohibited access or directory full"},
    {FR_EXIST,                  "Destination file already exists"},
    {FR_INVALID_OBJECT,         "The file/directory object is invalid"},
    {FR_WRITE_PROTECTED,        "The physical drive is write protected"},
    {FR_INVALID_DRIVE,          "The logical drive number is invalid"},
    {FR_NOT_ENABLED,            "The volume has no work area"},
    {FR_NO_FILESYSTEM,          "There is no valid FAT volume"},
    {FR_MKFS_ABORTED,           "f_mkfs() aborted due to a parameter error. Try adjusting the partition size."},
    {FR_TIMEOUT,                "Could not get a grant to access the volume within defined period"},
    {FR_LOCKED,                 "The operation is rejected according to the file sharing policy"},
    {FR_NOT_ENOUGH_CORE,        "LFN working buffer could not be allocated"},
    {FR_TOO_MANY_OPEN_FILES,    "Number of open files > _FS_SHARE"},
    {FR_INVALID_PARAMETER,      "Invalid parameter"},
};


#define FSCHK(a,b) {printf("___%s___%d: %s\n", a, b, ffs_err[b].str); if(b>0) exit(1);};

#define SIZE   (2*1024*1024)
#define LABEL   "web"
#define MAX_PATH 300

typedef struct
{
    char dir[MAX_PATH];
    char name[FILENAME_MAX];
}dn_t;


static int path_split(char *path, dn_t *dn)
{
    char *p,*q;
    int i,l;
    
    p = path;
    q = strrchr(path, '/');
    if(!q) {
        return -1;
    }
    l = q-p;
    
    memcpy(dn->dir, p, l);
    dn->dir[l] = 0;
    strcpy(dn->name, q+1);
    
    return 0;
}


static int mkimage(char *path, int len)
{
    #define BLEN 4096
    FILE *fd;
    char buf[BLEN];
    int  i,cnt,left;
    
    cnt = len/BLEN;
    left = len%BLEN;
    fd = fopen(path, "wb");
    if(!fd) {
        //printf("%s open failed\n");//strerror(errno));
        printf("%s open failed %s", strerror(errno));
        return -1;
    }
    
    for(i=0;i<cnt;i++) {
        fwrite(buf, 1, BLEN, fd);
    }
    fwrite(buf, 1, left, fd);
    fclose(fd);
    
    return 0;
}


static int f_copy(char *path)
{
    int len;
    FFILE fp;
    FILE *fd;
    dn_t dn;
    FRESULT fr;
    char *buf;
    DIR *dir;
    char tmp[MAX_PATH];
    struct stat st;
    struct dirent *ent=NULL;
    
    path_split(path, &dn);
    
    printf("___file: %s\n", dn.name);
    stat(path, &st);
    if(S_ISDIR(st.st_mode)) {
        dir = opendir(path);
        if(dir) {
            f_chdir(dn.name);
            while((ent=readdir(dir))) {
                snprintf(tmp, sizeof tmp, "%s/%s", path, ent->d_name);  
                f_copy(tmp);
            }
            
            closedir(dir);
            f_chdir("..");
        }
    }
    else {
        fd = fopen(path, "rb");
        if(fd) {
            buf = malloc(st.st_size);
            fread(buf, 1, st.st_size, fd);
            fclose(fd);
            
            if(f_open (&fp, dn.name, FA_CREATE_NEW)==FR_OK) {
                printf("____ copy %s ...\n", dn.name);
                f_write(&fp, buf, st.st_size, NULL);
                f_close(&fp);
            }
            else {
                printf("____ create %s failed\n", dn.name);
            }
        }
    }
}



int main(int argc, char **argv)
{
    int fd;
    char *ptr;
    FATFS fs;
    FRESULT fr;
    BYTE work[FF_MAX_SS];
    
    mkimage(IMAGE, SIZE);
    
    FSCHK("mkfs", f_mkfs("", FM_SFD|FM_FAT, 0, work, sizeof work));
    FSCHK("setlabel", f_setlabel("0"LABEL));
    
    FSCHK("mount", f_mount(&fs, IMAGE, 0));
    f_copy(".");
    FSCHK("unmount", f_unmount(IMAGE));
    
    return 0;
}

