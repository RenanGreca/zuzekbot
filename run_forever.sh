#!/bin/bash

while true
do
    sleep 1
    node bot.js
    echo "[$(date)] bot exited with code $?. restarting ..."
done

