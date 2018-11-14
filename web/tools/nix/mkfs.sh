IMG="web.bin"
WEBSRC="../.."
WEBTMP="./web"
IMGDIR="/tmp/_img_"
CPDIR="~/Desktop"

LIB=laya



mangle_js() {
    jss=
    dirs=$WEBTMP/js $WEBTMP/js/lib/$LIB
    for i in $dirs; do
        echo i
    done
#    uglifyjs inet.js -m -o inet.min.js
}

copy_to_tmp() {
    mkdir -p $WEBTMP/js/lib
    
    cp -ruf $1/res   $WEBTMP/
    cp -uf  $1/js/*  $WEBTMP/js/
    cp -ruf $1/js/lib/$LIB $WEBTMP/js/lib/
}

copy_to_img() {
    cp -ruf $WEBTMP/* $WEBTMP/
}


#make img file
make_img() {
    if [ ! -f $IMG ];then
        echo "create $IMG"
        dd if=/dev/zero of=$IMG bs=1M count=2
        mkfs.vfat -F 32 -n "web" $IMG
    fi
}

#copy web files to img
update_img() {
    if [ -f $IMG ];then
        mkdir -p $IMGDIR
        mount -t vfat $IMG $IMGDIR
        if [ $? -eq 0 ];then
        #gulp_web
        rm -rf $IMGDIR
        copy_to_img
        umount $tmp
        else
        echo "mount $img failed"
        fi
    fi
}

clear_all() {
    rm -rf $WEBTMP
}


#process flow ...
copy_to_tmp
mangle_js
make_img
update_img
clear_all