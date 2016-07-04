#!/bin/bash

scriptDir=$(dirname $0)
screenshotter="${scriptDir}/../screenshotter.js"
echo "creating video using ${screenshotter} for chart ${1} at ${2}..."

/usr/local/bin/phantomjs $screenshotter $1 3 | /usr/local/bin/ffmpeg -y -c:v png -f image2pipe -r 25 -t 10  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart $2
