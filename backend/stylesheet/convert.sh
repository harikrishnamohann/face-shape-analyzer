#!/usr/bin/env bash

DEST=./converted
mkdir -p "$DEST"

PREV_STYLE=""
i=0

find ./inventory/ -type f \( -iname '*.png' -o -iname '*.webp' -o -iname '*.jxl' -o -iname '*.jpg' -o -iname '*.jpeg' \) | while IFS= read -r file
do
    STYLE_DIR=$(echo "$file" | cut -d'/' -f3)
    [ "$STYLE_DIR" != "$PREV_STYLE" ] && i=0

    FILE_NAME=$(basename "$file" | cut -d '.' -f1)
    mkdir -p "$DEST/$STYLE_DIR"

    magick -quality 100 +compress "$file" "$DEST/$STYLE_DIR/$i.jpg" && echo -n "$DEST/$STYLE_DIR/$i.jpg" && echo " ☑" || echo -e "\e[31m ☒\e[0m"

    ((i++))
    PREV_STYLE="$STYLE_DIR"
done
