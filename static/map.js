mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpa2EtY2hhbiIsImEiOiJja3J1YjE5NXMxMDA2Mm9tZmsyMjZpcjJ5In0.NvcmxedWpkjDDHd315UDRg';
var tile_filter;
const bounds = [
    [104.047041, 4.267536], // Southwest coordinates
    [139.578562, 20.870064] // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/erika-chan/ckszvg5py745v17qudxf0fs8e', // style URL
    center: [120.99, 12.56], // starting position [lng, lat]
    zoom: 4.7, // starting zoom,
    minZoom: 4.7,
    maxZoom: 18,
    maxBounds: bounds
});


$(document).ready(function () {
    $('input[type=radio]').click(function () {
        const sect = this.value;
        console.log(sect)
        // update the map filter
        if (sect === 'Total') {
            tile_filter = ['!=', ['number', ['get', 'Total - Grand Total'], -1]];
        } else if (sect === 'Private') {
            tile_filter = ['!=', ['number', ['get', 'Private - Grand Total'], -1]];
        } else if (sect === 'Public') {
            tile_filter = ['!=', ['number', ['get', 'Public - Grand Total'], -1]];
        } else {
            console.log('error');
        }
        map.setFilter('healthworker', ['all', tile_filter]);
    });


    document.getElementById('select_healthcare_worker_type').addEventListener('change', function () {
        console.log('You selected: ', this.value);
        if (this.value == 'ALL') {
            map.setFilter('healthworker', ['!=', ['number', ['get', 'Total - Grand Total']], -2]);
            // map.setFilter('healthworker', ['!=', ['number', ['get', 'Total - Grand Total']], -1]);
            // tile_filter = ['!=', ['number', ['get', 'Total - Grand Total'], -1]];
        } else if (this.value == 'Doctor - Clinical') {
            map.setFilter('healthworker', ['!=', ['number', ['get', 'Total - Doctor: Clinical']], -1]);
        } else if (this.value === 'Medical Technologist') {
            map.setFilter('healthworker', ['!=', ['number', ['get', 'Total - Medical Technologist'], -3]]);
        } else if (this.value === 'Midwife') {
            map.setFilter('healthworker', ['!=', ['number', ['get', 'Total - Midwife'], -4]]);
            // } else if (this.value === 'Nutritionist or Dietician') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'Occupational Therapist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'Pharmacist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'Physical Therapist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'Radiologic Technologist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'X-ray Technologist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
            // } else if (this.value === 'Dentist') {
            //     map.setFilter('healthworker', ['!=', ['number', ['get', 'Public - Grand Total'], -1]]);
        }
        // map.setFilter('healthworker', ['all', tile_filter]);
    });

    document.getElementById('select_amentity').addEventListener('change', function () {
        console.log('You selected: ', this.value);
        if (this.value == "ALL") {
            map.setFilter('healthsites', ['!=', ['string', ['get', 'amenity']], this.value]);
        } else {
            map.setFilter('healthsites', ['==', ['string', ['get', 'amenity']], this.value]);
        }

    });

    document.getElementById('select_province').addEventListener('change', function () {
        console.log('You selected: ', this.value);
        if (this.value == "ALL") {
            map.setFilter('healthsites', ['!=', ['string', ['get', 'province']], this.value]);
            map.setFilter('healthworker', ['!=', ['string', ['get', 'Province']], this.value]);
        } else {
            map.setFilter('healthsites', ['==', ['string', ['get', 'province']], this.value]);
            map.setFilter('healthworker', ['==', ['string', ['get', 'Province']], this.value]);
        }
    });

    document.getElementById('select_region').addEventListener('change', function () {
        console.log('You selected: ', this.value);

        if (this.value == "ALL") {
            map.setFilter('healthsites', ['!=', ['string', ['get', 'Region']], this.value]);
            map.setFilter('healthworker', ['!=', ['string', ['get', 'Region']], this.value]);
        } else {
            map.setFilter('healthsites', ['==', ['string', ['get', 'Region']], this.value]);
            map.setFilter('healthworker', ['==', ['string', ['get', 'Region']], this.value]);
        }


    });
});

map.on('load', () => {
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

    map.addSource('workers', {
        type: 'vector',
        url: 'mapbox://shyreneching.3wjtx73g',
    });

    map.addLayer({
        type: 'fill',
        'id': 'healthworker',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        "minzoom": 6,
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'Total - Grand Total']],
                // ['get', 'Total - Grand Total'],
                0, '#ffffff',
                1000, '#fed8d8',
                5000, '#f07272',
                7000, '#e71414',
                10000, '#960b0b',
                20000, '#650b0b',
                32000, '#600101',
            ],
            'fill-outline-color': '#777777'
        }
    }, 'waterway-label');

    const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'healthsites', (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        // console.log(e.features[0].properties)
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        var description = "<b>" + titleCase(e.features[0].properties.name) + "</b>" +
            "<br>Amenity: " + titleCase(e.features[0].properties.amenity) +
            // "<br>Amenity: " + titleCase(e.features[0].properties.addr_housenumber) +" "+ titleCase(e.features[0].properties.addr_city) +
            "<br>Region: " + e.features[0].properties.Region +
            "<br>Province: " + e.features[0].properties.province +
            long_desc(e);

        if (description.substring(0, 4) == "<b><") {
            description = description.replace("<b></b>", "");
            description = description.substring(4);
        }

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

    map.on('mouseleave', 'healthsites', () => {
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

    function long_desc(e) {
        var desc = "";
        if (e.features[0].properties.opening_hours != "") {
            desc = desc + "<br>Opening Hours: " + e.features[0].properties.opening_hours;
        }
        if (e.features[0].properties.contact_number != "") {
            desc = desc + "<br>Contact Number: " + e.features[0].properties.contact_number;
        }
        if (e.features[0].properties.health_amenity_type != "") {
            desc = desc + "<br>Health Amenity Type: " + e.features[0].properties.health_amenity_type;
        }
        if (e.features[0].properties.operational_status != "") {
            desc = desc + "<br>Operational Status: " + e.features[0].properties.operational_status;
        }
        if (e.features[0].properties.staff_doctors != "") {
            desc = desc + "<br>Staff Doctors: " + e.features[0].properties.staff_doctors;
        }
        if (e.features[0].properties.staff_nurses != "") {
            desc = desc + "<br>Staff Nurses: " + e.features[0].properties.staff_nurses;
        }
        if (e.features[0].properties.wheelchair != "") {
            desc = desc + "<br>Wheelchair: " + e.features[0].properties.wheelchair;
        }
        if (e.features[0].properties.beds != "") {
            desc = desc + "<br>Bed: " + e.features[0].properties.beds;
        }
        if (e.features[0].properties.electricity != "") {
            desc = desc + "<br>Electricity: " + e.features[0].properties.electricity;
        }
        if (e.features[0].properties.water_source != "") {
            desc = desc + "<br>Water Source: " + e.features[0].properties.water_source;
        }
        if (e.features[0].properties.emergency != "") {
            var add = e.features[0].properties.emergency;
            add.replace(0, "No");
            add.replace(1, "Yes");
            desc = desc + "<br>Emergency: " + add;
        }
        if (e.features[0].properties.is_in_health_zone != "") {
            var add = e.features[0].properties.is_in_health_zone;
            add.replace(0, "No");
            add.replace(1, "Yes");
            desc = desc + "<br>In Health Zone: " + add;
        }
        if (e.features[0].properties.is_in_health_area != "") {
            var add = e.features[0].properties.is_in_health_area;
            add.replace(0, "No");
            add.replace(1, "Yes");
            desc = desc + "<br>In Health Area: " + add;
        }
        if (e.features[0].properties.insurance != "") {
            desc = desc + "<br>Insurance: " + e.features[0].properties.insurance;
        }

        return desc;
    }

});