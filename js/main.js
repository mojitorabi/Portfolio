(function () {
  'use strict';

  // Header scroll state
  var header = document.querySelector('.header');
  if (header) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 20);
      lastY = y;
    }, { passive: true });
  }

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navList.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Intersection observer for project cards (scroll-in animation)
  var cards = document.querySelectorAll('.project-card');
  if (cards.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );
    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  // Smooth focus for skip link
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var skip = document.querySelector('.skip-link');
    if (skip && document.activeElement === document.body) {
      skip.focus();
    }
  });
})();
