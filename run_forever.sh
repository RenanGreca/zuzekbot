#!/bin/bash

# ./run_forever test
# will run the bot on a test server
# this script swaps the values on auth.json so that the "token" key is always set to what we want 

running_on_test_server="false"
if [ "x$1" != "x" ] && [ $1 = "test" ]; then
    running_on_test_server="true"
    echo "Running on Test Server"
fi

if [ "x`grep tokenTest ./jsons/auth.json`" = "x" ]; then
    was_running_on_test_server="true"
else
    was_running_on_test_server="false"
fi

# if it wasn't running on test server and we now want that then we need to update the token on auth.json
if [ $was_running_on_test_server = "false" ] && [ $running_on_test_server = "true" ]; then
    sed -e 's/\"token\"/\"tokenFusion\"/' -e 's/\"tokenTest\"/\"token\"/' -i auth.json
fi	


# if it wasn't running on fusion server and we now want that then we need to update the token on auth.json
if [ $was_running_on_test_server = "true" ] && [ $running_on_test_server = "false" ]; then
    sed -e 's/\"token\"/\"tokenTest\"/' -e 's/\"tokenFusion\"/\"token\"/' -i auth.json
fi	

while true
do
    sleep 1
    node bot.js
    echo "[$(date)] bot exited with code $?. restarting ..."
done
