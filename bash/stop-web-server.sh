#!/bin/bash

port=60923
scriptDir=`pwd`"/"`dirname $0`
rootDir="${scriptDir}/../viz_templates/"
process=`ps  | grep http-server | grep -v grep | cut -d ' ' -f 1`

if [ ! -z $process ]; then 
  echo "Web server is started at pid:${process}, Stopping it."
  kill $process
fi