#!/bin/awk

# Print header
BEGIN {
    printf("# zuzekbot\n## Emojis");
    printf("\n%-11s | Emoji\n", "Nome");
    printf("------------|------\n");
}

# Skip '[' and ']' brackets and output the rest in md format
/[^\[\]]/ {
    gsub("\"", "");
    gsub(",", "", $3);
    sub(".","",$5);  
    printf("%-11s | ![%s](%s)\n", $3, $3, $5);
}
