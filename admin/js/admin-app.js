/**
 * BRANAPI ADMIN — MASTER APPLICATION CONTROLLER
 * Coordinates authentication, navigation tabs, editor actions, Supabase sync and previews.
 */

(function () {
  'use strict';

  // DOM Elements
  const loginOverlay = document.getElementById('loginOverlay');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const btnLogout = document.getElementById('btnLogout');
  const editorWorkspace = document.getElementById('editorWorkspace');
  const btnNewArticle = document.getElementById('btnNewArticle');
  const btnCloseEditor = document.getElementById('btnCloseEditor');
  const btnSaveDraft = document.getElementById('btnSaveDraft');
  const btnPublish = document.getElementById('btnPublish');
  const btnPreviewEditor = document.getElementById('btnPreviewEditor');
  const previewModal = document.getElementById('previewModal');
  const btnClosePreview = document.getElementById('btnClosePreview');
  const previewFrameWrap = document.getElementById('previewFrameWrap');
  const btnPreviewDesktop = document.getElementById('btnPreviewDesktop');
  const btnPreviewMobile = document.getElementById('btnPreviewMobile');

  // Supabase Settings Elements
  const supabaseUrlInput = document.getElementById('supabaseUrlInput');
  const supabaseKeyInput = document.getElementById('supabaseKeyInput');
  const btnSaveSupabase = document.getElementById('btnSaveSupabase');
  const btnTestSupabase = document.getElementById('btnTestSupabase');
  const supabaseStatus = document.getElementById('supabaseStatus');

  // SQL Modal Elements
  const sqlModal = document.getElementById('sqlModal');
  const btnCloseSqlModal = document.getElementById('btnCloseSqlModal');
  const btnCopySqlModal = document.getElementById('btnCopySqlModal');

  // 1. Session & Auth Check
  function checkAuth() {
    const session = BranapiAuth.getCurrentSession();
    if (session) {
      loginOverlay.style.display = 'none';
      const userEmailEl = document.getElementById('currentUserEmail');
      if (userEmailEl) userEmailEl.textContent = session.email;
      initDashboard();
    } else {
      loginOverlay.style.display = 'flex';
      const lock = BranapiAuth.isLocked();
      if (lock.locked) {
        showLoginError(`Acesso bloqueado por segurança. Aguarde ${lock.remainingSeconds}s.`);
      }
    }
  }

  function showLoginError(msg) {
    if (loginError) {
      loginError.textContent = msg;
      loginError.style.display = 'block';
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Autenticando...';
      }

      const email = document.getElementById('loginEmail').value;
      const pass = document.getElementById('loginPassword').value;
      const mfa = document.getElementById('loginMfa')?.value;

      try {
        await BranapiAuth.login(email, pass, mfa);
        checkAuth();
      } catch (err) {
        showLoginError(err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      BranapiAuth.logout();
      window.location.reload();
    });
  }

  // 2. Navigation Tabs
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  const tabSections = {
    articles: document.getElementById('tabArticles'),
    categories: document.getElementById('tabCategories'),
    supabase: document.getElementById('tabSupabase'),
    logs: document.getElementById('tabLogs')
  };

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');

      const tab = item.getAttribute('data-tab');
      Object.keys(tabSections).forEach((k) => {
        if (tabSections[k]) tabSections[k].style.display = k === tab ? 'block' : 'none';
      });

      if (tab === 'logs') BranapiAuditLogs.refresh();
      if (tab === 'articles') BranapiArticlesManager.refresh();
    });
  });

  // 3. Editor Modals & Actions
  if (btnNewArticle) {
    btnNewArticle.addEventListener('click', () => {
      BranapiEditor.loadPost({
        id: crypto.randomUUID(),
        title: '',
        subtitle: '',
        slug: '',
        excerpt: '',
        content: '',
        status: 'draft'
      });
      editorWorkspace.style.display = 'block';
    });
  }

  if (btnCloseEditor) {
    btnCloseEditor.addEventListener('click', () => {
      if (confirm('Deseja fechar o editor? Alterações não salvas serão perdidas.')) {
        editorWorkspace.style.display = 'none';
      }
    });
  }

  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', async () => {
      const post = BranapiEditor.getFormData();
      post.status = 'draft';
      await BranapiSupabase.savePost(post);
      await BranapiArticlesManager.refresh();
      editorWorkspace.style.display = 'none';
      alert('Rascunho salvo com sucesso no repositório!');
    });
  }

  if (btnPublish) {
    btnPublish.addEventListener('click', async () => {
      const post = BranapiEditor.getFormData();
      if (!post.title || !post.slug) {
        alert('O título e o slug são obrigatórios para publicação.');
        return;
      }
      post.status = 'published';
      post.published_at = new Date().toISOString();
      await BranapiSupabase.savePost(post);
      await BranapiArticlesManager.refresh();
      editorWorkspace.style.display = 'none';
      alert('Artigo publicado com sucesso! Estrutura de SEO canônica gerada.');
    });
  }

  // 4. Live Preview Modal
  if (btnPreviewEditor) {
    btnPreviewEditor.addEventListener('click', () => {
      const post = BranapiEditor.getFormData();
      const previewIframe = document.getElementById('previewIframe');
      if (previewIframe) {
        const previewHtml = `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <title>${post.meta_title || post.title}</title>
            <link rel="stylesheet" href="/styles.css" />
            <link rel="stylesheet" href="/blog/blog.css" />
            <style>body { background: #0a0a0a; color: #f5f5f0; padding: 24px; font-family: -apple-system, sans-serif; }</style>
          </head>
          <body class="blog-page">
            <header class="article-header" style="padding-top: 20px;">
              <div class="blog-breadcrumb"><span>Início / Blog / ${post.category_name}</span></div>
              <h1>${post.title || 'Título do Artigo'}</h1>
              <p class="article-subtitle">${post.subtitle || ''}</p>
              <div class="article-byline"><small>${post.author_name} • ${post.reading_time_minutes} min</small></div>
            </header>
            <div class="article-content" style="margin-top: 32px;">
              <p><strong>${post.excerpt || ''}</strong></p>
              <div>${(post.content || '').replace(/\n/g, '<br />')}</div>
            </div>
          </body>
          </html>
        `;
        previewIframe.srcdoc = previewHtml;
      }
      previewModal.style.display = 'flex';
    });
  }

  if (btnClosePreview) {
    btnClosePreview.addEventListener('click', () => {
      previewModal.style.display = 'none';
    });
  }

  if (btnPreviewDesktop && btnPreviewMobile && previewFrameWrap) {
    btnPreviewDesktop.addEventListener('click', () => {
      previewFrameWrap.className = 'preview-frame-wrap desktop';
      btnPreviewDesktop.classList.add('active');
      btnPreviewMobile.classList.remove('active');
    });
    btnPreviewMobile.addEventListener('click', () => {
      previewFrameWrap.className = 'preview-frame-wrap mobile';
      btnPreviewMobile.classList.add('active');
      btnPreviewDesktop.classList.remove('active');
    });
  }

  // 5. Supabase Settings
  function loadSupabaseSettings() {
    const config = BranapiSupabase.getConfig();
    if (supabaseUrlInput) supabaseUrlInput.value = config.url || '';
    if (supabaseKeyInput) supabaseKeyInput.value = config.anonKey || '';
  }

  if (btnSaveSupabase) {
    btnSaveSupabase.addEventListener('click', () => {
      BranapiSupabase.saveConfig(supabaseUrlInput.value, supabaseKeyInput.value);
      alert('Configurações do Supabase salvas localmente!');
    });
  }

  if (btnTestSupabase) {
    btnTestSupabase.addEventListener('click', async () => {
      supabaseStatus.textContent = 'Testando conexão HTTPS com o Supabase...';
      const result = await BranapiSupabase.testConnection();
      supabaseStatus.textContent = result.message;
      supabaseStatus.style.color = result.connected ? 'var(--admin-success)' : 'var(--admin-danger)';
    });
  }

  // 6. SQL Modal
  if (btnCloseSqlModal) {
    btnCloseSqlModal.addEventListener('click', () => {
      sqlModal.style.display = 'none';
    });
  }

  if (btnCopySqlModal) {
    btnCopySqlModal.addEventListener('click', () => {
      const output = document.getElementById('sqlOutput');
      if (output) {
        navigator.clipboard.writeText(output.value);
        btnCopySqlModal.textContent = 'Copiado!';
        setTimeout(() => (btnCopySqlModal.textContent = 'Copiar SQL'), 2000);
      }
    });
  }

  // Initialization
  function initDashboard() {
    BranapiEditor.init();
    BranapiArticlesManager.init();
    BranapiAuditLogs.init();
    loadSupabaseSettings();
  }

  checkAuth();
})();
