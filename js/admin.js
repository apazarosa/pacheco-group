/**
 * Grupo Pacheco (Corporación Domingo Savio)
 * Módulo del Panel de Control CMS (admin.js)
 * Maneja el Drawer/Modal administrativo, formularios CRUD y reactividad instantánea
 */

const Admin = {
  drawerEl: null,
  overlayEl: null,
  activeTab: 'cms-unidades',
  editingUnitId: null,
  editingSysId: null,
  unitFilterQuery: '',
  systemFilterQuery: '',

  init() {
    this.drawerEl = document.querySelector('#cms-drawer');
    this.overlayEl = document.querySelector('#cms-overlay');

    this.bindDrawerTriggers();
    this.bindTabNavigation();
    this.bindSearchFilters();
    this.bindImageUploaders();
    this.bindUnitForm();
    this.bindSystemForm();
    this.bindMisionVisionForm();

    this.refreshAllLists();
  },

  /**
   * Buscadores en tiempo real dentro de las listas del CMS
   */
  bindSearchFilters() {
    const unitsSearch = document.querySelector('#cms-search-units-input');
    if (unitsSearch) {
      unitsSearch.addEventListener('input', (e) => {
        this.unitFilterQuery = e.target.value.toLowerCase().trim();
        const db = window.PachecoStore.get();
        this.renderUnitsAdminList(db.unidades);
      });
    }

    const sysSearch = document.querySelector('#cms-search-systems-input');
    if (sysSearch) {
      sysSearch.addEventListener('input', (e) => {
        this.systemFilterQuery = e.target.value.toLowerCase().trim();
        const db = window.PachecoStore.get();
        this.renderSystemsAdminList(db.sistemas);
      });
    }
  },

  /**
   * Apertura y cierre del Drawer Administrativo
   */
  bindDrawerTriggers() {
    const openBtns = document.querySelectorAll('.btn-open-cms');
    const closeBtn = document.querySelector('#btn-close-cms');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    // Tecla ESC para cerrar
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  },

  open() {
    if (this.drawerEl && this.overlayEl) {
      this.drawerEl.classList.add('open');
      this.overlayEl.classList.add('visible');
      document.body.style.overflow = 'hidden';
      this.refreshAllLists();
      this.loadMisionVisionValues();
    }
  },

  close() {
    if (this.drawerEl && this.overlayEl) {
      this.drawerEl.classList.remove('open');
      this.overlayEl.classList.remove('visible');
      document.body.style.overflow = '';
      this.resetForms();
    }
  },

  isOpen() {
    return this.drawerEl && this.drawerEl.classList.contains('open');
  },

  /**
   * Pestañas dentro del CMS
   */
  bindTabNavigation() {
    const tabBtns = document.querySelectorAll('.cms-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (!target) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.cms-tab-content').forEach(view => {
          view.style.display = view.id === target ? 'block' : 'none';
        });

        this.activeTab = target;
      });
    });
  },

  /**
   * Refresca las listas de gestión del CMS
   */
  refreshAllLists() {
    const db = window.PachecoStore.get();
    this.renderUnitsAdminList(db.unidades);
    this.renderSystemsAdminList(db.sistemas);
  },

  // ================= 1. ADMINISTRACIÓN DE UNIDADES DE NEGOCIO =================
  renderUnitsAdminList(unidades = []) {
    const list = document.querySelector('#cms-units-list');
    if (!list) return;

    let items = [...unidades];
    if (this.unitFilterQuery) {
      const q = this.unitFilterQuery;
      items = items.filter(u =>
        u.nombre.toLowerCase().includes(q) ||
        (u.categoria && u.categoria.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      list.innerHTML = '<p class="cms-empty-note" style="text-align: center; padding: 28px; color: var(--text-muted);"><i class="ri-search-eye-line" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i>No se encontraron unidades.</p>';
      return;
    }

    list.innerHTML = items.map(u => `
      <div class="cms-item-card" data-id="${u.id}">
        <div class="cms-item-info">
          <div class="cms-item-title-row">
            <strong>${u.nombre}</strong>
          </div>
          <span class="cms-item-meta">${u.categoria} &bull; <a href="${u.url || '#'}" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary);">${u.url || 'Sin enlace'}</a></span>
        </div>
        <div class="cms-item-actions">
          <button type="button" class="cms-btn-icon edit" onclick="Admin.editUnit('${u.id}')" title="Editar Unidad">
            <i class="ri-edit-line"></i>
          </button>
          <button type="button" class="cms-btn-icon delete" onclick="Admin.deleteUnit('${u.id}', '${u.nombre}')" title="Eliminar">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  /**
   * Manejo interactivo de carga de archivos (Logos e Imágenes) con FileReader y Base64
   */
  bindImageUploaders() {
    // 1. Uploader para Unidades de Negocio
    const unitFileInput = document.querySelector('#unit-input-file');
    const unitLogoVal = document.querySelector('#unit-input-logo-val');
    const unitLogoUrl = document.querySelector('#unit-input-logo-url');
    const unitPreviewImg = document.querySelector('#unit-logo-preview-img');
    const unitRemoveBtn = document.querySelector('#btn-remove-unit-logo');

    if (unitFileInput) {
      unitFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          this.toast('Por favor seleccione un archivo de imagen válido', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          if (unitPreviewImg) unitPreviewImg.src = result;
          if (unitLogoVal) unitLogoVal.value = result;
          if (unitLogoUrl) unitLogoUrl.value = '';
          if (unitRemoveBtn) unitRemoveBtn.style.display = 'inline-flex';
          this.toast('Logotipo cargado exitosamente', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    if (unitLogoUrl) {
      unitLogoUrl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          if (unitPreviewImg) unitPreviewImg.src = val;
          if (unitLogoVal) unitLogoVal.value = val;
          if (unitRemoveBtn) unitRemoveBtn.style.display = 'inline-flex';
        } else if (!unitLogoVal.value) {
          if (unitPreviewImg) unitPreviewImg.src = 'assets/images/Logo.jpeg';
          if (unitRemoveBtn) unitRemoveBtn.style.display = 'none';
        }
      });
    }

    if (unitRemoveBtn) {
      unitRemoveBtn.addEventListener('click', () => {
        if (unitPreviewImg) unitPreviewImg.src = 'assets/images/Logo.jpeg';
        if (unitLogoVal) unitLogoVal.value = '';
        if (unitLogoUrl) unitLogoUrl.value = '';
        if (unitFileInput) unitFileInput.value = '';
        unitRemoveBtn.style.display = 'none';
      });
    }

    // 2. Uploader para Sistemas e Intranet
    const sysFileInput = document.querySelector('#sys-input-file');
    const sysLogoVal = document.querySelector('#sys-input-logo-val');
    const sysLogoUrl = document.querySelector('#sys-input-logo-url');
    const sysIconInput = document.querySelector('#sys-input-icon');
    const sysPreviewImg = document.querySelector('#sys-logo-preview-img');
    const sysPreviewIcon = document.querySelector('#sys-logo-preview-icon');
    const sysRemoveBtn = document.querySelector('#btn-remove-sys-logo');

    if (sysFileInput) {
      sysFileInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
          this.toast('Por favor seleccione una imagen válida', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result;
          if (sysPreviewImg) {
            sysPreviewImg.src = result;
            sysPreviewImg.style.display = 'block';
          }
          if (sysPreviewIcon) sysPreviewIcon.style.display = 'none';
          if (sysLogoVal) sysLogoVal.value = result;
          if (sysLogoUrl) sysLogoUrl.value = '';
          if (sysRemoveBtn) sysRemoveBtn.style.display = 'inline-flex';
          this.toast('Logo del sistema cargado', 'success');
        };
        reader.readAsDataURL(file);
      });
    }

    if (sysLogoUrl) {
      sysLogoUrl.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          if (sysPreviewImg) {
            sysPreviewImg.src = val;
            sysPreviewImg.style.display = 'block';
          }
          if (sysPreviewIcon) sysPreviewIcon.style.display = 'none';
          if (sysLogoVal) sysLogoVal.value = val;
          if (sysRemoveBtn) sysRemoveBtn.style.display = 'inline-flex';
        } else if (!sysLogoVal.value) {
          if (sysPreviewImg) {
            sysPreviewImg.src = '';
            sysPreviewImg.style.display = 'none';
          }
          if (sysPreviewIcon) {
            sysPreviewIcon.style.display = 'block';
            sysPreviewIcon.className = (sysIconInput && sysIconInput.value.trim()) || 'ri-link-m';
          }
          if (sysRemoveBtn) sysRemoveBtn.style.display = 'none';
        }
      });
    }

    if (sysIconInput) {
      sysIconInput.addEventListener('input', (e) => {
        const iconClass = e.target.value.trim();
        if ((!sysLogoVal || !sysLogoVal.value) && (!sysLogoUrl || !sysLogoUrl.value.trim())) {
          if (sysPreviewIcon) sysPreviewIcon.className = iconClass || 'ri-link-m';
        }
      });
    }

    if (sysRemoveBtn) {
      sysRemoveBtn.addEventListener('click', () => {
        if (sysPreviewImg) {
          sysPreviewImg.src = '';
          sysPreviewImg.style.display = 'none';
        }
        if (sysPreviewIcon) {
          sysPreviewIcon.style.display = 'block';
          sysPreviewIcon.className = (sysIconInput && sysIconInput.value.trim()) || 'ri-link-m';
        }
        if (sysLogoVal) sysLogoVal.value = '';
        if (sysLogoUrl) sysLogoUrl.value = '';
        if (sysFileInput) sysFileInput.value = '';
        sysRemoveBtn.style.display = 'none';
      });
    }
  },

  bindUnitForm() {
    const form = document.querySelector('#cms-form-unit');
    const cancelBtn = document.querySelector('#btn-cancel-unit-edit');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.querySelector('#unit-input-name').value.trim();
      const categoria = document.querySelector('#unit-input-category').value;
      const descripcion = document.querySelector('#unit-input-desc').value.trim();
      const url = document.querySelector('#unit-input-url').value.trim();
      const logoImg = document.querySelector('#unit-input-logo-val').value ||
                      document.querySelector('#unit-input-logo-url').value.trim() ||
                      'assets/images/Logo.jpeg';

      if (!nombre || !descripcion || !url) {
        this.toast('Por favor complete los campos obligatorios (*)', 'error');
        return;
      }

      const payload = {
        nombre,
        categoria,
        descripcion,
        url: url || '#',
        logo_img: logoImg
      };

      if (this.editingUnitId) {
        window.PachecoStore.updateUnidad(this.editingUnitId, payload);
        this.toast(`Unidad "${nombre}" actualizada`, 'success');
        this.editingUnitId = null;
      } else {
        window.PachecoStore.addUnidad(payload);
        this.toast(`Unidad "${nombre}" agregada exitosamente`, 'success');
      }

      form.reset();
      this.resetUnitImagePreview();
      document.querySelector('#unit-form-legend').textContent = 'Añadir Nueva Unidad de Negocio';
      if (cancelBtn) cancelBtn.style.display = 'none';
      this.refreshAllLists();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        form.reset();
        this.resetUnitImagePreview();
        this.editingUnitId = null;
        document.querySelector('#unit-form-legend').textContent = 'Añadir Nueva Unidad de Negocio';
        cancelBtn.style.display = 'none';
      });
    }
  },

  resetUnitImagePreview() {
    const previewImg = document.querySelector('#unit-logo-preview-img');
    const logoValInput = document.querySelector('#unit-input-logo-val');
    const logoUrlInput = document.querySelector('#unit-input-logo-url');
    const fileInput = document.querySelector('#unit-input-file');
    const removeBtn = document.querySelector('#btn-remove-unit-logo');

    if (previewImg) previewImg.src = 'assets/images/Logo.jpeg';
    if (logoValInput) logoValInput.value = '';
    if (logoUrlInput) logoUrlInput.value = '';
    if (fileInput) fileInput.value = '';
    if (removeBtn) removeBtn.style.display = 'none';
  },

  editUnit(id) {
    const db = window.PachecoStore.get();
    const unit = db.unidades.find(u => u.id === id);
    if (!unit) return;

    this.editingUnitId = id;
    document.querySelector('#unit-input-name').value = unit.nombre || '';
    document.querySelector('#unit-input-category').value = unit.categoria || 'Educacion';
    document.querySelector('#unit-input-desc').value = unit.descripcion || '';
    document.querySelector('#unit-input-url').value = unit.url || '';

    // Cargar logotipo en el preview y en los inputs
    const logoVal = unit.logo_img || 'assets/images/Logo.jpeg';
    const previewImg = document.querySelector('#unit-logo-preview-img');
    const logoValInput = document.querySelector('#unit-input-logo-val');
    const logoUrlInput = document.querySelector('#unit-input-logo-url');
    const removeBtn = document.querySelector('#btn-remove-unit-logo');

    if (previewImg) previewImg.src = logoVal;
    if (logoValInput) logoValInput.value = logoVal;
    if (logoUrlInput) logoUrlInput.value = logoVal.startsWith('data:') ? '' : logoVal;
    if (removeBtn) {
      removeBtn.style.display = (logoVal && logoVal !== 'assets/images/Logo.jpeg') ? 'inline-flex' : 'none';
    }

    document.querySelector('#unit-form-legend').textContent = `Editando: ${unit.nombre}`;
    const cancelBtn = document.querySelector('#btn-cancel-unit-edit');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    // Scroll suave hacia el formulario
    document.querySelector('#cms-form-unit').scrollIntoView({ behavior: 'smooth' });
  },

  deleteUnit(id, nombre) {
    if (confirm(`¿Confirma eliminar la unidad "${nombre}" del holding corporativo?`)) {
      window.PachecoStore.deleteUnidad(id);
      this.toast(`Unidad eliminada: ${nombre}`, 'success');
      this.refreshAllLists();
    }
  },

  // ================= 2. ADMINISTRACIÓN DE ENLACES / SISTEMAS =================
  renderSystemsAdminList(sistemas = []) {
    const list = document.querySelector('#cms-systems-list');
    if (!list) return;

    let items = [...sistemas];
    if (this.systemFilterQuery) {
      const q = this.systemFilterQuery;
      items = items.filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        (s.tipo && s.tipo.toLowerCase().includes(q))
      );
    }

    if (items.length === 0) {
      list.innerHTML = '<p class="cms-empty-note" style="text-align: center; padding: 28px; color: var(--text-muted);"><i class="ri-search-eye-line" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i>No se encontraron sistemas.</p>';
      return;
    }

    list.innerHTML = items.map(s => `
      <div class="cms-item-card" data-id="${s.id}">
        <div class="cms-item-info">
          <div class="cms-item-title-row">
            <span class="cms-type-pill ${(s.tipo || 'interno').toLowerCase()}">${s.tipo}</span>
            <strong>${s.nombre}</strong>
          </div>
          <span class="cms-item-meta"><a href="${s.url}" target="_blank" rel="noopener noreferrer" style="color:var(--color-primary);">${s.url}</a></span>
        </div>
        <div class="cms-item-actions">
          <button type="button" class="cms-btn-icon edit" onclick="Admin.editSystem('${s.id}')" title="Editar Sistema">
            <i class="ri-edit-line"></i>
          </button>
          <button type="button" class="cms-btn-icon delete" onclick="Admin.deleteSystem('${s.id}', '${s.nombre}')" title="Remover">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  bindSystemForm() {
    const form = document.querySelector('#cms-form-system');
    const cancelBtn = document.querySelector('#btn-cancel-sys-edit');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.querySelector('#sys-input-name').value.trim();
      const tipo = document.querySelector('#sys-input-type').value;
      const url = document.querySelector('#sys-input-url').value.trim();
      const descripcion = document.querySelector('#sys-input-desc').value.trim();
      const logoImg = document.querySelector('#sys-input-logo-val').value ||
                      document.querySelector('#sys-input-logo-url').value.trim() ||
                      null;
      const customIcon = document.querySelector('#sys-input-icon').value.trim();

      if (!nombre || !url || !descripcion) {
        this.toast('Por favor complete todos los campos requeridos (*)', 'error');
        return;
      }

      const defaultIcon = tipo === 'M365' ? 'ri-microsoft-fill' : (tipo === 'Externo' ? 'ri-server-line' : 'ri-computer-line');

      const payload = {
        nombre,
        tipo,
        url,
        descripcion,
        icono: customIcon || defaultIcon,
        logo_img: logoImg,
        color: tipo === 'M365' ? '#0078D4' : (tipo === 'Externo' ? '#24282B' : '#009B8E')
      };

      if (this.editingSysId) {
        window.PachecoStore.updateSistema(this.editingSysId, payload);
        this.toast(`Sistema "${nombre}" actualizado`, 'success');
        this.editingSysId = null;
      } else {
        window.PachecoStore.addSistema(payload);
        this.toast(`Sistema "${nombre}" agregado al hub`, 'success');
      }

      form.reset();
      this.resetSystemImagePreview();
      document.querySelector('#sys-form-legend').textContent = 'Añadir Nuevo Acceso Directo';
      if (cancelBtn) cancelBtn.style.display = 'none';
      this.refreshAllLists();
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        form.reset();
        this.resetSystemImagePreview();
        this.editingSysId = null;
        document.querySelector('#sys-form-legend').textContent = 'Añadir Nuevo Acceso Directo';
        cancelBtn.style.display = 'none';
      });
    }
  },

  resetSystemImagePreview() {
    const previewImg = document.querySelector('#sys-logo-preview-img');
    const previewIcon = document.querySelector('#sys-logo-preview-icon');
    const logoValInput = document.querySelector('#sys-input-logo-val');
    const logoUrlInput = document.querySelector('#sys-input-logo-url');
    const iconInput = document.querySelector('#sys-input-icon');
    const fileInput = document.querySelector('#sys-input-file');
    const removeBtn = document.querySelector('#btn-remove-sys-logo');

    if (previewImg) {
      previewImg.src = '';
      previewImg.style.display = 'none';
    }
    if (previewIcon) {
      previewIcon.style.display = 'block';
      previewIcon.className = 'ri-link-m';
    }
    if (logoValInput) logoValInput.value = '';
    if (logoUrlInput) logoUrlInput.value = '';
    if (iconInput) iconInput.value = '';
    if (fileInput) fileInput.value = '';
    if (removeBtn) removeBtn.style.display = 'none';
  },

  editSystem(id) {
    const db = window.PachecoStore.get();
    const sys = db.sistemas.find(s => s.id === id);
    if (!sys) return;

    this.editingSysId = id;
    document.querySelector('#sys-input-name').value = sys.nombre || '';
    document.querySelector('#sys-input-type').value = sys.tipo || 'Interno';
    document.querySelector('#sys-input-url').value = sys.url || '';
    document.querySelector('#sys-input-desc').value = sys.descripcion || '';

    // Cargar logotipo o icono en la vista previa
    const previewImg = document.querySelector('#sys-logo-preview-img');
    const previewIcon = document.querySelector('#sys-logo-preview-icon');
    const logoValInput = document.querySelector('#sys-input-logo-val');
    const logoUrlInput = document.querySelector('#sys-input-logo-url');
    const iconInput = document.querySelector('#sys-input-icon');
    const removeBtn = document.querySelector('#btn-remove-sys-logo');

    if (iconInput) iconInput.value = sys.icono || '';

    if (sys.logo_img) {
      if (previewImg) {
        previewImg.src = sys.logo_img;
        previewImg.style.display = 'block';
      }
      if (previewIcon) previewIcon.style.display = 'none';
      if (logoValInput) logoValInput.value = sys.logo_img;
      if (logoUrlInput) logoUrlInput.value = sys.logo_img.startsWith('data:') ? '' : sys.logo_img;
      if (removeBtn) removeBtn.style.display = 'inline-flex';
    } else {
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      if (previewIcon) {
        previewIcon.style.display = 'block';
        previewIcon.className = sys.icono || 'ri-link-m';
      }
      if (logoValInput) logoValInput.value = '';
      if (logoUrlInput) logoUrlInput.value = '';
      if (removeBtn) removeBtn.style.display = 'none';
    }

    document.querySelector('#sys-form-legend').textContent = `Editando: ${sys.nombre}`;
    const cancelBtn = document.querySelector('#btn-cancel-sys-edit');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    document.querySelector('#cms-form-system').scrollIntoView({ behavior: 'smooth' });
  },

  deleteSystem(id, nombre) {
    if (confirm(`¿Remover el acceso a "${nombre}" del hub de sistemas?`)) {
      window.PachecoStore.deleteSistema(id);
      this.toast(`Sistema removido: ${nombre}`, 'success');
      this.refreshAllLists();
    }
  },

  // ================= 3. EDICIÓN INSTITUCIONAL (MISIÓN / VISIÓN) =================
  loadMisionVisionValues() {
    const db = window.PachecoStore.get();
    const mInput = document.querySelector('#cms-input-mision');
    const vInput = document.querySelector('#cms-input-vision');

    if (mInput && db.empresa.mision) mInput.value = db.empresa.mision;
    if (vInput && db.empresa.vision) vInput.value = db.empresa.vision;
  },

  bindMisionVisionForm() {
    const form = document.querySelector('#cms-form-institutional');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const mision = document.querySelector('#cms-input-mision').value.trim();
      const vision = document.querySelector('#cms-input-vision').value.trim();

      window.PachecoStore.updateMisionVision(mision, vision);
      this.toast('Misión y Visión actualizadas en vivo', 'success');
    });
  },

  resetForms() {
    this.editingUnitId = null;
    this.editingSysId = null;
    document.querySelector('#cms-form-unit')?.reset();
    document.querySelector('#cms-form-system')?.reset();
    this.resetUnitImagePreview();
    this.resetSystemImagePreview();
    const c1 = document.querySelector('#btn-cancel-unit-edit');
    const c2 = document.querySelector('#btn-cancel-sys-edit');
    if (c1) c1.style.display = 'none';
    if (c2) c2.style.display = 'none';
  },

  /**
   * Sistema de Toasts no intrusivo
   */
  toast(message, type = 'success') {
    let container = document.querySelector('.cms-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'cms-toast-container';
      document.body.appendChild(container);
    }

    const item = document.createElement('div');
    item.className = `cms-toast ${type}`;
    item.innerHTML = `
      <i class="${type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(item);

    setTimeout(() => {
      item.classList.add('fade-out');
      setTimeout(() => item.remove(), 250);
    }, 3200);
  }
};

window.Admin = Admin;
