#!/bin/bash

scriptDir=$(dirname $0)
screenshotter="${scriptDir}/../screenshotter.js"
echo "creating video using ${screenshotter} for chart ${1} at ${2} for ${3} seconds..."

phantomjs="${scriptDir}/../ext/phantomjs/phantomjs"
ffmpeg="${scriptDir}/../ext/ffmpeg/ffmpeg"

echo "Trying to execute: $phantomjs $screenshotter $1 $3 | $ffmpeg -y -c:v png -f image2pipe -r 24  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart $2"

$phantomjs $screenshotter $1 $3 | $ffmpeg -y -c:v png -f image2pipe -r 24  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart $2
