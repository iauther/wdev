IMG="web.bin"
WEBDIR="../.."
IMGDIR="/tmp/_img_"
SINGLE="single.js"
CPDIR="~/Desktop"

LIB="laya"



mangle_js() {
    fs=""
    js1=$WEBDIR/js/lib/$LIB
    js2=$WEBDIR/js
 
    for i in $js1/*; do
        fs=$fs" $i"
    done
    
    for i in $js2/*; do
        if [ -f $i ]; then
            fs=$fs" $i"
        fi
    done
    
    #source nodejs env
    . /etc/profile
    opt="-m -c"
    uglifyjs $opt -o $WEBDIR/$SINGLE $fs
}

copy_to_tmp() {
    
    
    cp -uf  $WEBDIR/*     $WEBTMP/
    cp -ruf $WEBDIR/res   $WEBTMP/
    cp -uf  $WEBDIR/js/*  $WEBTMP/js/
    cp -ruf $WEBDIR/js/lib/$LIB $WEBTMP/js/lib/
}

copy_to_img() {
    rm -rf $IMGDIR/*
    mkdir -p $IMGDIR/js/lib
    
    cp -uf  $WEBDIR/*     $IMGDIR/
    cp -ruf $WEBDIR/res   $WEBTMP/
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
        copy_to_img
        umount $tmp
        else
        echo "mount $img failed"
        fi
    fi
}


#process flow ...
mangle_js
#make_img
#update_img
