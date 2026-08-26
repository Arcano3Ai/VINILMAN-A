// Forzar inicio siempre en el tope superior (Hero) al cargar en móvil y escritorio
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Asegurar posición inicial en el tope de la pantalla
  window.scrollTo(0, 0);

  // --- CONFIGURACIÓN PRINCIPAL ---
  const CONFIG = {
    WHATSAPP_PHONE: '528123785429', // Teléfono oficial VINILMANÍA (+52 8123785429)
    EMAIL: 'aneltamez@vinilmania.com', // Correo oficial
    DEFAULT_MSG: 'Hola VINILMANÍA 👋 Quiero cotizar un proyecto personalizado. ¿Me podrían dar información?'
  };

  /**
   * Helper para generar URLs de WhatsApp codificadas
   */
  function buildWhatsAppUrl(message) {
    return `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  }

  // Asignar enlaces de WhatsApp por defecto a botones estáticos
  const defaultWhatsAppButtons = document.querySelectorAll('[data-wa-default]');
  defaultWhatsAppButtons.forEach(btn => {
    btn.setAttribute('href', buildWhatsAppUrl(CONFIG.DEFAULT_MSG));
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  // --- 1. HEADER & MENÚ MÓVIL ---
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

  // Sticky Navbar Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Toggle Menú Móvil
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 2. VIDEO SHOWCASE (LOOP VISUAL 100% SILENCIADO) ---
  const mainVinilVideo = document.getElementById('mainVinilVideo');
  if (mainVinilVideo) {
    mainVinilVideo.muted = true;
    mainVinilVideo.play().catch(() => {});
  }

  // --- 3. MOTOR DE AUDIO VINILMANÍA (3 LOOPS CON DESBLOQUEO MÓVIL GARANTIZADO) ---
  const bgMusic = document.getElementById('bgMusic') || new Audio('assets/music/vinilmania_theme.mp3');
  const heroAudioPill = document.getElementById('heroAudioPill');
  const audioPillText = document.getElementById('audioPillText');
  const audioPillIcon = document.getElementById('audioPillIcon');

  let loopCount = 0;
  const MAX_LOOPS = 3;
  let isAudioPlaying = false;

  function updateAudioPillUI(playing) {
    isAudioPlaying = playing;
    if (playing) {
      heroAudioPill?.classList.add('playing');
      if (audioPillText) audioPillText.textContent = `Reproduciendo (${loopCount + 1}/${MAX_LOOPS}) 🎵`;
      if (audioPillIcon) audioPillIcon.textContent = '🔊';
    } else {
      heroAudioPill?.classList.remove('playing');
      if (audioPillText) audioPillText.textContent = 'Música Oficial ▶️';
      if (audioPillIcon) audioPillIcon.textContent = '🎵';
    }
  }

  if (bgMusic) {
    bgMusic.volume = 0.85;
    bgMusic.loop = false;

    // Al terminar cada vuelta, repetir exactamente 3 loops
    bgMusic.addEventListener('ended', () => {
      loopCount++;
      if (loopCount < MAX_LOOPS) {
        bgMusic.currentTime = 0;
        bgMusic.play().then(() => updateAudioPillUI(true)).catch(() => {});
      } else {
        bgMusic.pause();
        updateAudioPillUI(false);
      }
    });

    // Rutina de inicio / desbloqueo directo
    function triggerAudioStart() {
      if (loopCount >= MAX_LOOPS) return;

      // Despertar AudioContext de WebKit/Blink
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const tempCtx = new AudioContextClass();
          if (tempCtx.state === 'suspended') {
            tempCtx.resume();
          }
        }
      } catch (e) {}

      bgMusic.muted = false;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateAudioPillUI(true);
            removeGlobalGestureListeners();
          })
          .catch(() => {
            // El navegador bloqueó antes del primer gesto
            updateAudioPillUI(false);
          });
      }
    }

    // 1. Intentar arranque inmediato al cargar
    triggerAudioStart();

    // 2. Desbloqueo ultra-rápido en el primer toque de pantalla, clic o desplazamiento
    const onUserFirstAction = () => {
      if (!isAudioPlaying && loopCount < MAX_LOOPS) {
        triggerAudioStart();
      }
    };

    const actionEvents = [
      'touchstart',
      'touchend',
      'pointerdown',
      'pointerup',
      'mousedown',
      'click',
      'scroll'
    ];

    function removeGlobalGestureListeners() {
      actionEvents.forEach(evt => {
        window.removeEventListener(evt, onUserFirstAction, true);
        document.removeEventListener(evt, onUserFirstAction, true);
      });
    }

    actionEvents.forEach(evt => {
      window.addEventListener(evt, onUserFirstAction, { capture: true, passive: true });
      document.addEventListener(evt, onUserFirstAction, { capture: true, passive: true });
    });

    // 3. Control directo en la píldora del Hero
    if (heroAudioPill) {
      heroAudioPill.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
          if (loopCount >= MAX_LOOPS) loopCount = 0;
          triggerAudioStart();
        } else {
          bgMusic.pause();
          updateAudioPillUI(false);
        }
      });
    }
  }

  // Asegurar siempre posición en el tope al finalizar carga
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });

  // --- 4. SERVICIOS: BOTONES DE COTIZACIÓN DINÁMICOS ---
  const serviceQuoteBtns = document.querySelectorAll('.service-quote-btn');
  serviceQuoteBtns.forEach(btn => {
    const serviceName = btn.getAttribute('data-service-name') || 'Personalización en Vinil';
    const msg = `Hola VINILMANÍA 👋 Me interesa cotizar el servicio de: *${serviceName}*. ¿Podrían brindarme información?`;
    btn.setAttribute('href', buildWhatsAppUrl(msg));
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  // --- 3. MÓDULO INTERACTIVO "¿QUÉ QUIERES PERSONALIZAR?" ---
  const customizerData = {
    playera: {
      title: 'Playeras & Prendas',
      category: 'Streetwear & Moda',
      desc: 'Personalizamos playeras de algodón premium, sudaderas oversized, gorras y uniformes con vinil textil de alta densidad, efecto holográfico, reflectivo o flock aterciopelado. Resistente a más de 50 lavadas sin perder color ni adherencia.',
      image: 'img/apparel.jpg',
      specs: [
        'Vinil textil termo-adherido HD',
        'Desde 1 pieza hasta pedidos por volumen',
        'Prendas 100% algodón o combinadas',
        'Efectos mate, neón, metálico y holo'
      ]
    },
    termo: {
      title: 'Termos & Vasos Térmicos',
      category: 'Drinkware Premium',
      desc: 'Termos de acero inoxidable de doble pared, vasos estilo tumbler y botellas deportivas personalizados con tu nombre, frase o logotipo con vinil adhesivo permanente de máxima durabilidad y resistencia al agua.',
      image: 'img/tumblers.jpg',
      specs: [
        'Vinil permanente a prueba de agua',
        'Nombres y tipografías en corte fino',
        'Acabados en oro rosa, tornasol y mate',
        'Ideal para regalos y uso diario'
      ]
    },
    taza: {
      title: 'Tazas & Cerámica',
      category: 'Regalos & Oficina',
      desc: 'Tazas de cerámica en acabados mate y brillante. Diseños especiales con siluetas, logos corporativos, nombres individuales o frases motivacionales para tu día a día o eventos.',
      image: 'img/tumblers.jpg',
      specs: [
        'Corte de vinil resistente a lavados',
        'Variedad de colores y contrastes',
        'Modelos clásicos y tazas mágicas',
        'Presentación individual para regalo'
      ]
    },
    regalo: {
      title: 'Regalos Personalizados',
      category: 'Detalles Especiales',
      desc: 'Cajas de regalo personalizadas con caligrafía en vinil metalizado, copas grabadas, portarretratos y detalles únicos para aniversarios, cumpleaños, San Valentín y fechas inolvidables.',
      image: 'img/gifts_events.jpg',
      specs: [
        'Cajas rígidas con nombres en vinil',
        'Kits temáticos listos para entregar',
        'Tipografías elegantes y cursivas',
        '100% hecho a la medida'
      ]
    },
    sticker: {
      title: 'Stickers & Calcomanías',
      category: 'Stickers Die-Cut',
      desc: 'Stickers troquelados a la forma de tu diseño con corte preciso de plotter. Vinil impermeable con laminado brillante, mate o acabado holográfico tornasol para laptops, termos, autos y libretas.',
      image: 'img/stickers.jpg',
      specs: [
        'Corte a registro o troquelado directo',
        'Vinil impermeable y resistente al sol',
        'Acabados holográficos y aperlados',
        'Pliegos o piezas individuales'
      ]
    },
    empaque: {
      title: 'Empaques & Packaging',
      category: 'Branding para Marcas',
      desc: 'Eleva la experiencia unboxing de tu marca con sellos de seguridad en vinil, stickers para cajas de envío, bolsas kraft personalizadas y etiquetas para cerrar papel tissue.',
      image: 'img/stickers.jpg',
      specs: [
        'Stickers de cierre y agradecimiento',
        'Etiquetas circulares, cuadradas o libres',
        'Potencia el valor percibido de tus envíos',
        'Cantidades accesibles para emprendedores'
      ]
    },
    negocio: {
      title: 'Personalización para Negocios',
      category: 'Soluciones Comerciales',
      desc: 'Impulsa la imagen de tu local o marca: uniformes con tu logotipo, termos corporativos, rotulación de horarios, logos en acrílico y material para ferias o expos.',
      image: 'img/signage_b2b.jpg',
      specs: [
        'Atención especial a volumen y empresas',
        'Mantenimiento de línea gráfica oficial',
        'Facturación disponible',
        'Entregas puntuales y coordinadas'
      ]
    },
    evento: {
      title: 'Decoración para Eventos',
      category: 'Fiestas & Celebraciones',
      desc: 'Letreros de bienvenida para bodas, XV años, baby showers, números de mesa en acrílico, decoración de globos burbuja y backdrops temáticos con frases personalizadas.',
      image: 'img/gifts_events.jpg',
      specs: [
        'Letreros en madera o acrílico',
        'Vinil en espejos y caballetes',
        'Diseños temáticos para tu celebración',
        'Coordinación de paleta de colores'
      ]
    },
    letrero: {
      title: 'Letreros & Señalización',
      category: 'Espacios & Espacios Comerciales',
      desc: 'Letreros decorativos en acrílico transparente o mate con vinil de corte de alta precisión, rotulación para puertas de cristal, señalética de interiores y placas para oficinas.',
      image: 'img/signage_b2b.jpg',
      specs: [
        'Acrílicos de alta calidad con chapetones',
        'Vinil esmerilado / frosted para vidrio',
        'Corte milimétrico en plotter profesional',
        'Instalación fácil y acabado prémium'
      ]
    }
  };

  const customizerTabs = document.querySelectorAll('.customizer-tab-btn');
  const customizerImg = document.getElementById('customizerPreviewImg');
  const customizerTitle = document.getElementById('customizerTitle');
  const customizerDesc = document.getElementById('customizerDesc');
  const customizerSpecsList = document.getElementById('customizerSpecsList');
  const customizerCta = document.getElementById('customizerCtaBtn');

  function renderCustomizer(key) {
    const item = customizerData[key];
    if (!item) return;

    if (customizerImg) customizerImg.src = item.image;
    if (customizerTitle) customizerTitle.textContent = item.title;
    if (customizerDesc) customizerDesc.textContent = item.desc;

    if (customizerSpecsList) {
      customizerSpecsList.innerHTML = item.specs.map(spec => `
        <li class="customizer-spec-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          ${spec}
        </li>
      `).join('');
    }

    if (customizerCta) {
      const msg = `Hola VINILMANÍA 👋 Me gustaría cotizar la personalización de: *${item.title}*. ¿Qué opciones tienen disponibles?`;
      customizerCta.setAttribute('href', buildWhatsAppUrl(msg));
      customizerCta.setAttribute('target', '_blank');
      customizerCta.setAttribute('rel', 'noopener noreferrer');
    }
  }

  customizerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      customizerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetKey = tab.getAttribute('data-target');
      renderCustomizer(targetKey);
    });
  });

  // Inicializar primer tab del customizer
  renderCustomizer('playera');

  // --- 4. GALERÍA INSPÍRATE & LIGHTBOX ---
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxCtaBtn = document.getElementById('lightboxCtaBtn');

  // Filtrado de Galería
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Abrir Lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item-title')?.textContent || 'Diseño Personalizado';
      const category = item.querySelector('.gallery-item-category')?.textContent || 'VINILMANÍA';

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = category;

      if (lightboxCtaBtn) {
        const msg = `Hola VINILMANÍA 👋 Vi este diseño en la galería: "*${title}*" (${category}) y me interesa cotizar algo similar.`;
        lightboxCtaBtn.setAttribute('href', buildWhatsAppUrl(msg));
        lightboxCtaBtn.setAttribute('target', '_blank');
        lightboxCtaBtn.setAttribute('rel', 'noopener noreferrer');
      }

      if (lightboxModal) {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Cerrar Lightbox
  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // --- 5. B2B & CTA CORPORATIVO ---
  const b2bCtaBtn = document.getElementById('b2bCtaBtn');
  if (b2bCtaBtn) {
    const b2bMsg = 'Hola VINILMANÍA 👋 Me comunico de parte de un negocio/empresa y deseo cotizar personalización por volumen.';
    b2bCtaBtn.setAttribute('href', buildWhatsAppUrl(b2bMsg));
    b2bCtaBtn.setAttribute('target', '_blank');
    b2bCtaBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // --- 6. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar todos los demás items para mantener orden limpio
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // --- 7. FORMULARIO DE COTIZACIÓN VALIDADO CON SALIDA A WHATSAPP ---
  const quoteForm = document.getElementById('quoteForm');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const successModal = document.getElementById('successModal');
  const successWhatsAppBtn = document.getElementById('successWhatsAppBtn');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('formName');
      const phoneInput = document.getElementById('formPhone');
      const productInput = document.getElementById('formProduct');
      const quantityInput = document.getElementById('formQuantity');
      const designInput = document.getElementById('formDesign');
      const messageInput = document.getElementById('formMessage');
      const promoCheckbox = document.getElementById('formPromo');

      // Validaciones básicas
      const name = nameInput?.value.trim();
      const phone = phoneInput?.value.trim();
      const product = productInput?.value;
      const quantity = quantityInput?.value.trim();
      const design = designInput?.value;
      const message = messageInput?.value.trim();

      if (!name || !phone || !product || !quantity || !design) {
        showFormMessage('Por favor completa todos los campos obligatorios (*).', 'error');
        return;
      }

      // Validar que el teléfono tenga al menos 10 dígitos
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        showFormMessage('Ingresa un número de WhatsApp válido (mínimo 10 dígitos).', 'error');
        return;
      }

      // Construir mensaje estructurado para WhatsApp
      const waQuoteMessage = `*¡NUEVA SOLICITUD DE COTIZACIÓN - VINILMANÍA!* 🚀\n\n` +
        `👤 *Nombre:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🎨 *Producto:* ${product}\n` +
        `🔢 *Cantidad:* ${quantity}\n` +
        `📐 *¿Cuenta con diseño?:* ${design}\n` +
        `📝 *Detalles de la idea:* ${message || 'Cotización inicial'}\n` +
        `🎁 *Promociones:* ${promoCheckbox?.checked ? 'Sí desea recibir promociones' : 'No marcado'}\n\n` +
        `_Enviado desde la Landing Page oficial de VINILMANÍA._`;

      const whatsappTargetUrl = buildWhatsAppUrl(waQuoteMessage);

      // Configurar botón del modal de éxito
      if (successWhatsAppBtn) {
        successWhatsAppBtn.setAttribute('href', whatsappTargetUrl);
        successWhatsAppBtn.setAttribute('target', '_blank');
        successWhatsAppBtn.setAttribute('rel', 'noopener noreferrer');
      }

      // Mostrar modal de éxito
      if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Resetear formulario
      quoteForm.reset();
      hideFormMessage();

      // Abrir WhatsApp en nueva pestaña automáticamente para conveniencia del usuario
      setTimeout(() => {
        window.open(whatsappTargetUrl, '_blank');
      }, 700);
    });
  }

  function showFormMessage(msg, type) {
    if (formStatusMsg) {
      formStatusMsg.textContent = msg;
      formStatusMsg.className = `form-status-msg ${type}`;
    }
  }

  function hideFormMessage() {
    if (formStatusMsg) {
      formStatusMsg.style.display = 'none';
      formStatusMsg.textContent = '';
    }
  }

  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // --- 8. MICROINTERACCIONES & SCROLL REVEAL SUAVE ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0px)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.service-card, .trust-card, .process-card, .gallery-item, .b2b-check-item, .pricing-banner, .quote-form-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

});
