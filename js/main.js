window.addEventListener('load', function() {
  // spam-free email links (a.mail)
  var mails = document.getElementsByClassName('mail');
  var mail;
  for (var i=0,n=mails.length; i<n; i++) {
    mail = mails[i];
    mail.setAttribute('href', mail.getAttribute('href').replace('nospam', 'nick'));
    mail.setAttribute('href', mail.getAttribute('href').replace('+at+', '@'));
  }
  
  // mobile menu toggle
  var toggle = document.getElementById('toggle');
  var open = false;
  toggle.addEventListener('click', function() {
    toggleClass(document.body, 'active', (open = !open));
  });

  // fix external links
  var pageContent = document.getElementById('page-content');
  var links = pageContent.getElementsByTagName('a');
  for (var i=0,n=links.length; i<n; i++) {
    if (links[i].href.substr(0, 4) == 'http' && links[i].origin != window.location.origin) {
      links[i].target = "_blank";
    }
  }
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
