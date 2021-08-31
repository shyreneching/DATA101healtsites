function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

$(document).ready(function(){
    d3.csv('/numsites').then(function(data){
        data = data[0]
        $('#healthsites_total').text(numberWithCommas(data[0]))
    })
})