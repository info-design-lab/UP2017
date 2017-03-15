import json
import csv
import random

data = json.load(open('margins 2017.json', 'r'))

final = ''

for i in data:

    final = final + "<option value='" + i["const_code"] + "'> "  +  i["constituency"] + "</option>"

with open('dump.txt', 'w') as outfile:
    json.dump(final, outfile)
