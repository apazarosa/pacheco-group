/**
 * Grupo Pacheco - Inicialización y eventos de Landing Page (main.js)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Cargar datos desde Store (con soporte LocalStorage y fallback)
  const data = await window.PachecoStore.getData();

  // Renderizar componentes principales
  window.PachecoRender.renderAll(data);

  // Inicializar mapa interactivo de Bolivia
  window.BoliviaMap.init('#bolivia-map-canvas', '#sede-detail-card', '#dept-chips');

  // Reactividad ante cambios desde el admin o local storage
  window.addEventListener('pacheco:data-updated', (e) => {
    window.PachecoRender.renderAll(e.detail);
    window.BoliviaMap.init('#bolivia-map-canvas', '#sede-detail-card', '#dept-chips');
  });

  // Configurar interactividad de la UI
  setupNavigation();
  setupContactForm();
});

/**
 * Control del menú móvil, scroll y estados activos
 */
function setupNavigation() {
  const toggleBtn = document.querySelector('#nav-toggle');
  const navMenu = document.querySelector('#nav-menu');
  const navbar = document.querySelector('.navbar');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('show')) {
          icon.className = 'ri-close-line';
        } else {
          icon.className = 'ri-menu-3-line';
        }
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'ri-menu-3-line';
      });
    });
  }

  // Sombra en navbar con scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });
}

/**
 * Manejo del formulario de contacto simulado
 */
function setupContactForm() {
  const form = document.querySelector('#contact-form');
  const alertBox = document.querySelector('#contact-form-alert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando consulta...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.className = 'alert-success';
        alertBox.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Su mensaje ha sido enviado exitosamente al Departamento de Atención Corporativa de Grupo Pacheco. Nos pondremos en contacto a la brevedad.';

        setTimeout(() => {
          alertBox.style.display = 'none';
        }, 5000);
      }
    }, 900);
  });
}

