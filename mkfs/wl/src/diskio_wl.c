// Copyright 2015-2017 Espressif Systems (Shanghai) PTE LTD
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <string.h>
#include "diskio.h"
#include "ffconf.h"
#include "ff.h"
#include "esp_log.h"
#include "diskio_wl.h"
#include "wear_levelling.h"

static const char* TAG = "diskio_wl";

wl_handle_t diskio_wl_handles[FF_VOLUMES] = {
        WL_INVALID_HANDLE,
        WL_INVALID_HANDLE,
};


esp_err_t diskio_wl_reg(BYTE pdrv, wl_handle_t handle)
{
    if (pdrv >= FF_VOLUMES) {
        return ESP_ERR_INVALID_ARG;
    }

    diskio_wl_handles[pdrv] = handle;

    return ESP_OK;
}

BYTE diskio_wl_index(wl_handle_t handle)
{
    for (int i = 0; i < FF_VOLUMES; i++) {
        if (handle == diskio_wl_handles[i]) {
            return i;
        }
    }
    return 0xff;
}

void diskio_wl_unreg(wl_handle_t handle)
{
    for (int i = 0; i < FF_VOLUMES; i++) {
        if (handle == diskio_wl_handles[i]) {
            diskio_wl_handles[i] = WL_INVALID_HANDLE;
        }
    }
}



int diskio_wl_initialize (BYTE pdrv)
{
    return 0;
}

int diskio_wl_status (BYTE pdrv)
{
    return 0;
}

int diskio_wl_read (BYTE pdrv, BYTE *buff, DWORD sector, UINT count)
{
    //printf("ff_wl_read - pdrv=%i, sector=%i, count=%i\n", (unsigned int)pdrv, (unsigned int)sector, (unsigned int)count);
    wl_handle_t wl_handle = diskio_wl_handles[pdrv];
    assert(wl_handle+1);
    
    esp_err_t err = wl_read(wl_handle, sector * wl_sector_size(wl_handle), buff, count * wl_sector_size(wl_handle));
    if (err != ESP_OK) {
        printf("wl_read failed (%d)", err);
        return RES_ERROR;
    }
    return RES_OK;
}

int diskio_wl_write (BYTE pdrv, const BYTE *buff, DWORD sector, UINT count)
{
    //printf("ff_wl_write - pdrv=%i, sector=%i, count=%i\n", (unsigned int)pdrv, (unsigned int)sector, (unsigned int)count);
    wl_handle_t wl_handle = diskio_wl_handles[pdrv];
    assert(wl_handle + 1);
    esp_err_t err = wl_erase_range(wl_handle, sector * wl_sector_size(wl_handle), count * wl_sector_size(wl_handle));
    if (err != ESP_OK) {
        printf("wl_erase_range failed (%d)", err);
        return RES_ERROR;
    }
    err = wl_write(wl_handle, sector * wl_sector_size(wl_handle), buff, count * wl_sector_size(wl_handle));
    if (err != ESP_OK) {
        printf("wl_write failed (%d)", err);
        return RES_ERROR;
    }
    return RES_OK;
}

int diskio_wl_ioctl (BYTE pdrv, BYTE cmd, void *buff)
{
    wl_handle_t wl_handle = diskio_wl_handles[pdrv];
    //printf("diskio_wl_ioctl: cmd=%i\n", cmd);
    assert(wl_handle + 1);
    
    switch (cmd) {
    case CTRL_SYNC:
        return RES_OK;
    case GET_SECTOR_COUNT:
        *((DWORD *) buff) = wl_size(wl_handle) / wl_sector_size(wl_handle);
        //ESP_LOGE(TAG, "_______ size: %d, ssize: %d, count: %d\n", wl_size(wl_handle), wl_sector_size(wl_handle), wl_size(wl_handle) / wl_sector_size(wl_handle));
        return RES_OK;
    case GET_SECTOR_SIZE:
        *((WORD *) buff) = wl_sector_size(wl_handle);
        return RES_OK;
    case GET_BLOCK_SIZE:
        return RES_ERROR;
    }
    return RES_ERROR;
}






