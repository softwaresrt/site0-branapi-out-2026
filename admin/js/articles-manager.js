/**
 * BRANAPI ADMIN — ARTICLES LISTING & ACTIONS MANAGER
 * Filter, search, duplicate, delete, SQL export, KPIs.
 */

const BranapiArticlesManager = (function () {
  'use strict';

  let currentArticles = [];
  let filterStatus = 'all';
  let searchTerm = '';

  function renderTable() {
    const tbody = document.getElementById('articlesTableBody');
    if (!tbody) return;

    let filtered = currentArticles.filter((post) => {
      const matchStatus = filterStatus === 'all' || post.status === filterStatus;
      const matchSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm) ||
        post.slug.toLowerCase().includes(searchTerm) ||
        (post.primary_keyword || '').toLowerCase().includes(searchTerm);
      return matchStatus && matchSearch;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 32px;">Nenhum artigo encontrado com os filtros atuais.</td></tr>`;
      return;
    }

    filtered.forEach((post) => {
      const tr = document.createElement('tr');
      const statusClass = post.status === 'published' ? 'published' : 'draft';
      const statusLabel = post.status === 'published' ? 'Publicado' : 'Rascunho';

      tr.innerHTML = `
        <td>
          <strong style="color: var(--admin-ice); display: block; font-size: 14px;">${escapeHtml(post.title)}</strong>
          <small style="font-family: var(--admin-mono); color: var(--admin-muted); font-size: 11px;">/blog/${escapeHtml(post.slug)}/</small>
        </td>
        <td>
          <span style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-ice);">${escapeHtml(post.category_name || 'Geral')}</span>
        </td>
        <td>
          <span class="status-tag ${statusClass}">${statusLabel}</span>
        </td>
        <td style="font-family: var(--admin-mono); font-size: 11px;">
          ${post.reading_time_minutes || 5} min
        </td>
        <td style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-lime);">
          ${(post.views_count || 0).toLocaleString('pt-BR')}
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="table-btn btn-edit" data-id="${post.id}">Editar</button>
            <button type="button" class="table-btn btn-preview" data-slug="${post.slug}">Preview</button>
            <button type="button" class="table-btn btn-sql" data-id="${post.id}" title="Gerar SQL para Supabase">SQL</button>
            <button type="button" class="table-btn btn-dup" data-id="${post.id}">Duplicar</button>
            <button type="button" class="table-btn btn-del" data-id="${post.id}" style="color: var(--admin-danger); border-color: rgba(255,85,85,0.3);">Excluir</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    updateKpis();
    bindTableButtons();
  }

  function updateKpis() {
    const totalCount = currentArticles.length;
    const publishedCount = currentArticles.filter((p) => p.status === 'published').length;
    const totalViews = currentArticles.reduce((acc, p) => acc + (p.views_count || 0), 0);
    const avgReading = totalCount > 0 ? Math.round(currentArticles.reduce((acc, p) => acc + (p.reading_time_minutes || 5), 0) / totalCount) : 0;

    const elTotal = document.getElementById('kpiTotal');
    const elPub = document.getElementById('kpiPublished');
    const elViews = document.getElementById('kpiViews');
    const elReading = document.getElementById('kpiAvgReading');

    if (elTotal) elTotal.textContent = totalCount;
    if (elPub) elPub.textContent = publishedCount;
    if (elViews) elViews.textContent = totalViews.toLocaleString('pt-BR');
    if (elReading) elReading.textContent = `${avgReading} min`;
  }

  function bindTableButtons() {
    // Edit
    document.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const post = currentArticles.find((p) => p.id === id);
        if (post) {
          BranapiEditor.loadPost(post);
          document.getElementById('editorWorkspace').style.display = 'block';
        }
      });
    });

    // Preview
    document.querySelectorAll('.btn-preview').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        window.open(`/blog/${slug}/`, '_blank');
      });
    });

    // SQL Exporter modal
    document.querySelectorAll('.btn-sql').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const post = currentArticles.find((p) => p.id === id);
        if (post) {
          const sql = BranapiSupabase.exportAsSQL(post);
          promptCopySQL(sql);
        }
      });
    });

    // Duplicate
    document.querySelectorAll('.btn-dup').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const post = currentArticles.find((p) => p.id === id);
        if (post) {
          const copy = {
            ...post,
            id: crypto.randomUUID(),
            title: post.title + ' (Cópia)',
            slug: post.slug + '-copia',
            status: 'draft'
          };
          await BranapiSupabase.savePost(copy);
          await loadArticles();
        }
      });
    });

    // Delete
    document.querySelectorAll('.btn-del').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Tem certeza de que deseja excluir este artigo do blog?')) {
          await BranapiSupabase.deletePost(id);
          await loadArticles();
        }
      });
    });
  }

  function promptCopySQL(sql) {
    const modal = document.getElementById('sqlModal');
    const textarea = document.getElementById('sqlOutput');
    if (modal && textarea) {
      textarea.value = sql;
      modal.style.display = 'flex';
    } else {
      navigator.clipboard.writeText(sql);
      alert('SQL gerado e copiado para a área de transferência! Cole no Supabase SQL Editor.');
    }
  }

  function escapeHtml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  async function loadArticles() {
    currentArticles = await BranapiSupabase.getPosts();
    renderTable();
  }

  return {
    async init() {
      const searchInput = document.getElementById('tableSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchTerm = e.target.value.trim().toLowerCase();
          renderTable();
        });
      }

      document.querySelectorAll('.status-filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.status-filter-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          filterStatus = btn.getAttribute('data-status') || 'all';
          renderTable();
        });
      });

      await loadArticles();
    },

    refresh: loadArticles
  };
})();
