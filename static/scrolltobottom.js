$(document).ready(function() {
  $('#goToBottom').click(function(){
    console.log("Hello");
    var element = document.getElementById("num_healthsites_per_region");
    element.scrollIntoView({behavior: "smooth"});
    document.getElementById('goToBottom').hide();
  });
});
