/*
 * Email Profit X: kleine, abhaengigkeitsfreie Interaktions-Skripte fuer die
 * statisch exportierte systeme.io-Seite (das eigentliche React/JS des
 * Page-Builders wurde beim Export entfernt, siehe Auftrag "epx-alt2").
 * Deckt ab: mobiles Hamburger-Menue, FAQ-Akkordeon, Karussell-Pfeile.
 * Wird von index.html UND agentur/index.html eingebunden (gleiche Datei).
 */
(function () {
  'use strict';

  function initMobileMenus() {
    document.querySelectorAll('[id^="side-menu-"]').forEach(function (panel) {
      var wrapper = panel.parentElement;
      if (!wrapper) return;
      var toggle = wrapper.querySelector('.gshUyi');
      if (!toggle) return;

      function isOpen() {
        return !!panel.style.width && panel.style.width !== '0px';
      }
      function onKeydown(e) {
        if (e.key === 'Escape') close();
      }
      function onOutsideClick(e) {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) close();
      }
      function open() {
        panel.style.width = 'min(85vw, 320px)';
        toggle.setAttribute('aria-expanded', 'true');
        document.addEventListener('keydown', onKeydown);
        document.addEventListener('click', onOutsideClick, true);
      }
      function close() {
        panel.style.width = '0px';
        toggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('click', onOutsideClick, true);
      }
      function toggleMenu() {
        if (isOpen()) close(); else open();
      }

      toggle.setAttribute('role', 'button');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
      });
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMenu();
        }
      });
      panel.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', close);
      });
    });
  }

  function initFaqAccordion() {
    document.querySelectorAll('.sc-enkILD').forEach(function (item) {
      var question = item.querySelector(':scope > .hnibMT');
      var answer = item.querySelector(':scope > .hcxIWP');
      if (!question || !answer) return;
      var icon = question.querySelector('i');

      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
      question.setAttribute('aria-expanded', 'false');
      answer.style.height = '0px';

      function toggle() {
        var open = item.classList.contains('epx-open');
        if (open) {
          answer.style.height = '0px';
          item.classList.remove('epx-open');
          question.setAttribute('aria-expanded', 'false');
          if (icon) icon.classList.remove('epx-faq-open');
        } else {
          answer.style.height = answer.scrollHeight + 'px';
          item.classList.add('epx-open');
          question.setAttribute('aria-expanded', 'true');
          if (icon) icon.classList.add('epx-faq-open');
        }
      }

      question.addEventListener('click', toggle);
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function initCarousels() {
    document.querySelectorAll('.carousel-ui').forEach(function (carousel) {
      var slider = carousel.querySelector('.carousel-slider-ui');
      if (!slider || !slider.children.length) return;
      var dots = carousel.querySelectorAll('.sc-bhqpjG');

      function step() {
        var cs = window.getComputedStyle(slider);
        var gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
        return slider.children[0].getBoundingClientRect().width + gap;
      }

      function setActiveDot() {
        if (!dots.length) return;
        var amount = step();
        var idx = amount ? Math.round(slider.scrollLeft / amount) : 0;
        idx = Math.max(0, Math.min(dots.length - 1, idx));
        dots.forEach(function (d, i) {
          if (i === idx) {
            d.classList.add('fPBjys');
            d.classList.remove('cjEyOh');
          } else {
            d.classList.remove('fPBjys');
            d.classList.add('cjEyOh');
          }
        });
      }

      function scrollOneCard(direction) {
        var maxScroll = slider.scrollWidth - slider.clientWidth;
        if (direction > 0 && slider.scrollLeft >= maxScroll - 4) {
          slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (direction < 0 && slider.scrollLeft <= 4) {
          slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          slider.scrollBy({ left: direction * step(), behavior: 'smooth' });
        }
        window.setTimeout(setActiveDot, 350);
      }

      carousel.querySelectorAll('i[class*="fa-chevron-right"]').forEach(function (arrow) {
        arrow.style.cursor = 'pointer';
        arrow.addEventListener('click', function () { scrollOneCard(1); });
      });
      carousel.querySelectorAll('i[class*="fa-chevron-left"]').forEach(function (arrow) {
        arrow.style.cursor = 'pointer';
        arrow.addEventListener('click', function () { scrollOneCard(-1); });
      });
    });
  }

  function init() {
    initMobileMenus();
    initFaqAccordion();
    initCarousels();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
