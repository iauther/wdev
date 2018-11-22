#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include "ffconf.h"
#include "file.h"


static int pfd=-1;
esp_err_t file_partition_init(const esp_partition_t *partition)
{
    pfd = open(IMAGE, O_SYNC|O_RDWR, S_IRUSR|S_IWUSR);
    
    return ESP_OK;
}


esp_err_t file_partition_free()
{
    close(pfd);
    
    return ESP_OK;
}



esp_err_t file_partition_erase(size_t start_address, size_t size)
{
    unsigned char buf[size];
    
    memset(buf, 0xff, sizeof buf);
    lseek(pfd, start_address, SEEK_SET);
    write(pfd, buf, sizeof buf);
    
    return ESP_OK;
}


esp_err_t file_partition_read(size_t dest_addr, void *src, size_t size)
{
    lseek(pfd, dest_addr, SEEK_SET);
    read(pfd, src, size);
    
    return ESP_OK;
}


esp_err_t file_partition_write(size_t dest_addr, const void *src, size_t size)
{
    lseek(pfd, dest_addr, SEEK_SET);
    write(pfd, src, size);
    
    return ESP_OK;
}