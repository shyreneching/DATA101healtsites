$(document).ready(function() {
  var healthcareWorkerTypeSelect = document.getElementById("select_healthcare_worker_type");
  var provinceSelect = document.getElementById("select_province");
  var regionSelect = document.getElementById("select_region");
  var amenitiesSelect = document.getElementById("select_amentity");

  var bothRadioBtn = document.getElementById("radiobtn_both_sector");

  var healthworkersList = ['ALL', 'Dentist', 'Doctor - Clinical', 'Medical Technologist', 'Midwife','Nurse', 'Nutritionist or Dietician','Occupational Therapist','Pharmacist','Physical Therapist','Radiologic Technologist','X-ray Technologist'];

  var provincesList = ['ALL', 'ABRA',
  'AGUSAN DEL NORTE',
  'AGUSAN DEL SUR',
  'AKLAN',
  'ALBAY',
  'ANTIQUE',
  'APAYAO',
  'AURORA',
  'BASILAN (WITH ISABELA CITY)',
  'BATAAN',
  'BATANES',
  'BATANGAS',
  'BENGUET',
  'BILIRAN',
  'BOHOL',
  'BUKIDNON',
  'BULACAN',
  'CAGAYAN',
  'CAMARINES NORTE',
  'CAMARINES SUR',
  'CAMIGUIN',
  'CAPIZ',
  'CATANDUANES',
  'CAVITE',
  'CEBU',
  'COMPOSTELA VALLEY',
  'DAVAO DEL NORTE',
  'DAVAO DEL SUR',
  'DAVAO ORIENTAL',
  'DINAGAT ISLANDS',
  'EASTERN SAMAR',
  'GUIMARAS',
  'IFUGAO',
  'ILOCOS NORTE',
  'ILOCOS SUR',
  'ILOILO',
  'ISABELA',
  'KALINGA',
  'LA UNION',
  'LAGUNA',
  'LANAO DEL NORTE',
  'LANAO DEL SUR',
  'LEYTE',
  'MAGUINDANAO (WITH COTABATO CITY)',
  'MARINDUQUE',
  'MASBATE',
  'METROPOLITAN MANILA',
  'MISAMIS OCCIDENTAL',
  'MISAMIS ORIENTAL',
  'MOUNTAIN PROVINCE',
  'NEGROS OCCIDENTAL',
  'NEGROS ORIENTAL',
  'NORTH COTABATO',
  'NORTHERN SAMAR',
  'NUEVA ECIJA',
  'NUEVA VIZCAYA',
  'OCCIDENTAL MINDORO',
  'ORIENTAL MINDORO',
  'PALAWAN',
  'PAMPANGA',
  'PANGASINAN',
  'QUEZON',
  'QUIRINO',
  'RIZAL',
  'ROMBLON',
  'SAMAR',
  'SARANGANI',
  'SIQUIJOR',
  'SORSOGON',
  'SOUTH COTABATO',
  'SOUTHERN LEYTE',
  'SULTAN KUDARAT',
  'SULU',
  'SURIGAO DEL NORTE',
  'SURIGAO DEL SUR',
  'TARLAC',
  'TAWI-TAWI',
  'ZAMBALES',
  'ZAMBOANGA DEL NORTE',
  'ZAMBOANGA DEL SUR',
  'ZAMBOANGA SIBUGAY'
  ];

  var regionsList = ['ALL', 'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)',
  'CORDILLERA ADMINISTRATIVE REGION (CAR)',
  'MIMAROPA REGION',
  'NATIONAL CAPITAL REGION (NCR)',
  'REGION I (ILOCOS REGION)',
  'REGION II (CAGAYAN VALLEY)',
  'REGION III (CENTRAL LUZON)',
  'REGION IV-A (CALABARZON)',
  'REGION V (BICOL REGION)',
  'REGION VI (WESTERN VISAYAS)',
  'REGION VII (CENTRAL VISAYAS)',
  'REGION VIII (EASTERN VISAYAS)',
  'REGION IX (ZAMBOANGA PENINSULA)',
  'REGION X (NORTHERN MINDANAO)',
  'REGION XI (DAVAO REGION)',
  'REGION XII (SOCCSKSARGEN)',
  'REGION XIII (Caraga)'
  ];

 var amenitiesList = ['ALL', 'clinic', 'dentist', 'doctors', 'healthcare', 'hospital', 'laboratory', 'pharmacy', 'social facility', 'others'];

 for (var i = 0; i < healthworkersList.length; i++) {
   var option = document.createElement("option");
   option.value = healthworkersList[i];
   option.text = healthworkersList[i].toUpperCase();
   healthcareWorkerTypeSelect.appendChild(option);
 };

 for (var i = 0; i < provincesList.length; i++) {
   //console.log(provincesList[i])
   var option = document.createElement("option");
   option.value = provincesList[i];
   option.text = provincesList[i];
   provinceSelect.appendChild(option);
 };

 for (var i = 0; i < regionsList.length; i++) {
   var option = document.createElement("option");
   option.value = regionsList[i];
   option.text = regionsList[i];
   regionSelect.appendChild(option);
 };

 for (var i = 0; i < amenitiesList.length; i++) {
   var option = document.createElement("option");
   option.value = amenitiesList[i];
   option.text = amenitiesList[i].toUpperCase();
   amenitiesSelect.appendChild(option);
 };


 $("#select_province").on('change', function(){
  $('#select_region').prop('selectedIndex',0)
 })

 $("#select_region").on('change', function(){
  $('#select_province').prop('selectedIndex',0)
 })
});
