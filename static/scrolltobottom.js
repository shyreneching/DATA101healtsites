let btnscroll = document.querySelector('#goToBottom')

btnscroll.addEventListener('click', function () {
  console.log("Hello");
  var element = document.getElementById("num_healthsites_per_region");
  element.scrollIntoView({behavior: "smooth"});
  // btnscroll.style.visibility='hidden';
  
});

$(document).ready(function () {
  window.onscroll = function() {scrollFunction()};
		
  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("goToBottom").style.display = "none";   
    } else {
      document.getElementById("goToBottom").style.display = "block";
    }
  }
  
})
