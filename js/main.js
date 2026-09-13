(() => {
  'use strict';

  // Add the real SEA number here, including country code, with digits only.
  // Argentine mobile format: 549 + area code + subscriber number (no 0 or 15).
  const WHATSAPP_NUMBER = '5492235940073';
  const messages = {
    general: 'Hola SEA Energía, quisiera consultar por un proyecto. Estoy en ',
    solar: 'Hola SEA Energía, me interesa un sistema solar llave en mano. Estoy en ',
    industrial: 'Hola SEA Energía, quisiera consultar por una instalación eléctrica industrial. Estoy en '
  };
  const ready = /^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER);
  const status = document.querySelector('.whatsapp-status');
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (ready) {
      const message = messages[link.dataset.whatsapp] || messages.general;
      link.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else if (link.hasAttribute('data-contact-button')) {
      link.setAttribute('aria-disabled', 'true');
      link.addEventListener('click', event => {
        event.preventDefault();
        status.textContent = 'WhatsApp disponible próximamente.';
      });
    }
  });
  if (ready) status.textContent = 'Abrís WhatsApp y nos contás tu idea. Así de simple.';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const surfaces = document.querySelectorAll('main, .site-footer, .whatsapp-float');
  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobileNav.hidden = true;
    document.body.classList.remove('menu-open');
    surfaces.forEach(surface => { surface.inert = false; });
    if (returnFocus) menuButton.focus({ preventScroll: true });
  }
  menuButton.addEventListener('click', () => {
    if (menuButton.getAttribute('aria-expanded') === 'true') return closeMenu(true);
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Cerrar menú');
    mobileNav.hidden = false;
    document.body.classList.add('menu-open');
    surfaces.forEach(surface => { surface.inert = true; });
    mobileNav.querySelector('a').focus({ preventScroll: true });
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  window.matchMedia('(min-width:1000px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (mobileNav.hidden) return;
    if (event.key === 'Escape') return closeMenu(true);
    if (event.key !== 'Tab') return;
    const focusables = [menuButton, ...mobileNav.querySelectorAll('a')];
    const first = focusables[0], last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const hero = document.querySelector('.hero');
  const contact = document.querySelector('#contacto');
  const sections = [...document.querySelectorAll('#servicios, #proceso, #zona, #contacto')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  let queued = false;
  function sync() {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
    document.body.classList.toggle('show-whatsapp', hero.getBoundingClientRect().bottom < header.offsetHeight && contact.getBoundingClientRect().top > innerHeight);
    const active = sections.filter(section => section.getBoundingClientRect().top <= header.offsetHeight + 80).at(-1);
    navLinks.forEach(link => {
      if (active && link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(sync); } }
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', schedule, { passive:true });
  window.addEventListener('load', sync, { once:true });
  sync();
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
