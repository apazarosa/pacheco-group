/**
 * Grupo Pacheco (Corporación Domingo Savio)
 * Módulo Principal de Inicialización, Modo Claro/Oscuro y Eventos Globales (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Modo Claro / Oscuro
  setupThemeToggle();

  // 2. Inicializar Almacén Local de Datos (LocalStorage: 'GRUPO_PACHECO_DB')
  const db = window.PachecoStore.init();

  // 3. Renderizar Interfaz Inicial
  window.PachecoRender.all(db);

  // 4. Inicializar Panel de Administración CMS
  window.Admin.init();

  // 5. Reactividad Pura: cuando el Store cambie (crear, editar, eliminar, reset),
  // se re-renderizan los componentes del DOM instantáneamente sin recargar la página.
  window.addEventListener('pacheco:store-changed', (e) => {
    window.PachecoRender.all(e.detail);
  });

  // 6. Configurar Filtros, Búsqueda y Menú Móvil
  setupCategoryFilters();
  setupSystemHubInteractivity();
  setupMobileNav();
});

/**
 * Control del Modo Claro y Modo Oscuro con Persistencia en LocalStorage
 */
function setupThemeToggle() {
  const toggleBtn = document.querySelector('#theme-toggle');
  const THEME_KEY = 'pacheco_theme';

  // Obtener preferencia guardada o preferencia del sistema operativo
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_KEY, nextTheme);
    });
  }

  // Escuchar cambios en la preferencia del sistema operativo
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.querySelector('#theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('title', theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro');
  }

  // Notificar a componentes que puedan requerir redibujado específico
  window.dispatchEvent(new CustomEvent('pacheco:theme-changed', { detail: { theme } }));
}

/**
 * Filtros de Categoría para Unidades de Negocio
 */
function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.unit-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-cat') || 'todos';

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const db = window.PachecoStore.get();
      window.PachecoRender.unidades(db.unidades, cat);
    });
  });
}

/**
 * Barra de Búsqueda Instantánea y Filtros del Hub de Sistemas (SharePoint / M365 / ERP)
 */
function setupSystemHubInteractivity() {
  const searchInput = document.querySelector('#sys-search-input');
  const clearBtn = document.querySelector('#sys-search-clear');
  const typeFilterBtns = document.querySelectorAll('.sys-filter-pill');

  let currentType = 'todos';
  let currentSearch = '';

  const triggerFilter = () => {
    const db = window.PachecoStore.get();
    window.PachecoRender.sistemas(db.sistemas, currentType, currentSearch);
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = currentSearch.trim() ? 'flex' : 'none';
      }
      triggerFilter();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      currentSearch = '';
      clearBtn.style.display = 'none';
      triggerFilter();
    });
  }

  typeFilterBtns.forEach(pill => {
    pill.addEventListener('click', () => {
      typeFilterBtns.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      currentType = pill.getAttribute('data-type') || 'todos';
      triggerFilter();
    });
  });
}

/**
 * Control del Menú Móvil y Sombra con Scroll
 */
function setupMobileNav() {
  const toggleBtn = document.querySelector('#mobile-menu-toggle');
  const navMenu = document.querySelector('#main-nav-menu');
  const navbar = document.querySelector('.site-header');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen
        ? '<i class="ri-close-line"></i>'
        : '<i class="ri-menu-3-line"></i>';
    });

    // Cerrar al pulsar un link
    navMenu.querySelectorAll('.nav-anchor').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '<i class="ri-menu-3-line"></i>';
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}
