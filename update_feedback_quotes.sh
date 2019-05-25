#!/bin/bash

node modules/quotes_pastebin.js

# remove byproducts of quotes_pastebin.js
rm quotes.txt 

git add jsons/feedback.json jsons/quotes.json jsons/pastebin.json
git commit -m "updated feedbacks, quotes and pastebin"
git push origin master
