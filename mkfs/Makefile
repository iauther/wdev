
TARGET=mkfs
USE_WL=1


CUR_DIR = $(shell pwd)
SRC_DIR = $(CUR_DIR)
BLD_DIR = build

BIN_DIR = /usr/bin
BIN_PRE =

CC = $(BIN_DIR)/$(BIN_PRE)gcc
CXX = $(BIN_DIR)/$(BIN_PRE)g++
LD = $(BIN_DIR)/$(BIN_PRE)g++
AS = $(BIN_DIR)/$(BIN_PRE)as
AR = $(BIN_DIR)/$(BIN_PRE)ar
GDB = $(BIN_DIR)/$(BIN_PRE)gdb
DUMP = $(BIN_DIR)/$(BIN_PRE)objdump
STRIP = $(BIN_DIR)/$(BIN_PRE)strip


IDIRS  += . 

CFILES += diskio.c \
          ffsystem.c \
          ffunicode.c \
          ff.c \
          main.c

ifeq ($(USE_WL),1)
    IDIRS  += wl/inc
    CFILES += wl/src/diskio_wl.c
    CPPFILES += wl/src/crc32.cpp \
                wl/src/Partition.cpp \
                wl/src/SPI_Flash.cpp \
                wl/src/WL_Ext_Perf.cpp \
                wl/src/WL_Ext_Safe.cpp \
                wl/src/WL_Flash.cpp \
                wl/src/wear_levelling.cpp
              
    
    DFLAGS += -DUSE_WL
else
    CFILES += diskio_std.c
endif



OBJS = $(addprefix $(BLD_DIR)/,$(CFILES:.c=.o)) $(addprefix $(BLD_DIR)/,$(CPPFILES:.cpp=.o))
DFILES = $(OBJS:.o=.d)
########################################

$(info $(DFILES))

IFLAGS += $(addprefix -I$(SRC_DIR)/,$(IDIRS))

FLAGS = -std=c99 -MMD -MP -MF $(@:.o=.d)
CFLAGS += $(FLAGS) $(IFLAGS) $(DFLAGS)
LDFLAGS += -lc -lrt -pthread

########################################


.PHONEY: all clean

all: $(TARGET)

$(TARGET): $(COBJS)
	$(LD) $(LDFLAGS) $^ -o $@

$(BLD_DIR)/%.o: $(SRC_DIR)/%.c Makefile
	@mkdir -p $(dir $@)
	$(CC) -c $(CFLAGS) $< -o $@

$(BLD_DIR)/%.o: $(SRC_DIR)/%.cpp Makefile
	@mkdir -p $(dir $@)
	$(CXX) -c $(CFLAGS) $< -o $@

clean:
	rm -rf $(BLD_DIR) $(TARGET)

-include $(DFILES)