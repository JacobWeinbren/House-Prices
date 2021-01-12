import csv, ujson

features = []

#In E/W
with open('hexes.geojson') as f:
	simple_map = ujson.load(f)
	for index, feature in enumerate(simple_map['features']):
		features.append(feature['properties']['msoa11cd'])

#Creates Simplified Postcode Data For Reading
with open('postcodes.csv', 'r') as full:
	with open('convert.csv', 'w') as convert:
		writer = csv.writer(convert, delimiter=',', quoting=csv.QUOTE_MINIMAL)
		writer.writerow(['postcode', 'oa', 'msoa', 'lat', 'long'])

		reader = csv.DictReader(full, delimiter=',')

		for index, postcode in enumerate(reader):
			if postcode['msoa11'] in features:
				writer.writerow([postcode['pcds'], postcode['oa11'], postcode['msoa11'], postcode['lat'], postcode['long']])
			if index % 100000 == 0:
				print(index)