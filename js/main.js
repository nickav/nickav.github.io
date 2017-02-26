window.addEventListener('load', function() {
  // spam-free email links (a.mail)
  var $mails = document.getElementsByClassName('mail');
  var mail;
  for (var i=0,n=$mails.length; i<n; i++) {
    mail = $mails[i];
    mail.setAttribute('href', mail.getAttribute('href').replace('nospam', 'mailto:'));
    mail.setAttribute('href', mail.getAttribute('href').replace('+at+', '@'));
  }

  // fix external links
  var $pageContent = document.getElementById('page-content');
  var links = $pageContent.getElementsByTagName('a');
  for (var i=0,n=links.length; i<n; i++) {
    if (links[i].href.substr(0, 4) === 'http' && links[i].origin !== window.location.origin) {
      links[i].target = '_blank';
    }
  }

  // invert color theme
  var $logo = document.getElementById('logo');
  var dark = false;
  if (window.location.pathname === '/') {
    $logo.addEventListener('click', function(e) {
      toggleClass(document.body, 'dark-theme', (open = !open));
      e.preventDefault();
    });
  }

  // set current year
  var $year = document.getElementById('year');
  $year.innerHTML = new Date().getFullYear();
});

// helpers

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
