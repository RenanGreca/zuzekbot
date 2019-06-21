#!/bin/awk

# Print header
BEGIN {
    printf("# zuzekbot\n## Emojis");
    printf("\n%-11s | Emoji\n", "Nome");
    printf("------------|------\n");
    FS="\"";
}

# Skip '[' and ']' brackets and output the rest in md format
/[^\[\]]/ {
    sub(".", "", $5);  
    printf("%-11s | ![%s](%s)\n", $4, $4, $8);
}


