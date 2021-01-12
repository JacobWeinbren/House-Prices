year = '20'
view = 'buildings'

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function shorttolong() {
    var temp = parseInt(year)
    if (temp > 50) {
        return '19' + year
    } else {
        return '20' + year
    }
}

mapboxgl.accessToken = 'pk.eyJ1IjoiZWRtaWxpYmFuZCIsImEiOiJja2pweWsxZmE3YXJ6MnJsZzM5M2EyYm56In0.qLzLmOafH0vucvXSMWo9Kg';

map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [-2.3278, 52.8379],
    zoom: 6,
    maxZoom: 14,
    attributionControl: false
}).addControl(new mapboxgl.AttributionControl({
    customAttribution: '<a href="https://www.thesocialreview.co.uk/">TSR</a>'
}));

LIGHT_SETTINGS = {
    ambientRatio: 1,
    diffuseRatio: 1,
    specularRatio: 1,
};

$.getJSON('twenty.json', function(data) {
    //Data domain
    var twenty = data['20']

    //Blue and Red 10
    var col_range = ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"]

    colours = d3.scaleQuantile()
        .domain(twenty)
        .range(col_range.reverse());

    var quan = colours.quantiles()
    quan = quan.filter((e, i) => i % 2 == 0)
    quan.unshift(0)

    for (var i = 0; i < quan.length; i++) {
        var tick = quan[i]
        var colour = colours(tick)
        $('.row .container').append($("<div class='grid'></div")
            .append($("<div class='col col--6'></div>").css('background-color', colour))
            .append($("<div class='col col--6 align-left'></div>").html('<p>' + tick + '+</p>'))
        )
    }
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
    }

    fill = [
        'case',
        ['==', ['has', year], true],
        ['interpolate', ['linear'],
            ['get', year],
            0, 0,
            400, 80000
        ],
        0
    ]

    var quan = colours.quantiles()
    quan.unshift(0)

    for (var i = 0; i < quan.length; i++) {
        var tick = quan[i]
        var colour = colours(tick)
        paint['fill-color'][2].push(parseInt(tick))
        paint['fill-color'][2].push(colour)
    }

}

//Initial paint of maps
map.on('load', function() {

    generatePaint()

    map.addLayer({
            "id": "buildings",
            "type": "fill",
            "source": {
                "type": "vector",
                "tiles": ["http://206.189.22.89:8080/data/intersect/{z}/{x}/{y}.pbf"],
            },
            'layout': {
                'visibility': 'visible'
            },
            "source-layer": "intersect_data",
            'paint': paint
        },
        'waterway-label');

    map.addLayer({
            "id": "areas",
            "type": "fill",
            "source": {
                "type": "vector",
                "tiles": ["http://206.189.22.89:8080/data/oa/{z}/{x}/{y}.pbf"],
            },
            'layout': {
                'visibility': 'visible'
            },
            "source-layer": "oa",
            'paint': paint
        },
        'waterway-label');

    /*
    map.addSource('hexes', {
        'type': 'geojson',
        'data': 'hexes.geojson'
    });
    map.addLayer({
        'id': 'hex_map',
        'type': 'fill-extrusion',
        'source': 'hexes',
        'paint': {
            'fill-extrusion-color': paint['fill-color'],
            'fill-extrusion-height': fill,
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 1
        },
        'layout': {
            'visibility': 'none'
        },
    });*/

    $('#mode-select').click(function() {
        if (view == 'msoa') {
            change('buildings')
        } else {
            change('msoa')
        }
    });

    $('#fill-select').click(function() {
        if (view == 'areas') {
            change('buildings')
        } else {
            change('areas')
        }
    });
});

//Perspective change
function change(value) {
    if (value != view) {
        view = value;
        $('.mode').removeClass('active');
        if (value == "buildings") {
            move('2d')
            map.setLayoutProperty('buildings', 'visibility', 'visible')
            map.setLayoutProperty('areas', 'visibility', 'none')
            map.setLayoutProperty('hex_map', 'visibility', 'none')
            map.setPaintProperty(
                'buildings',
                'fill-color',
                paint['fill-color']
            );
        }
        if (value == "areas") {
            $('#fill-select').addClass('active');
            move('2d')
            map.setLayoutProperty('buildings', 'visibility', 'none')
            map.setLayoutProperty('areas', 'visibility', 'visible')
            map.setLayoutProperty('hex_map', 'visibility', 'none')
            map.setPaintProperty(
                'areas',
                'fill-color',
                paint['fill-color']
            );
        }
        if (value == "msoa") {
            $('#mode-select').addClass('active');
            move('3d')
            map.setLayoutProperty('buildings', 'visibility', 'none')
            map.setLayoutProperty('areas', 'visibility', 'none')
            map.setLayoutProperty('hex_map', 'visibility', 'visible')
            map.setPaintProperty(
                'hex_map',
                'fill-color',
                paint['fill-color']
            );
            map.setPaintProperty(
                'hex_map',
                'fill-extrusion-height',
                fill
            );
        }
    }
}

//Angle change
function move(type) {
    if (type == '2d') {
        map.easeTo({
            bearing: 0,
            pitch: 0,
            duration: 2000
        });
    } else {
        map.easeTo({
            bearing: -27,
            pitch: 60,
            duration: 2000
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

    $('.title').text('House Prices as a Multiple of Salary (' + shorttolong() + ')')

    $(".legend").prependTo(".mapboxgl-ctrl-bottom-right");
    $(".mode").appendTo(".mapboxgl-ctrl-top-left");
    $(".choices").prependTo(".mapboxgl-ctrl-bottom-left");
    $("#info").insertBefore(".mapboxgl-ctrl-attrib");

});