/* ============================================================
   Grand Hokuyo Wedding LP - main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Hero Slider ---
  const heroSlider = (() => {
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    let current = 0;
    let interval;
    let touchStartX = 0;
    let touchEndX = 0;

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() {
      goTo(current + 1);
    }

    function startAutoplay() {
      interval = setInterval(next, 5000);
    }

    function resetAutoplay() {
      clearInterval(interval);
      startAutoplay();
    }

    // Dot clicks
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(parseInt(dot.dataset.index, 10));
        resetAutoplay();
      });
    });

    // Touch/swipe on hero
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroEl.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            goTo(current + 1);
          } else {
            goTo(current - 1);
          }
          resetAutoplay();
        }
      }, { passive: true });
    }

    if (slides.length > 1) {
      startAutoplay();
    }
  })();

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const globalNav = document.getElementById('globalNav');

  if (hamburger && globalNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      globalNav.classList.toggle('active');
      document.body.style.overflow = globalNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    globalNav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        globalNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Sticky Header ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // --- Smooth Scroll ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Spy ---
  const navLinks = document.querySelectorAll('.header__nav-link:not(.header__nav-link--cta)');
  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) {
        sections.push({ el: section, link: link });
      }
    }
  });

  function updateScrollSpy() {
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 100;
    let currentSection = null;

    sections.forEach(({ el }) => {
      if (el.offsetTop <= scrollPos) {
        currentSection = el;
      }
    });

    navLinks.forEach(link => link.classList.remove('active'));

    if (currentSection) {
      const activeLink = sections.find(s => s.el === currentSection);
      if (activeLink) {
        activeLink.link.classList.add('active');
      }
    }
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq__item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // --- Scroll Fade-in Animation ---
  const fadeEls = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // --- Lazy Load Images ---
  const lazyImages = document.querySelectorAll('img.lazy');

  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
        }
        lazyObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px'
  });

  lazyImages.forEach(img => lazyObserver.observe(img));

  // --- Floating CTA ---
  const floatingCta = document.getElementById('floatingCta');
  const heroSection = document.getElementById('hero');

  if (floatingCta && heroSection) {
    window.addEventListener('scroll', () => {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    }, { passive: true });
  }
});
