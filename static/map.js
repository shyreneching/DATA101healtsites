mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpa2EtY2hhbiIsImEiOiJja3J1YjE5NXMxMDA2Mm9tZmsyMjZpcjJ5In0.NvcmxedWpkjDDHd315UDRg';

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/erika-chan/ckszvg5py745v17qudxf0fs8e', // style URL
    center: [120.99, 12.56], // starting position [lng, lat]
    zoom: 4.7, // starting zoom,
    minZoom: 4.7,
    maxZoom: 20
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


});
