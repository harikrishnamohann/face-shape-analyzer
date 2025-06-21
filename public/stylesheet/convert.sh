#! /usr/bin/env bash

DEST=./converted
mkdir -p $DEST

PREV_STYLE=""
for file in ./inventory0/*/*.{png,gif,bmp,tiff,webp,jxl,jpg,jpeg}
do
	if [ -f $file ]
	then
		STYLE_DIR=$(echo $file | cut -d'/' -f3)
		[ $STYLE_DIR != $PREV_STYLE ] && i=0
		FILE_NAME=$(echo $file | cut -d '/' -f4 | cut -d '.' -f1)

		mkdir -p "$DEST/$STYLE_DIR"
		cp "$file" "$DEST/$STYLE_DIR/$i.jpg"

		# magick -quality 100 +compress "$file" "$DEST/$STYLE_DIR/$FILE_NAME.jpg"
		# trash "$file"

		i=$[i+1]
		PREV_STYLE=$STYLE_DIR
	fi

done
