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

    document.getElementById('select_amentity').addEventListener('change', function () {
        console.log('You selected: ', this.value);

        if ($("#select_region").val() != null && $("#select_region").val() != "ALL") {
            filterLocAmenity(this.value, $("#select_region").val(), true)
        } else {
            filterLocAmenity(this.value, $("#select_province").val(), false)
        }
    });

    document.getElementById('select_province').addEventListener('change', function () {
        console.log('You selected: ', this.value);
        filterLocAmenity($("#select_amentity").val() , this.value, false)

        if (this.value == "ALL") {
            filterLayers('!=', 'Province', this.value);
        } else {
            filterLayers('==', 'Province', this.value);
        }
    });

    document.getElementById('select_region').addEventListener('change', function () {
        console.log('You selected: ', this.value);
        filterLocAmenity($("#select_amentity").val() , this.value, true)

        if (this.value == "ALL") {
            filterLayers('!=', 'Region', this.value);
        } else {
            filterLayers('==', 'Region', this.value);
        }
    });
});

function filterLocAmenity(amenity, location, boolRegion){
    // If amenity and locationis both all
    if((amenity == null || amenity == "ALL") && (location == null || location == "ALL")){
        amenity = "ALL"
        location = "ALL"
        map.setFilter('healthsites', ["all",['!=', ['string', ['get', 'amenity']], amenity], ['!=', ['string', ['get', 'province']], location], ['!=', ['string', ['get', 'Region']], location]]);
    } else if ((amenity != null && amenity != "ALL") && (location != null && location != "ALL")){ // if amenity and location both has value
        amenity = amenity
        location = location

        if(boolRegion){
            map.setFilter('healthsites', ["all",['==', ['string', ['get', 'amenity']], amenity], ['==', ['string', ['get', 'Region']], location]]);
        } else {
            map.setFilter('healthsites', ["all",['==', ['string', ['get', 'amenity']], amenity], ['==', ['string', ['get', 'province']], location]]);
        }
    } else if (amenity == null || amenity == "ALL"){
        amenity = "ALL"
        location = location

        if(boolRegion){
            map.setFilter('healthsites', ["all",['!=', ['string', ['get', 'amenity']], amenity], ['==', ['string', ['get', 'Region']], location]]);
        } else {
            map.setFilter('healthsites', ["all",['!=', ['string', ['get', 'amenity']], amenity], ['==', ['string', ['get', 'province']], location]]);
        }
    } else if (location == null || location == "ALL"){
        amenity = amenity
        location = "ALL"
        map.setFilter('healthsites', ["all",['==', ['string', ['get', 'amenity']], amenity], ['!=', ['string', ['get', 'province']], location], ['!=', ['string', ['get', 'Region']], location]]);
    }
}

function filterLayers(conditional, filter, value){
    var arr1 = [
        '',
        '_dentist',
        '_drclinical',
        '_mt',
        '_midwife',
        '_nurse',
        '_n_d',
        '_ot',
        '_pharmacist',
        '_pt',
        '_rt',
        '_xray',
    ], arr2 = [
        '',
        '_public',
        '_private'
    ]

    for (var i of arr1){
        for (var j of arr2){
            map.setFilter('healthworker'+j+i, [conditional, ['string', ['get', filter]], value]);
        }
    }
}

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

            'circle-color': '#645986',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#2d3d6f'
        },
    });

    map.addSource('workers', {
        type: 'vector',
        url: 'mapbox://shyreneching.3wjtx73g',
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
        var description = "<b>" + titleCase(e.features[0].properties.name) + "</b>" +
            "<br>Facility: " + titleCase(e.features[0].properties.amenity) +
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

    function setLayersToInvisible(){
        var arr1 = [
            '',
            '_dentist',
            '_drclinical',
            '_mt',
            '_midwife',
            '_nurse',
            '_n_d',
            '_ot',
            '_pharmacist',
            '_pt',
            '_rt',
            '_xray',
        ], arr2 = [
            '',
            '_public',
            '_private'
        ]

        for (var i of arr1){
            for (var j of arr2){
                map.setLayoutProperty('healthworker'+j+i, 'visibility', 'none');
            }
        }
    }

    function filterMapWorker(){
        var worker = $("#select_healthcare_worker_type").val()
        var sector = $('input[name="inlineRadioOptions"]:checked').val();

        setLayersToInvisible()
        var layer = 'healthworker'

        if (sector === 'Private') {
            layer = layer + '_private'
        } else if (sector === 'Public') {
            layer = layer + '_public'
        }

        if (worker == 'Doctor - Clinical') {
            layer = layer + '_drclinical'
        } else if (worker === 'Medical Technologist') {
            layer = layer + '_mt'
        } else if (worker === 'Midwife') {
            layer = layer + '_midwife'
        } else if (worker === 'Nutritionist or Dietician') {
            layer = layer + '_n_d'
        } else if (worker === 'Occupational Therapist') {
            layer = layer + '_ot'
        } else if (worker === 'Pharmacist') {
            layer = layer + '_pharmacist'
        } else if (worker === 'Physical Therapist') {
            layer = layer + '_pt'
        } else if (worker === 'Radiologic Technologist') {
            layer = layer + '_rt'
        } else if (worker === 'X-ray Technologist') {
            layer = layer + '_xray'
        } else if (worker === 'Dentist') {
            layer = layer + '_dentist'
        } else if (worker === 'Nurse') {
            layer = layer + '_nurse'
        }

        map.setLayoutProperty(layer, 'visibility', 'visible');
    }

    $('input[type=radio]').click(function () {
        filterMapWorker()
    });

    document.getElementById('select_healthcare_worker_type').addEventListener('change', function () {
        filterMapWorker()
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_dentist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Dentist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_drclinical',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Doctor: Clinical'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_mt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Medical Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_midwife',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Midwife'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_nurse',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Nurse'],
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


    map.addLayer({
        type: 'fill',
        'id': 'healthworker_n_d',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Nutritionist/ Dietician'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_ot',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Occupational Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_pharmacist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Pharmacist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_pt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Physical Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_rt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - Radiologic Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_xray',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Total - X-ray Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_dentist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Dentist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_drclinical',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Doctor: Clinical'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_mt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Medical Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_midwife',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Midwife'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_nurse',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Nurse'],
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


    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_n_d',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Nutritionist/ Dietician'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_ot',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Occupational Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_pharmacist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Pharmacist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_pt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Physical Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_rt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Radiologic Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private_xray',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - X-ray Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_dentist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Dentist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_drclinical',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Doctor: Clinical'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_mt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Medical Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_midwife',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Midwife'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_nurse',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Nurse'],
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


    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_n_d',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Nutritionist/ Dietician'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_ot',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Occupational Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_pharmacist',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Pharmacist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_pt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Physical Therapist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_rt',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Radiologic Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public_xray',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - X-ray Technologist'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_private',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Private - Grand Total'],
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

    map.addLayer({
        type: 'fill',
        'id': 'healthworker_public',
        'source': 'workers',
        'source-layer': 'healthworkers-86lyvc',
        'visibility': 'none',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'Public - Grand Total'],
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

    setLayersToInvisible()

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
});
