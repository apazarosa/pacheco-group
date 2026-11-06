/**
 * Grupo Pacheco (Corporación Domingo Savio)
 * Módulo de Persistencia y Gestor de Datos (store.js)
 * Clave oficial en LocalStorage: 'GRUPO_PACHECO_DB'
 */

const STORAGE_KEY = 'GRUPO_PACHECO_DB';

// Datos institucionales predeterminados de la Corporación
const INITIAL_CORPORATE_DATA = {
  empresa: {
    nombre: "Grupo Pacheco (Corporación Domingo Savio)",
    sigla: "Grupo Pacheco",
    subtitulo: "Holding Corporativo Multisectorial",
    sede_central: "Santa Cruz de la Sierra, Bolivia",
    fundacion: "1995",
    telefono: "+591 (3) 344-4333",
    telefono_wsp: "+591 78001234",
    email: "contacto@grupopacheco.bo",
    direccion: "Av. Beni y 3er Anillo Externo, Santa Cruz de la Sierra - Bolivia",
    mision: "Generar cambios en las personas para desarrollar emprendedores socialmente responsables capaces de responder a desafíos emergentes.",
    vision: "Ser la red de educación universitaria referente a nivel nacional por su formación académica de excelencia basada en la investigación científica y su compromiso con la Internacionalización.",
    valores: [
      { titulo: "Innovación Continua", desc: "Adaptación permanente y adopción de tecnologías transformadoras para la educación y los servicios." },
      { titulo: "Accesibilidad Social", desc: "Democratización real de servicios de alta calidad al alcance de las familias bolivianas." },
      { titulo: "Calidad Integral", desc: "Rigor profesional, calidez humana y mejora constante en cada punto de contacto." },
      { titulo: "Ética Corporativa", desc: "Transparencia, solvencia moral y gobernanza sólida en todas nuestras operaciones." },
      { titulo: "Compromiso Regional", desc: "Desarrollo territorial inclusivo con presencia activa en departamentos estratégicos del país." }
    ]
  },

  cifras: [
    { valor: "9", label: "Departamentos de Cobertura", desc: "Presencia territorial institucional", icono: "ri-map-pin-range-line" },
    { valor: "+60K", label: "Estudiantes Activos", desc: "En red universitaria y colegios", icono: "ri-graduation-cap-line" },
    { valor: "+300K", label: "Visitantes Anuales", desc: "Play Land Park y Hospitalidad", icono: "ri-empathize-line" },
    { valor: "+3,200", label: "Colaboradores y Docentes", desc: "Talento boliviano calificado", icono: "ri-team-line" }
  ],

  liderazgo: [
    {
        "id": "lid-1",
        "nombre": "Ing. Víctor Pacheco Llerena",
        "cargo": "Fundador y Presidente del Directorio",
        "rol": "Fundador",
        "resena": "Visionario empresarial y educador boliviano. Pionero indiscutible en la democratización de la educación superior, el esparcimiento familiar moderno y la infraestructura en Bolivia. Fundó la Universidad Privada Domingo Savio con la firme convicción de que la formación integral accesible transforma vidas y regiones.",
        "foto": "assets/images/Victor Pacheco.jpg",
        "reconocimiento": "Pionero en Educación & Recreación",
        "icono": "ri-award-line"
    },
    {
        "id": "lid-2",
        "nombre": "Ing. Norma Pacheco Suárez",
        "cargo": "CEO y Vicepresidenta del Directorio",
        "rol": "Dirección Ejecutiva",
        "resena": "Líder ejecutiva de la modernización corporativa, expansión territorial y gobernanza estratégica del holding. Conduce la transformación digital de la red UPDS, la integración de nuevos ecosistemas de negocio y el fortalecimiento de la sostenibilidad social y financiera de Grupo Pacheco.",
        "foto": "assets/images/Norma Pacheco.jpg",
        "reconocimiento": "Estrategia & Transformación Digital",
        "icono": "ri-compass-3-line"
    }
],

  unidades: [
    {
        "id": "u-upds",
        "nombre": "Universidad Privada Domingo Savio (UPDS)",
        "nombre_corto": "UPDS Universidad",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Institución",
        "descripcion": "Red universitaria líder en Bolivia con presencia activa en las 9 capitales departamentales. Modelo formativo por competencias, tecnología de vanguardia y vinculación laboral.",
        "url": "https://www.upds.edu.bo",
        "estado": "Activo",
        "badge": "Institución · 9 Capitales",
        "icono": "ri-building-4-line",
        "color": "#009B8E",
        "logo_img": "assets/images/UPDS.jpg",
        "departamentos": [
            "SC",
            "LP",
            "CB",
            "TJ",
            "CH",
            "PT",
            "OR",
            "BN",
            "PA"
        ],
        "ubicacion_confirmada": "Los 9 departamentos",
        "ciudad_municipio": "Las 9 capitales departamentales",
        "sedes_info": {
            "SC": {
                "sede": "Campus Central Santa Cruz",
                "direccion": "Av. Beni y 3er Anillo Externo",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Facultades de Ingeniería, Empresariales, Sociales y Posgrado"
            },
            "LP": {
                "sede": "Campus Universitario La Paz & El Alto",
                "direccion": "San Jorge, Av. 20 de Octubre / Ceja El Alto",
                "telefono": "+591 (2) 244-8800",
                "detalle": "Pregrado, Escuela de Posgrado y Centros de Litigación"
            },
            "CB": {
                "sede": "Campus Regional Cochabamba",
                "direccion": "Av. Villazón Km 3.5, Zona Quintanilla",
                "telefono": "+591 (4) 425-7710",
                "detalle": "Ingenierías, Ciencias Empresariales y Extensión"
            },
            "TJ": {
                "sede": "Campus Regional Tarija",
                "direccion": "Av. Circunvalación esq. Av. La Paz",
                "telefono": "+591 (4) 664-2190",
                "detalle": "Pregrado, Posgrado y Convenios Agroindustriales"
            },
            "CH": {
                "sede": "Sede Universitaria Sucre",
                "direccion": "Calle España esq. San Alberto N° 210",
                "telefono": "+591 (4) 645-1212",
                "detalle": "Ciencias Jurídicas, Sociales y Especializaciones"
            },
            "PT": {
                "sede": "Sede Académica Potosí",
                "direccion": "Av. Sevilla frente a la Estación Central",
                "telefono": "+591 (2) 622-4545",
                "detalle": "Administración, Sistemas y Gabinetes Digitales"
            },
            "OR": {
                "sede": "Campus Universitario Oruro",
                "direccion": "Calle Pagador entre Bolívar y Sucre",
                "telefono": "+591 (2) 527-3100",
                "detalle": "Comercio Exterior, Auditoría e Ingeniería de Sistemas"
            },
            "BN": {
                "sede": "Campus Regional Trinidad",
                "direccion": "Av. Pedro Ignacio Muiba N° 450",
                "telefono": "+591 (3) 462-8900",
                "detalle": "Formación Profesional y Programas de Titulación"
            },
            "PA": {
                "sede": "Sede Universitaria Cobija",
                "direccion": "Av. 9 de Febrero s/n, Zona Central",
                "telefono": "+591 (3) 842-3344",
                "detalle": "Educación Semipresencial y Centro a Distancia"
            }
        }
    },
    {
        "id": "u-cds",
        "nombre": "Colegio Domingo Savio",
        "nombre_corto": "Colegio Domingo Savio",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Institución",
        "descripcion": "Educación regular integral desde nivel inicial hasta bachillerato en Santa Cruz de la Sierra. Enfoque humanista, formación en valores, robótica y desarrollo integral del talento escolar.",
        "url": "https://cbds.edu.bo",
        "estado": "Activo",
        "badge": "Institución · Santa Cruz",
        "icono": "ri-book-read-line",
        "color": "#24282B",
        "logo_img": "assets/images/CBDS.png",
        "departamentos": [
            "SC"
        ],
        "ubicacion_confirmada": "Santa Cruz",
        "ciudad_municipio": "Santa Cruz de la Sierra",
        "sedes_info": {
            "SC": {
                "sede": "Colegio Domingo Savio - Santa Cruz",
                "direccion": "Av. Beni y 3er Anillo Externo",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Nivel inicial, primario y secundario con laboratorios tecnológicos y campus deportivo"
            }
        }
    },
    {
        "id": "u-cbt",
        "nombre": "Colegio Británico Tarija",
        "nombre_corto": "Colegio Británico Tarija",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Institución con socios",
        "descripcion": "Propuesta educativa escolar bilingüe y de alta calidad pedagógica en Tarija, desarrollada en alianza con socios institucionales y con proyección académica internacional.",
        "url": "https://www.grupopacheco.bo",
        "estado": "Activo",
        "badge": "Institución con socios · Tarija",
        "icono": "ri-global-line",
        "color": "#1E3A8A",
        "logo_img": "assets/images/Colegio Britanico.png",
        "departamentos": [
            "TJ"
        ],
        "ubicacion_confirmada": "Tarija",
        "ciudad_municipio": "Tarija",
        "sedes_info": {
            "TJ": {
                "sede": "Colegio Británico Tarija",
                "direccion": "Zona Central / Las Panosas, Tarija",
                "telefono": "+591 (4) 664-2190",
                "detalle": "Educación bilingüe con enfoque en tecnología, desarrollo del pensamiento crítico y valores"
            }
        }
    },
    {
        "id": "u-itds",
        "nombre": "Instituto Técnico Domingo Savio (ITDS)",
        "nombre_corto": "Instituto Técnico ITDS",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Marca de ITDS S.R.L.",
        "descripcion": "Formación técnica superior y media orientada a la rápida inserción laboral. Carreras prácticas con talleres equipados y convenios empresariales en Santa Cruz de la Sierra y Tarija.",
        "url": "https://itds.edu.bo",
        "estado": "Activo",
        "badge": "Marca de ITDS S.R.L. · SC & TJ",
        "icono": "ri-tools-line",
        "color": "#009B8E",
        "logo_img": "assets/images/ITDS.jpg",
        "departamentos": [
            "SC",
            "TJ"
        ],
        "ubicacion_confirmada": "Santa Cruz y Tarija*",
        "ciudad_municipio": "Santa Cruz de la Sierra y Tarija",
        "sedes_info": {
            "SC": {
                "sede": "ITDS Santa Cruz (ITDS S.R.L.)",
                "direccion": "Av. Beni y 3er Anillo Externo, Santa Cruz",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Talleres tecnológicos, contabilidad, diseño gráfico y redes de computación"
            },
            "TJ": {
                "sede": "ITDS Tarija (ITDS S.R.L.)",
                "direccion": "Av. Circunvalación esquina Av. La Paz, Tarija",
                "telefono": "+591 (4) 664-2190",
                "detalle": "Carreras técnicas con alta vinculación laboral e industrial en el sur del país"
            }
        }
    },
    {
        "id": "u-indosa",
        "nombre": "Instituto Domingo Savio (INDOSA)",
        "nombre_corto": "Instituto INDOSA",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Marca de INDOSA S.R.L.",
        "descripcion": "Unidad técnica operada bajo la personería de INDOSA S.R.L. en Santa Cruz de la Sierra, especializada en programas de capacitación práctica, comercial y oficios de alta demanda.",
        "url": "https://www.grupopacheco.bo",
        "estado": "Activo",
        "badge": "Marca de INDOSA S.R.L. · Santa Cruz",
        "icono": "ri-medal-line",
        "color": "#0D9488",
        "logo_img": "assets/images/INDOSA.png",
        "departamentos": [
            "SC"
        ],
        "ubicacion_confirmada": "Santa Cruz",
        "ciudad_municipio": "Santa Cruz de la Sierra",
        "sedes_info": {
            "SC": {
                "sede": "INDOSA S.R.L. Santa Cruz",
                "direccion": "Santa Cruz de la Sierra, Bolivia",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Programas de capacitación modular y certificación técnica aplicada al ámbito empresarial"
            }
        }
    },
    {
        "id": "u-sfic",
        "nombre": "South Florida International College (SFIC)",
        "nombre_corto": "SFIC Miami (EE. UU.)",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Institución en EE. UU.",
        "descripcion": "Institución de educación superior con campus en Doral (Miami-Dade, Florida), Estados Unidos. Impulsa la internacionalización del holding con dobles titulaciones y programas ejecutivos en el mercado norteamericano.",
        "url": "https://sficollege.com",
        "estado": "Activo",
        "badge": "Institución en EE. UU. · Miami-Dade",
        "icono": "ri-earth-line",
        "color": "#2563EB",
        "logo_img": "assets/images/SFIC.png",
        "departamentos": [
            "SC"
        ],
        "es_internacional": true,
        "ubicacion_confirmada": "Florida, Estados Unidos",
        "ciudad_municipio": "Doral, condado de Miami-Dade",
        "sedes_info": {
            "SC": {
                "sede": "Oficina de Enlace Internacional Bolivia (SFIC)",
                "direccion": "Av. Beni y 3er Anillo Externo (Campus UPDS), Santa Cruz",
                "telefono": "+1 (305) 555-0199 | +591 (3) 344-4333",
                "detalle": "Sede central en Doral, Miami-Dade (Florida, EE. UU.). Coordinación de admisiones, doble grado y convalidación para toda Bolivia"
            }
        }
    },
    {
        "id": "u-eiag",
        "nombre": "Escuela Internacional de Alta Gestión (EIAG)",
        "nombre_corto": "Escuela EIAG (Alta Gestión)",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Unidad de UPDS",
        "descripcion": "Escuela de posgrado y formación ejecutiva de la UPDS. Programas de maestrías (MBA), diplomados especializados y consultoría corporativa con presencia física y virtual en las 9 sedes departamentales.",
        "url": "https://posgrado.upds.edu.bo",
        "estado": "Activo",
        "badge": "Unidad de UPDS · 9 Sedes",
        "icono": "ri-briefcase-line",
        "color": "#4338CA",
        "logo_img": "assets/images/EIAG.jpg",
        "departamentos": [
            "SC",
            "LP",
            "CB",
            "TJ",
            "CH",
            "PT",
            "OR",
            "BN",
            "PA"
        ],
        "ubicacion_confirmada": "Los 9 departamentos",
        "ciudad_municipio": "Oficinas en las 9 sedes de UPDS",
        "sedes_info": {
            "SC": {
                "sede": "EIAG Central Santa Cruz",
                "direccion": "Campus UPDS, Av. Beni y 3er Anillo Externo",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Maestrías ejecutivas, diplomados corporativos y programas in-company"
            },
            "LP": {
                "sede": "EIAG Sede La Paz",
                "direccion": "San Jorge, Av. 20 de Octubre",
                "telefono": "+591 (2) 244-8800",
                "detalle": "Especialidades en gestión pública, derecho corporativo y finanzas"
            },
            "CB": {
                "sede": "EIAG Sede Cochabamba",
                "direccion": "Av. Villazón Km 3.5",
                "telefono": "+591 (4) 425-7710",
                "detalle": "Diplomados en innovación, agronegocios e ingeniería gerencial"
            },
            "TJ": {
                "sede": "EIAG Sede Tarija",
                "direccion": "Av. Circunvalación esquina Av. La Paz",
                "telefono": "+591 (4) 664-2190",
                "detalle": "Posgrados en comercio internacional y energía"
            },
            "CH": {
                "sede": "EIAG Sede Sucre",
                "direccion": "Calle España esq. San Alberto N° 210",
                "telefono": "+591 (4) 645-1212",
                "detalle": "Posgrados en ciencias jurídicas y administración institucional"
            },
            "PT": {
                "sede": "EIAG Sede Potosí",
                "direccion": "Av. Sevilla frente a la Estación Central",
                "telefono": "+591 (2) 622-4545",
                "detalle": "Programas de gestión tributaria, minería y finanzas"
            },
            "OR": {
                "sede": "EIAG Sede Oruro",
                "direccion": "Calle Pagador entre Bolívar y Sucre",
                "telefono": "+591 (2) 527-3100",
                "detalle": "Diplomados en comercio exterior, auditoría y sistemas"
            },
            "BN": {
                "sede": "EIAG Sede Trinidad",
                "direccion": "Av. Pedro Ignacio Muiba N° 450",
                "telefono": "+591 (3) 462-8900",
                "detalle": "Capacitación continua para líderes y funcionarios regionales"
            },
            "PA": {
                "sede": "EIAG Sede Cobija",
                "direccion": "Av. 9 de Febrero s/n, Zona Central",
                "telefono": "+591 (3) 842-3344",
                "detalle": "Programas virtuales y semipresenciales para la Amazonía"
            }
        }
    },
    {
        "id": "u-adi",
        "nombre": "Academia de Idiomas UPDS (ADI)",
        "nombre_corto": "Academia de Idiomas (ADI)",
        "categoria": "Educacion",
        "sector": "Educación",
        "clasificacion": "Unidad de UPDS",
        "descripcion": "Centro especializado de idiomas de la UPDS. Programas comunicativos y certificaciones internacionales en inglés, portugués y lenguas originarias con oficinas y aulas en las 9 sedes de UPDS.",
        "url": "https://idiomas.upds.edu.bo",
        "estado": "Activo",
        "badge": "Unidad de UPDS · 9 Sedes",
        "icono": "ri-translate-2",
        "color": "#059669",
        "logo_img": "assets/images/ADI.png",
        "departamentos": [
            "SC",
            "LP",
            "CB",
            "TJ",
            "CH",
            "PT",
            "OR",
            "BN",
            "PA"
        ],
        "ubicacion_confirmada": "Los 9 departamentos",
        "ciudad_municipio": "Inscripciones disponibles en las 9 sedes",
        "sedes_info": {
            "SC": {
                "sede": "ADI Central Santa Cruz",
                "direccion": "Campus UPDS, Av. Beni y 3er Anillo Externo",
                "telefono": "+591 (3) 344-4333",
                "detalle": "Laboratorios de inmersión lingüística y certificaciones TOEFL / IELTS"
            },
            "LP": {
                "sede": "ADI Sede La Paz & El Alto",
                "direccion": "San Jorge / Ceja El Alto",
                "telefono": "+591 (2) 244-8800",
                "detalle": "Cursos acelerados de inglés y portugués comercial"
            },
            "CB": {
                "sede": "ADI Sede Cochabamba",
                "direccion": "Av. Villazón Km 3.5",
                "telefono": "+591 (4) 425-7710",
                "detalle": "Inglés técnico para ingeniería y negocios"
            },
            "TJ": {
                "sede": "ADI Sede Tarija",
                "direccion": "Av. Circunvalación esquina Av. La Paz",
                "telefono": "+591 (4) 664-2190",
                "detalle": "Programas infantiles, juveniles y universitarios"
            },
            "CH": {
                "sede": "ADI Sede Sucre",
                "direccion": "Calle España esq. San Alberto N° 210",
                "telefono": "+591 (4) 645-1212",
                "detalle": "Cursos modulares presenciales e intensivos"
            },
            "PT": {
                "sede": "ADI Sede Potosí",
                "direccion": "Av. Sevilla frente a la Estación Central",
                "telefono": "+591 (2) 622-4545",
                "detalle": "Niveles A1 a C1 con docentes calificados"
            },
            "OR": {
                "sede": "ADI Sede Oruro",
                "direccion": "Calle Pagador entre Bolívar y Sucre",
                "telefono": "+591 (2) 527-3100",
                "detalle": "Certificaciones de suficiencia en lenguas extranjeras"
            },
            "BN": {
                "sede": "ADI Sede Trinidad",
                "direccion": "Av. Pedro Ignacio Muiba N° 450",
                "telefono": "+591 (3) 462-8900",
                "detalle": "Modalidades semipresenciales y virtuales con tutorías"
            },
            "PA": {
                "sede": "ADI Sede Cobija",
                "direccion": "Av. 9 de Febrero s/n, Zona Central",
                "telefono": "+591 (3) 842-3344",
                "detalle": "Aulas multimedia y plataformas digitales 24/7"
            }
        }
    },
    {
        "id": "u-cardiosalud",
        "nombre": "Clínica CardioSalud – Domingo Savio",
        "nombre_corto": "Clínica CardioSalud",
        "categoria": "Salud",
        "sector": "Salud",
        "clasificacion": "Clínica",
        "descripcion": "Institución de salud de alta especialidad en Santa Cruz de la Sierra. Centro médico cardiológico, diagnóstico avanzado, laboratorio clínico y atención ambulatoria e internación de calidad accesible.",
        "url": "https://cardiosalud.com.bo",
        "estado": "Activo",
        "badge": "Clínica · Santa Cruz",
        "icono": "ri-heart-pulse-line",
        "color": "#EF4444",
        "logo_img": "assets/images/CardioSalud.jpg",
        "departamentos": [
            "SC"
        ],
        "ubicacion_confirmada": "Santa Cruz",
        "ciudad_municipio": "Santa Cruz de la Sierra",
        "sedes_info": {
            "SC": {
                "sede": "Clínica CardioSalud – Domingo Savio",
                "direccion": "Zona Norte / Equipetrol, Santa Cruz de la Sierra",
                "telefono": "+591 (3) 345-8000",
                "detalle": "Cardiología integral, ecocardiografía, pruebas de esfuerzo, laboratorio y policonsultorios"
            }
        }
    },
    {
        "id": "u-playland",
        "nombre": "Playland / Play Land Park",
        "nombre_corto": "Playland Park",
        "categoria": "Entretenimiento",
        "sector": "Entretenimiento",
        "clasificacion": "Marca de entretenimiento",
        "descripcion": "El parque recreacional acuático y mecánico de referencia en Bolivia, situado en Warnes (carretera al norte km 11–12, Santa Cruz). Grandes piscinas con olas, toboganes de adrenalina y diversión familiar.",
        "url": "https://playlandpark.bo",
        "estado": "Activo",
        "badge": "Marca de entretenimiento · Warnes",
        "icono": "ri-riding-line",
        "color": "#F59E0B",
        "logo_img": "assets/images/PLAYLAND.jpg",
        "departamentos": [
            "SC"
        ],
        "ubicacion_confirmada": "Santa Cruz",
        "ciudad_municipio": "Warnes, carretera al norte, km 11–12",
        "sedes_info": {
            "SC": {
                "sede": "Playland / Play Land Park Warnes",
                "direccion": "Warnes, Carretera al Norte Km 11–12, Santa Cruz",
                "telefono": "+591 (3) 385-2000",
                "detalle": "Parque temático acuático y mecánico, piscinas gigantes, áreas de eventos corporativos y restaurantes"
            }
        }
    },
    {
        "id": "u-westgate",
        "nombre": "Westgate",
        "nombre_corto": "Westgate Inmobiliaria",
        "categoria": "Inmobiliario",
        "sector": "Inmobiliario",
        "clasificacion": "Alianza empresarial",
        "descripcion": "Alianza empresarial en el sector de desarrollo inmobiliario, estructuración de proyectos urbanos y gestión de activos habitacionales y comerciales en Santa Cruz de la Sierra.",
        "url": "https://www.grupopacheco.bo",
        "estado": "Activo",
        "badge": "Alianza empresarial · Santa Cruz",
        "icono": "ri-building-line",
        "color": "#6366F1",
        "logo_img": "assets/images/WESTGAT.jpg",
        "departamentos": [
            "SC"
        ],
        "ubicacion_confirmada": "Santa Cruz",
        "ciudad_municipio": "Santa Cruz de la Sierra",
        "sedes_info": {
            "SC": {
                "sede": "Westgate Desarrollos Inmobiliarios",
                "direccion": "Equipetrol Norte, Santa Cruz de la Sierra",
                "telefono": "+591 (3) 345-9900",
                "detalle": "Proyectos habitacionales modernos, inversión patrimonial y desarrollo de infraestructura urbana"
            }
        }
    }
],

  departamentos: [
    {
      id: "SC",
      nombre: "Santa Cruz",
      capital: "Santa Cruz de la Sierra",
      sede_tipo: "Sede Central & Corporativa",
      descripcion: "Epicentro administrativo e institucional de Grupo Pacheco. Alberga la Casa Matriz, Campus Central UPDS, Colegio Británico (CBDS), Play Land Park, Instituto Técnico y Red de Clínicas.",
      direccion: "Av. Beni y 3er Anillo Externo, Edificio Corporativo Pacheco",
      contacto: "+591 (3) 344-4333 | santacruz@grupopacheco.bo"
    },
    {
      id: "LP",
      nombre: "La Paz / El Alto",
      capital: "Nuestra Señora de La Paz",
      sede_tipo: "Sede Regional Andina",
      descripcion: "Campus Universitario UPDS La Paz (San Jorge) y El Alto, Escuela de Posgrado, centros de investigación y extensión técnica.",
      direccion: "Zona San Jorge, Av. 20 de Octubre esq. Campos / El Alto Ceja",
      contacto: "+591 (2) 244-8800 | lapaz@grupopacheco.bo"
    },
    {
      id: "CB",
      nombre: "Cochabamba",
      capital: "Cochabamba",
      sede_tipo: "Campus Universitario Regional",
      descripcion: "Moderno campus UPDS en el corazón de Bolivia con carreras de ingeniería, ciencias empresariales, aulas interactivas y centros de extensión.",
      direccion: "Av. Villazón Km 3.5, Zona Quintanilla / Centro de la ciudad",
      contacto: "+591 (4) 425-7710 | cochabamba@grupopacheco.bo"
    },
    {
      id: "TJ",
      nombre: "Tarija",
      capital: "Tarija",
      sede_tipo: "Campus Universitario Regional",
      descripcion: "Consolidada infraestructura universitaria UPDS en el sur del país, con programas de pregrado, posgrado y convenios estratégicos regionales.",
      direccion: "Av. Circunvalación esquina Av. La Paz, Tarija",
      contacto: "+591 (4) 664-2190 | tarija@grupopacheco.bo"
    },
    {
      id: "CH",
      nombre: "Chuquisaca",
      capital: "Sucre",
      sede_tipo: "Sede Universitaria Regional",
      descripcion: "Presencia en la capital histórica de Bolivia impartiendo formación por competencias, ciencias jurídicas, ciencias sociales y diplomados.",
      direccion: "Calle España esq. San Alberto N° 210, Sucre",
      contacto: "+591 (4) 645-1212 | sucre@grupopacheco.bo"
    },
    {
      id: "PT",
      nombre: "Potosí",
      capital: "Potosí",
      sede_tipo: "Sede Académica Regional",
      descripcion: "Sede académica UPDS orientada al impulso del talento joven en áreas empresariales, ingeniería de sistemas y carreras humanísticas.",
      direccion: "Av. Sevilla frente a la Estación Central, Potosí",
      contacto: "+591 (2) 622-4545 | potosi@grupopacheco.bo"
    },
    {
      id: "OR",
      nombre: "Oruro",
      capital: "Oruro",
      sede_tipo: "Campus Universitario Regional",
      descripcion: "Campus universitario UPDS con enfoque en comercio exterior, logística, administración, contaduría y tecnología.",
      direccion: "Calle Pagador entre Bolívar y Sucre, Oruro",
      contacto: "+591 (2) 527-3100 | oruro@grupopacheco.bo"
    },
    {
      id: "BN",
      nombre: "Beni",
      capital: "Trinidad",
      sede_tipo: "Campus Regional Amazónico",
      descripcion: "Campus universitario y de extensión en Trinidad, fortaleciendo el acceso a la educación superior en el oriente amazónico boliviano.",
      direccion: "Av. Pedro Ignacio Muiba N° 450, Trinidad",
      contacto: "+591 (3) 462-8900 | beni@grupopacheco.bo"
    },
    {
      id: "PA",
      nombre: "Pando",
      capital: "Cobija",
      sede_tipo: "Sede Universitaria & Distancia",
      descripcion: "Punto de enlace académico en el extremo norte del país, garantizando profesionalización universitaria y educación continua a distancia.",
      direccion: "Av. 9 de Febrero s/n, Zona Central, Cobija",
      contacto: "+591 (3) 842-3344 | pando@grupopacheco.bo"
    }
  ],

  sistemas: [
    {
      "id": "sys-sac",
      "nombre": "Sistema SAC (E-Ticket)",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Sistema de Atención al Colaborador y mesa de ayuda institucional para solicitudes, soporte técnico y requerimientos de TI.",
      "url": "https://ticket.upds.edu.bo/account/login",
      "icono": "ri-customer-service-2-line",
      "color": "#1E40AF"
    },
    {
      "id": "sys-galileo",
      "nombre": "GALILEO",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Plataforma educativa y campus virtual institucional para distribución de material de estudio, exámenes y foros colaborativos.",
      "url": "https://galileo.upds.edu.bo/Login",
      "icono": "ri-computer-line",
      "color": "#009B8E"
    },
    {
      "id": "sys-galileo-v2",
      "nombre": "GALILEO V2",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Segunda versión interactiva del campus virtual institucional con entorno optimizado y recursos didácticos modernos.",
      "url": "https://galileov2.upds.edu.bo/Login",
      "icono": "ri-laptop-line",
      "color": "#00D1C1"
    },
    {
      "id": "sys-saads-v2",
      "nombre": "SAADS V2",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Sistema central de gestión académica y administrativa para registro de calificaciones, kardex estudiantil y control escolar.",
      "url": "https://saadsv2.upds.edu.bo/Login",
      "icono": "ri-apps-2-line",
      "color": "#1E293B"
    },
    {
      "id": "sys-bi-rectorado",
      "nombre": "Power BI - Tablero Rectorado",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Reportes analíticos, métricas de gestión e indicadores ejecutivos de Rectorado y sedes regionales.",
      "url": "https://app.powerbi.com/groups/f01eaf67-0c33-49f2-bd0e-62be821bb2f5/reports/0058986b-9c15-4234-93fa-230c8e85be9f/116f81e5ecd51809a0ac?experience=power-bi",
      "icono": "ri-bar-chart-box-line",
      "color": "#F59E0B"
    },
    {
      "id": "sys-bi-corporativo",
      "nombre": "Power BI - Tablero Corporativo",
      "tipo": "Interno",
      "categoria": "Sistemas Internos",
      "descripcion": "Cuadro de mando integral, métricas de rendimiento y analítica estratégica para la dirección del holding.",
      "url": "https://app.powerbi.com/groups/f01eaf67-0c33-49f2-bd0e-62be821bb2f5/reports/24ca4945-bb65-4a58-a3b0-37c23b0c68c8/116f81e5ecd51809a0ac?experience=power-bi",
      "icono": "ri-pie-chart-2-line",
      "color": "#D97706"
    },
    {
      "id": "sys-sap-prod",
      "nombre": "SAP S/4HANA Cloud (Producción)",
      "tipo": "Externo",
      "categoria": "Sistemas Externos",
      "descripcion": "ERP corporativo en la nube para compras, presupuesto, contabilidad centralizada y tesorería corporativa.",
      "url": "https://adee9omkd.accounts.cloud.sap/saml2/idp/sso/adee9omkd.accounts.ondemand.com",
      "icono": "ri-cloud-line",
      "color": "#0284C7"
    },
    {
      "id": "sys-salar",
      "nombre": "SALAR - Software de RRHH",
      "tipo": "Externo",
      "categoria": "Sistemas Externos",
      "descripcion": "Plataforma integral de nóminas, gestión del talento humano y planillas de sueldos de Grupo Pacheco.",
      "url": "https://grupopacheco.salar11.net/ingresar.aspx?ReturnUrl=/",
      "icono": "ri-team-line",
      "color": "#0F172A"
    },
    {
      "id": "sys-m365",
      "nombre": "Office 365",
      "tipo": "M365",
      "categoria": "Office 365 & Documentos",
      "descripcion": "Suite de productividad y aplicaciones cloud Microsoft 365 para toda la corporación.",
      "url": "https://www.office.com",
      "icono": "ri-microsoft-line",
      "color": "#D83B01"
    },
    {
      "id": "sys-outlook",
      "nombre": "Outlook Corporativo",
      "tipo": "M365",
      "categoria": "Office 365 & Documentos",
      "descripcion": "Correo institucional oficial con calendario corporativo integrado y libreta de direcciones.",
      "url": "https://outlook.office.com",
      "icono": "ri-mail-line",
      "color": "#0078D4"
    },
    {
      "id": "sys-teams",
      "nombre": "Microsoft Teams",
      "tipo": "M365",
      "categoria": "Office 365 & Documentos",
      "descripcion": "Comunicaciones empresariales, reuniones virtuales y canales colaborativos de trabajo.",
      "url": "https://teams.microsoft.com",
      "icono": "ri-video-chat-line",
      "color": "#5059C9"
    },
    {
      "id": "sys-onedrive",
      "nombre": "OneDrive",
      "tipo": "M365",
      "categoria": "Office 365 & Documentos",
      "descripcion": "Almacenamiento seguro en la nube para respaldos, intercambio de archivos y sincronización.",
      "url": "https://onedrive.live.com",
      "icono": "ri-cloud-line",
      "color": "#0078D4"
    },
    {
      "id": "sys-sharepoint",
      "nombre": "SharePoint Holding",
      "tipo": "M365",
      "categoria": "Office 365 & Documentos",
      "descripcion": "Portal de intranet corporativa, noticias oficiales y repositorio centralizado de documentación.",
      "url": "https://grupopacheco.sharepoint.com",
      "icono": "ri-folders-line",
      "color": "#038387"
    },
    {
      "id": "sys-tut-saads",
      "nombre": "Video Tutorial: SAADS V2",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Guía audiovisual de procesos operativos, calificaciones y gestión de actas en el Sistema SAADS V2.",
      "url": "https://saadsv2.upds.edu.bo/Login",
      "icono": "ri-video-line",
      "color": "#1E293B"
    },
    {
      "id": "sys-tut-galileo",
      "nombre": "Video Tutorial: GALILEO",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Tutorial instructivo para uso del campus virtual Galileo, foros, tareas y herramientas educativas.",
      "url": "https://galileov2.upds.edu.bo/Login",
      "icono": "ri-video-line",
      "color": "#009B8E"
    },
    {
      "id": "sys-tut-sac",
      "nombre": "Video Tutorial: Sistema SAC (E-Ticket)",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Paso a paso en video para registro, canalización y seguimiento de solicitudes de soporte técnico y servicio al cliente.",
      "url": "https://ticket.upds.edu.bo/account/login",
      "icono": "ri-video-line",
      "color": "#1E40AF"
    },
    {
      "id": "sys-tut-salar",
      "nombre": "Video Tutorial: Sistema SALAR",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Demostración en video de liquidación de planillas, gestión de talento y módulos de recursos humanos en Salar.",
      "url": "https://grupopacheco.salar11.net/ingresar.aspx?ReturnUrl=/",
      "icono": "ri-video-line",
      "color": "#0F172A"
    },
    {
      "id": "sys-tut-sap",
      "nombre": "Video Tutorial: SAP S/4HANA Cloud",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Capacitación en video para gestión financiera, órdenes de compra y control presupuestario en SAP Cloud.",
      "url": "https://adee9omkd.accounts.cloud.sap/saml2/idp/sso/adee9omkd.accounts.ondemand.com",
      "icono": "ri-video-line",
      "color": "#0284C7"
    },
    {
      "id": "sys-tut-powerbi",
      "nombre": "Video Tutorial: Power BI Analytics",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Guía de navegación e interpretación de cuadros de mando y analítica institucional en Power BI.",
      "url": "https://app.powerbi.com/groups/f01eaf67-0c33-49f2-bd0e-62be821bb2f5/reports/24ca4945-bb65-4a58-a3b0-37c23b0c68c8/116f81e5ecd51809a0ac?experience=power-bi",
      "icono": "ri-video-line",
      "color": "#F59E0B"
    },
    {
      "id": "sys-tut-novus",
      "nombre": "Video Tutorial: Sistema NOVUS",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Tutorial instructivo para registro y consulta de trámites académicos y administrativos en Sistema Novus.",
      "url": "https://novus.upds.edu.bo",
      "icono": "ri-video-line",
      "color": "#002B49"
    },
    {
      "id": "sys-tut-odoo",
      "nombre": "Video Tutorial: Sistema ODOO",
      "tipo": "Tutoriales",
      "categoria": "Videos Tutoriales",
      "descripcion": "Capacitación audiovisual para el manejo de compras, almacenes, inventarios y módulos integrados en Odoo ERP.",
      "url": "https://odoo.grupopacheco.bo",
      "icono": "ri-video-line",
      "color": "#714B67"
    }
  ]
};

const Store = {
  /**
   * Inicializa los datos en LocalStorage si no existen o actualiza a versión con plataformas oficiales completas (v4)
   */
  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        INITIAL_CORPORATE_DATA.version = 6;
        this.save(INITIAL_CORPORATE_DATA);
        return INITIAL_CORPORATE_DATA;
      }
      const parsed = JSON.parse(stored);
      // Migración automática a versión 6 (Sistemas y enlaces oficiales del holding)
      if (!parsed.version || parsed.version < 6 || !parsed.sistemas || parsed.sistemas.length < 5) {
        console.log("Actualizando base de datos local a versión 6 (Sistemas y enlaces oficiales del holding)...");
        parsed.sistemas = INITIAL_CORPORATE_DATA.sistemas;
        parsed.empresa.mision = INITIAL_CORPORATE_DATA.empresa.mision;
        parsed.empresa.vision = INITIAL_CORPORATE_DATA.empresa.vision;
        parsed.version = 6;
        this.save(parsed);
        return parsed;
      }
      return parsed;
    } catch (e) {
      console.warn("Fallo al acceder a localStorage. Usando datos iniciales.", e);
      return INITIAL_CORPORATE_DATA;
    }
  },

  get() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error al leer datos:", e);
    }
    return this.init();
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('pacheco:store-changed', { detail: data }));
      return true;
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
      return false;
    }
  },

  reset() {
    const clone = JSON.parse(JSON.stringify(INITIAL_CORPORATE_DATA));
    this.save(clone);
    return clone;
  },

  exportJSON() {
    const data = this.get();
    const str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement("a");
    a.setAttribute("href", str);
    a.setAttribute("download", `grupo-pacheco-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.empresa && parsed.unidades && parsed.sistemas) {
        this.save(parsed);
        return { success: true };
      }
      return { success: false, error: "Estructura JSON no reconocida o incompleta" };
    } catch (e) {
      return { success: false, error: "JSON inválido: " + e.message };
    }
  },

  // CRUD Unidades
  addUnidad(unidad) {
    const db = this.get();
    unidad.id = 'u-' + Date.now();
    if (!unidad.color) unidad.color = '#009B8E';
    if (!unidad.icono) unidad.icono = 'ri-building-line';
    if (!unidad.logo_img) unidad.logo_img = 'assets/images/Logo.jpeg';
    if (!unidad.departamentos) unidad.departamentos = ['SC'];
    db.unidades.unshift(unidad);
    this.save(db);
    return unidad;
  },

  updateUnidad(id, updatedFields) {
    const db = this.get();
    const index = db.unidades.findIndex(u => u.id === id);
    if (index !== -1) {
      db.unidades[index] = { ...db.unidades[index], ...updatedFields };
      this.save(db);
      return db.unidades[index];
    }
    return null;
  },

  deleteUnidad(id) {
    const db = this.get();
    db.unidades = db.unidades.filter(u => u.id !== id);
    this.save(db);
    return true;
  },

  // CRUD Sistemas
  addSistema(sistema) {
    const db = this.get();
    sistema.id = 'sys-' + Date.now();
    if (!sistema.icono) sistema.icono = 'ri-link-m';
    if (!sistema.color) sistema.color = '#009B8E';
    db.sistemas.unshift(sistema);
    this.save(db);
    return sistema;
  },

  updateSistema(id, updatedFields) {
    const db = this.get();
    const index = db.sistemas.findIndex(s => s.id === id);
    if (index !== -1) {
      db.sistemas[index] = { ...db.sistemas[index], ...updatedFields };
      this.save(db);
      return db.sistemas[index];
    }
    return null;
  },

  deleteSistema(id) {
    const db = this.get();
    db.sistemas = db.sistemas.filter(s => s.id !== id);
    this.save(db);
    return true;
  },

  updateMisionVision(mision, vision) {
    const db = this.get();
    if (mision) db.empresa.mision = mision;
    if (vision) db.empresa.vision = vision;
    this.save(db);
    return db.empresa;
  }
};

window.PachecoStore = Store;
