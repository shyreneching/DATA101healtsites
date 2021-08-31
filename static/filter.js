$(document).ready(function() {
  var healthcareWorkerTypeSelect = document.getElementById("select_healthcare_worker_type");
  var provinceSelect = document.getElementById("select_province");
  var regionSelect = document.getElementById("select_region");
  var amenitiesSelect = document.getElementById("select_amentity");

  var healthworkersList = ['ALL', 'DENTIST', 'DOCTOR', 'MEDICAL TECHNOLOGIST', 'MIDWIFE', 'NURSE', 'NUTRITIONIST/DIETICIAN', 'OCCUPATIONAL THERAPIST', 'PHARMACIST', 'PHYSICAL THERAPIST', 'RADIOLOGIC TECHNOLOGIST', 'X-RAY TECHNOLOGIST'];

  var provincesList = ['ALL', 'BASILAN',
    'LANAO DEL SUR',
    'MAGUINDANAO',
    'SULU',
    'TAWI-TAWI',
    'ABRA',
    'APAYAO',
    'BENGUET',
    'IFUGAO',
    'KALINGA',
    'MOUNTAIN PROVINCE',
    'MARINDUQUE',
    'OCCIDENTAL MINDORO',
    'ORIENTAL MINDORO',
    'PALAWAN',
    'ROMBLON',
    'ILOCOS NORTE',
    'ILOCOS SUR',
    'LA UNION',
    'PANGASINAN',
    'BATANES',
    'CAGAYAN',
    'ISABELA',
    'NUEVA VIZCAYA',
    'QUIRINO',
    'AURORA',
    'BATAAN',
    'BULACAN',
    'NUEVA ECIJA',
    'PAMPANGA',
    'TARLAC',
    'ZAMBALES',
    'BATANGAS',
    'CAVITE',
    'LAGUNA',
    'QUEZON',
    'RIZAL',
    'CITY OF ISABELA',
    'ZAMBOANGA DEL NORTE',
    'ZAMBOANGA DEL SUR',
    'ZAMBOANGA SIBUGAY',
    'ALBAY',
    'CAMARINES NORTE',
    'CAMARINES SUR',
    'CATANDUANES',
    'MASBATE',
    'SORSOGON',
    'AKLAN',
    'ANTIQUE',
    'CAPIZ',
    'GUIMARAS',
    'ILOILO',
    'NEGROS OCCIDENTAL',
    'BOHOL',
    'CEBU',
    'NEGROS ORIENTAL',
    'SIQUIJOR',
    'BILIRAN',
    'EASTERN SAMAR',
    'LEYTE',
    'NORTHERN SAMAR',
    'SAMAR',
    'SOUTHERN LEYTE',
    'BUKIDNON',
    'CAMIGUIN',
    'LANAO DEL NORTE',
    'MISAMIS OCCIDENTAL',
    'MISAMIS ORIENTAL',
    'COMPOSTELA VALLEY',
    'DAVAO DEL NORTE',
    'DAVAO DEL SUR',
    'DAVAO OCCIDENTAL',
    'DAVAO ORIENTAL',
    'NORTH COTABATO',
    'COTABATO CITY',
    'SARANGANI',
    'SOUTH COTABATO',
    'SULTAN KUDARAT',
    'AGUSAN DEL NORTE',
    'AGUSAN DEL SUR',
    'DINAGAT ISLANDS',
    'SURIGAO DEL NORTE',
    'SURIGAO DEL SUR',
    'METROPOLITAN MANILA'
  ];

  var regionsList = ['ALL', 'REGION I (ILOCOS REGION)',
 'REGION II (CAGAYAN VALLEY)',
 'REGION III (CENTRAL LUZON)',
 'REGION V (BICOL REGION)',
 'REGION VI (WESTERN VISAYAS)',
 'REGION VII (CENTRAL VISAYAS)',
 'REGION VIII (EASTERN VISAYAS)',
 'REGION IX (ZAMBOANGA PENINSULA)',
 'REGION X (NORTHERN MINDANAO)',
 'REGION XI (DAVAO REGION)',
 'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)',
 'REGION IV-A (CALABARZON)',
 'CORDILLERA ADMINISTRATIVE REGION (CAR)',
 'REGION XIII (Caraga)',
 'MIMAROPA REGION',
 'NATIONAL CAPITAL REGION (NCR)',
 'REGION XII (SOCCSKSARGEN)'];

 var amenitiesList = ['ALL', 'CLINIC', 'DENTIST', 'DOCTORS', 'HOSPITAL', 'PHARMACY', 'OTHERS'];

 for (var i = 0; i < healthworkersList.length; i++) {
   var option = document.createElement("option");
   option.value = healthworkersList[i];
   option.text = healthworkersList[i];
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
   option.text = amenitiesList[i];
   amenitiesSelect.appendChild(option);
 };
});
