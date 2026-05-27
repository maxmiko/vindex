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

  // --- Contact form (Web3Forms via AJAX) ---
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var origText = btn.textContent;
      var isLV = document.documentElement.lang === 'lv';

      btn.textContent = isLV ? 'Nosūta...' : 'Sending...';
      btn.disabled = true;

      var data = new FormData(form);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.web3forms.com/submit');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = function () {
        if (xhr.status === 200) {
          form.reset();
          btn.textContent = isLV ? 'Nosūtīts!' : 'Sent!';
          btn.style.backgroundColor = '#2e7d32';
          btn.style.color = '#fff';
          setTimeout(function () {
            btn.textContent = origText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        } else {
          btn.textContent = isLV ? 'Kļūda. Mēģiniet vēlreiz.' : 'Error. Try again.';
          btn.style.backgroundColor = '#c62828';
          btn.style.color = '#fff';
          setTimeout(function () {
            btn.textContent = origText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.disabled = false;
          }, 3000);
        }
      };
      xhr.onerror = function () {
        btn.textContent = isLV ? 'Kļūda. Mēģiniet vēlreiz.' : 'Error. Try again.';
        setTimeout(function () {
          btn.textContent = origText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
          btn.disabled = false;
        }, 3000);
      };
      xhr.send(data);
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

  // --- Service card "Lasīt vairāk" toggle ---
  setTimeout(function() {
    document.querySelectorAll('.svc-card__desc').forEach(function(desc) {
      if (desc.scrollHeight > desc.clientHeight + 2) {
        var btn = document.createElement('button');
        btn.className = 'svc-card__toggle';
        btn.textContent = 'Lasīt vairāk';
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var expanded = desc.classList.toggle('expanded');
          btn.textContent = expanded ? 'Lasīt mazāk' : 'Lasīt vairāk';
        });
        desc.parentNode.insertBefore(btn, desc.nextSibling);
      }
    });
  }, 0);

  // --- Go to top button ---
  var goTopBtn = document.querySelector('.go-top');
  if (goTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        goTopBtn.classList.add('visible');
      } else {
        goTopBtn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // --- Metrics band counter animation ---
  var metricsBand = document.querySelector('.metrics-band');
  if (metricsBand && 'IntersectionObserver' in window) {
    var countEls = metricsBand.querySelectorAll('[data-count]');
    // Reset to 0 immediately so animation is visible
    countEls.forEach(function (el) { el.textContent = '0'; });

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countEls.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    counterObserver.observe(metricsBand);
  }

})();
