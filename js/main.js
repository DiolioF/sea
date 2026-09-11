(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('.form-status');

  const hero = document.querySelector('.hero');
  const contactSection = document.querySelector('#contacto');
  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const pastHero = Boolean(hero && window.scrollY > hero.offsetHeight * .68);
    const beforeContact = !contactSection || window.scrollY + window.innerHeight < contactSection.offsetTop + 80;
    document.body.classList.toggle('show-mobile-cta', pastHero && beforeContact);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
    header?.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Cerrar menú' : 'Abrir menú');
    mobileNav.hidden = !opening;
    header?.classList.toggle('menu-active', opening);
    document.body.classList.toggle('menu-open', opening);
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.matchMedia('(min-width: 1000px)').addEventListener('change', (event) => { if (event.matches) closeMenu(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

  const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
  const trackedSections = document.querySelectorAll('#servicios, #proceso, #proyectos, #zona, #contacto');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${visible.target.id}`));
    }, { rootMargin: '-22% 0px -64% 0px', threshold: [0, .2, .5] });
    trackedSections.forEach((section) => navObserver.observe(section));
  }

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
    try {
      await navigator.clipboard.writeText(query);
      formStatus.textContent = 'Consulta copiada. Ya podés pegarla en tu mensaje a SEA Energía.';
    } catch {
      formStatus.textContent = 'Tu consulta está lista. Copiá estos datos para enviarlos por tu canal habitual.';
    }
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
