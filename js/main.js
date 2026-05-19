/* ============================================
   Juridiskais birojs Vindex — Main JS
   ============================================ */

(function () {
  'use strict';

  // --- Navbar scroll ---
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
    // Initial check
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  // --- Mobile menu ---
  var burger = document.querySelector('.navbar__burger');
  var mobileMenu = document.querySelector('.navbar__mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      // Toggle icon
      var iconOpen = burger.querySelector('.icon-menu');
      var iconClose = burger.querySelector('.icon-close');
      if (iconOpen && iconClose) {
        iconOpen.style.display = isOpen ? 'none' : 'block';
        iconClose.style.display = isOpen ? 'block' : 'none';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        var iconOpen = burger.querySelector('.icon-menu');
        var iconClose = burger.querySelector('.icon-close');
        if (iconOpen && iconClose) {
          iconOpen.style.display = 'block';
          iconClose.style.display = 'none';
        }
      });
    });
  }

  // --- Active nav link on scroll (single-page) ---
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar__link[data-section]');
  if (sections.length && navLinks.length) {
    function updateActive() {
      var scrollY = window.scrollY + 120;
      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }
    window.addEventListener('scroll', updateActive);
    updateActive();
  }

  // --- Scroll animations (IntersectionObserver) ---
  var animElements = document.querySelectorAll('.fade-in, .fade-left, .fade-right');
  if (animElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animElements.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all
    animElements.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Contact form ---
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      // Collect data
      var data = new FormData(form);
      var obj = {};
      data.forEach(function (val, key) { obj[key] = val; });

      // Simple mailto fallback
      var subject = encodeURIComponent('Pieteikums no vindex.lv');
      var body = encodeURIComponent(
        'Vārds: ' + (obj.name || '') + '\n' +
        'Tālrunis: ' + (obj.phone || '') + '\n' +
        'E-pasts: ' + (obj.email || '') + '\n' +
        'Ziņojums: ' + (obj.message || '')
      );
      window.location.href = 'mailto:info@vindex.lv?subject=' + subject + '&body=' + body;

      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
        form.reset();
      }, 1000);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').substring(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
