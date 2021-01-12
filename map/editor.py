import csv, ujson

features = []

print("Loading Data")
with open('../data/pure_data.json') as f:
	data = ujson.load(f)

def read(inputter, output):
	print("Loading Geojson")
	with open(inputter) as f:
		simple_map = ujson.load(f)
		print('Read')

	with open(inputter) as f:
		new_map = ujson.load(f)
		print("Iterating")

	for index, feature in enumerate(simple_map['features']):
		name = feature['properties']['OA11CD']
		new_map['features'][index]['properties'] = {'m':'OA11CD'}
		try:
			temp = data['O_'+feature['properties']['OA11CD']]
			for year in temp.keys():
				new_map['features'][index]['properties'][year] = temp[year]
		except Exception as e:
			for year in range(1995,2021):
				short_year = str(year)[2:]
				new_map['features'][index]['properties'][short_year] = None
			print("type error: " + str(e))
		if index % 100000 == 0:
			print(index)

	with open(output, 'w') as f:
		ujson.dump(new_map, f)

##https://geoportal.statistics.gov.uk/datasets/output-areas-december-2011-boundaries-ew-bgc-1
#Intersected ArcGIS (+Repaired first)
read('../data/Maps/OA/oa.geojson', 'oa.geojson')
#https://www.ordnancesurvey.co.uk/business-government/products/vectormap-district
read('../data/Maps/Intersect/intersect.geojson', 'intersect.geojson')