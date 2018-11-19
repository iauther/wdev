
TARGET = wdev
INNER_USE = 0


CUR_DIR = $(shell pwd)
SRC_DIR = $(CUR_DIR)
BLD_DIR = build

BIN_DIR = /usr/bin
BIN_PRE =

CC = $(BIN_DIR)/$(BIN_PRE)gcc
CXX = $(BIN_DIR)/$(BIN_PRE)g++
LD = $(BIN_DIR)/$(BIN_PRE)gcc
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

COBJS = $(addprefix $(BLD_DIR)/,$(CFILES:.c=.o))
DFILES = $(COBJS:.o=.d)
########################################

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

clean:
	rm -rf $(BLD_DIR) $(TARGET)

-include $(DFILES)