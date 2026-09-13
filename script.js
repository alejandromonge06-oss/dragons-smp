// Edita precios y URLs cuando estén definidos. Las URLs vacías no abren ninguna pasarela.
const UNBAN_PRICE = '$5.90 USD';
const SEGUNDO_UNBAN_PRICE = '$11.79 USD';
const SEGUNDO_UNBAN_URL = '';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const toast = document.querySelector('.toast');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shopValues = {
    UNBAN_PRICE,
    SEGUNDO_UNBAN_PRICE,
  };
  const shopUrls = {
    SEGUNDO_UNBAN_URL,
  };
  document.querySelectorAll('[data-price-key]').forEach((price) => {
    price.textContent = shopValues[price.dataset.priceKey];
  });
  document.querySelectorAll('[data-purchase-key]').forEach((link) => {
    const url = shopUrls[link.dataset.purchaseKey];
    if (url) {
      link.href = url;
      link.removeAttribute('aria-disabled');
    } else {
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', (event) => event.preventDefault());
    }
  });


  if (!reduceMotion) {
    const heroParticles = document.querySelector('.hero-particles');
    for (let index = 0; index < 8; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'hero-particle';
      particle.style.setProperty('--left', `${8 + Math.random() * 84}%`);
      particle.style.setProperty('--top', `${8 + Math.random() * 84}%`);
      particle.style.setProperty('--size', `${1 + Math.random() * 2}px`);
      particle.style.setProperty('--duration', `${6 + Math.random() * 3}s`);
      particle.style.setProperty('--delay', `${Math.random() * -8}s`);
      particle.style.setProperty('--drift', `${-12 + Math.random() * 24}px`);
      heroParticles.appendChild(particle);
    }
  }

  let scrollTicking = false;
  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeader);
      scrollTicking = true;
    }
  }, { passive: true });
  updateHeader();

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  let toastTimer;
  const showToast = () => {
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2300);
  };

  const fallbackCopy = (value) => {
    const helper = document.createElement('textarea');
    helper.value = value;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  };

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch (error) {
        fallbackCopy(value);
      }
      const originalLabel = button.textContent;
      button.textContent = 'Copiado';
      showToast();
      window.setTimeout(() => { button.textContent = originalLabel; }, 1800);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (!activeLink) return;
        navLinks.forEach((link) => link.classList.remove('is-active'));
        activeLink.classList.add('is-active');
      });
    }, { rootMargin: '-42% 0px -52% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }
});
