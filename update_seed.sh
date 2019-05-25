#!/bin/bash

node modules/calc_seed.js  9 > seed.txt
node modules/seed_pastebin.js

# remove byproducts calc_seed.js
rm seed.txt 
