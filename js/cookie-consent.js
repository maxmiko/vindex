/* Cookie Consent Banner — GDPR/Google Consent Mode v2 */
(function () {
  'use strict';

  var COOKIE_NAME = 'cookie_consent';
  var COOKIE_DAYS = 365;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function isLV() {
    return document.documentElement.lang === 'lv';
  }

  function loadAnalytics() {
    if (window.gtag) {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  function createBanner() {
    var lv = isLV();
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');

    var inner = document.createElement('div');
    inner.className = 'cb__inner';

    var text = document.createElement('p');
    text.className = 'cb__text';
    text.textContent = lv
      ? 'Mēs izmantojam sīkdatnes, lai uzlabotu Jūsu pieredzi mūsu vietnē. '
      : 'We use cookies to improve your experience on our website. ';

    var privacyLink = document.createElement('a');
    privacyLink.href = lv ? '/vindex/privatuma-politika/' : '/vindex/en/privacy-policy/';
    privacyLink.textContent = lv ? 'Privātuma politika' : 'Privacy Policy';
    text.appendChild(privacyLink);

    text.appendChild(document.createTextNode(' | '));

    var cookieLink = document.createElement('a');
    cookieLink.href = lv ? '/vindex/sikdatnu-politika/' : '/vindex/en/cookie-policy/';
    cookieLink.textContent = lv ? 'Sīkdatņu politika' : 'Cookie Policy';
    text.appendChild(cookieLink);

    var buttons = document.createElement('div');
    buttons.className = 'cb__buttons';

    var acceptBtn = document.createElement('button');
    acceptBtn.className = 'cb__btn cb__btn--accept';
    acceptBtn.textContent = lv ? 'Pieņemt visas' : 'Accept all';

    var rejectBtn = document.createElement('button');
    rejectBtn.className = 'cb__btn cb__btn--reject';
    rejectBtn.textContent = lv ? 'Tikai nepieciešamās' : 'Necessary only';

    buttons.appendChild(acceptBtn);
    buttons.appendChild(rejectBtn);
    inner.appendChild(text);
    inner.appendChild(buttons);
    banner.appendChild(inner);

    acceptBtn.addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'all', COOKIE_DAYS);
      banner.remove();
      loadAnalytics();
    });

    rejectBtn.addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'necessary', COOKIE_DAYS);
      banner.remove();
    });

    return banner;
  }

  /* Google Consent Mode v2 — default deny */
  if (window.gtag) {
    gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
  }

  var consent = getCookie(COOKIE_NAME);
  if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(createBanner());
      });
    } else {
      document.body.appendChild(createBanner());
    }
  } else if (consent === 'all') {
    loadAnalytics();
  }
})();
