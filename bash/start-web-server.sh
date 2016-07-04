#!/bin/bash

port=60923
scriptDir=`pwd`"/"`dirname $0`
rootDir="${scriptDir}/../viz_templates/"
process=`ps  | grep http-server | grep -v grep | cut -d ' ' -f 1`

if [ -z $process ]; then
  echo "Web server is not started starting it with rootDir: ${rootDir}"
  node node_modules/http-server/bin/http-server  ${rootDir} -p $port &
else 
  echo "Web server is already started pid:${process}, Using the same web server."
fi