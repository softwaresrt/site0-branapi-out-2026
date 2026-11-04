/**
 * BRANAPI — SOLUÇÕES PRONTAS DYNAMIC CONTROLLER
 * Loads, filters, searches, and displays ready solutions directly from Supabase / Local Repository.
 */

(function () {
  'use strict';

  const cfg = window.BRANAPI_CONFIG || {};

  function getWhatsAppUrl(solutionTitle) {
    const phone = String(cfg.whatsappNumber || '5562981580707').replace(/\D/g, '') || '5562981580707';
    const msg = `Olá, Branapi! Vim pelo site (Soluções Prontas) e gostaria de ver uma demonstração da solução "${solutionTitle}".`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let allSolutions = [];
  let activeCategory = 'all';
  let searchTerm = '';

  const gridEl = document.getElementById('solucoesGrid');
  const filtersEl = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('solutionSearch');
  const detailModal = document.getElementById('solutionDetailModal');
  const modalCloseBtn = document.getElementById('closeSolutionModal');

  function sanitizeCategory(cat) {
    if (!cat) return 'Soluções';
    const clean = cat.replace(/\s*&\s*/g, ' e ').trim();
    if (/infoprodutos/i.test(clean)) return 'Infoprodutos';
    if (/igaming/i.test(clean)) return 'iGaming';
    if (/fintech/i.test(clean)) return 'Fintech';
    if (/banking|baas/i.test(clean)) return 'Banking';
    if (/saas|crm/i.test(clean)) return 'SaaS';
    return clean;
  }

  function cleanAmpersands(text) {
    if (!text) return '';
    return String(text).replace(/\s*&\s*/g, ' e ');
  }

  function formatVideoEmbed(url) {
    if (!url) return '';
    const trimmed = String(url).trim();

    // YouTube
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; border: 1px solid rgba(184, 255, 77, 0.2);"></iframe>`;
    }

    // Vimeo
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
      const vimeoId = vimeoMatch[3] || vimeoMatch[1];
      return `<iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; border: 1px solid rgba(184, 255, 77, 0.2);"></iframe>`;
    }

    // Loom
    const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
    if (loomMatch && loomMatch[1]) {
      return `<iframe src="https://www.loom.com/embed/${loomMatch[1]}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; border: 1px solid rgba(184, 255, 77, 0.2);"></iframe>`;
    }

    // Direct MP4 / WebM
    if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
      return `<video controls playsinline style="width: 100%; max-height: 420px; border-radius: 8px; border: 1px solid rgba(184, 255, 77, 0.2); background: #000;"><source src="${trimmed}" type="video/mp4">Seu navegador não suporta este vídeo.</video>`;
    }

    // Fallback generic iframe
    if (/^https?:\/\//i.test(trimmed)) {
      return `<iframe src="${trimmed}" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 8px; border: 1px solid rgba(184, 255, 77, 0.2);"></iframe>`;
    }

    return '';
  }

  // Load directly from Supabase REST API (strictly respects Admin publications)
  async function loadSolutions() {
    let solutions = [];

    // Purge any legacy localStorage mock data immediately
    try {
      localStorage.removeItem('branapi_ready_solutions');
    } catch (_) {}

    const supabaseConfig = (window.BRANAPI_CONFIG && window.BRANAPI_CONFIG.supabase) || {
      url: 'https://pvpksepdbvkvzwsfqhbu.supabase.co',
      anonKey: 'sb_publishable_O7mBemDDfQzE3aL2_E3DsA_Saj6RPDB'
    };

    // Fetch live from Supabase
    if (supabaseConfig.url && supabaseConfig.anonKey) {
      try {
        const timestamp = Date.now();
        const res = await fetch(`${supabaseConfig.url}/rest/v1/ready_solutions?select=*&status=eq.published&order=display_order.asc,created_at.desc&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'apikey': supabaseConfig.anonKey,
            'Authorization': `Bearer ${supabaseConfig.anonKey}`
          }
        });
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData)) {
            solutions = remoteData;
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err);
      }
    }

    // ZERO mock data. ZERO localStorage fallback. ONLY real admin-published solutions.

    // Clean categories and ampersands
    solutions = solutions.map(sol => ({
      ...sol,
      title: cleanAmpersands(sol.title),
      subtitle: cleanAmpersands(sol.subtitle),
      category_name: sanitizeCategory(sol.category_name),
      badge: cleanAmpersands(sol.badge),
      description: cleanAmpersands(sol.description),
      features: Array.isArray(sol.features) ? sol.features.map(f => cleanAmpersands(f)) : []
    }));

    allSolutions = solutions.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    buildCategoryFilters();
    renderCards();
    checkUrlHash();
  }

  function buildCategoryFilters() {
    if (!filtersEl) return;
    if (allSolutions.length === 0) {
      filtersEl.innerHTML = '';
      return;
    }
    const categories = ['all'];
    allSolutions.forEach(s => {
      const cat = sanitizeCategory(s.category_name);
      if (cat && !categories.includes(cat)) {
        categories.push(cat);
      }
    });

    filtersEl.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-chip ${cat === activeCategory ? 'active' : ''}`;
      btn.textContent = cat === 'all' ? 'Todas' : cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        renderCards();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderCards() {
    if (!gridEl) return;

    if (allSolutions.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #111612; border: 1px dashed rgba(220,245,210,0.15); border-radius: 16px;">
          <h3 style="font-size: 20px; color: var(--white); margin-bottom: 8px;">Nenhuma solução publicada no momento</h3>
          <p style="color: var(--muted); font-size: 14px;">As plataformas cadastradas e publicadas pelo painel administrativo aparecerão aqui em tempo real.</p>
        </div>
      `;
      return;
    }

    const filtered = allSolutions.filter(sol => {
      const matchCat = activeCategory === 'all' || sol.category_name === activeCategory;
      const matchSearch =
        searchTerm === '' ||
        sol.title.toLowerCase().includes(searchTerm) ||
        (sol.subtitle || '').toLowerCase().includes(searchTerm) ||
        (sol.description || '').toLowerCase().includes(searchTerm) ||
        (sol.category_name || '').toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    gridEl.innerHTML = '';

    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #111612; border: 1px dashed rgba(220,245,210,0.15); border-radius: 16px;">
          <h3 style="font-size: 20px; color: var(--white); margin-bottom: 8px;">Nenhuma solução encontrada</h3>
          <p style="color: var(--muted); font-size: 14px;">Tente ajustar os filtros ou termo de busca acima.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(sol => {
      const card = document.createElement('article');
      card.className = 'solution-card';
      card.id = sol.slug;

      const photoUrl = sol.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
      const ctaUrl = sol.cta_url || getWhatsAppUrl(sol.title);

      const checkIconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      const featuresList = (Array.isArray(sol.features) ? sol.features : [])
        .map(feat => `<li><span class="feat-check">${checkIconSvg}</span> <span>${escapeHtml(feat)}</span></li>`)
        .join('');

      card.innerHTML = `
        <div class="solution-visual">
          ${sol.video_url ? `<span class="badge-video-pill" style="position: absolute; top: 12px; left: 12px; background: rgba(5, 10, 5, 0.88); border: 1px solid rgba(184, 255, 77, 0.5); color: #b8ff4d; font-size: 11px; padding: 4px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px; backdrop-filter: blur(6px); font-weight: 600; z-index: 2;"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Vídeo Demo</span>` : ''}
          <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(sol.cover_image_alt || sol.title)}" loading="lazy" />
          <div class="solution-visual-overlay"></div>
          <div class="solution-badges">
            <span class="badge-cat">${escapeHtml(sol.category_name || 'Solução')}</span>
            <span class="badge-time">${escapeHtml(sol.badge || 'Time-to-Market Imediato')}</span>
          </div>
        </div>

        <div class="solution-body">
          <div class="solution-head">
            <span class="solution-tag">${escapeHtml(sol.price_tag || 'Código Proprietário')}</span>
            <h3 class="solution-title">${escapeHtml(sol.title)}</h3>
            ${sol.subtitle ? `<p class="solution-subtitle">${escapeHtml(sol.subtitle)}</p>` : ''}
          </div>

          <p class="solution-desc">${escapeHtml(sol.description)}</p>

          ${featuresList ? `<ul class="solution-features">${featuresList}</ul>` : ''}

          <div class="solution-actions">
            <a href="${escapeHtml(ctaUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-lime btn-small" style="flex: 1; justify-content: center;">
              ${escapeHtml(sol.cta_text || 'Solicitar Demonstração ↗')}
            </a>
            <button type="button" class="btn btn-outline btn-small btn-open-detail" data-slug="${escapeHtml(sol.slug)}">
              Detalhes ↗
            </button>
          </div>
        </div>
      `;

      gridEl.appendChild(card);
    });

    // Bind Detail Modal buttons
    document.querySelectorAll('.btn-open-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        const sol = allSolutions.find(s => s.slug === slug);
        if (sol) openDetailModal(sol);
      });
    });
  }

  function openDetailModal(sol) {
    if (!detailModal) return;

    const modalTitle = document.getElementById('modalSolutionTitle');
    const modalCat = document.getElementById('modalSolutionCategory');
    const modalBadge = document.getElementById('modalSolutionBadge');
    const modalDesc = document.getElementById('modalSolutionDesc');
    const modalImg = document.getElementById('modalSolutionImg');
    const modalGallery = document.getElementById('modalSolutionGallery');
    const modalFeatures = document.getElementById('modalSolutionFeatures');
    const modalCta = document.getElementById('modalSolutionCta');

    if (modalTitle) modalTitle.textContent = sol.title;
    if (modalCat) modalCat.textContent = sol.category_name || 'Solução Pronta';
    if (modalBadge) modalBadge.textContent = sol.badge || 'Time-to-Market Imediato';
    if (modalDesc) modalDesc.textContent = sol.description;
    
    // Vídeo de Demonstração (se houver)
    const videoWrap = document.getElementById('modalSolutionVideoWrap');
    const videoContainer = document.getElementById('modalSolutionVideoContainer');
    if (videoWrap && videoContainer) {
      if (sol.video_url && sol.video_url.trim()) {
        const videoHtml = formatVideoEmbed(sol.video_url);
        if (videoHtml) {
          videoContainer.innerHTML = videoHtml;
          videoWrap.style.display = 'block';
        } else {
          videoContainer.innerHTML = '';
          videoWrap.style.display = 'none';
        }
      } else {
        videoContainer.innerHTML = '';
        videoWrap.style.display = 'none';
      }
    }

    if (modalImg) {
      modalImg.src = sol.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80';
      modalImg.alt = sol.cover_image_alt || sol.title;
    }

    if (modalGallery) {
      modalGallery.innerHTML = '';
      if (Array.isArray(sol.gallery_images) && sol.gallery_images.length > 0) {
        sol.gallery_images.forEach(imgUrl => {
          const img = document.createElement('img');
          img.src = imgUrl;
          img.alt = `Tela adicional da solução ${sol.title}`;
          img.className = 'gallery-thumb';
          img.addEventListener('click', () => {
            if (modalImg) modalImg.src = imgUrl;
          });
          modalGallery.appendChild(img);
        });
        modalGallery.style.display = 'flex';
      } else {
        modalGallery.style.display = 'none';
      }
    }

    if (modalFeatures) {
      modalFeatures.innerHTML = '';
      if (Array.isArray(sol.features) && sol.features.length > 0) {
        const checkIconSvg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        sol.features.forEach(f => {
          const li = document.createElement('li');
          li.innerHTML = `<span class="feat-check">${checkIconSvg}</span> <span>${escapeHtml(f)}</span>`;
          modalFeatures.appendChild(li);
        });
      }
    }

    if (modalCta) {
      modalCta.href = sol.cta_url || getWhatsAppUrl(sol.title);
      modalCta.textContent = sol.cta_text || 'Solicitar Demonstração via WhatsApp ↗';
    }

    detailModal.style.display = 'flex';
    document.body.classList.add('menu-open');
  }

  function closeDetailModal() {
    if (!detailModal) return;
    const videoContainer = document.getElementById('modalSolutionVideoContainer');
    if (videoContainer) videoContainer.innerHTML = ''; // Limpa o iframe/vídeo para parar o áudio imediatamente
    detailModal.style.display = 'none';
    document.body.classList.remove('menu-open');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeDetailModal);
  }

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeDetailModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailModal && detailModal.style.display === 'flex') {
      closeDetailModal();
    }
  });

  // Search input binding
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = (e.target.value || '').trim().toLowerCase();
      renderCards();
    });
  }

  // URL Hash check
  function checkUrlHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = allSolutions.find(s => s.slug === hash);
      if (match) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('highlight-pulse');
            setTimeout(() => el.classList.remove('highlight-pulse'), 3000);
          }
        }, 300);
      }
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', loadSolutions);
})();

