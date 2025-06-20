#! /usr/bin/env bash

DEST=./inventory0_compressed
mkdir -p $DEST

for file in ./inventory0/*/*.{png,gif,bmp,tiff,webp,jxl,jpg,jpeg}
do
	if [ -f $file ]
	then
		STYLE_DIR=$(echo $file | cut -d'/' -f3)
		FILE_NAME=$(echo $file | cut -d '/' -f4 | cut -d '.' -f1)
		
		mkdir -p "$DEST/$STYLE_DIR"
		magick "$file" "$DEST/$STYLE_DIR/$FILE_NAME.jpg"
	fi
	
done
