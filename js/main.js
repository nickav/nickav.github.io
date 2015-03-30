// spam-free email links
window.addEventListener('load', function(){
  var mail = document.getElementById('mail');
  mail.setAttribute('href', mail.getAttribute('href').replace('nospam+at+', 'nick@'));
});