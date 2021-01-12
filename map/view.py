import ujson

with open('oa.geojson') as f:
	new_map = ujson.load(f)

	for index, feature in enumerate(new_map['features']):
		print(feature)