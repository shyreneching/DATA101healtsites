let btnscroll = document.querySelector('#goToBottom')

btnscroll.addEventListener('click', function () {
  console.log("Hello");
  var element = document.getElementById("other_charts_description");
  element.scrollIntoView({behavior: "smooth"});
  // btnscroll.style.visibility='hidden';

});

$(document).ready(function () {
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      document.getElementById("goToBottom").style.display = "none";
    } else {
      document.getElementById("goToBottom").style.display = "block";
    }
  }

})
