#ifndef __FILE_H__
#define __FILE_H__

#include "esp_err.h"
#include "esp_partition.h"

#ifdef __cplusplus
extern "C" {
#endif

esp_err_t file_partition_init(const esp_partition_t *partition);

esp_err_t file_partition_free();

esp_err_t file_partition_erase(size_t start_address, size_t size);

esp_err_t file_partition_read(size_t dest_addr, void *src, size_t size);

esp_err_t file_partition_write(size_t dest_addr, const void *src, size_t size);


#ifdef __cplusplus
}
#endif

#endif
