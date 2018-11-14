IMG="web.bin"
WEBDIR="../.."
TODIR="~/Desktop"


function pack_web() {
    cp -r $1/js
}

function copy_web() {
    cp -r $1/js
}


#make img file
if [ ! -f $IMG ];then
    dd if=/dev/zero of=$IMG bs=1M count=2
    mkfs.vfat F 32 -n "web" $IMG
fi

#copy web files to img
if [ -f $IMG ];then
    tmp=/tmp/_img_
    mkdir -p $tmp
    mount $img $tmp
    if [ $? -eq 0 ];then
    copy_web $WEBDIR $tmp
    umount $tmp
    else
    echo "mount $img failed"
    fi
fi

#copy img to goal dir
#cp $IMG $TODIR/
