import csv
from re import match

data = []
with open('2012.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        data.append(row)

string = '''1-Bhadohi, Jahid Beg SP
2-Mohammadabad,  Sibgatulla Ansari Independent
3-Zahoorabad, Syeda Shadab Fatima, SP
4-Jaunpur,  Nadeem Javed, Congress
5-Sikanderpur,  Jiauddin Rizvi  SP
6-Mau,  Mukhtar Ansari, Independent
7-Didarganj,  Adil Sheikh , SP
8-Nizamabad, Alambadi,  SP
9-Mubarakpur,  Shah Alam,  BSP
10-Gopalpur,  Waseem Ahmad,  SP
11-Rampur Karkhana, Choudhari Fasiha Bashir, SP
12-Pathardeva, Shakir Ali, SP
13-Khalilabad, Dr. Mohd Ayub, Peace party
14-Dumariyaganj, Kamal Yusuf Malik, Peace party
15-Utraula,  Arif Anwar Hashmi,  SP
16-Tulsipur, Abdul Mashhood Khan, SP
17-Shravasti, Muhammad Ramjan, SP
18-Bahraich, Dr. Waqar Ahmad Shah, SP
19-Tanda, Azimulhaque Pahlwan, SP
20-Kursi, Farred Mahfooz Kidwai, SP
21-Allahabad South, Haji Parvez Ahmed, SP
22-Phulpur, Sayeed Ahamad, SP
23-Phaphamau. Ansar Ahmad, SP
24-Chail, Mohd Ashif Jafri, BSP
25-Husainganj, Mohd Asif, BSP
26-Fatehpur, Syed Qasim Hasan, SP
27-Sisamau, Haji Irfan Solanki, SP
28-Bhojpur, Jamaluddin Siddiqui, SP
29-Isauli, Abrar Ahmad, SP
30-Tiloi, Mohd. Muslim, Congress
31-Lucknow West, Mohd Rehman, SP
32-Bangarmau, Badlu Khan, SP
33-Shahabad, Babu Khan, SP
34-Laharpur, Jasmir Ansari, BSP
35-Pilibhit, Riaz Ahmed, SP
36-Bhojipura, Shazil Islam, indep
37-Meerganj, Sultan Baig, BSP
38-Baheri, Ataurrehman, SP
39-Badaun, Abid Raza Khan, SP
40-Bilsi, Musarrat Ali Bittan, BSP
41-Patiyali, Najeewa Khan Zeenat, SP
42-Aligarh, Zafar Aalam, SP
43-Koil, Zameer Ullah Khan, SP
44-Bulandshahr, Mohd Aleem Khan, BSP
45-Muradnagar, Wahab, BSP
46-Loni, Zakir Ali, BSP
47-Siwalkhas, Ghulam Mohammad, SP
48-Hasanpur, Kamal Akhtar, SP
49-Amroha, Mehboob Ali, SP
50-Naugawan Sadat, Ashfaq Ali Khan, SP
51-Rampur, Azam Khan, SP
52-Chamraua, Ali Yusuf Ali, BSP
53-Sambhal, Iqbal Mehmood, SP
54-Bilari, Mohd Irfan, SP
55-Kundarki, Mohammad Rizwan, SP
56-Moradabad Nagar, Mohammad Yusuf Ansari, SP
57-Moradabad Rural, Shameemul Haq, SP
58-Kanth, Aneesur Rehman, Peace party
59-Chandpur, Iqbal, BSP
60-Barhapur, Mohd Ghazi, BSP
61-Najibabad, Tasleem, BSP
62-Meerapur, Jamil Ahmed Qasmi, BSP
63-Charthawal, Noor Saleem Rana, BSP
64-Budhana, Nawazish Alam Khan, SP
'''

muslim = []
selected = []
candidates = string.splitlines()
for i in candidates:
    muslim.append(match(r"\A([^=]+)(-)(.+)\Z", i.split(',')[0]).group(3))

for i in data:
    for j in muslim:
        if i[1].lower() == j.lower():
            i[5] = 'TRUE'
            selected.append(i[1])

print(set(muslim) - set(selected))

with open('test.csv', 'w', newline='') as fp:
    a = csv.writer(fp, delimiter=',')
    a.writerows(data)
