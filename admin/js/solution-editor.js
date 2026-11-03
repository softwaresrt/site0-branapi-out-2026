/**
 * BRANAPI ADMIN — SOLUTION EDITOR CONTROLLER
 * Full management of photo uploads, canvas optimization, title, description, features and status.
 */

const BranapiSolutionEditor = (function () {
  'use strict';

  let currentSolutionId = null;

  // In-memory Canvas image compressor
  function compressImage(file, maxWidth = 1600, quality = 0.84) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function slugify(text) {
    return (text || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  function updatePhotoPreview(url) {
    const previewImg = document.getElementById('solutionPhotoPreviewImg');
    const placeholder = document.getElementById('solutionPhotoPlaceholder');
    if (!previewImg || !placeholder) return;

    if (url && url.trim()) {
      previewImg.src = url.trim();
      previewImg.style.display = 'block';
      placeholder.style.display = 'none';
    } else {
      previewImg.src = '';
      previewImg.style.display = 'none';
      placeholder.style.display = 'block';
    }
  }

  function loadSolution(sol) {
    currentSolutionId = sol ? sol.id : crypto.randomUUID();

    const titleEl = document.getElementById('editSolutionTitle');
    const slugEl = document.getElementById('editSolutionSlug');
    const subtitleEl = document.getElementById('editSolutionSubtitle');
    const descEl = document.getElementById('editSolutionDescription');
    const featEl = document.getElementById('editSolutionFeatures');
    const imgEl = document.getElementById('editSolutionImage');
    const galleryEl = document.getElementById('editSolutionGallery');
    const catEl = document.getElementById('editSolutionCategory');
    const badgeEl = document.getElementById('editSolutionBadge');
    const priceEl = document.getElementById('editSolutionPriceTag');
    const ctaTextEl = document.getElementById('editSolutionCtaText');
    const ctaUrlEl = document.getElementById('editSolutionCtaUrl');
    const orderEl = document.getElementById('editSolutionOrder');
    const statusEl = document.getElementById('editSolutionStatus');
    const headerTitle = document.getElementById('solutionEditorTitle');

    if (sol && sol.id) {
      if (headerTitle) headerTitle.textContent = `Editar Solução: ${sol.title}`;
      if (titleEl) titleEl.value = sol.title || '';
      if (slugEl) slugEl.value = sol.slug || '';
      if (subtitleEl) subtitleEl.value = sol.subtitle || '';
      if (descEl) descEl.value = sol.description || '';
      if (featEl) featEl.value = Array.isArray(sol.features) ? sol.features.join('\n') : (sol.features || '');
      if (imgEl) imgEl.value = sol.cover_image_url || '';
      if (galleryEl) galleryEl.value = Array.isArray(sol.gallery_images) ? sol.gallery_images.join('\n') : '';
      if (catEl) catEl.value = sol.category_name || 'Solução Pronta';
      if (badgeEl) badgeEl.value = sol.badge || 'Time-to-Market Imediato';
      if (priceEl) priceEl.value = sol.price_tag || 'Implantação Imediata';
      if (ctaTextEl) ctaTextEl.value = sol.cta_text || 'Solicitar Demonstração ↗';
      if (ctaUrlEl) ctaUrlEl.value = sol.cta_url || '';
      if (orderEl) orderEl.value = sol.display_order || 0;
      if (statusEl) statusEl.value = sol.status || 'published';
      updatePhotoPreview(sol.cover_image_url);
    } else {
      if (headerTitle) headerTitle.textContent = 'Criar Nova Solução Pronta';
      if (titleEl) titleEl.value = '';
      if (slugEl) slugEl.value = '';
      if (subtitleEl) subtitleEl.value = '';
      if (descEl) descEl.value = '';
      if (featEl) featEl.value = '';
      if (imgEl) imgEl.value = '';
      if (galleryEl) galleryEl.value = '';
      if (catEl) catEl.value = 'Solução Pronta';
      if (badgeEl) badgeEl.value = 'Time-to-Market Imediato';
      if (priceEl) priceEl.value = 'Implantação Imediata';
      if (ctaTextEl) ctaTextEl.value = 'Solicitar Demonstração ↗';
      if (ctaUrlEl) ctaUrlEl.value = '';
      if (orderEl) orderEl.value = 0;
      if (statusEl) statusEl.value = 'published';
      updatePhotoPreview('');
    }
  }

  function getFormData() {
    const title = (document.getElementById('editSolutionTitle')?.value || '').trim();
    let slug = (document.getElementById('editSolutionSlug')?.value || '').trim();
    if (!slug && title) {
      slug = slugify(title);
    }
    const subtitle = (document.getElementById('editSolutionSubtitle')?.value || '').trim();
    const description = (document.getElementById('editSolutionDescription')?.value || '').trim();
    
    const featuresRaw = document.getElementById('editSolutionFeatures')?.value || '';
    const features = featuresRaw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const cover_image_url = (document.getElementById('editSolutionImage')?.value || '').trim();
    
    const galleryRaw = document.getElementById('editSolutionGallery')?.value || '';
    const gallery_images = galleryRaw
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const category_name = (document.getElementById('editSolutionCategory')?.value || '').trim() || 'Solução Pronta';
    const badge = (document.getElementById('editSolutionBadge')?.value || '').trim() || 'Time-to-Market Imediato';
    const price_tag = (document.getElementById('editSolutionPriceTag')?.value || '').trim() || 'Implantação Imediata';
    const cta_text = (document.getElementById('editSolutionCtaText')?.value || '').trim() || 'Solicitar Demonstração ↗';
    const cta_url = (document.getElementById('editSolutionCtaUrl')?.value || '').trim();
    const display_order = parseInt(document.getElementById('editSolutionOrder')?.value || '0', 10) || 0;
    const status = document.getElementById('editSolutionStatus')?.value || 'published';

    return {
      id: currentSolutionId || crypto.randomUUID(),
      title,
      slug,
      subtitle,
      description,
      features,
      cover_image_url,
      cover_image_alt: title,
      gallery_images,
      category_name,
      badge,
      price_tag,
      cta_text,
      cta_url,
      display_order,
      status
    };
  }

  function init() {
    const autoSlugBtn = document.getElementById('autoSolutionSlugBtn');
    const titleInput = document.getElementById('editSolutionTitle');
    const slugInput = document.getElementById('editSolutionSlug');
    const imgInput = document.getElementById('editSolutionImage');
    const btnUpload = document.getElementById('btnUploadSolutionPhoto');
    const fileInput = document.getElementById('solutionPhotoFileInput');
    const btnSaveDraft = document.getElementById('btnSaveSolutionDraft');
    const btnPublish = document.getElementById('btnPublishSolution');
    const btnClose = document.getElementById('btnCloseSolutionEditor');
    const btnPreview = document.getElementById('btnPreviewSolution');
    const workspace = document.getElementById('solutionEditorWorkspace');

    // Auto Slug
    if (autoSlugBtn && titleInput && slugInput) {
      autoSlugBtn.addEventListener('click', () => {
        slugInput.value = slugify(titleInput.value);
      });
    }

    // Live photo preview when URL is typed
    if (imgInput) {
      imgInput.addEventListener('input', () => {
        updatePhotoPreview(imgInput.value);
      });
    }

    // Local file upload with compression
    if (btnUpload && fileInput) {
      btnUpload.addEventListener('click', () => {
        fileInput.click();
      });

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        btnUpload.disabled = true;
        btnUpload.textContent = 'Processando foto...';

        try {
          const compressedDataUrl = await compressImage(file);
          if (imgInput) {
            imgInput.value = compressedDataUrl;
            updatePhotoPreview(compressedDataUrl);
          }
        } catch (err) {
          console.error('Erro ao processar imagem:', err);
          alert('Falha ao processar a imagem. Tente uma imagem diferente ou insira a URL direta.');
        } finally {
          btnUpload.disabled = false;
          btnUpload.innerHTML = '📁 Escolher Foto do Computador (Upload)';
          fileInput.value = '';
        }
      });
    }

    // Save Draft
    if (btnSaveDraft) {
      btnSaveDraft.addEventListener('click', async () => {
        const solution = getFormData();
        if (!solution.title) {
          alert('Por favor, informe ao menos o título da solução.');
          return;
        }
        solution.status = 'draft';
        await BranapiSupabase.saveSolution(solution);
        await BranapiSolutionsManager.refresh();
        if (workspace) workspace.style.display = 'none';
        alert('Rascunho da solução salvo com sucesso!');
      });
    }

    // Publish
    if (btnPublish) {
      btnPublish.addEventListener('click', async () => {
        const solution = getFormData();
        if (!solution.title || !solution.description) {
          alert('O título e a descrição são obrigatórios para publicar uma solução pronta.');
          return;
        }
        solution.status = 'published';
        solution.published_at = new Date().toISOString();
        await BranapiSupabase.saveSolution(solution);
        await BranapiSolutionsManager.refresh();
        if (workspace) workspace.style.display = 'none';
        alert('Solução publicada com sucesso no catálogo oficial!');
      });
    }

    // Close
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (confirm('Deseja fechar o editor de soluções? Alterações não salvas serão perdidas.')) {
          if (workspace) workspace.style.display = 'none';
        }
      });
    }

    // Preview
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        const solution = getFormData();
        window.open(`/solucoes-prontas/#${solution.slug || ''}`, '_blank');
      });
    }
  }

  return {
    init,
    loadSolution,
    getFormData
  };
})();

