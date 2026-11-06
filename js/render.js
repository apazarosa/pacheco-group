/**
 * Grupo Pacheco (Corporación Domingo Savio)
 * Módulo de Renderizado en el DOM (render.js)
 * Transforma los datos en componentes UI modernos, accesibles y reactivos
 */

const Render = {
  // Estado local para los filtros interactivos
  currentUnitFilter: 'todos',
  currentSystemFilter: 'todos',
  currentSystemSearch: '',

  /**
   * Renderiza todos los bloques de la página
   */
  all(db) {
    if (!db) return;
    this.empresa(db.empresa);
    this.liderazgo(db.liderazgo);
    this.valores(db.empresa.valores);
    this.unidades(db.unidades, this.currentUnitFilter);
    this.sistemas(db.sistemas, this.currentSystemFilter, this.currentSystemSearch);
  },

  /**
   * Datos institucionales
   */
  empresa(empresa) {
    if (!empresa) return;

    // Actualizar Misión y Visión
    const misionEl = document.querySelector('#display-mision');
    if (misionEl && empresa.mision) misionEl.textContent = empresa.mision;

    const visionEl = document.querySelector('#display-vision');
    if (visionEl && empresa.vision) visionEl.textContent = empresa.vision;
  },

  /**
   * Liderazgo (Ing. Víctor Pacheco Llerena & Ing. Norma Pacheco Suárez)
   */
  liderazgo(lideres = []) {
    const container = document.querySelector('#liderazgo-grid');
    if (!container) return;

    container.innerHTML = lideres.map(lid => `
      <article class="leader-card" data-id="${lid.id}">
        <div class="leader-visual">
          <img src="${lid.foto}" alt="${lid.nombre}" class="leader-photo" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500'"/>
        </div>
        <div class="leader-content">
          <span class="leader-role-tag">${lid.cargo}</span>
          <h3 class="leader-name">${lid.nombre}</h3>
          <p class="leader-bio">${lid.resena}</p>
        </div>
      </article>
    `).join('');
  },

  /**
   * Valores Institucionales
   */
  valores(valores = []) {
    const container = document.querySelector('#valores-container');
    if (!container) return;

    container.innerHTML = valores.map((v, idx) => `
      <div class="value-card">
        <div class="value-number">0${idx + 1}</div>
        <h4 class="value-title">${v.titulo}</h4>
        <p class="value-desc">${v.desc}</p>
      </div>
    `).join('');
  },

  /**
   * Determina el número de columnas independientes para las unidades
   */
  getUnitsColCount() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1000) return 2;
    if (w < 1300) return 3;
    return 4;
  },

  /**
   * Ecosistema de Unidades de Negocio (Filtrables)
   * Formato idéntico al Portal de Sistemas (fila compacta con desplegable limpio y borde verde)
   */
  unidades(unidades = [], filter = 'todos') {
    this.currentUnitFilter = filter;
    const container = document.querySelector('#unidades-grid');
    if (!container) return;

    const filtered = filter === 'todos'
      ? unidades
      : unidades.filter(u => u.categoria.toLowerCase() === filter.toLowerCase());

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="width: 100%; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="ri-folder-info-line" style="font-size: 2rem;"></i>
          <p>No se encontraron unidades en esta categoría.</p>
        </div>
      `;
      return;
    }

    const colCount = this.getUnitsColCount();
    const columns = Array.from({ length: colCount }, () => []);

    filtered.forEach((u, idx) => {
      columns[idx % colCount].push(u);
    });

    const renderUnitCardHtml = (u) => `
      <div class="unit-card ${u.estado === 'Inactivo' ? 'unit-inactive' : ''}" data-id="${u.id}" data-url="${u.url || ''}">
        <div class="unit-card-main-row">
          <div class="unit-brand-logo-wrap">
            <img src="${u.logo_img || 'assets/images/Logo.jpeg'}" alt="${u.nombre}" class="unit-brand-logo-img" />
          </div>

          <h4 class="unit-title">
            <a href="${u.url || '#'}" target="_blank" rel="noopener noreferrer" class="unit-title-link">
              ${u.nombre}
            </a>
          </h4>

          <button type="button" class="unit-desc-toggle" title="Ver información" aria-label="Ver información de ${u.nombre}">
            <i class="ri-arrow-down-s-line"></i>
          </button>
        </div>

        <div class="unit-desc-wrapper">
          <p class="unit-desc">${u.descripcion}</p>
        </div>
      </div>
    `;

    container.innerHTML = columns.map(colItems => `
      <div class="unit-col">
        ${colItems.map(u => renderUnitCardHtml(u)).join('')}
      </div>
    `).join('');

    // Eventos de interacción: acordeón exclusivo y navegación al enlace oficial
    container.querySelectorAll('.unit-card').forEach(card => {
      const toggleBtn = card.querySelector('.unit-desc-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCurrentlyOpen = card.classList.contains('desc-open');

          container.querySelectorAll('.unit-card.desc-open').forEach(otherCard => {
            otherCard.classList.remove('desc-open');
          });

          if (!isCurrentlyOpen) {
            card.classList.add('desc-open');
          }
        });
      }

      const descWrapper = card.querySelector('.unit-desc-wrapper');
      if (descWrapper) {
        descWrapper.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.unit-desc-toggle') || e.target.closest('.unit-desc-wrapper')) {
          return;
        }
        // Si hace clic en el enlace del título, el navegador ya navega naturalmente.
        // Si hace clic en el resto de la tarjeta, abre el enlace oficial en pestaña nueva.
        if (!e.target.closest('.unit-title-link')) {
          const url = card.getAttribute('data-url');
          if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
          }
        }
      });
    });

    // Cerrar al hacer clic fuera
    if (!this._unitsOutsideClickBound) {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.unit-card')) {
          document.querySelectorAll('.unit-card.desc-open').forEach(c => c.classList.remove('desc-open'));
        }
      });
      this._unitsOutsideClickBound = true;
    }

    // Escucha de resize para recalcular columnas
    if (!this._unitsResizeBound) {
      let lastCols = colCount;
      window.addEventListener('resize', () => {
        clearTimeout(this._unitsResizeTimer);
        this._unitsResizeTimer = setTimeout(() => {
          const newCols = this.getUnitsColCount();
          if (newCols !== lastCols) {
            lastCols = newCols;
            const db = window.PachecoStore ? window.PachecoStore.get() : null;
            if (db && db.unidades) {
              this.unidades(db.unidades, this.currentUnitFilter);
            }
          }
        }, 150);
      });
      this._unitsResizeBound = true;
    }
  },

  getSystemsColCount() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1000) return 2;
    if (w < 1300) return 3;
    return 4;
  },

  /**
   * Hub de Sistemas e Intranet (Inspirado en SharePoint UPDS)
   * Renderizado en columnas independientes (Masonry tracks):
   * Al abrir un desplegable, solo baja la tarjeta que está debajo en SU MISMA COLUMNA.
   * Las demás columnas se mantienen fijas en su posición.
   */
  sistemas(sistemas = [], filterType = 'todos', searchQuery = '') {
    this.currentSystemFilter = filterType;
    this.currentSystemSearch = searchQuery;
    const container = document.querySelector('#sistemas-grid');
    if (!container) return;

    let list = [...sistemas];

    // Filtro por tipo: si es 'todos', no incluir 'tutoriales' (los videos tutoriales solo se muestran al seleccionar su propia pestaña)
    if (filterType === 'todos') {
      list = list.filter(s => (s.tipo || '').toLowerCase() !== 'tutoriales');
    } else {
      list = list.filter(s => (s.tipo || '').toLowerCase() === filterType.toLowerCase());
    }

    // Filtro por búsqueda instantánea
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        (s.categoria && s.categoria.toLowerCase().includes(q)) ||
        (s.descripcion && s.descripcion.toLowerCase().includes(q))
      );
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div class="empty-systems-state" style="width: 100%; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="ri-search-eye-line" style="font-size: 2rem;"></i>
          <h4>No se encontraron sistemas</h4>
          <p>Pruebe con otro término de búsqueda (ej. SAADS, SAP, Galileo, Teams).</p>
        </div>
      `;
      return;
    }

    // Distribuir los elementos en columnas independientes para que el desplegable
    // solo empuje hacia abajo a las tarjetas de su propia columna vertical
    const colCount = this.getSystemsColCount();
    const columns = Array.from({ length: colCount }, () => []);

    list.forEach((sys, idx) => {
      columns[idx % colCount].push(sys);
    });

    const renderCardHtml = (sys) => `
      <div class="system-card" data-id="${sys.id}" data-url="${sys.url}">
        <div class="system-card-main-row">
          <div class="system-icon-box" style="background: ${sys.color || 'var(--color-primary)'};">
            ${sys.logo_img ? `<img src="${sys.logo_img}" alt="${sys.nombre}" style="width: 24px; height: 24px; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));" />` : `<i class="${sys.icono || 'ri-link-m'}"></i>`}
          </div>

          <h4 class="system-title">
            <a href="${sys.url}" target="_blank" rel="noopener noreferrer" class="system-title-link">
              ${sys.nombre}
            </a>
          </h4>

          <button type="button" class="system-desc-toggle" title="Ver descripción" aria-label="Ver descripción de ${sys.nombre}">
            <i class="ri-arrow-down-s-line"></i>
          </button>
        </div>

        <div class="system-desc-wrapper">
          <p class="system-desc">${sys.descripcion}</p>
        </div>
      </div>
    `;

    container.innerHTML = columns.map(colItems => `
      <div class="system-col">
        ${colItems.map(sys => renderCardHtml(sys)).join('')}
      </div>
    `).join('');

    // Eventos de interacción: desplegable al lado del título (acordeón exclusivo) y apertura del sistema
    container.querySelectorAll('.system-card').forEach(card => {
      const toggleBtn = card.querySelector('.system-desc-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isCurrentlyOpen = card.classList.contains('desc-open');

          // Cierra cualquier otro desplegable abierto para que solo uno esté visible
          container.querySelectorAll('.system-card.desc-open').forEach(otherCard => {
            otherCard.classList.remove('desc-open');
          });

          // Si el actual estaba cerrado, se abre (empujando hacia abajo las tarjetas de su columna)
          if (!isCurrentlyOpen) {
            card.classList.add('desc-open');
          }
        });
      }

      const descWrapper = card.querySelector('.system-desc-wrapper');
      if (descWrapper) {
        descWrapper.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      card.addEventListener('click', (e) => {
        if (e.target.closest('.system-desc-toggle') || e.target.closest('.system-desc-wrapper')) {
          return;
        }
        const url = card.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    });

    // Cerrar automáticamente si el usuario hace clic fuera de las tarjetas
    if (!this._systemsOutsideClickBound) {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.system-card')) {
          document.querySelectorAll('.system-card.desc-open').forEach(c => c.classList.remove('desc-open'));
        }
      });
      this._systemsOutsideClickBound = true;
    }

    // Escucha de redimensionamiento de pantalla para recalcular columnas si cambia el breakpoint
    if (!this._systemsResizeBound) {
      let lastCols = colCount;
      window.addEventListener('resize', () => {
        clearTimeout(this._systemsResizeTimer);
        this._systemsResizeTimer = setTimeout(() => {
          const newCols = this.getSystemsColCount();
          if (newCols !== lastCols) {
            lastCols = newCols;
            const db = window.PachecoStore ? window.PachecoStore.get() : null;
            if (db && db.sistemas) {
              this.sistemas(db.sistemas, this.currentSystemFilter, this.currentSystemSearch);
            }
          }
        }, 150);
      });
      this._systemsResizeBound = true;
    }
  }
};

window.PachecoRender = Render;
