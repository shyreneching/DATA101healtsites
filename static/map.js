mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpa2EtY2hhbiIsImEiOiJja3J1YjE5NXMxMDA2Mm9tZmsyMjZpcjJ5In0.NvcmxedWpkjDDHd315UDRg';

const bounds = [
    [103.047041, 4.267536], // Southwest coordinates
    [139.578562, 20.830064] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/erika-chan/ckszvg5py745v17qudxf0fs8e', // style URL
    center: [120.99, 12.56], // starting position [lng, lat]
    zoom: 4.7, // starting zoom,
    minZoom: 4.7,
    maxZoom: 13,
    maxBounds: bounds
});

map.on('load', () => {
    //put things here

    map.addSource('sites', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/shyreneching/DATA101healtsites/main/data/healthsites.geojson'
    });

    map.addLayer({
        id: 'healthsites',
        type: 'circle',
        source: 'sites',
        paint: {
            'circle-radius': {
                'base': 1.75,
                'stops': [
                    [12, 2],
                    [22, 180]
                ]
            },

            'circle-color': '#D2285B',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#5C0218'
        },
    });

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'healthsites', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.name + 
                            "<br>Amenity: " + titleCase(e.features[0].properties.amenity);

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on('mouseleave', 'places', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }

});