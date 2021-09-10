let btnscroll = document.querySelector('#goToBottom')

btnscroll.addEventListener('click', function () {
  console.log("Hello");
  var element = document.getElementById("num_healthsites_per_region");
  element.scrollIntoView({behavior: "smooth"});
  btnscroll.style.visibility='hidden';
});
