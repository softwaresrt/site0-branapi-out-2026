/**
 * BRANAPI ADMIN — SUPABASE CLIENT & DATA REPOSITORY
 * Connects directly to external Supabase PostgreSQL via REST/RLS,
 * with secure local synchronization fallback.
 */

const BranapiSupabase = (function () {
  'use strict';

  const CONFIG_KEY = 'branapi_supabase_config';
  const POSTS_STORAGE = 'branapi_posts';
  const CATEGORIES_STORAGE = 'branapi_categories';
  const AUTHORS_STORAGE = 'branapi_authors';
  const SOLUTIONS_STORAGE = 'branapi_ready_solutions';

  const INITIAL_SOLUTIONS = [
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
      gallery_images: [],
      cta_text: 'Solicitar Demonstração ↗',
      cta_url: 'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20de%20Infoprodutos%20Pronta%20da%20Branapi',
      price_tag: 'Implantação Imediata',
      status: 'published',
      display_order: 1,
      created_at: '2026-10-28T09:00:00Z',
      published_at: '2026-10-28T09:00:00Z'
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
      gallery_images: [],
      cta_text: 'Solicitar Demonstração ↗',
      cta_url: 'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20de%20Apostas%20Pronta%20da%20Branapi',
      price_tag: 'Homologação Completa',
      status: 'published',
      display_order: 2,
      created_at: '2026-10-28T09:00:00Z',
      published_at: '2026-10-28T09:00:00Z'
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
      gallery_images: [],
      cta_text: 'Solicitar Demonstração ↗',
      cta_url: 'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20Gateway%20de%20Pagamentos%20Pronto%20da%20Branapi',
      price_tag: 'Código Proprietário',
      status: 'published',
      display_order: 3,
      created_at: '2026-10-28T09:00:00Z',
      published_at: '2026-10-28T09:00:00Z'
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
      gallery_images: [],
      cta_text: 'Solicitar Demonstração ↗',
      cta_url: 'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20BaaS%20Pronta%20da%20Branapi',
      price_tag: 'Full Compliance',
      status: 'published',
      display_order: 4,
      created_at: '2026-10-28T09:00:00Z',
      published_at: '2026-10-28T09:00:00Z'
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
      gallery_images: [],
      cta_text: 'Solicitar Demonstração ↗',
      cta_url: 'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20CRM%20Inteligente%20Pronto%20da%20Branapi',
      price_tag: 'Pronto para Uso',
      status: 'published',
      display_order: 5,
      created_at: '2026-10-28T09:00:00Z',
      published_at: '2026-10-28T09:00:00Z'
    }
  ];

  // Initial seed articles (The 5 official pillar articles)
  const INITIAL_POSTS = [
    {
      id: 'b1111111-1111-1111-1111-111111111111',
      slug: 'software-sob-medida-ou-sistema-pronto-como-decidir',
      title: 'Software sob medida ou sistema pronto: como decidir',
      subtitle: 'O dilema entre a velocidade aparente de um SaaS de prateleira e a autonomia de longo prazo de um ativo proprietário.',
      category_id: 'c1111111-1111-1111-1111-111111111111',
      category_name: 'Sistemas Sob Medida',
      author_name: 'Equipe de Arquitetura Branapi',
      excerpt: 'Compare custos, TCO em 3 anos, autonomia e riscos entre software sob medida e sistemas prontos de prateleira para saber qual a melhor escolha empresarial.',
      primary_keyword: 'software sob medida ou sistema pronto',
      search_intent: 'comparativa',
      meta_title: 'Software Sob Medida ou Sistema Pronto? Como Decidir',
      meta_description: 'Compare custos, TCO em 3 anos, autonomia e riscos entre software sob medida e sistemas prontos de prateleira para saber qual a melhor escolha empresarial.',
      reading_time_minutes: 7,
      status: 'published',
      published_at: '2026-10-28T09:00:00Z',
      views_count: 1240
    },
    {
      id: 'b2222222-2222-2222-2222-222222222222',
      slug: 'quanto-custa-desenvolver-software-no-brasil',
      title: 'Quanto custa desenvolver um software no Brasil em 2026',
      subtitle: 'Por que as propostas no mercado oscilam entre R$ 15 mil e R$ 300 mil? Descubra os 4 componentes reais que determinam o orçamento.',
      category_id: 'c2222222-2222-2222-2222-222222222222',
      category_name: 'Custos & Decisão',
      author_name: 'Equipe de Engenharia Branapi',
      excerpt: 'Entenda a composição real de custos para desenvolvimento de software no Brasil em 2026: escopo, regras de negócio, infraestrutura, prazos e faixas reais.',
      primary_keyword: 'preço para desenvolver software no brasil',
      search_intent: 'preco',
      meta_title: 'Quanto Custa Desenvolver Software no Brasil em 2026',
      meta_description: 'Entenda a composição real de custos para desenvolvimento de software no Brasil em 2026: escopo, regras de negócio, infraestrutura, prazos e faixas reais.',
      reading_time_minutes: 8,
      status: 'published',
      published_at: '2026-10-28T09:00:00Z',
      views_count: 2180
    },
    {
      id: 'b3333333-3333-3333-3333-333333333333',
      slug: 'quanto-custa-criar-um-aplicativo',
      title: 'Quanto custa criar um aplicativo para iOS e Android em 2026',
      subtitle: 'Custos fixos de publicação, a economia real de frameworks como React Native e os módulos que mais encarecem o desenvolvimento mobile.',
      category_id: 'c3333333-3333-3333-3333-333333333333',
      category_name: 'Apps & Mobile',
      author_name: 'Equipe Mobile Branapi',
      excerpt: 'Guia completo com custos reais de publicação nas lojas, arquitetura nativa versus híbrida, integrações complexas e faixas de investimento para criar seu app.',
      primary_keyword: 'custo para criar aplicativo ios e android',
      search_intent: 'preco',
      meta_title: 'Quanto Custa Criar um Aplicativo iOS e Android em 2026',
      meta_description: 'Guia completo com custos reais de publicação nas lojas, arquitetura nativa versus híbrida, integrações complexas e faixas de investimento para criar seu app.',
      reading_time_minutes: 6,
      status: 'published',
      published_at: '2026-10-28T09:00:00Z',
      views_count: 1890
    },
    {
      id: 'b4444444-4444-4444-4444-444444444444',
      slug: 'quando-empresa-precisa-abandonar-planilhas',
      title: 'Quando uma empresa precisa abandonar planilhas e migrar para um sistema sob medida',
      subtitle: 'Planilhas funcionam perfeitamente para começar, mas tornam-se um risco operacional oculto quando o negócio escala.',
      category_id: 'c1111111-1111-1111-1111-111111111111',
      category_name: 'Sistemas Sob Medida',
      author_name: 'Consultoria de Engenharia Branapi',
      excerpt: 'Descubra os 5 sintomas críticos que mostram quando sua empresa estourou o limite das planilhas e precisa migrar com segurança para um sistema sob medida.',
      primary_keyword: 'quando abandonar planilhas por um sistema',
      search_intent: 'comercial',
      meta_title: 'Quando a Empresa Precisa Abandonar Planilhas? Guia',
      meta_description: 'Descubra os 5 sintomas críticos que mostram quando sua empresa estourou o limite das planilhas e precisa migrar com segurança para um sistema sob medida.',
      reading_time_minutes: 6,
      status: 'published',
      published_at: '2026-10-28T09:00:00Z',
      views_count: 940
    },
    {
      id: 'b5555555-5555-5555-5555-555555555555',
      slug: 'arquitetura-de-software-para-startups-e-empresas',
      title: 'Arquitetura de software para startups e sistemas empresariais: guia prático',
      subtitle: 'Como desenhar plataformas preparadas para milhões de acessos sem cair na armadilha da complexidade prematura.',
      category_id: 'c4444444-4444-4444-4444-444444444444',
      category_name: 'Arquitetura & Engenharia',
      author_name: 'Principal Software Engineer Branapi',
      excerpt: 'Guia prático de arquitetura de software: microsserviços vs monólito modular, modelagem de banco de dados, segurança OWASP e escalabilidade sem desperdício.',
      primary_keyword: 'arquitetura de software para empresas',
      search_intent: 'informacional',
      meta_title: 'Arquitetura de Software para Startups e Empresas',
      meta_description: 'Guia prático de arquitetura de software: microsserviços vs monólito modular, modelagem de banco de dados, segurança OWASP e escalabilidade sem desperdício.',
      reading_time_minutes: 10,
      status: 'published',
      published_at: '2026-10-28T09:00:00Z',
      views_count: 3120
    }
  ];

  function ensureInitialData() {
    if (!localStorage.getItem(POSTS_STORAGE)) {
      localStorage.setItem(POSTS_STORAGE, JSON.stringify(INITIAL_POSTS));
    }
    if (!localStorage.getItem(CATEGORIES_STORAGE)) {
      localStorage.setItem(CATEGORIES_STORAGE, JSON.stringify([
        { id: 'c1111111-1111-1111-1111-111111111111', name: 'Sistemas Sob Medida', slug: 'sob-medida', color: '#C6FF3D' },
        { id: 'c2222222-2222-2222-2222-222222222222', name: 'Custos & Decisão', slug: 'custos', color: '#FFFFFF' },
        { id: 'c3333333-3333-3333-3333-333333333333', name: 'Apps & Mobile', slug: 'apps', color: '#C6FF3D' },
        { id: 'c4444444-4444-4444-4444-444444444444', name: 'Arquitetura & Engenharia', slug: 'arquitetura', color: '#FFFFFF' }
      ]));
    }
    if (!localStorage.getItem(AUTHORS_STORAGE)) {
      localStorage.setItem(AUTHORS_STORAGE, JSON.stringify([
        { id: 'a1111111-1111-1111-1111-111111111111', name: 'Equipe de Arquitetura Branapi', role: 'Principal Software Engineer' },
        { id: 'a2222222-2222-2222-2222-222222222222', name: 'Equipe Mobile Branapi', role: 'Senior Mobile Engineer' },
        { id: 'a3333333-3333-3333-3333-333333333333', name: 'Consultoria de Engenharia Branapi', role: 'Head of Enterprise Solutions' }
      ]));
    }
    if (!localStorage.getItem(SOLUTIONS_STORAGE)) {
      localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify(INITIAL_SOLUTIONS));
    }
  }

  ensureInitialData();

  const DEFAULT_CONFIG = {
    url: 'https://pvpksepdbvkvzwsfqhbu.supabase.co',
    anonKey: 'sb_publishable_O7mBemDDfQzE3aL2_E3DsA_Saj6RPDB'
  };

  function getRequestHeaders(extra = {}) {
    const config = BranapiSupabase.getConfig();
    let authToken = config.anonKey;
    try {
      if (typeof BranapiAuth !== 'undefined' && BranapiAuth.getCurrentSession) {
        const session = BranapiAuth.getCurrentSession();
        if (session && session.token) {
          authToken = session.token;
        }
      }
    } catch (e) {}

    return {
      'apikey': config.anonKey,
      'Authorization': `Bearer ${authToken}`,
      ...extra
    };
  }

  return {
    getConfig() {
      try {
        const raw = localStorage.getItem(CONFIG_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.url) return parsed;
        }
        if (window.BRANAPI_CONFIG && window.BRANAPI_CONFIG.supabase) {
          return window.BRANAPI_CONFIG.supabase;
        }
        return DEFAULT_CONFIG;
      } catch {
        return DEFAULT_CONFIG;
      }
    },

    saveConfig(url, anonKey) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: (url || '').trim(), anonKey: (anonKey || '').trim() }));
    },

    async testConnection() {
      const config = this.getConfig();
      if (!config.url || !config.anonKey) {
        return { connected: false, message: 'URL ou Chave do Supabase não configuradas (modo local ativo).' };
      }
      try {
        const res = await fetch(`${config.url}/rest/v1/blog_posts?select=id&limit=1`, {
          headers: getRequestHeaders()
        });
        if (res.ok) {
          return { connected: true, message: 'Conexão com o Supabase estabelecida com sucesso via HTTPS!' };
        } else {
          return { connected: false, message: `Erro HTTP ${res.status}: verifique as chaves e a tabela blog_posts.` };
        }
      } catch (err) {
        return { connected: false, message: `Falha na conexão: ${err.message}` };
      }
    },

    async getPosts() {
      const config = this.getConfig();
      if (config.url && config.anonKey) {
        try {
          const res = await fetch(`${config.url}/rest/v1/blog_posts?select=*&order=created_at.desc`, {
            headers: getRequestHeaders()
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              localStorage.setItem(POSTS_STORAGE, JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {
          console.warn('Supabase fetch fallback to local store:', err);
        }
      }
      return JSON.parse(localStorage.getItem(POSTS_STORAGE) || '[]');
    },

    async savePost(postData) {
      const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE) || '[]');
      const index = posts.findIndex(p => p.id === postData.id || p.slug === postData.slug);

      if (index >= 0) {
        posts[index] = { ...posts[index], ...postData, updated_at: new Date().toISOString() };
      } else {
        postData.id = postData.id || crypto.randomUUID();
        postData.created_at = new Date().toISOString();
        postData.updated_at = postData.created_at;
        posts.unshift(postData);
      }

      localStorage.setItem(POSTS_STORAGE, JSON.stringify(posts));

      // Attempt remote Supabase save if configured
      const config = this.getConfig();
      if (config.url && config.anonKey) {
        const VALID_COLUMNS = [
          'id', 'slug', 'title', 'subtitle', 'excerpt', 'content', 'content_html',
          'cover_image_url', 'cover_image_alt', 'category_id', 'author_id', 'status',
          'reading_time_minutes', 'primary_keyword', 'secondary_keywords', 'search_intent',
          'meta_title', 'meta_description', 'canonical_url', 'og_image_url', 'no_index',
          'commercial_cta_title', 'commercial_cta_description', 'commercial_cta_button_text',
          'commercial_cta_target_url', 'views_count', 'published_at', 'scheduled_for',
          'created_at', 'updated_at'
        ];

        const remotePayload = {};
        VALID_COLUMNS.forEach(col => {
          if (postData[col] !== undefined) {
            remotePayload[col] = postData[col];
          }
        });

        try {
          const res = await fetch(`${config.url}/rest/v1/blog_posts?on_conflict=slug`, {
            method: 'POST',
            headers: getRequestHeaders({
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            }),
            body: JSON.stringify(remotePayload)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.warn('Supabase remote save response:', res.status, err);
          }
        } catch (e) {
          console.warn('Remote sync pending:', e);
        }
      }

      return postData;
    },

    async deletePost(id) {
      let posts = JSON.parse(localStorage.getItem(POSTS_STORAGE) || '[]');
      posts = posts.filter(p => p.id !== id);
      localStorage.setItem(POSTS_STORAGE, JSON.stringify(posts));

      const config = this.getConfig();
      if (config.url && config.anonKey) {
        try {
          await fetch(`${config.url}/rest/v1/blog_posts?id=eq.${id}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
          });
        } catch (e) {}
      }
      return true;
    },

    getCategories() {
      return JSON.parse(localStorage.getItem(CATEGORIES_STORAGE) || '[]');
    },

    getAuthors() {
      return JSON.parse(localStorage.getItem(AUTHORS_STORAGE) || '[]');
    },

    exportAsSQL(post) {
      const escape = (val) => val ? `'${String(val).replace(/'/g, "''")}'` : 'NULL';
      return `INSERT INTO public.blog_posts (
  id, slug, title, subtitle, excerpt, content, primary_keyword, 
  meta_title, meta_description, canonical_url, status, reading_time_minutes, published_at
) VALUES (
  ${escape(post.id)},
  ${escape(post.slug)},
  ${escape(post.title)},
  ${escape(post.subtitle)},
  ${escape(post.excerpt)},
  ${escape(post.content || post.excerpt)},
  ${escape(post.primary_keyword)},
  ${escape(post.meta_title)},
  ${escape(post.meta_description)},
  ${escape(post.canonical_url || `https://branapi.com/blog/${post.slug}/`)},
  ${escape(post.status || 'published')},
  ${post.reading_time_minutes || 5},
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();`;
    },

    // =========================================================================
    // READY SOLUTIONS (SOLUÇÕES PRONTAS) REPOSITORY & SUPABASE CLIENT
    // =========================================================================
    async getSolutions() {
      const config = this.getConfig();
      if (config.url && config.anonKey) {
        try {
          const res = await fetch(`${config.url}/rest/v1/ready_solutions?select=*&order=display_order.asc,created_at.desc`, {
            headers: getRequestHeaders()
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {
          console.warn('Supabase ready_solutions fetch fallback to local store:', err);
        }
      }
      return JSON.parse(localStorage.getItem(SOLUTIONS_STORAGE) || '[]');
    },

    async saveSolution(solutionData) {
      let solutions = JSON.parse(localStorage.getItem(SOLUTIONS_STORAGE) || '[]');
      const index = solutions.findIndex(s => s.id === solutionData.id || s.slug === solutionData.slug);

      if (index >= 0) {
        solutions[index] = { ...solutions[index], ...solutionData, updated_at: new Date().toISOString() };
      } else {
        solutionData.id = solutionData.id || crypto.randomUUID();
        solutionData.created_at = new Date().toISOString();
        solutionData.updated_at = solutionData.created_at;
        solutions.push(solutionData);
      }

      localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify(solutions));

      // Attempt remote Supabase save if configured
      const config = this.getConfig();
      if (config.url && config.anonKey) {
        const VALID_SOLUTION_COLUMNS = [
          'id', 'slug', 'title', 'subtitle', 'category_name', 'badge', 'description',
          'features', 'cover_image_url', 'cover_image_alt', 'gallery_images', 'cta_text',
          'cta_url', 'price_tag', 'status', 'display_order', 'views_count',
          'published_at', 'created_at', 'updated_at'
        ];

        const remotePayload = {};
        VALID_SOLUTION_COLUMNS.forEach(col => {
          if (solutionData[col] !== undefined) {
            remotePayload[col] = solutionData[col];
          }
        });

        try {
          const res = await fetch(`${config.url}/rest/v1/ready_solutions?on_conflict=slug`, {
            method: 'POST',
            headers: getRequestHeaders({
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            }),
            body: JSON.stringify(remotePayload)
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.warn('Supabase remote ready_solutions save response:', res.status, err);
          }
        } catch (e) {
          console.warn('Remote ready_solutions sync pending:', e);
        }
      }

      return solutionData;
    },

    async deleteSolution(id) {
      let solutions = JSON.parse(localStorage.getItem(SOLUTIONS_STORAGE) || '[]');
      solutions = solutions.filter(s => s.id !== id);
      localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify(solutions));

      const config = this.getConfig();
      if (config.url && config.anonKey) {
        try {
          await fetch(`${config.url}/rest/v1/ready_solutions?id=eq.${id}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
          });
        } catch (e) {}
      }
      return true;
    },

    exportSolutionAsSQL(solution) {
      const escape = (val) => val ? `'${String(val).replace(/'/g, "''")}'` : 'NULL';
      const formatArray = (arr) => {
        if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'";
        const escapedItems = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`);
        return `'{\n    ${escapedItems.join(',\n    ')}\n  }'`;
      };

      return `INSERT INTO public.ready_solutions (
  id, slug, title, subtitle, category_name, badge, description, features,
  cover_image_url, cover_image_alt, cta_text, cta_url, price_tag, status, display_order, published_at
) VALUES (
  ${escape(solution.id)},
  ${escape(solution.slug)},
  ${escape(solution.title)},
  ${escape(solution.subtitle)},
  ${escape(solution.category_name || 'Solução Pronta')},
  ${escape(solution.badge || 'Time-to-Market Imediato')},
  ${escape(solution.description)},
  ${formatArray(solution.features)},
  ${escape(solution.cover_image_url)},
  ${escape(solution.cover_image_alt || solution.title)},
  ${escape(solution.cta_text || 'Solicitar Demonstração ↗')},
  ${escape(solution.cta_url)},
  ${escape(solution.price_tag || 'Implantação Imediata')},
  ${escape(solution.status || 'published')},
  ${solution.display_order || 0},
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  category_name = EXCLUDED.category_name,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  cover_image_url = EXCLUDED.cover_image_url,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  price_tag = EXCLUDED.price_tag,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();`;
    }
  };
})();
