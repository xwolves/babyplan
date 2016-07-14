#! /bin/bash/
ret=`ps -ef|grep fdfs_http_upload| grep -v grep |grep -v tail| awk '{print $2}'`
echo ${ret}
kill -9 ${ret}
