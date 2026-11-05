/**
 * BRANAPI ADMIN — READY SOLUTIONS (SOLUÇÕES PRONTAS) MANAGER
 * Handles catalog display, filtering, search, duplication, deletion, and SQL generation.
 */

const BranapiSolutionsManager = (function () {
  'use strict';

  let currentSolutions = [];
  let filterStatus = 'all';
  let searchTerm = '';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderTable() {
    const tbody = document.getElementById('solutionsTableBody');
    if (!tbody) return;

    let filtered = currentSolutions.filter((solution) => {
      const matchStatus = filterStatus === 'all' || solution.status === filterStatus;
      const matchSearch =
        searchTerm === '' ||
        solution.title.toLowerCase().includes(searchTerm) ||
        solution.slug.toLowerCase().includes(searchTerm) ||
        (solution.category_name || '').toLowerCase().includes(searchTerm) ||
        (solution.description || '').toLowerCase().includes(searchTerm);
      return matchStatus && matchSearch;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--admin-muted); padding: 32px;">Nenhuma solução encontrada com os filtros atuais.</td></tr>`;
      return;
    }

    filtered.forEach((sol) => {
      const tr = document.createElement('tr');
      const statusClass = sol.status === 'published' ? 'published' : 'draft';
      const statusLabel = sol.status === 'published' ? 'Publicada' : 'Rascunho';
      const photoHtml = sol.cover_image_url
        ? `<img src="${escapeHtml(sol.cover_image_url)}" alt="${escapeHtml(sol.title)}" style="width: 52px; height: 38px; object-fit: cover; border-radius: 4px; border: 1px solid var(--admin-border);" />`
        : `<div style="width: 52px; height: 38px; background: var(--admin-surface-2); border-radius: 4px; display: grid; place-items: center; font-size: 10px; color: var(--admin-muted); border: 1px dashed var(--admin-border);">Sem foto</div>`;

      tr.innerHTML = `
        <td style="vertical-align: middle;">
          ${photoHtml}
        </td>
        <td>
          <strong style="color: var(--admin-ice); display: block; font-size: 14px;">${escapeHtml(sol.title)}</strong>
          <small style="font-family: var(--admin-mono); color: var(--admin-muted); font-size: 11px;">/solucoes-prontas/#${escapeHtml(sol.slug)}</small>
        </td>
        <td>
          <span style="font-family: var(--admin-mono); font-size: 11px; color: var(--admin-lime); display: block;">${escapeHtml(sol.category_name || 'Solução Pronta')}</span>
          <small style="color: var(--admin-muted); font-size: 10px;">${escapeHtml(sol.badge || 'Time-to-Market Imediato')}</small>
        </td>
        <td>
          <span class="status-tag ${statusClass}">${statusLabel}</span>
        </td>
        <td style="font-family: var(--admin-mono); font-size: 12px; color: var(--admin-ice);">
          #${sol.display_order || 0}
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="table-btn btn-solution-edit" data-id="${sol.id}">Editar</button>
            <button type="button" class="table-btn btn-solution-view" data-slug="${sol.slug}">Ver no site</button>
            <button type="button" class="table-btn btn-solution-dup" data-id="${sol.id}">Duplicar</button>
            <button type="button" class="table-btn btn-solution-del" data-id="${sol.id}" style="color: var(--admin-danger); border-color: rgba(255,85,85,0.3);">Excluir</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    updateKpis();
    bindTableButtons();
  }

  function updateKpis() {
    const totalCount = currentSolutions.length;
    const publishedCount = currentSolutions.filter((s) => s.status === 'published').length;
    const draftCount = totalCount - publishedCount;

    const elTotal = document.getElementById('kpiSolutionsTotal');
    const elPub = document.getElementById('kpiSolutionsPublished');
    const elDraft = document.getElementById('kpiSolutionsDraft');

    if (elTotal) elTotal.textContent = totalCount;
    if (elPub) elPub.textContent = publishedCount;
    if (elDraft) elDraft.textContent = draftCount;
  }

  function bindTableButtons() {
    // Edit
    document.querySelectorAll('.btn-solution-edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const solution = currentSolutions.find((s) => s.id === id);
        if (solution) {
          const editor = window.BranapiSolutionEditor || (typeof BranapiSolutionEditor !== 'undefined' ? BranapiSolutionEditor : null);
          if (editor && typeof editor.open === 'function') {
            editor.open(solution);
          } else if (editor && typeof editor.loadSolution === 'function') {
            editor.loadSolution(solution);
            const workspace = document.getElementById('solutionEditorWorkspace');
            if (workspace) workspace.style.display = 'block';
          }
        }
      });
    });

    // View on live site
    document.querySelectorAll('.btn-solution-view').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slug = btn.getAttribute('data-slug');
        window.open(`/solucoes-prontas/#${slug}`, '_blank');
      });
    });

    // Duplicate
    document.querySelectorAll('.btn-solution-dup').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const solution = currentSolutions.find((s) => s.id === id);
        if (solution) {
          const clone = JSON.parse(JSON.stringify(solution));
          clone.id = crypto.randomUUID();
          clone.title = `${clone.title} (Cópia)`;
          clone.slug = `${clone.slug}-copia-${Date.now().toString().slice(-4)}`;
          clone.status = 'draft';
          clone.display_order = (clone.display_order || 0) + 1;
          await BranapiSupabase.saveSolution(clone);
          await refresh();
          alert('Solução duplicada como rascunho com sucesso!');
        }
      });
    });

    // Delete
    document.querySelectorAll('.btn-solution-del').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const solution = currentSolutions.find((s) => s.id === id);
        if (solution && confirm(`Tem certeza que deseja excluir a solução "${solution.title}"? Esta ação removerá a publicação do catálogo.`)) {
          await BranapiSupabase.deleteSolution(id);
          await refresh();
        }
      });
    });
  }

  async function refresh() {
    try {
      currentSolutions = await BranapiSupabase.getSolutions();
      renderTable();
    } catch (e) {
      console.error('Falha ao carregar soluções:', e);
    }
  }

  function init() {
    // Status filter buttons
    document.querySelectorAll('.solution-status-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.solution-status-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        filterStatus = btn.getAttribute('data-status') || 'all';
        renderTable();
      });
    });

    // Search input
    const searchInput = document.getElementById('solutionTableSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = (e.target.value || '').trim().toLowerCase();
        renderTable();
      });
    }

    refresh();
  }

  const solutionsManagerApi = {
    init,
    refresh,
    getCurrentSolutions: () => currentSolutions
  };

  window.BranapiSolutionsManager = solutionsManagerApi;
  return solutionsManagerApi;
})();

window.BranapiSolutionsManager = BranapiSolutionsManager;

