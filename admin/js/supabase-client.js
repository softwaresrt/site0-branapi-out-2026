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
    }
  };
})();
