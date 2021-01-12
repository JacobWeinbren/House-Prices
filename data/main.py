import datetime
import json
import csv
import statistics
import postcodes_io

data = {}
convert = {}

print("Reading Postcode -> MSOA data")
with open('convert.csv', 'r') as file:
	reader = csv.DictReader(file, delimiter=',')
	for index, item in enumerate(reader):
		msoa = item['msoa']
		oa = item['oa']
		convert[item['postcode']] = (msoa, oa)
		data['M_'+msoa] = {}
		data['O_'+oa] = {}
		for year in range(1995,2021):
			data['M_'+msoa][year] = []
			data['O_'+oa][year] = []
		if index % 100000 == 0:
			print(index) 

print("Creating Data File")
index = 0
with open('pricing.csv', 'r') as file:
	fieldnames = ['id', 'price', 'date', 'postcode', 'type', 'age', 'duration', 'paon', 'soan', 'street', 'locality', 'town', 'district', 'county', 'ppd', 'status']
	temp = csv.DictReader(file, delimiter=',', fieldnames=fieldnames)

	for index, item in enumerate(temp):
		postcode = item["postcode"]
		if postcode:
			try:
				temp = convert[postcode]
				msoa = temp[0]
				oa = temp[1]
				year = datetime.datetime.strptime(item["date"], '%Y-%m-%d %H:%M').year
				data['M_'+msoa][year].append(float(item['price']))
				data['O_'+oa][year].append(float(item['price']))
			except Exception as err:
				print("ERR", postcode, err)
		if index % 100000 == 0:
			print("IND", index) 

print("Collecting Averages")
for field in data:
	for year in range(1995,2021):
		if len(data[field][year]):
			data[field][year] = round(statistics.mean(data[field][year]), 2)

print("Writing File")
with open('data.json', 'w') as file:
	json.dump(data, file, ensure_ascii=False, indent=4)