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

  const INITIAL_SOLUTIONS = [];
  const INITIAL_POSTS = [];

  function ensureInitialData() {
    if (!localStorage.getItem(POSTS_STORAGE)) {
      localStorage.setItem(POSTS_STORAGE, JSON.stringify([]));
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
      localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify([]));
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
        // Only use session.token if it's a valid Supabase JWT (3 parts separated by dots)
        if (session && session.token && typeof session.token === 'string' && session.token.split('.').length === 3) {
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
            headers: getRequestHeaders(),
            cache: 'no-store'
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              if (data.length === 0) {
                localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify([]));
                return [];
              }
              // Merge with local storage in case local has video_url or newer offline edits
              const localData = JSON.parse(localStorage.getItem(SOLUTIONS_STORAGE) || '[]');
              const localMap = new Map(localData.map((item) => [item.id, item]));

              const merged = data.map((remoteItem) => {
                const localItem = localMap.get(remoteItem.id);
                if (localItem) {
                  return {
                    ...remoteItem,
                    video_url: localItem.video_url || remoteItem.video_url || '',
                    cover_image_url: localItem.cover_image_url || remoteItem.cover_image_url,
                    gallery_images: (localItem.gallery_images && localItem.gallery_images.length > 0) ? localItem.gallery_images : (remoteItem.gallery_images || [])
                  };
                }
                return remoteItem;
              });

              localStorage.setItem(SOLUTIONS_STORAGE, JSON.stringify(merged));
              return merged;
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
          'features', 'cover_image_url', 'cover_image_alt', 'gallery_images', 'video_url', 'cta_text',
          'cta_url', 'price_tag', 'status', 'display_order', 'views_count',
          'published_at', 'created_at', 'updated_at'
        ];

        const remotePayload = {};
        VALID_SOLUTION_COLUMNS.forEach(col => {
          if (solutionData[col] !== undefined) {
            remotePayload[col] = solutionData[col];
          }
        });

        // Ensure database not-null fields have solid defaults
        if (!remotePayload.category_name) remotePayload.category_name = 'Solução Pronta';
        if (!remotePayload.badge) remotePayload.badge = 'Time-to-Market Imediato';
        if (!Array.isArray(remotePayload.features)) remotePayload.features = [];
        if (!Array.isArray(remotePayload.gallery_images)) remotePayload.gallery_images = [];

        try {
          let res = await fetch(`${config.url}/rest/v1/ready_solutions?on_conflict=id`, {
            method: 'POST',
            headers: getRequestHeaders({
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates,return=representation'
            }),
            body: JSON.stringify(remotePayload)
          });

          // Graceful fallback if video_url column does not exist yet on remote table
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (errData && errData.message && errData.message.includes('video_url')) {
              console.warn('Coluna video_url pendente no Supabase (execute o SQL de migração). Salvando demais campos...');
              const fallbackPayload = { ...remotePayload };
              delete fallbackPayload.video_url;

              await fetch(`${config.url}/rest/v1/ready_solutions?on_conflict=id`, {
                method: 'POST',
                headers: getRequestHeaders({
                  'Content-Type': 'application/json',
                  'Prefer': 'resolution=merge-duplicates,return=representation'
                }),
                body: JSON.stringify(fallbackPayload)
              });
            } else {
              console.warn('Supabase remote ready_solutions save response:', res.status, errData);
            }
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
          await fetch(`${config.url}/rest/v1/ready_solutions?id=eq.${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: getRequestHeaders()
          });
        } catch (e) {
          console.warn('Erro ao deletar solução no Supabase:', e);
        }
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
  cover_image_url, cover_image_alt, video_url, cta_text, cta_url, price_tag, status, display_order, published_at
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
  ${escape(solution.video_url)},
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
  video_url = EXCLUDED.video_url,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  price_tag = EXCLUDED.price_tag,
  status = EXCLUDED.status,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();`;
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
