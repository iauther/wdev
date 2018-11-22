#pragma once

#include <stdint.h>
#include <stdio.h>

#include "sdkconfig.h"

#ifdef __cplusplus
extern "C" {
#endif

#define heap_caps_malloc(a, b)  NULL
#define MALLOC_CAP_INTERNAL     0
#define MALLOC_CAP_8BIT         0

#define LOG_LOCAL_LEVEL         CONFIG_LOG_DEFAULT_LEVEL

typedef enum {
    ESP_LOG_NONE,       /*!< No log output */
    ESP_LOG_ERROR,      /*!< Critical errors, software module can not recover on its own */
    ESP_LOG_WARN,       /*!< Error conditions from which recovery measures have been taken */
    ESP_LOG_INFO,       /*!< Information messages which describe normal flow of events */
    ESP_LOG_DEBUG,      /*!< Extra information which is not necessary for normal use (values, pointers, sizes, etc). */
    ESP_LOG_VERBOSE     /*!< Bigger chunks of debugging information, or frequent messages which can potentially flood the output. */
} esp_log_level_t;

#define LOG_COLOR_E
#define LOG_COLOR_W
#define LOG_COLOR_I
#define LOG_COLOR_D
#define LOG_COLOR_V
#define LOG_RESET_COLOR

#undef _Static_assert
#define _Static_assert(cond, message)
void esp_log_write(esp_log_level_t level, const char* tag, const char* format, ...);

#define ESP_LOGE( tag, format, ... )  if (LOG_LOCAL_LEVEL >= ESP_LOG_ERROR)   { esp_log_write(ESP_LOG_ERROR,   tag, format, ##__VA_ARGS__); }
#define ESP_LOGW( tag, format, ... )  if (LOG_LOCAL_LEVEL >= ESP_LOG_WARN)    { esp_log_write(ESP_LOG_WARN,    tag, format, ##__VA_ARGS__); }
#define ESP_LOGI( tag, format, ... )  if (LOG_LOCAL_LEVEL >= ESP_LOG_INFO)    { esp_log_write(ESP_LOG_INFO,    tag, format, ##__VA_ARGS__); }
#define ESP_LOGD( tag, format, ... )  if (LOG_LOCAL_LEVEL >= ESP_LOG_DEBUG)   { esp_log_write(ESP_LOG_DEBUG,   tag, format, ##__VA_ARGS__); }
#define ESP_LOGV( tag, format, ... )  if (LOG_LOCAL_LEVEL >= ESP_LOG_VERBOSE) { esp_log_write(ESP_LOG_VERBOSE, tag, format, ##__VA_ARGS__); }


#define LOGE    ESP_LOGE
#define LOGW    ESP_LOGW
#define LOGI    ESP_LOGI
#define LOGD    ESP_LOGD
#define LOGV    ESP_LOGV


// Assume that flash encryption is not enabled. Put here since in partition.c
// esp_log.h is included later than esp_flash_encrypt.h.
#define esp_flash_encryption_enabled()      false

#ifdef __cplusplus
}
#endif
