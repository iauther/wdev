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
    //��ȡ�����в���֮��Ϊ�˱��ⷢ������̱������Ҫ�� apָ��رգ���ʵ��������൱�ڽ�args����ΪNULL   
    va_end(vl);
}



