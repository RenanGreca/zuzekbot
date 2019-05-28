#!/bin/bash

# IMPORTANT NOTE
# This file uses explicit file paths. It only works if called from the repository's root directory
# It breaks otherwise. (too lazy to deal with this in a robust way...)

# cut:   gets the columns that we want (rank, name, points) 
# sed:   does a few regex substitutions to turn the input into a valid JSON file. Quick and dirty.

cut ranking.csv -d"," -f1,2,3 | \
sed -e 's/^/\ \ {\ "rank": /g' \
    -e 's/\ [0-9]*,/&\ "name": /g' \
    -e 's/[0-9]*$/\ "points": &\ },/g' \
    -e '1 s/^.*$/\[\n/g' \
    -e '$ s/.$/\n\]/' > jsons/ranking.json
