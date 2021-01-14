year = '95';
view = 'buildings';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shorttolong() {
    var temp = parseInt(year);
    if (temp > 50) {
        return '19' + year;
    } else {
        return '20' + year;
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZWRtaWxpYmFuZCIsImEiOiJja2pweWsxZmE3YXJ6MnJsZzM5M2EyYm56In0.qLzLmOafH0vucvXSMWo9Kg';

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-2.3278, 52.8379],
    zoom: 6,
    maxZoom: 14,
    attributionControl: false,
    antialias: true,
}).addControl(new mapboxgl.AttributionControl({
    customAttribution: '<a href="https://www.thesocialreview.co.uk/">TSR</a>'
}));

$.getJSON('twenty.json', function(data) {
    //Data domain
    var twenty = data['20'];

    //Blue and Red 10
    var col_range = ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"];

    colours = d3.scaleQuantile()
        .domain(twenty)
        .range(col_range.reverse());

    var quan = colours.quantiles();
    quan = quan.filter((e, i) => i % 2 == 0);
    quan.unshift(0);

    for (var i = 0; i < quan.length; i++) {
        var tick = quan[i];
        var colour = colours(tick)
        $('.row .container').append($("<div class='box'></div")
            .append($("<div class='text'></div>").html('<p>' + tick + '+</p>'))
            .append($("<div class='colour'></div>").css('background-color', colour))
        );
    }

    //Initial paint of maps
    map.on('load', function() {

        generatePaint()

        map.addLayer({
                "id": "buildings",
                "type": "fill",
                "source": {
                    "type": "vector",
                    "tiles": ["https://www.mapservertsr.xyz/data/intersect/{z}/{x}/{y}.pbf"],
                },
                "source-layer": "intersect",
                'paint': paint
            },
            'waterway-label');

        map.addLayer({
                "id": "areas",
                "type": "fill",
                "source": {
                    "type": "vector",
                    "tiles": ["https://www.mapservertsr.xyz/data/oa/{z}/{x}/{y}.pbf"],
                },
                "source-layer": "oa",
                'paint': paint,
                'layout': {
                    'visibility': 'none'
                }
            },
            'waterway-label');

        map.addSource('hex_source', {
            'type': 'geojson',
            'data': 'hexes.geojson'
        });

        map.addLayer({
                'id': 'msoa',
                'type': 'fill-extrusion',
                'source': 'hex_source',
                "renderingMode": "3d",
                'paint': {
                    'fill-extrusion-color': paint['fill-color'],
                    'fill-extrusion-height': fill,
                    'fill-extrusion-base': 0,
                    'fill-extrusion-opacity': 1
                },
                'layout': {
                    'visibility': 'none'
                }
            },
            'waterway-label');

        map.setLight({
            "anchor": "viewport",
            "color": "white",
            "intensity": 0.4
        });;

        $('#mode-select').click(function() {
            $('#mode-select').toggleClass('active');
            $('#fill-select').removeClass('active');
            if (view == 'msoa') {
                change('buildings');
            } else {
                change('msoa');
            }
        });

        $('#fill-select').click(function() {
            $('#fill-select').toggleClass('active');
            $('#mode-select').removeClass('active');
            if (view == 'areas') {
                change('buildings');
            } else {
                change('areas');
            }
        });

        function progress() {
            y = parseInt(shorttolong()) + 1;
            if (y > 2020) {
                y = 1995;
            }
            $('.draggable').val(y);
            y = y.toString().slice(-2);
            changeyear(y);
        }

        $('.main').click(function() {
            $('.control').toggleClass('pause');
            if ($('.control').hasClass('pause')) {
                progress();
                timer = setInterval(function() {
                    progress();
                }, 2000);
            } else {
                clearInterval(timer);
            }
        });
    });
});

//Get colour scheme for 2D Maps
function generatePaint() {
    paint = {
        'fill-color': [
            'case',
            ['==', ['has', year], true],
            ['interpolate-hcl', ['linear'],
                ['get', year]
            ],
            ["rgba", 191, 191, 191, 0.1]
        ]
    };

    fill = [
        'case',
        ['==', ['has', year], true],
        ['interpolate', ['linear'],
            ['get', year],
            0, 0,
            70, 10000,
            100, 20000,
            2000, 30000
        ],
        0
    ];

    var quan = colours.quantiles();
    quan.unshift(0);

    for (var i = 0; i < quan.length; i++) {
        var tick = quan[i];
        var colour = colours(tick);
        paint['fill-color'][2].push(parseInt(tick));
        paint['fill-color'][2].push(colour);
    }
}

//Perspective change
function change(value) {
    if (value != view) {
        view = value;
        if (value == "buildings") {
            move('2d');
            map.setLayoutProperty('buildings', 'visibility', 'visible');
            map.setLayoutProperty('areas', 'visibility', 'none');
            map.setLayoutProperty('msoa', 'visibility', 'none');
        }
        if (value == "areas") {
            move('2d');
            map.setLayoutProperty('buildings', 'visibility', 'none');
            map.setLayoutProperty('areas', 'visibility', 'visible');
            map.setLayoutProperty('msoa', 'visibility', 'none');
        }
        if (value == "msoa") {
            move('3d');
            map.setLayoutProperty('buildings', 'visibility', 'none');
            map.setLayoutProperty('areas', 'visibility', 'none');
            map.setLayoutProperty('msoa', 'visibility', 'visible');
        }
    }
}

//Updates year
function changeyear(y) {
    year = y;
    $('.year b').text(shorttolong().toString());
    generatePaint()

    map.setPaintProperty(
        'msoa',
        'fill-extrusion-color',
        paint['fill-color']
    );
    map.setPaintProperty(
        'msoa',
        'fill-extrusion-height',
        fill
    );
    map.setPaintProperty(
        'areas',
        'fill-color',
        paint['fill-color']
    );
    map.setPaintProperty(
        'buildings',
        'fill-color',
        paint['fill-color']
    );
}

//Angle change
function move(type) {
    if (type == '2d') {
        map.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 2000,
        });
    } else {
        map.easeTo({
            bearing: -27,
            pitch: 60,
            duration: 2000,
        });
    }
}

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: 'gb',
        marker: false
    })
);

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

$(document).ready(function() {
    $(".mode").appendTo(".mapboxgl-ctrl-top-left");
    $(".timeline").prependTo(".mapboxgl-ctrl-bottom-left");
    $(".legend").prependTo(".mapboxgl-ctrl-bottom-left");

    $('.draggable').on('change', function() {
        changeyear($(this).val().toString().slice(-2));
    });

    $('.draggable').on('input', function() {
        $('.year b').text($(this).val().toString())
    });
});