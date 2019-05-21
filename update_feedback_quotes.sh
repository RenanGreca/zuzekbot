#!/bin/bash

node quotes_pastebin.js

# remove byproducts of quotes_pastebin.js
rm quotes.txt 

git add feedback.json quotes.json pastebin.json
git commit -m "updated feedbacks, quotes and pastebin"
git push origin master
