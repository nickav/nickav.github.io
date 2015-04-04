// spam-free email links
window.addEventListener('load', function() {
  var mails = document.getElementsByClassName('mail');
  var mail;
  for (var i=0,n=mails.length; i<n; i++) {
    mail = mails[i];
    mail.setAttribute('href', mail.getAttribute('href').replace('nospam+at+', 'nick@'));
  }
  
  var toggle = document.getElementById('toggle');
  var open = false;
  toggle.addEventListener('click', function() {
    toggleClass(document.body, 'active', (open = !open));
  });
});

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className);
  else
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function toggleClass(el, className, addMode) {
  if (addMode) addClass(el, className);
  else removeClass(el, className);
}