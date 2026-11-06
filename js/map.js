/**
 * Grupo Pacheco - Lógica del Mapa Interactivo de Bolivia (map.js)
 * Renderizado de SVG de Bolivia, interacción con departamentos, pines de sedes y panel dinámico
 */

const BoliviaMap = {
  activeDeptId: 'LP',
  sedesData: [],
  containerEl: null,
  detailEl: null,

  // Definición vectorial simplificada y armónica de los 9 departamentos de Bolivia (viewBox: 0 0 600 620)
  departments: [
    {
      id: 'PA',
      nombre: 'Pando',
      path: 'M 140 30 L 220 50 L 250 110 L 210 145 L 140 120 L 105 75 Z',
      labelX: 175,
      labelY: 90,
      center: { x: 175, y: 85 }
    },
    {
      id: 'BN',
      nombre: 'Beni',
      path: 'M 220 50 L 340 90 L 380 180 L 340 260 L 250 250 L 210 145 L 250 110 Z',
      labelX: 285,
      labelY: 175,
      center: { x: 285, y: 175 }
    },
    {
      id: 'LP',
      nombre: 'La Paz',
      path: 'M 105 75 L 140 120 L 210 145 L 250 250 L 205 320 L 160 300 L 130 230 L 95 190 Z',
      labelX: 165,
      labelY: 220,
      center: { x: 165, y: 220 }
    },
    {
      id: 'CB',
      nombre: 'Cochabamba',
      path: 'M 205 320 L 250 250 L 340 260 L 330 350 L 265 370 L 205 320 Z',
      labelX: 270,
      labelY: 315,
      center: { x: 270, y: 315 }
    },
    {
      id: 'SC',
      nombre: 'Santa Cruz',
      path: 'M 340 90 L 460 130 L 530 220 L 515 370 L 415 425 L 330 350 L 340 260 L 380 180 Z',
      labelX: 415,
      labelY: 270,
      center: { x: 415, y: 270 }
    },
    {
      id: 'OR',
      nombre: 'Oruro',
      path: 'M 160 300 L 205 320 L 220 405 L 175 435 L 135 385 Z',
      labelX: 175,
      labelY: 365,
      center: { x: 175, y: 365 }
    },
    {
      id: 'PT',
      nombre: 'Potosí',
      path: 'M 175 435 L 220 405 L 265 370 L 290 440 L 280 540 L 200 550 L 165 490 Z',
      labelX: 230,
      labelY: 480,
      center: { x: 230, y: 480 }
    },
    {
      id: 'CH',
      nombre: 'Chuquisaca',
      path: 'M 265 370 L 330 350 L 350 430 L 320 490 L 290 440 Z',
      labelX: 305,
      labelY: 420,
      center: { x: 305, y: 420 }
    },
    {
      id: 'TJ',
      nombre: 'Tarija',
      path: 'M 280 540 L 290 440 L 350 430 L 380 515 L 320 560 Z',
      labelX: 330,
      labelY: 510,
      center: { x: 330, y: 510 }
    }
  ],

  init(containerSelector = '#bolivia-map-canvas', detailSelector = '#sede-detail-card', chipsSelector = '#dept-chips') {
    this.containerEl = document.querySelector(containerSelector);
    this.detailEl = document.querySelector(detailSelector);
    this.chipsEl = document.querySelector(chipsSelector);

    if (!this.containerEl) return;

    const data = window.PachecoStore ? window.PachecoStore.getDataSync() : null;
    this.sedesData = data && data.sedes ? data.sedes : [];

    this.renderMap();
    this.renderChips();
    this.selectDepartment(this.activeDeptId);
  },

  renderMap() {
    let svgHtml = `
      <svg class="bolivia-svg-map" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mapShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.1" />
          </filter>
        </defs>
        <g id="departments-group">
    `;

    // Renderizar cada departamento
    this.departments.forEach(dept => {
      const hasSede = this.sedesData.some(s => s.id === dept.id);
      const activeClass = dept.id === this.activeDeptId ? 'active' : '';
      const sedeClass = hasSede ? 'has-sede' : '';

      svgHtml += `
        <g class="dept-group" data-id="${dept.id}">
          <path id="dept-${dept.id}" class="dept-path ${sedeClass} ${activeClass}" d="${dept.path}" data-id="${dept.id}" data-name="${dept.nombre}" />
          <text class="dept-label" x="${dept.labelX}" y="${dept.labelY}">${dept.nombre}</text>
        </g>
      `;
    });

    // Renderizar pines de sedes en centros calculados
    svgHtml += `</g><g id="pins-group">`;

    this.departments.forEach(dept => {
      const sede = this.sedesData.find(s => s.id === dept.id);
      if (sede) {
        const isActive = dept.id === this.activeDeptId ? 'active' : '';
        svgHtml += `
          <g class="sede-pin ${isActive}" id="pin-${dept.id}" data-id="${dept.id}" transform="translate(${dept.center.x}, ${dept.center.y})">
            <circle class="pin-pulse" cx="0" cy="0" r="8" fill="#009B8E" />
            <circle class="pin-dot" cx="0" cy="0" r="5" />
          </g>
        `;
      }
    });

    svgHtml += `
        </g>
      </svg>
      <div id="map-tooltip" class="map-tooltip"></div>
    `;

    this.containerEl.innerHTML = svgHtml;
    this.attachEvents();
  },

  renderChips() {
    if (!this.chipsEl) return;

    let html = '';
    this.departments.forEach(dept => {
      const active = dept.id === this.activeDeptId ? 'active' : '';
      html += `
        <button type="button" class="dept-chip ${active}" data-id="${dept.id}">
          ${dept.nombre}
        </button>
      `;
    });

    this.chipsEl.innerHTML = html;

    this.chipsEl.querySelectorAll('.dept-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.selectDepartment(id);
      });
    });
  },

  attachEvents() {
    const tooltip = this.containerEl.querySelector('#map-tooltip');

    // Hover y click en paths
    this.containerEl.querySelectorAll('.dept-path, .sede-pin').forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const deptId = el.getAttribute('data-id');
        const dept = this.departments.find(d => d.id === deptId);
        const sede = this.sedesData.find(s => s.id === deptId);

        if (tooltip && dept) {
          tooltip.innerHTML = `<strong>${dept.nombre}</strong>${sede ? ` &bull; ${sede.nombre_sede}` : ''}`;
          tooltip.classList.add('visible');
        }
      });

      el.addEventListener('mousemove', (e) => {
        if (!tooltip) return;
        const rect = this.containerEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      });

      el.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.remove('visible');
      });

      el.addEventListener('click', () => {
        const deptId = el.getAttribute('data-id');
        this.selectDepartment(deptId);
      });
    });
  },

  selectDepartment(deptId) {
    this.activeDeptId = deptId;

    // Actualizar clases SVG
    this.containerEl.querySelectorAll('.dept-path').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-id') === deptId);
    });

    this.containerEl.querySelectorAll('.sede-pin').forEach(pin => {
      pin.classList.toggle('active', pin.getAttribute('data-id') === deptId);
    });

    // Actualizar Chips
    if (this.chipsEl) {
      this.chipsEl.querySelectorAll('.dept-chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-id') === deptId);
      });
    }

    // Actualizar Tarjeta de Sede
    this.renderDetailCard(deptId);
  },

  renderDetailCard(deptId) {
    if (!this.detailEl) return;

    const dept = this.departments.find(d => d.id === deptId);
    const sede = this.sedesData.find(s => s.id === deptId);

    if (!sede) {
      this.detailEl.innerHTML = `
        <div class="sede-detail-card">
          <span class="sede-badge-type"><i class="ri-map-pin-line"></i> Cobertura en Expansión</span>
          <h3 class="sede-card-title">${dept ? dept.nombre : 'Bolivia'}</h3>
          <p class="sede-card-dept"><i class="ri-information-line"></i> Punto de atención y proyectos en curso</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Grupo Pacheco atiende requerimientos en este departamento a través de nuestros centros regionales principales de La Paz, Cochabamba y Santa Cruz.
          </p>
          <a href="#contacto" class="btn btn-outline btn-sm">Solicitar Información</a>
        </div>
      `;
      return;
    }

    const unitsHtml = (sede.unidades_presentes || [])
      .map(u => `<span class="sede-unit-tag">${u}</span>`)
      .join('');

    this.detailEl.innerHTML = `
      <div class="sede-detail-card">
        <span class="sede-badge-type"><i class="ri-building-4-line"></i> ${sede.tipo || 'Sede Regional'}</span>
        <h3 class="sede-card-title">${sede.nombre_sede}</h3>
        <p class="sede-card-dept"><i class="ri-map-pin-2-fill"></i> ${sede.departamento}, Bolivia</p>
        
        <div class="sede-info-list">
          <div class="sede-info-item">
            <i class="ri-map-pin-line"></i>
            <div>
              <strong>Dirección:</strong>
              <div>${sede.direccion}</div>
            </div>
          </div>

          <div class="sede-info-item">
            <i class="ri-phone-line"></i>
            <div>
              <strong>Teléfono Central:</strong>
              <div><a href="tel:${sede.telefono}" style="color: var(--primary); font-weight:600;">${sede.telefono}</a></div>
            </div>
          </div>

          <div class="sede-info-item">
            <i class="ri-mail-line"></i>
            <div>
              <strong>Correo Oficial:</strong>
              <div><a href="mailto:${sede.email}" style="color: var(--primary); font-weight:600;">${sede.email}</a></div>
            </div>
          </div>

          ${sede.horario ? `
            <div class="sede-info-item">
              <i class="ri-time-line"></i>
              <div>
                <strong>Atención:</strong>
                <div>${sede.horario}</div>
              </div>
            </div>
          ` : ''}

          ${sede.responsable ? `
            <div class="sede-info-item">
              <i class="ri-user-star-line"></i>
              <div>
                <strong>Dirección / Responsable:</strong>
                <div>${sede.responsable}</div>
              </div>
            </div>
          ` : ''}
        </div>

        <div>
          <strong style="font-size: 0.85rem; color: var(--text-main);">Unidades y Servicios Operativos:</strong>
          <div class="sede-units-tag-list">${unitsHtml}</div>
        </div>

        <div class="sede-contact-actions">
          <a href="tel:${sede.telefono}" class="btn btn-primary btn-sm">
            <i class="ri-phone-fill"></i> Llamar
          </a>
          <a href="mailto:${sede.email}" class="btn btn-outline btn-sm">
            <i class="ri-mail-send-line"></i> Enviar Mensaje
          </a>
        </div>
      </div>
    `;
  }
};

window.BoliviaMap = BoliviaMap;

