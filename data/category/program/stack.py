import csv
from re import match

data = []
with open('2007.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        data.append(row)

d = {
'BJP' : [0,0,0,0,0],
'INC' : [0,0,0,0,0],
'BSP' : [0,0,0,0,0],
'SP' : [0,0,0,0,0],
'Others' : [0,0,0,0,0]
}

#['const_id', 'const_name', 'category', 'gender', 'party', 'muslim', 'C&G', 'G&M', 'M&C']

for j in data:
    try:
        if ((j[2] == "S.C.") & (j[3] == "M") & (j[5] == "FALSE")):
            d[j[4]][0] += 1
        elif ((j[2] == "S.C.") & (j[3] == "F") & (j[5] == "FALSE")):
            d[j[4]][1] += 1
        elif ((j[2] != "S.C.") & (j[3] == "F") & (j[5] == "FALSE")):
            d[j[4]][2] += 1
        elif ((j[2] != "S.C.") & (j[3] == "F") & (j[5] != "FALSE")):
            d[j[4]][3] += 1
        elif ((j[3] != "F") & (j[5] != "FALSE")):
            d[j[4]][4] += 1
    except:
        if ((j[2] == "S.C.") & (j[3] == "M") & (j[5] == "FALSE")):
            d['Others'][0] += 1
        elif ((j[2] == "S.C.") & (j[3] == "F") & (j[5] == "FALSE")):
            d['Others'][1] += 1
        elif ((j[2] != "S.C.") & (j[3] == "F") & (j[5] == "FALSE")):
            d['Others'][2] += 1
        elif ((j[2] != "S.C.") & (j[3] == "F") & (j[5] != "FALSE")):
            d['Others'][3] += 1
        elif ((j[3] != "F") & (j[5] != "FALSE")):
            d['Others'][4] += 1

res = [['party', 'S', 'S&F', 'F', 'F&M', 'M']]
for i in d:
    res.append([i, *d[i]])
print(res)
with open('stack_2007.csv', 'w', newline='') as fp:
    a = csv.writer(fp, delimiter=',')
    a.writerows(res)
