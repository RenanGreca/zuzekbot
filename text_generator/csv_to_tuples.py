import csv
import simplejson as json
import string

def check_for_emojis(string, emojis):
    for e in emojis:
        # print(e)
        # print (e[0], e[1])
        string = string.replace(e[0], e[1])
    return string

tuples = []
triples = []

## Load emojis list
with open('emojis.json') as emojisfile:
    emojisdict = json.load(emojisfile, encoding='utf-8')

emojis = []
for e in emojisdict:
    emojicode = ':'+e['name']+':'
    emojistring = '<:'+e['name']+':'+e['id']+'>'

    emojis.append((emojicode, emojistring))

# s = "hahahah :naner: hahaha"
# s = check_for_emojis(s, emojis)
# print(s)

# exit(0)

## Load messages from CSV
with open('Nintendo Fusion - geral [466183286683729931].csv', 'r', encoding='utf-8') as csvfile, open('tuples.txt', 'w', newline='', encoding='utf-8') as tuplefile:
    rows = csv.reader(csvfile, delimiter=',')
    # rows.next()
    for row in rows:
        s = row[3]
        # table = string.maketrans({key: None for key in string.punctuation})
        s = check_for_emojis(s, emojis)
        split = s.split(' ')

        for index in range(0, len(split)-1):
            a = split[index]
            b = split[index+1]

            if len(a) > 0 and len(b) > 0:
                tuplefile.write(a+' '+b+'\n')
                
                tuples.append((a, b))

        for index in range(0, len(split)-2):
            a = split[index]
            b = split[index+1]
            c = split[index+2]

            if len(a) > 0 and len(b) > 0 and len(c) > 0:
                # tuplefile.write(a+' '+b+'\n')
                triples.append((a+" "+b, c))

d = {}

for t in tuples:
    d[t[0].lower()] = []
for t in triples:
    d[t[0].lower()] = []

for t in tuples:
    d[t[0].lower()].append(t[1])
for t in triples:
    d[t[0].lower()].append(t[1])


with open('words.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(d, jsonfile, ensure_ascii=False, encoding="utf-8")