IMG="web.bin"
WEBSRC="../.."
WEBTMP="./web"
IMGDIR="/tmp/_img_"
SINGLE="single.js"
CPDIR="~/Desktop"

LIB=laya



mangle_js() {
    fs=""
    js1=$WEBTMP/js/lib/$LIB
    js2=$WEBTMP/js
 
    for i in $js1/*; do
        fs=$fs" $i"
    done
    
    for i in $js2/*; do
        if [ -f $i ]; then
            fs=$fs" $i"
        fi
    done
    
    echo $fs
    #rm $WEBTMP/$SINGLE
    . /etc/profile
    uglifyjs -V
    opt="-m -c"
    uglifyjs $opt -o $WEBTMP/$SINGLE $fs
}

copy_to_tmp() {
    mkdir -p $WEBTMP/js/lib
    
    cp -uf  $WEBSRC/*     $WEBTMP/
    cp -ruf $WEBSRC/res   $WEBTMP/
    cp -uf  $WEBSRC/js/*  $WEBTMP/js/
    cp -ruf $WEBSRC/js/lib/$LIB $WEBTMP/js/lib/
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
clear_all
copy_to_tmp
mangle_js
#make_img
#update_img
