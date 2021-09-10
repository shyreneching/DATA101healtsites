function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

$(document).ready(function(){
    d3.csv('/numworkers').then(function(data){
        data = data[0]
        $('#healthcare_workers_total').text(numberWithCommas(data[0]))
    })

    $("#select_healthcare_worker_type").on('change', function(){
        var worker = $("#select_healthcare_worker_type").val()
        var sector = $('input[name="inlineRadioOptions"]:checked').val();
        var amenity = $("#select_amentity").val()
        var location = $("#select_province").val()
        if((location  == null || location  == "ALL") && ($("#select_region").val() != null && $("#select_region").val() != "ALL")){
            location = "region_" + $("#select_region").val()
        }

        d3.csv('/numworkers/'+worker+"/"+sector+"/"+amenity+"/"+location).then(function(data){
            data = data[0]
            $('#healthcare_workers_total').text(numberWithCommas(data[0]))
        })
    })

    $('input[name="inlineRadioOptions"]').on('change', function(){
        var worker = $("#select_healthcare_worker_type").val()
        var sector = $('input[name="inlineRadioOptions"]:checked').val();
        var amenity = $("#select_amentity").val()
        var location = $("#select_province").val()
        if((location  == null || location  == "ALL") && ($("#select_region").val() != null && $("#select_region").val() != "ALL")){
            location = "region_" + $("#select_region").val()
        }

        d3.csv('/numworkers/'+worker+"/"+sector+"/"+amenity+"/"+location).then(function(data){
            data = data[0]
            $('#healthcare_workers_total').text(numberWithCommas(data[0]))
        })
    })

    $('#select_province').on('change', function(){
        var worker = $("#select_healthcare_worker_type").val()
        var sector = $('input[name="inlineRadioOptions"]:checked').val();
        var amenity = $("#select_amentity").val()
        var location = $("#select_province").val()

        d3.csv('/numworkers/'+worker+"/"+sector+"/"+amenity+"/"+location).then(function(data){
            data = data[0]
            $('#healthcare_workers_total').text(numberWithCommas(data[0]))
        })
    })

    $('#select_region').on('change', function(){
        var worker = $("#select_healthcare_worker_type").val()
        var sector = $('input[name="inlineRadioOptions"]:checked').val();
        var amenity = $("#select_amentity").val()
        var location = $("#select_region").val()
        if(location  != null && location  != "ALL"){
            location = "region_" + $("#select_region").val()
        }

        d3.csv('/numworkers/'+worker+"/"+sector+"/"+amenity+"/"+location).then(function(data){
            data = data[0]
            $('#healthcare_workers_total').text(numberWithCommas(data[0]))
        })
    })
})