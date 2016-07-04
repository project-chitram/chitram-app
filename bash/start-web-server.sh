#!/bin/bash

port=90923
scriptDir=`pwd`"/"`dirname $0`
rootDir='${scriptDir}/../'
process=`ps  | grep http-server | grep -v grep | cut -d ' ' -f 1`

if [ $? -ne 0 ]; then
  echo "http server is not started starting it with rootDir: ${rootDir}"
  node node_modules/http-server/bin/http-server  ${rootDir} -p $port &
else 
  echo "Http server is already started at ${process} hello"
fi