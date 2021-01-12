Step 1 / Download Files

a. Vector Mapshttps: www.ordnancesurvey.co.uk/business-government/products/vectormap-district
b. Postcode Directory: www.geoportal.statistics.gov.uk/datasets/ons-postcode-directory-november-2020
c. Price Paid Data (Dec 2020) https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads
d. MSOA Boundaries: https://geoportal.statistics.gov.uk/datasets/middle-layer-super-output-areas-december-2011-boundaries-ew-bfe
e. Centroids: https://geoportal.statistics.gov.uk/datasets/b0a6d8a3dc5d4718b3fd62c548d60f81_0
f. Output Area Boundaries: https://geoportal.statistics.gov.uk/datasets/output-areas-december-2011-boundaries-ew-bgc-1
g. cpi: https://docs.google.com/spreadsheets/d/1wPqbpLXIHzRKJuseX67vxX1ABxcfoxG-QfNbKrMLXi0/edit#gid=0

Step 2 / Run MSOA Postcode Table.py 

Step 3 / Run Main.py

Step 4 / Run Data Maker.py

Step 5 / Run Hex Maker.py

Step 6 / In ARCGIS - Run Repair on the OA...and buildings if you have the memory (I don't). Then run intersect. Put these in the maps folder

Step 7 / Run these commands

mapshaper OA_2.shp -o oa.geojson
mapshaper-xl 16gb Intersect.shp -proj wgs84 -o intersect.geojson precision=0.0000001

Step 8 / Run these commands

tippecanoe --output=oa.mbtiles --coalesce-smallest-as-needed --coalesce-densest-as-needed --coalesce-fraction-as-needed --simplify-only-low-zooms --no-feature-limit --no-tile-size-limit --detect-shared-borders --include=OA11CD oa.geojson

tippecanoe --output=intersect.mbtiles --coalesce-smallest-as-needed --coalesce-densest-as-needed --coalesce-fraction-as-needed --simplify-only-low-zooms --no-feature-limit --no-tile-size-limit --detect-shared-borders --include=OA11CD intersect.geojson

Step 9 / Run these commands on backend

ssh root@206.189.22.89  
docker run -it -v $(pwd):/data -p 8080:80 klokantech/tileserver-gl --silent -c config.json
python3 -m http.server (if you're testing)