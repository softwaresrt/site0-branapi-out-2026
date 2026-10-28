/**
 * BRANAPI ADMIN — ARTICLE EDITOR & REAL-TIME SEO AUDIT ENGINE
 * Real-time checklist, slug sanitizer, full rich toolbar, visual mode,
 * multi-image / multi-video upload and responsive carousel generator.
 */

const BranapiEditor = (function () {
  'use strict';

  let currentPostId = null;
  let mediaItems = []; // Array of { id, type: 'image'|'video', url, caption, isCover: boolean }

  function slugify(text) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function countWords(str) {
    return (str || '').trim().split(/\s+/).filter(Boolean).length;
  }

  // Parses YouTube and Vimeo URLs into standard embed links
  function formatVideoUrl(url) {
    if (!url) return '';
    const clean = url.trim();

    // YouTube watch or short link
    const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo link
    const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
      return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }

    return clean;
  }

  // Generates accessible, sleek responsive carousel HTML
  function generateCarouselHtml(items, carouselId = 'articleCarousel') {
    if (!items || items.length === 0) return '';

    const slidesHtml = items.map((item, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      let mediaHtml = '';
      if (item.type === 'video') {
        if (item.url.includes('youtube.com') || item.url.includes('vimeo.com')) {
          mediaHtml = `<div class="carousel-video-wrap"><iframe src="${item.url}" title="Vídeo do artigo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        } else {
          mediaHtml = `<video controls playsinline preload="metadata" class="carousel-video-player"><source src="${item.url}">Seu navegador não suporta vídeos.</video>`;
        }
      } else {
        mediaHtml = `<img src="${item.url}" alt="${item.caption || 'Mídia do artigo Branapi'}" loading="lazy" class="carousel-img" />`;
      }

      const captionHtml = item.caption ? `<div class="carousel-caption"><span>${escapeHtml(item.caption)}</span></div>` : '';

      return `
        <div class="carousel-slide ${activeClass}" data-slide-index="${idx}">
          ${mediaHtml}
          ${captionHtml}
        </div>
      `;
    }).join('\n');

    const dotsHtml = items.length > 1 ? `
      <div class="carousel-dots" role="tablist">
        ${items.map((_, idx) => `<button type="button" class="carousel-dot ${idx === 0 ? 'active' : ''}" data-goto="${idx}" aria-label="Ir para o slide ${idx + 1}"></button>`).join('')}
      </div>
    ` : '';

    const controlsHtml = items.length > 1 ? `
      <button type="button" class="carousel-nav-btn carousel-prev" aria-label="Slide anterior">‹</button>
      <button type="button" class="carousel-nav-btn carousel-next" aria-label="Próximo slide">›</button>
      <div class="carousel-counter"><span class="cur-slide">1</span> / <span>${items.length}</span></div>
    ` : '';

    return `
<div class="article-carousel" id="${carouselId}" data-total="${items.length}">
  <div class="carousel-stage">
    ${slidesHtml}
    ${controlsHtml}
  </div>
  ${dotsHtml}
</div>
    `.trim();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  // Convert markdown to clean, semantic HTML for visual mode & publishing
  function markdownToHtml(markdown) {
    if (!markdown) return '';
    let html = markdown;

    // Callout blocks
    html = html.replace(/:::callout\s*([\s\S]*?):::/g, (match, p1) => {
      return `<div class="callout-box"><strong style="color:var(--admin-lime,#c6ff3d);display:block;margin-bottom:6px;">⚡ NOTA DE ENGENHARIA & ARQUITETURA</strong><div>${p1.trim().replace(/\n/g, '<br/>')}</div></div>`;
    });

    // Code blocks
    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Headers
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');

    // Bold, italic, underline, strike
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr/>');

    // Tables
    html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
      const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
      const trs = rows.trim().split('\n').map(r => {
        const tds = r.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      return `<div class="table-responsive"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
    });

    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Paragraphs
    const lines = html.split('\n\n');
    html = lines.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<pre') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<hr') || trimmed.startsWith('<table')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n\n');

    return html;
  }

  function updateSeoAudit() {
    const title = (document.getElementById('editTitle')?.value || '').trim();
    const metaTitle = (document.getElementById('editMetaTitle')?.value || '').trim();
    const metaDesc = (document.getElementById('editMetaDesc')?.value || '').trim();
    const keyword = (document.getElementById('editKeyword')?.value || '').trim().toLowerCase();
    const slug = (document.getElementById('editSlug')?.value || '').trim();
    const content = (document.getElementById('editContent')?.value || '').trim();
    const excerpt = (document.getElementById('editExcerpt')?.value || '').trim();

    // 1. Meta Title Meter (Target: 40-60 chars)
    const titleLen = metaTitle.length;
    const titleMeter = document.getElementById('metaTitleMeter');
    if (titleMeter) {
      titleMeter.textContent = `${titleLen} / 60 caracteres`;
      titleMeter.className = 'char-meter ' + (titleLen >= 40 && titleLen <= 60 ? 'ok' : titleLen > 60 ? 'bad' : 'warn');
    }

    // 2. Meta Desc Meter (Target: 130-160 chars)
    const descLen = metaDesc.length;
    const descMeter = document.getElementById('metaDescMeter');
    if (descMeter) {
      descMeter.textContent = `${descLen} / 160 caracteres (ideal: 130 a 160)`;
      descMeter.className = 'char-meter ' + (descLen >= 130 && descLen <= 160 ? 'ok' : descLen > 160 ? 'bad' : 'warn');
    }

    // 3. Reading time estimation
    const words = countWords(content);
    const readingMin = Math.max(1, Math.ceil(words / 190));
    const readingMeter = document.getElementById('readingTimeMeter');
    if (readingMeter) {
      readingMeter.textContent = `${words} palavras (~${readingMin} min de leitura)`;
    }

    // 4. Update Checklist Items
    const checks = {
      chkSlug: slug.length > 3 && !slug.includes(' ') && slug === slugify(slug),
      chkTitle: titleLen >= 40 && titleLen <= 60,
      chkDesc: descLen >= 130 && descLen <= 160,
      chkKeyword: keyword.length > 2,
      chkKeywordInTitle: keyword.length > 2 && (title.toLowerCase().includes(keyword) || metaTitle.toLowerCase().includes(keyword)),
      chkH2: content.includes('## ') || content.includes('<h2'),
      chkExcerpt: excerpt.length >= 50
    };

    for (const [id, passed] of Object.entries(checks)) {
      const el = document.getElementById(id);
      if (el) {
        el.className = passed ? 'pass' : 'fail';
        const icon = el.querySelector('span.status-icon');
        if (icon) icon.textContent = passed ? '✓' : '✗';
      }
    }
  }

  function insertFormatting(prefix, suffix = '') {
    const textarea = document.getElementById('editContent');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    const replacement = prefix + (selected || 'texto') + suffix;
    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.focus();
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length + (selected || 'texto').length;

    updateSeoAudit();
  }

  // Optimize and compress images in-memory via HTML5 canvas
  function compressImage(file, maxWidth = 1600, quality = 0.82) {
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
          resolve(canvas.toDataURL('image/webp', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderMediaGallery() {
    const grid = document.getElementById('mediaGalleryItems');
    const badge = document.getElementById('mediaCountBadge');
    const emptyNotice = document.getElementById('mediaEmptyNotice');

    if (badge) badge.textContent = `${mediaItems.length} ${mediaItems.length === 1 ? 'mídia' : 'mídias'}`;
    if (emptyNotice) emptyNotice.style.display = mediaItems.length === 0 ? 'block' : 'none';

    if (!grid) return;
    grid.innerHTML = '';

    mediaItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `media-card ${item.isCover ? 'is-cover' : ''}`;

      let previewContent = '';
      if (item.type === 'video') {
        if (item.url.includes('youtube.com') || item.url.includes('vimeo.com')) {
          previewContent = `<iframe src="${item.url}" title="Preview do vídeo"></iframe>`;
        } else {
          previewContent = `<video src="${item.url}" muted></video>`;
        }
      } else {
        previewContent = `<img src="${item.url}" alt="${item.caption || 'Foto'}" loading="lazy" />`;
      }

      card.innerHTML = `
        <div class="media-thumb-area">
          ${previewContent}
          <span class="media-badge-type">${item.type === 'video' ? 'VÍDEO' : 'IMAGEM'}</span>
          ${item.isCover ? '<span class="media-badge-cover">⭐ CAPA</span>' : ''}
        </div>
        <div class="media-card-body">
          <input type="text" class="media-caption-input" placeholder="Legenda da foto/vídeo..." value="${escapeHtml(item.caption || '')}" data-index="${index}" />
          <div class="media-card-actions">
            <button type="button" class="media-btn-action btn-set-cover" data-index="${index}">
              ${item.isCover ? 'Capa Ativa' : 'Definir Capa'}
            </button>
            <button type="button" class="media-btn-action btn-insert-text" data-index="${index}">
              + No Texto
            </button>
            <button type="button" class="media-btn-action delete btn-delete-media" data-index="${index}">
              Excluir
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Caption change listeners
    grid.querySelectorAll('.media-caption-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (mediaItems[idx]) {
          mediaItems[idx].caption = e.target.value.trim();
        }
      });
    });

    // Set as Cover
    grid.querySelectorAll('.btn-set-cover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        mediaItems.forEach((m, i) => (m.isCover = i === idx));
        renderMediaGallery();
      });
    });

    // Insert directly into text editor
    grid.querySelectorAll('.btn-insert-text').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        const item = mediaItems[idx];
        if (!item) return;

        if (item.type === 'video') {
          insertFormatting(`\n<video controls class="article-video-embed" poster=""><source src="${item.url}" type="video/mp4"></video>\n`);
        } else {
          insertFormatting(`\n![${item.caption || 'Imagem do artigo'}](${item.url})\n`);
        }
      });
    });

    // Delete item
    grid.querySelectorAll('.btn-delete-media').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        const wasCover = mediaItems[idx]?.isCover;
        mediaItems.splice(idx, 1);
        if (wasCover && mediaItems.length > 0) {
          mediaItems[0].isCover = true;
        }
        renderMediaGallery();
      });
    });
  }

  function addMedia(type, url, caption = '', isCover = false) {
    if (!url) return;
    const shouldBeCover = isCover || mediaItems.length === 0;
    mediaItems.push({
      id: crypto.randomUUID ? crypto.randomUUID() : 'm_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type,
      url,
      caption,
      isCover: shouldBeCover
    });
    renderMediaGallery();
  }

  return {
    init() {
      const titleInput = document.getElementById('editTitle');
      const slugInput = document.getElementById('editSlug');
      const autoSlugBtn = document.getElementById('autoSlugBtn');

      if (autoSlugBtn && titleInput && slugInput) {
        autoSlugBtn.addEventListener('click', () => {
          slugInput.value = slugify(titleInput.value);
          updateSeoAudit();
        });
      }

      ['editTitle', 'editMetaTitle', 'editMetaDesc', 'editKeyword', 'editSlug', 'editContent', 'editExcerpt']
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) el.addEventListener('input', updateSeoAudit);
        });

      // Rich Formatting Toolbar bindings
      document.querySelectorAll('.toolbar-btn[data-format]').forEach(btn => {
        btn.addEventListener('click', () => {
          const fmt = btn.getAttribute('data-format');
          if (fmt === 'h2') insertFormatting('\n## ', '\n');
          if (fmt === 'h3') insertFormatting('\n### ', '\n');
          if (fmt === 'h4') insertFormatting('\n#### ', '\n');
          if (fmt === 'bold') insertFormatting('**', '**');
          if (fmt === 'italic') insertFormatting('*', '*');
          if (fmt === 'underline') insertFormatting('<u>', '</u>');
          if (fmt === 'strike') insertFormatting('~~', '~~');
          if (fmt === 'ul') insertFormatting('\n- ', '\n');
          if (fmt === 'ol') insertFormatting('\n1. ', '\n');
          if (fmt === 'link') insertFormatting('[', '](https://branapi.com)');
          if (fmt === 'quote') insertFormatting('\n> ', '\n');
          if (fmt === 'code') insertFormatting('\n```sql\n', '\n```\n');
          if (fmt === 'table') insertFormatting('\n| Critério | Opção A | Opção B |\n|---|---|---|\n| Custo | Baixo | Alto |\n| Autonomia | Total | Dependente |\n');
          if (fmt === 'callout') insertFormatting('\n:::callout\n', '\n:::\n');
          if (fmt === 'hr') insertFormatting('\n\n---\n\n');
          if (fmt === 'carousel') insertFormatting('\n\n:::carrossel\n', '\n:::\n');
        });
      });

      // View Mode Switcher (Write vs Visual Mode)
      const btnModeWrite = document.getElementById('btnModeWrite');
      const btnModeVisual = document.getElementById('btnModeVisual');
      const editContent = document.getElementById('editContent');
      const editVisualPreview = document.getElementById('editVisualPreview');

      if (btnModeWrite && btnModeVisual && editContent && editVisualPreview) {
        btnModeWrite.addEventListener('click', () => {
          btnModeWrite.classList.add('active');
          btnModeVisual.classList.remove('active');
          editContent.style.display = 'block';
          editVisualPreview.style.display = 'none';
        });

        btnModeVisual.addEventListener('click', () => {
          btnModeVisual.classList.add('active');
          btnModeWrite.classList.remove('active');

          let contentRendered = markdownToHtml(editContent.value);
          // Render carousel at top of visual mode if media items exist
          if (mediaItems.length > 0) {
            const carouselPreviewHtml = generateCarouselHtml(mediaItems, 'previewCarousel');
            contentRendered = `<div style="margin-bottom:24px;">${carouselPreviewHtml}</div>` + contentRendered;
          }

          editVisualPreview.innerHTML = contentRendered || '<p style="color:var(--admin-muted);">Nenhum texto inserido ainda.</p>';
          editContent.style.display = 'none';
          editVisualPreview.style.display = 'block';

          // Initialize slider interaction in visual preview
          if (window.BranapiBlog && window.BranapiBlog.initCarousels) {
            window.BranapiBlog.initCarousels(editVisualPreview);
          }
        });
      }

      // Media Upload File Button
      const btnUploadMediaFile = document.getElementById('btnUploadMediaFile');
      const mediaFileInput = document.getElementById('mediaFileInput');

      if (btnUploadMediaFile && mediaFileInput) {
        btnUploadMediaFile.addEventListener('click', () => {
          mediaFileInput.click();
        });

        mediaFileInput.addEventListener('change', async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          btnUploadMediaFile.disabled = true;
          btnUploadMediaFile.textContent = 'Processando...';

          for (const file of files) {
            try {
              if (file.type.startsWith('image/')) {
                const compressedUrl = await compressImage(file);
                addMedia('image', compressedUrl, file.name.replace(/\.[^/.]+$/, ''));
              } else if (file.type.startsWith('video/')) {
                const videoDataUrl = await new Promise((res, rej) => {
                  const r = new FileReader();
                  r.onload = ev => res(ev.target.result);
                  r.onerror = rej;
                  r.readAsDataURL(file);
                });
                addMedia('video', videoDataUrl, file.name.replace(/\.[^/.]+$/, ''));
              }
            } catch (err) {
              console.warn('Falha no upload do arquivo:', file.name, err);
            }
          }

          mediaFileInput.value = '';
          btnUploadMediaFile.disabled = false;
          btnUploadMediaFile.innerHTML = '📁 Upload Imagens / Vídeos';
        });
      }

      // Media URL Drawer
      const btnToggleUrlMedia = document.getElementById('btnToggleUrlMedia');
      const mediaUrlDrawer = document.getElementById('mediaUrlDrawer');
      const btnCancelMediaUrl = document.getElementById('btnCancelMediaUrl');
      const btnAddMediaUrlConfirm = document.getElementById('btnAddMediaUrlConfirm');
      const mediaUrlType = document.getElementById('mediaUrlType');
      const mediaUrlInput = document.getElementById('mediaUrlInput');
      const mediaCaptionInput = document.getElementById('mediaCaptionInput');

      if (btnToggleUrlMedia && mediaUrlDrawer) {
        btnToggleUrlMedia.addEventListener('click', () => {
          const isOpen = mediaUrlDrawer.style.display === 'block';
          mediaUrlDrawer.style.display = isOpen ? 'none' : 'block';
          if (!isOpen && mediaUrlInput) mediaUrlInput.focus();
        });

        if (btnCancelMediaUrl) {
          btnCancelMediaUrl.addEventListener('click', () => {
            mediaUrlDrawer.style.display = 'none';
          });
        }

        if (btnAddMediaUrlConfirm) {
          btnAddMediaUrlConfirm.addEventListener('click', () => {
            const rawUrl = (mediaUrlInput?.value || '').trim();
            if (!rawUrl) return;

            let type = mediaUrlType?.value || 'image';
            let formattedUrl = rawUrl;

            if (type === 'video') {
              formattedUrl = formatVideoUrl(rawUrl);
            }

            addMedia(type, formattedUrl, (mediaCaptionInput?.value || '').trim());

            if (mediaUrlInput) mediaUrlInput.value = '';
            if (mediaCaptionInput) mediaCaptionInput.value = '';
            mediaUrlDrawer.style.display = 'none';
          });
        }
      }
    },

    loadPost(post) {
      currentPostId = post?.id || null;
      document.getElementById('editTitle').value = post?.title || '';
      document.getElementById('editSubtitle').value = post?.subtitle || '';
      document.getElementById('editSlug').value = post?.slug || '';
      document.getElementById('editCategory').value = post?.category_id || 'c1111111-1111-1111-1111-111111111111';
      document.getElementById('editAuthor').value = post?.author_name || 'Equipe de Arquitetura Branapi';
      document.getElementById('editExcerpt').value = post?.excerpt || '';
      document.getElementById('editContent').value = post?.content || post?.excerpt || '';
      document.getElementById('editKeyword').value = post?.primary_keyword || '';
      document.getElementById('editMetaTitle').value = post?.meta_title || post?.title || '';
      document.getElementById('editMetaDesc').value = post?.meta_description || post?.excerpt || '';
      document.getElementById('editStatus').value = post?.status || 'draft';

      // Load media items: either from post.media_gallery or parsed from metadata comment
      mediaItems = [];
      if (Array.isArray(post?.media_gallery)) {
        mediaItems = [...post.media_gallery];
      } else {
        const fullContent = (post?.content_html || '') + ' ' + (post?.content || '');
        const match = fullContent.match(/<!--\s*BRANAPI_GALLERY:\s*(\[.*?\])\s*-->/s);
        if (match && match[1]) {
          try {
            mediaItems = JSON.parse(match[1]);
          } catch (e) {}
        }
      }

      // If no gallery was found but post has cover_image_url, inject cover as first media
      if (mediaItems.length === 0 && post?.cover_image_url) {
        mediaItems.push({
          id: 'cover_' + Date.now(),
          type: 'image',
          url: post.cover_image_url,
          caption: post.cover_image_alt || post.title || 'Imagem de Capa',
          isCover: true
        });
      }

      renderMediaGallery();
      updateSeoAudit();
    },

    getFormData() {
      const title = (document.getElementById('editTitle')?.value || '').trim();
      const slug = (document.getElementById('editSlug')?.value || '').trim() || slugify(title);
      const metaTitle = (document.getElementById('editMetaTitle')?.value || '').trim() || title;
      const excerpt = (document.getElementById('editExcerpt')?.value || '').trim();
      const metaDesc = (document.getElementById('editMetaDesc')?.value || '').trim() || excerpt;
      const rawContent = (document.getElementById('editContent')?.value || '').trim();

      const words = countWords(rawContent);
      const readingMin = Math.max(1, Math.ceil(words / 190));

      const coverItem = mediaItems.find(m => m.isCover) || mediaItems[0] || null;
      const coverImageUrl = coverItem ? coverItem.url : '';
      const coverImageAlt = coverItem ? (coverItem.caption || title) : '';

      // Generate HTML from markdown
      let renderedHtml = markdownToHtml(rawContent);

      // Embed Carousel in HTML if media items exist
      let carouselHtml = '';
      if (mediaItems.length > 0) {
        carouselHtml = generateCarouselHtml(mediaItems, `carousel_${slug}`);
        if (renderedHtml.includes(':::carrossel:::') || renderedHtml.includes('<p>:::carrossel:::</p>')) {
          renderedHtml = renderedHtml.replace(/(?:<p>)?:::carrossel:::(?:<\/p>)?/g, carouselHtml);
        } else {
          // Prepend at the top of content
          renderedHtml = `${carouselHtml}\n\n${renderedHtml}`;
        }
      }

      // Embed gallery metadata comment for lossless re-hydration
      const galleryMetaComment = `\n<!-- BRANAPI_GALLERY: ${JSON.stringify(mediaItems)} -->\n`;
      renderedHtml += galleryMetaComment;

      return {
        id: currentPostId,
        title,
        subtitle: (document.getElementById('editSubtitle')?.value || '').trim(),
        slug,
        category_id: document.getElementById('editCategory')?.value,
        category_name: document.getElementById('editCategory')?.selectedOptions[0]?.text || 'Geral',
        author_name: document.getElementById('editAuthor')?.value || 'Engenharia Branapi',
        excerpt,
        content: rawContent + galleryMetaComment,
        content_html: renderedHtml,
        cover_image_url: coverImageUrl,
        cover_image_alt: coverImageAlt,
        og_image_url: coverImageUrl,
        media_gallery: mediaItems,
        primary_keyword: (document.getElementById('editKeyword')?.value || '').trim(),
        meta_title: metaTitle,
        meta_description: metaDesc,
        canonical_url: `https://branapi.com/blog/${slug}/`,
        reading_time_minutes: readingMin,
        status: document.getElementById('editStatus')?.value || 'draft',
        published_at: new Date().toISOString()
      };
    },

    getMediaItems() {
      return mediaItems;
    }
  };
})();
