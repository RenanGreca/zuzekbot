#!/bin/bash

node calc_seed.js  9 > seed.txt
node seed_pastebin.js

# remove byproducts calc_seed.js
rm seed.txt 
