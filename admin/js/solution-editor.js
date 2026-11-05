/**
 * BRANAPI ADMIN — SOLUTION EDITOR CONTROLLER
 * Full management of photo uploads, gallery compression, video embeds (YouTube, Vimeo, MP4, Loom),
 * title, description, features, commercial terms and real-time live site sync.
 */

const BranapiSolutionEditor = (function () {
  'use strict';

  let currentSolutionId = null;

  // In-memory Canvas image compressor for ultra-fast load
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

  function formatVideoEmbed(url) {
    if (!url) return '';
    const trimmed = url.trim();

    // YouTube
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `<iframe src="https://www.youtube.com/embed/${ytMatch[1]}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 6px; border: 1px solid var(--admin-border);"></iframe>`;
    }

    // Vimeo
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i);
    if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
      const vimeoId = vimeoMatch[3] || vimeoMatch[1];
      return `<iframe src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 6px; border: 1px solid var(--admin-border);"></iframe>`;
    }

    // Loom
    const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/i);
    if (loomMatch && loomMatch[1]) {
      return `<iframe src="https://www.loom.com/embed/${loomMatch[1]}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 6px; border: 1px solid var(--admin-border);"></iframe>`;
    }

    // Direct MP4 / WebM / OGG
    if (/\.(mp4|webm|ogg)($|\?)/i.test(trimmed)) {
      return `<video controls playsinline style="width: 100%; max-height: 220px; border-radius: 6px; border: 1px solid var(--admin-border); background: #000;"><source src="${trimmed}" type="video/mp4">Seu navegador não suporta este vídeo.</video>`;
    }

    // Fallback generic iframe
    if (/^https?:\/\//i.test(trimmed)) {
      return `<iframe src="${trimmed}" frameborder="0" allowfullscreen style="width: 100%; aspect-ratio: 16/9; border-radius: 6px; border: 1px solid var(--admin-border);"></iframe>`;
    }

    return '';
  }

  function updateVideoPreview(url) {
    const previewContent = document.getElementById('solutionVideoPreviewContent');
    const placeholder = document.getElementById('solutionVideoPlaceholder');
    if (!previewContent || !placeholder) return;

    if (url && url.trim()) {
      const html = formatVideoEmbed(url);
      if (html) {
        previewContent.innerHTML = html;
        previewContent.style.display = 'block';
        placeholder.style.display = 'none';
        return;
      }
    }

    previewContent.innerHTML = '';
    previewContent.style.display = 'none';
    placeholder.style.display = 'block';
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
    const videoEl = document.getElementById('editSolutionVideo');
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
      if (videoEl) videoEl.value = sol.video_url || '';
      if (catEl) catEl.value = sol.category_name || 'Solução Pronta';
      if (badgeEl) badgeEl.value = sol.badge || 'Time-to-Market Imediato';
      if (priceEl) priceEl.value = sol.price_tag || 'Implantação Imediata';
      if (ctaTextEl) ctaTextEl.value = sol.cta_text || 'Solicitar Demonstração ↗';
      if (ctaUrlEl) ctaUrlEl.value = sol.cta_url || '';
      if (orderEl) orderEl.value = sol.display_order || 0;
      if (statusEl) statusEl.value = sol.status || 'published';
      updatePhotoPreview(sol.cover_image_url);
      updateVideoPreview(sol.video_url);
    } else {
      if (headerTitle) headerTitle.textContent = 'Criar Nova Solução Pronta';
      if (titleEl) titleEl.value = '';
      if (slugEl) slugEl.value = '';
      if (subtitleEl) subtitleEl.value = '';
      if (descEl) descEl.value = '';
      if (featEl) featEl.value = '';
      if (imgEl) imgEl.value = '';
      if (galleryEl) galleryEl.value = '';
      if (videoEl) videoEl.value = '';
      if (catEl) catEl.value = 'Solução Pronta';
      if (badgeEl) badgeEl.value = 'Time-to-Market Imediato';
      if (priceEl) priceEl.value = 'Implantação Imediata';
      if (ctaTextEl) ctaTextEl.value = 'Solicitar Demonstração ↗';
      if (ctaUrlEl) ctaUrlEl.value = '';
      if (orderEl) orderEl.value = 0;
      if (statusEl) statusEl.value = 'published';
      updatePhotoPreview('');
      updateVideoPreview('');
    }
  }

  function getFormData() {
    const title = (document.getElementById('editSolutionTitle')?.value || '').trim();
    let slug = (document.getElementById('editSolutionSlug')?.value || '').trim();
    if (!slug && title) slug = slugify(title);

    const subtitle = (document.getElementById('editSolutionSubtitle')?.value || '').trim();
    const description = (document.getElementById('editSolutionDescription')?.value || '').trim();
    const featuresRaw = document.getElementById('editSolutionFeatures')?.value || '';
    const features = featuresRaw
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const cover_image_url = (document.getElementById('editSolutionImage')?.value || '').trim();
    const galleryRaw = document.getElementById('editSolutionGallery')?.value || '';
    const gallery_images = galleryRaw
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const video_url = (document.getElementById('editSolutionVideo')?.value || '').trim();
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
      video_url,
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
    const videoInput = document.getElementById('editSolutionVideo');
    const btnUpload = document.getElementById('btnUploadSolutionPhoto');
    const fileInput = document.getElementById('solutionPhotoFileInput');
    const btnUploadGallery = document.getElementById('btnUploadGalleryPhotos');
    const galleryFileInput = document.getElementById('solutionGalleryFileInput');
    const galleryTextarea = document.getElementById('editSolutionGallery');
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

    // Live video preview when URL is typed
    if (videoInput) {
      videoInput.addEventListener('input', () => {
        updateVideoPreview(videoInput.value);
      });
    }

    // Local file upload with compression for cover image
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
          alert('Falha ao processar a foto. Tente outra imagem ou insira uma URL direta.');
        } finally {
          btnUpload.disabled = false;
          btnUpload.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            Escolher Foto de Capa (Upload do PC)
          `;
          fileInput.value = '';
        }
      });
    }

    // Local file upload for gallery photos (multiple)
    if (btnUploadGallery && galleryFileInput && galleryTextarea) {
      btnUploadGallery.addEventListener('click', () => {
        galleryFileInput.click();
      });

      galleryFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        btnUploadGallery.disabled = true;
        btnUploadGallery.textContent = `Processando ${files.length} foto(s)...`;

        try {
          const compressedUrls = [];
          for (const f of files) {
            const url = await compressImage(f, 1600, 0.82);
            compressedUrls.push(url);
          }
          const currentText = galleryTextarea.value.trim();
          const separator = currentText ? '\n' : '';
          galleryTextarea.value = currentText + separator + compressedUrls.join('\n');
          alert(`${files.length} foto(s) adicionada(s) à galeria com sucesso!`);
        } catch (err) {
          console.error('Erro ao processar fotos da galeria:', err);
          alert('Erro ao processar fotos. Verifique os arquivos selecionados.');
        } finally {
          btnUploadGallery.disabled = false;
          btnUploadGallery.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Adicionar Fotos à Galeria (Upload do PC)
          `;
          galleryFileInput.value = '';
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

        btnSaveDraft.disabled = true;
        btnSaveDraft.textContent = 'Salvando rascunho...';

        try {
          solution.status = 'draft';
          await BranapiSupabase.saveSolution(solution);
          await BranapiSolutionsManager.refresh();
          if (workspace) workspace.style.display = 'none';
          alert('Rascunho da solução salvo com sucesso!');
        } catch (err) {
          console.error('Erro ao salvar rascunho:', err);
          alert('Erro ao salvar rascunho. Tente novamente.');
        } finally {
          btnSaveDraft.disabled = false;
          btnSaveDraft.textContent = 'Salvar Rascunho';
        }
      });
    }

    // Publish
    if (btnPublish) {
      btnPublish.addEventListener('click', async () => {
        const solution = getFormData();
        if (!solution.title || !solution.description) {
          alert('O título e a descrição são obrigatórios para publicar uma solução.');
          return;
        }

        btnPublish.disabled = true;
        btnPublish.textContent = 'Publicando no site...';

        try {
          solution.status = 'published';
          solution.published_at = new Date().toISOString();
          await BranapiSupabase.saveSolution(solution);
          await BranapiSolutionsManager.refresh();
          if (workspace) workspace.style.display = 'none';
          alert('Solução publicada com sucesso e espelhada no catálogo oficial!');
        } catch (err) {
          console.error('Erro ao publicar solução:', err);
          alert('Erro ao publicar solução. Verifique os campos e tente novamente.');
        } finally {
          btnPublish.disabled = false;
          btnPublish.textContent = 'Publicar Solução ↗';
        }
      });
    }

    // Close
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        if (confirm('Deseja fechar o editor de soluções? Alterações não salvas serão descartadas.')) {
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

  const solutionEditorApi = {
    init,
    loadSolution,
    getFormData,
    formatVideoEmbed,
    open(solution = null) {
      loadSolution(solution);
      const ws = document.getElementById('solutionEditorWorkspace');
      if (ws) {
        ws.style.display = 'block';
        const titleInput = document.getElementById('editSolutionTitle');
        if (titleInput) {
          setTimeout(() => titleInput.focus(), 50);
        }
      }
    },
    close() {
      const ws = document.getElementById('solutionEditorWorkspace');
      if (ws) ws.style.display = 'none';
    }
  };

  window.BranapiSolutionEditor = solutionEditorApi;
  return solutionEditorApi;
})();

window.BranapiSolutionEditor = BranapiSolutionEditor;

window.openNewSolutionModal = function () {
  try {
    if (window.BranapiSolutionEditor && typeof window.BranapiSolutionEditor.open === 'function') {
      window.BranapiSolutionEditor.open(null);
      return;
    }
    if (window.BranapiSolutionEditor && typeof window.BranapiSolutionEditor.loadSolution === 'function') {
      window.BranapiSolutionEditor.loadSolution(null);
    }
  } catch (e) {
    console.warn('Erro ao abrir editor de solução:', e);
  }
  const ws = document.getElementById('solutionEditorWorkspace');
  if (ws) {
    ws.style.display = 'block';
    const titleInput = document.getElementById('editSolutionTitle');
    if (titleInput) {
      setTimeout(() => titleInput.focus(), 50);
    }
  }
};

window.closeSolutionModal = function () {
  if (confirm('Deseja fechar o editor de soluções? Alterações não salvas serão descartadas.')) {
    const ws = document.getElementById('solutionEditorWorkspace');
    if (ws) ws.style.display = 'none';
  }
};

