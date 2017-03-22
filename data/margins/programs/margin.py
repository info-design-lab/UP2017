import json
import csv
import random

data = json.load(open('margins 2017.json', 'r'))
candidates_data = [data[i]['candidate_json'] for i in range(0, len(data))]
final_array = []
for i in range(0, len(candidates_data)):
    d = {}
    d['const_code'] = i + 1
    d['constituency'] = data[i]['constituency']
    d['win_party'] = candidates_data[i][0]['party']
    d['win_votes'] = int(candidates_data[i][0]['votes'])
    d['second_party'] = candidates_data[i][1]['party']
    d['second_votes'] = int(candidates_data[i][1]['votes'])
    first_max = int(candidates_data[i][0]['votes'])
    second_max = int(candidates_data[i][1]['votes'])
    d['None of the Above'] = candidates_data[i][len(candidates_data[i]) - 1]['votes']
    d['margin'] = first_max - second_max
    total = 0
    for j in candidates_data[i]:
        total = total + int(j['votes'])
    d['percent'] = d['margin']/total*100
    final_array.append(d)

with open('dump.txt', 'w') as outfile:
    json.dump(final_array, outfile)
