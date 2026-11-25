// Other portfolio pages use manual scroll restoration. Reset it for this page.
if ('scrollRestoration' in history) history.scrollRestoration = 'auto';

const workScrollKey = `work-scroll:${location.pathname}`;
const workNavigation = performance.getEntriesByType('navigation')[0];
let workReloadPosition = null;

if (workNavigation?.type === 'reload') {
  try {
    const savedPosition = sessionStorage.getItem(workScrollKey);
    const position = Number(savedPosition);
    if (savedPosition !== null && Number.isFinite(position) && position >= 0) {
      workReloadPosition = position;
    }
  } catch {
    // Leave native browser restoration available when storage is blocked.
  }
}

window.addEventListener('pagehide', () => {
  try {
    sessionStorage.setItem(workScrollKey, String(window.scrollY));
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
});

window.addEventListener('pageshow', async (event) => {
  if (event.persisted || workReloadPosition === null) return;
  // Restore after anchor navigation and font loading have settled the layout.
  if (document.fonts) await document.fonts.ready;
  requestAnimationFrame(() => window.scrollTo(0, workReloadPosition));
});

const workMenuButton = document.querySelector('.nav-toggle');
const workMenu = document.querySelector('#mainnav');

if (workMenuButton && workMenu) {
  function setWorkMenu(open) {
    workMenu.classList.toggle('is-open', open);
    workMenuButton.classList.toggle('is-open', open);
    workMenuButton.setAttribute('aria-expanded', String(open));
    workMenuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  workMenuButton.addEventListener('click', () => {
    setWorkMenu(workMenuButton.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('click', (event) => {
    if (!workMenu.contains(event.target) && !workMenuButton.contains(event.target)) {
      setWorkMenu(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && workMenuButton.getAttribute('aria-expanded') === 'true') {
      setWorkMenu(false);
      workMenuButton.focus();
    }
  });
  workMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setWorkMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setWorkMenu(false);
  });
}
