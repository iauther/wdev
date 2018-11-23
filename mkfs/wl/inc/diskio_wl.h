// Copyright 2015-2017 Espressif Systems (Shanghai) PTE LTD
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef _DISKIO_WL_DEFINED
#define _DISKIO_WL_DEFINED

#ifdef __cplusplus
extern "C" {
#endif

#include "integer.h"
#include "esp_err.h"
#include "wear_levelling.h"

typedef BYTE	DSTATUS;

int diskio_wl_reg(BYTE pdrv, wl_handle_t handle);

BYTE diskio_wl_index(wl_handle_t handle);

void diskio_wl_unreg(wl_handle_t handle);

int diskio_wl_initialize (BYTE pdrv);

int diskio_wl_status (BYTE pdrv);

int diskio_wl_read (BYTE pdrv, BYTE *buff, DWORD sector, UINT count);

int diskio_wl_write (BYTE pdrv, const BYTE *buff, DWORD sector, UINT count);

int diskio_wl_ioctl (BYTE pdrv, BYTE cmd, void *buff);

#ifdef __cplusplus
}
#endif

#endif // _DISKIO_WL_DEFINED
