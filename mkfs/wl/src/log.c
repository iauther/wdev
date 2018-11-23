#include <stdio.h>
#include <stdarg.h>
#include "esp_log.h"


const char *level_str[]={
    "none",
    "error",
    "warn",
    "info",
    "debug",
    "verbose",
};


char buffer[1000];
void esp_log_write(esp_log_level_t level, const char* tag, const char* fmt, ...)
{
    va_list vl;
    va_start(vl, fmt);
    printf("--%s--%s--", tag, level_str[level]);
    vsnprintf(buffer, sizeof buffer,fmt, vl);
    printf("%s\n", buffer);
    //��ȡ�����в���֮��Ϊ�˱��ⷢ������̱������Ҫ�� apָ��رգ���ʵ��������൱�ڽ�args����ΪNULL   
    va_end(vl);
}



