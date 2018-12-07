#ifndef __DATA_H__
#define __DATA_H__

#include "types.h"

#define MAGIC   0xff8899aa
#define IO_BT   (1<<0)
#define IO_I2C  (1<<1)
#define IO_I2S  (1<<2)
#define IO_SPI  (1<<3)
#define IO_USB  (1<<4)
#define IO_GPIO (1<<5)
#define IO_UART (1<<6)
#define IO_ETH  (1<<7)
#define IO_WIFI (1<<8)

enum {
    TYPE_PACK=0,
    TYPE_HDR,
    TYPE_GAIN,
    TYPE_EQ,
    TYPE_DYN,
    TYPE_UPG,
    TYPE_SETUP,
    TYPE_PARAS,
    
    TYPE_MAX,
};

#pragma pack(1)

typedef struct {
    s16 value;
}gain_t;

typedef struct {
    u8      aa;
    u8      bb;
    gain_t  gain;
}eq_t;

typedef struct {
    u8      lang;
    u16     cnt;
}setup_t;

typedef struct {
    u8      ver;
    eq_t    eq;
    setup_t setup;
}paras_t;


typedef struct {
    u32 magic;
    s16 pack[4];
    u8  data[];
}pack_t;

typedef struct {
    u32 itype;
    u32 dtype;
    u32 dlen;
    u8  data[];
}hdr_t;

#pragma pack()

#endif
