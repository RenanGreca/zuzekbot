#!/bin/bash

awk -f emojis_to_md.awk jsons/extended_emojis.json > EMOJIS.md
