#include <stdio.h>
#include <stdarg.h>
#include "esp_log.h"

char buffer[1000];
void esp_log_write(esp_log_level_t level, const char* tag, const char* fmt, ...)
{
    va_list vl;
    va_start(vl, fmt);
    printf("--%s--", tag);
    vsnprintf(buffer, sizeof buffer,fmt, vl);
    printf("%s", buffer);
    //获取完所有参数之后，为了避免发生程序瘫痪，需要将 ap指针关闭，其实这个函数相当于将args设置为NULL   
    va_end(vl);
}



