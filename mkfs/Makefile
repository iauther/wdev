
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
    CFILES += wl/src/diskio_wl.c \
              wl/src/file.c \
              wl/src/log.c
              
    CPPFILES += wl/src/crc.cpp \
                wl/src/crc32.cpp \
                wl/src/Partition.cpp \
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

$(info $(CPPFILES))

IFLAGS += $(addprefix -I$(SRC_DIR)/,$(IDIRS))

FLAGS = -MMD -MP -MF $(@:.o=.d)
CFLAGS += -c -std=c99 $(FLAGS) $(IFLAGS) $(DFLAGS)
CXXFLAGS += -c -std=c++11 $(FLAGS) $(IFLAGS) $(DFLAGS)
LDFLAGS += #-lc #-lrt -pthread

########################################


.PHONEY: all clean

all: $(TARGET)

$(TARGET): $(OBJS)
	$(LD) $(LDFLAGS) $^ -o $@

$(BLD_DIR)/%.o: $(SRC_DIR)/%.c Makefile
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) $< -o $@

$(BLD_DIR)/%.o: $(SRC_DIR)/%.cpp Makefile
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $< -o $@

clean:
	rm -rf $(BLD_DIR) $(TARGET)

-include $(DFILES)