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

  // Load from Supabase REST API or Local Storage fallback
  async function loadSolutions() {
    let solutions = [];

    // Try Supabase first if credentials exist
    if (cfg.supabase && cfg.supabase.url && cfg.supabase.anonKey) {
      try {
        const res = await fetch(`${cfg.supabase.url}/rest/v1/ready_solutions?select=*&status=eq.published&order=display_order.asc,created_at.desc`, {
          headers: {
            'apikey': cfg.supabase.anonKey,
            'Authorization': `Bearer ${cfg.supabase.anonKey}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            solutions = data;
            try {
              localStorage.setItem('branapi_ready_solutions', JSON.stringify(solutions));
            } catch (_) {}
          }
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    // Fallback to localStorage
    if (solutions.length === 0) {
      try {
        const localData = JSON.parse(localStorage.getItem('branapi_ready_solutions') || '[]');
        solutions = localData.filter(s => s.status === 'published');
      } catch (_) {}
    }

    // Default Seed Solutions if nothing found
    if (solutions.length === 0) {
      solutions = [
        {
          id: 'd1111111-1111-1111-1111-111111111111',
          slug: 'plataforma-de-infoprodutos-white-label',
          title: 'Plataforma de Infoprodutos White-Label',
          subtitle: 'Sua estrutura própria para comercializar cursos, mentorias e produtos digitais sem taxas abusivas de intermediários.',
          category_name: 'Infoprodutos',
          badge: 'White Label 100% Proprietário',
          description: 'Estrutura completa e homologada para venda de infoprodutos, cursos e comunidades com marca própria. Inclui checkout de alta conversão em 1 etapa, área de membros responsiva com streaming protegido, gestão de afiliados com split automático, recuperação inteligente de vendas via WhatsApp e relatórios financeiros consolidados em tempo real.',
          features: [
            'Checkout transparente de 1 etapa com conversão máxima',
            'Área de membros moderna estilo streaming para alunos',
            'Sistema completo de afiliados com split automático de comissões',
            'Recuperação automática de abandono de carrinho via WhatsApp',
            'Painel administrativo completo com relatórios de vendas e métricas'
          ],
          cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          cover_image_alt: 'Plataforma de Infoprodutos White Label Branapi',
          cta_text: 'Solicitar Demonstração ↗',
          price_tag: 'Implantação Imediata',
          display_order: 1
        },
        {
          id: 'd2222222-2222-2222-2222-222222222222',
          slug: 'plataforma-apostas-esportivas-igaming',
          title: 'Plataforma de Apostas Esportivas e iGaming',
          subtitle: 'Engine de alta performance com integração a provedores mundiais, cassino ao vivo e gateway PIX instantâneo.',
          category_name: 'iGaming',
          badge: 'Alta Concorrência e Escala',
          description: 'Plataforma robusta desenvolvida para suportar milhares de usuários simultâneos com estabilidade absoluta. Conta com integração direta com os maiores provedores de slots e cassino ao vivo do mercado global, feeds esportivos com odds em tempo real, split de comissões para afiliados multinível, liquidação automática via PIX 24/7 e motor antifraude de ponta.',
          features: [
            'Odds e feeds esportivos em tempo real com baixa latência',
            'Integração oficial com os maiores provedores de slots e cassino',
            'Depósito e saque automatizados via PIX com liquidação instantânea',
            'Módulo avançado de afiliados com comissões configuráveis',
            'Segurança antifraude ativa e controle de risco operacional'
          ],
          cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          cover_image_alt: 'Plataforma de Apostas Esportivas e iGaming Branapi',
          cta_text: 'Solicitar Demonstração ↗',
          price_tag: 'Homologação Completa',
          display_order: 2
        },
        {
          id: 'd3333333-3333-3333-3333-333333333333',
          slug: 'gateway-de-pagamentos-proprio-white-label',
          title: 'Gateway de Pagamentos Próprio (Fintech White Label)',
          subtitle: 'Opere seu próprio meio de pagamento, processe PIX e cartão, liquide taxas e crie seu ecossistema financeiro.',
          category_name: 'Fintech',
          badge: 'Sem Intermediários',
          description: 'Infraestrutura completa de subadquirência e processamento de pagamentos para quem deseja rentabilizar taxas de transação ou atender seu ecossistema de clientes. Inclui motor de conciliação bancária, webhooks resilientes com retry automático, antecipação de recebíveis, checkout transparente com SDKs e painel gerencial multitenant.',
          features: [
            'PIX direto com confirmação e liquidação em subsegundos',
            'Processamento de cartão de crédito com tokenização PCI segura',
            'Split nativo de pagamentos para marketplaces e múltiplos recebedores',
            'SDKs e APIs completas para integração rápida em qualquer software',
            'Painel financeiro multitenant com conciliação automatizada'
          ],
          cover_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
          cover_image_alt: 'Gateway de Pagamentos Próprio White Label Branapi',
          cta_text: 'Solicitar Demonstração ↗',
          price_tag: 'Código Proprietário',
          display_order: 3
        },
        {
          id: 'd4444444-4444-4444-4444-444444444444',
          slug: 'banking-as-a-service-plataforma-baas',
          title: 'Infraestrutura de Banking as a Service (BaaS)',
          subtitle: 'Contas digitais PJ e PF, emissão de cartões virtuais e ecossistema bancário completo com a sua marca.',
          category_name: 'Banking',
          badge: 'Ecossistema Bancário Completo',
          description: 'Plataforma completa para empresas que desejam oferecer serviços bancários proprietários aos seus clientes ou rede de parceiros. Emissão de contas correntes digitais com chave PIX, geração de cartões pré-pagos virtuais e físicos, pagamento e liquidação de boletos bancários com leitor de código de barras e compliance regulatório integrado.',
          features: [
            'Contas digitais PJ/PF completas com chave PIX individual',
            'Emissão de cartões de débito virtuais e físicos personalizados',
            'Pagamento e liquidação em lote de boletos bancários',
            'Módulo de compliance, KYC automatizado e onboarding biométrico',
            'Relatórios regulatórios e conciliação contábil em tempo real'
          ],
          cover_image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
          cover_image_alt: 'Plataforma de Banking as a Service BaaS Branapi',
          cta_text: 'Solicitar Demonstração ↗',
          price_tag: 'Full Compliance',
          display_order: 4
        },
        {
          id: 'd5555555-5555-5555-5555-555555555555',
          slug: 'sistema-crm-gestao-comercial-inteligente',
          title: 'CRM e Pipeline Comercial com IA Integrada',
          subtitle: 'Gestão completa de leads, funil de vendas multietapas, automação de WhatsApp e pontuação de oportunidades.',
          category_name: 'SaaS',
          badge: 'Automação Comercial Ativa',
          description: 'Software pronto para estruturar e acelerar a área comercial de empresas e consultorias. Conta com funil Kanban visual personalizável, disparos automáticos via WhatsApp oficial, gravação e transcrição de reuniões comerciais com IA, distribuição balanceada de leads para vendedores e dashboards executivos de conversão.',
          features: [
            'Funil de vendas visual Kanban totalmente personalizável',
            'Automação nativa de comunicação via WhatsApp e e-mail',
            'Distribuição automática de leads (Round-Robin) para corretores/vendedores',
            'Transcrição inteligente de reuniões e geração de propostas com IA',
            'Relatórios de produtividade comercial e previsão de faturamento'
          ],
          cover_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          cover_image_alt: 'Sistema de CRM e Gestão Comercial Branapi',
          cta_text: 'Solicitar Demonstração ↗',
          price_tag: 'Pronto para Uso',
          display_order: 5
        }
      ];
    }

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

