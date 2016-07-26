#!/bin/bash

scriptDir=$(dirname $0)
screenshotter="${scriptDir}/../screenshotter.js"
echo "creating video using ${screenshotter} for chart ${1} at ${2} for ${3} seconds..."

/usr/local/bin/phantomjs $screenshotter $1 $3 | /usr/local/bin/ffmpeg -y -c:v png -f image2pipe -r 24  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart $2
