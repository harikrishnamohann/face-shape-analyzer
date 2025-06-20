#! /usr/bin/env bash
for file in *.{png,gif,bmp,tiff,webp,jxl,jpg,jpeg}
do
	[ -f "$file" ] && magick "$file" "./converted/${file%.*}.jpg"
done
