function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

$(document).ready(function(){
    d3.csv('/numworkers').then(function(data){
        data = data[0]
        $('#healthcare_workers_total').text(numberWithCommas(data[0]))
    })
})