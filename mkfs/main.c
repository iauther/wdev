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
    char    *info;
}err_t;


static char* my_err[FR_MAX]={
    "Succeeded",                                                                        //FR_OK,                     
    "A hard error occurred in the low level disk I/O layer",                            //FR_DISK_ERR,               
    "Assertion failed (check for corruption)",                                          //FR_INT_ERR,                    
    "The physical drive cannot work",                                                   //FR_NOT_READY,                          
    "Could not find the file",                                                          //FR_NO_FILE,                                
    "Could not find the path",                                                          //FR_NO_PATH,                
    "The path name format is invalid",                                                  //FR_INVALID_NAME,           
    "Access denied due to prohibited access or directory full",                         //FR_DENIED,                             
    "Destination file already exists",                                                  //FR_EXIST,                  
    "The file/directory object is invalid",                                             //FR_INVALID_OBJECT,                 
    "The physical drive is write protected",                                            //FR_WRITE_PROTECTED,                
    "The logical drive number is invalid",                                              //FR_INVALID_DRIVE,                      
    "The volume has no work area",                                                      //FR_NOT_ENABLED,                                    
    "There is no valid FAT volume",                                                     //FR_NO_FILESYSTEM,                      
    "f_mkfs() aborted due to a parameter error. Try adjusting the partition size.",     //FR_MKFS_ABORTED,                               
    "Could not get a grant to access the volume within defined period",                 //FR_TIMEOUT,                        
    "The operation is rejected according to the file sharing policy",                   //FR_LOCKED,                                 
    "LFN working buffer could not be allocated",                                        //FR_NOT_ENOUGH_CORE,                        
    "Number of open files > _FS_SHARE",                                                 //FR_TOO_MANY_OPEN_FILES,                                            
    "Invalid parameter",                                                                //FR_INVALID_PARAMETER,          
};


#define CHK(a,b) printf("___%s, %d, %s\n", a, b, my_err[b])


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
                if(strcmp(ent->d_name,".") && strcmp(ent->d_name,"..")) {
                    snprintf(tmp, sizeof tmp, "%s/%s", path, ent->d_name);  
                    f_copy(tmp);
                }
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
            
            int wl;
            if(f_open (&fp, dn.name, FA_CREATE_NEW|FA_WRITE)==FR_OK) {
                printf("____ copy %s ...\n", dn.name);
                fr = f_write(&fp, buf, st.st_size, &wl);
                CHK("f_write", fr);
                f_close(&fp);
                printf("____ f_close\n");
            }
            else {
                printf("____ create %s failed\n", dn.name);
            }
            
            free(buf);
        }
    }
}

/////////////////////////////////////////

#define SIZE   (2*1024*1024)
#define LABEL   "web"
int main(int argc, char **argv)
{
    int fd;
    char *ptr;
    FATFS fs;
    FRESULT fr;
    BYTE work[FF_MAX_SS];
    
    remove(IMAGE);
    mkimage(IMAGE, SIZE);
    CHK("mkfs", f_mkfs("", FM_ANY, 0, work, sizeof work));

    CHK("mount", f_mount(&fs, IMAGE, 0));
    printf("123\n");
    CHK("setlabel", f_setlabel(LABEL));
    printf("abc\n");
    /*
    f_copy("./build");
    CHK("unmount", f_unmount(IMAGE));
    */
    return 0;
}

