import ujson, h3
from shapely.geometry import Polygon
from shapely_geojson import dumps, Feature, FeatureCollection
from data_maker import getEco
income,cpi,base = getEco()

with open('hexes.geojson') as f:
	data = ujson.load(f)
	hexes = data['features']

with open('data.json') as f:
    data = ujson.load(f)

features = []

for index, hex_item in enumerate(hexes):
	coords = hex_item['geometry']['coordinates']
	name = hex_item['properties']['msoa11cd']

	h3_address = h3.geo_to_h3(coords[0], coords[1], 7)
	hex_boundary = h3.h3_to_geo_boundary(h3_address)
	p = Polygon(hex_boundary)

	props = {'m': name}

	temp = data['M_'+name]
	for year in range(1995,2021):
		short_year = str(year)[2:]
		year = str(year)
		if temp[year] != []:
			props[short_year] = round((temp[year] * base / cpi[year]) / income[year])
		else:
			props[short_year] = None

	feature = Feature(p, props)
	features.append(feature)

feature_collection = FeatureCollection(features)

with open('../hexes.geojson', 'w') as f:
	features = ujson.loads(dumps(feature_collection))
	ujson.dump(features, f)

		