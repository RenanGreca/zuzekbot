#!/bin/bash

node create_pastebin.js

# remove byproducts of create_pastebin.js
rm quotes.txt 

git add feedback.json quotes.json pastebin.json
git commit -m "updated feedbacks, quotes and pastebin"
git push origin master
