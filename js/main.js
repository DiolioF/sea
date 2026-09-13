(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('.form-status');

  const hero = document.querySelector('.hero');
  const contactSection = document.querySelector('#contacto');
  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  const trackedSections = Array.from(document.querySelectorAll('#servicios, #proyectos, #proceso, #zona, #contacto'));
  let scrollPending = false;
  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const headerHeight = header?.offsetHeight || 0;
    const pastHero = Boolean(hero && hero.getBoundingClientRect().bottom < headerHeight);
    const beforeContact = !contactSection || contactSection.getBoundingClientRect().top > window.innerHeight;
    document.body.classList.toggle('show-mobile-cta', pastHero && beforeContact);
    const active = trackedSections.filter(section => section.getBoundingClientRect().top <= headerHeight + 100).at(-1);
    navLinks.forEach(link => {
      const selected = Boolean(active && link.hash === `#${active.id}`);
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  };
  syncHeader();
  const scheduleHeader = () => {
    if (scrollPending) return;
    scrollPending = true;
    window.requestAnimationFrame(syncHeader);
  };
  window.addEventListener('scroll', scheduleHeader, { passive: true });
  window.addEventListener('resize', scheduleHeader, { passive: true });
  window.addEventListener('load', scheduleHeader, { once: true });

  const pageSurfaces = document.querySelectorAll('main, .site-footer, .mobile-sticky-cta');

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
    header?.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
    pageSurfaces.forEach(surface => { surface.inert = false; });
  };

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.hidden = !opening;
    header?.classList.toggle('menu-active', opening);
    document.body.classList.toggle('menu-open', opening);
    pageSurfaces.forEach(surface => { surface.inert = opening; });
    if (opening) mobileNav.querySelector('a')?.focus({ preventScroll: true });
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 1000px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus({ preventScroll: true });
    }
    if (event.key === 'Tab') {
      const focusables = [menuButton, ...mobileNav.querySelectorAll('a')];
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const service = contactForm?.elements.namedItem('servicio');
      if (service) service.value = link.dataset.service;
      formStatus.textContent = '';
      document.querySelector('.query-result').hidden = true;
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.section-heading, .service-card, .focus-content > *, .process-list li, .coverage-copy, .coverage-image, .faq-grid > *, .contact-grid > *');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -9% 0px', threshold: .08 });
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-ready');
      if (element.matches('.coverage-copy, .contact-copy')) element.classList.add('reveal-from-left');
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
      revealObserver.observe(element);
    });
  }

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const query = ['Hola SEA Energía, quisiera solicitar una evaluación.','',`Nombre: ${data.get('nombre')}`,`Localidad: ${data.get('localidad')}`,`Servicio: ${data.get('servicio')}`,`Consulta: ${data.get('mensaje')}`].join('\n');
    const preview = document.querySelector('#query-preview');
    const result = document.querySelector('.query-result');
    preview.value = query;
    result.hidden = false;
    try {
      await navigator.clipboard.writeText(query);
      formStatus.textContent = 'Mensaje copiado. Ya podés pegarlo en tu conversación con SEA.';
    } catch {
      formStatus.textContent = 'Tu mensaje está listo abajo. Seleccionalo y copialo para compartirlo con SEA.';
      preview.focus({ preventScroll: true });
      preview.select();
    }
  });
  contactForm?.addEventListener('input', () => {
    formStatus.textContent = '';
    document.querySelector('.query-result').hidden = true;
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
