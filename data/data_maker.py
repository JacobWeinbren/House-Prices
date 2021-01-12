import ujson
import csv
from dict2xml import dict2xml as xmlify
import copy

def getEco():
	print("Collecting Inflation Data...")
	income = {}
	cpi = {}
	with open('cpi.csv', 'r') as full:
		reader = csv.DictReader(full, delimiter=',')
		for row in reader:
			year = row["Year"]
			cpi[year] = float(row["CPI"])
			income[year] = round(float(row['Inc'].replace(',','')))
	base = cpi["2020"]
	return income,cpi,base

if __name__ == "__main__":
	income,cpi,base = getEco()

	twenty = {"20":[]}

	print("Reading Files")
	with open('data.json') as f:
	    data = ujson.load(f)

	print("Creating Compressed Files, Adjusted for Income and CPI...")
	new_data = copy.deepcopy(data)

	for item in data.keys():
		temp_data = data[item]
		for year in temp_data:
			short_year = str(year)[2:]
			if temp_data[year] != []:
				val = round( (temp_data[year] * base / cpi[year]) / income[year])
				new_data[item][short_year] = val
				if short_year == "20":
					twenty["20"].append(val)
			else:
				new_data[item][short_year] = None
			new_data[item].pop(year)

	with open("pure_data.json", "w") as file:
		ujson.dump(new_data, file)

	for item in data.keys():
		if item.startswith('O_'):
			new_data.pop(item)

	with open("../twenty.json", "w") as file:
		ujson.dump(twenty, file)

	with open("../data.json", "w") as file:
		ujson.dump(new_data, file)

#https://docs.google.com/spreadsheets/d/1wPqbpLXIHzRKJuseX67vxX1ABxcfoxG-QfNbKrMLXi0/edit#gid=0