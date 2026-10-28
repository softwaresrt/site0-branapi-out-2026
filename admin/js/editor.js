/**
 * BRANAPI ADMIN — ARTICLE EDITOR & REAL-TIME SEO AUDIT ENGINE
 * Real-time checklist, slug sanitizer, character counters, live preview.
 */

const BranapiEditor = (function () {
  'use strict';

  let currentPostId = null;

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
        el.querySelector('span.status-icon').textContent = passed ? '✓' : '✗';
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

      // Toolbar bindings
      document.querySelectorAll('.toolbar-btn[data-format]').forEach(btn => {
        btn.addEventListener('click', () => {
          const fmt = btn.getAttribute('data-format');
          if (fmt === 'h2') insertFormatting('\n## ', '\n');
          if (fmt === 'h3') insertFormatting('\n### ', '\n');
          if (fmt === 'bold') insertFormatting('**', '**');
          if (fmt === 'italic') insertFormatting('*', '*');
          if (fmt === 'quote') insertFormatting('\n> ', '\n');
          if (fmt === 'code') insertFormatting('\n```sql\n', '\n```\n');
          if (fmt === 'callout') insertFormatting('\n:::callout\n', '\n:::\n');
          if (fmt === 'table') insertFormatting('\n| Critério | Opção A | Opção B |\n|---|---|---|\n| Custo | Baixo | Alto |\n');
        });
      });
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

      updateSeoAudit();
    },

    getFormData() {
      const title = (document.getElementById('editTitle')?.value || '').trim();
      const slug = (document.getElementById('editSlug')?.value || '').trim() || slugify(title);
      const metaTitle = (document.getElementById('editMetaTitle')?.value || '').trim() || title;
      const excerpt = (document.getElementById('editExcerpt')?.value || '').trim();
      const metaDesc = (document.getElementById('editMetaDesc')?.value || '').trim() || excerpt;
      const content = (document.getElementById('editContent')?.value || '').trim();

      const words = countWords(content);
      const readingMin = Math.max(1, Math.ceil(words / 190));

      return {
        id: currentPostId,
        title,
        subtitle: (document.getElementById('editSubtitle')?.value || '').trim(),
        slug,
        category_id: document.getElementById('editCategory')?.value,
        category_name: document.getElementById('editCategory')?.selectedOptions[0]?.text || 'Geral',
        author_name: document.getElementById('editAuthor')?.value || 'Engenharia Branapi',
        excerpt,
        content,
        primary_keyword: (document.getElementById('editKeyword')?.value || '').trim(),
        meta_title: metaTitle,
        meta_description: metaDesc,
        canonical_url: `https://branapi.com/blog/${slug}/`,
        reading_time_minutes: readingMin,
        status: document.getElementById('editStatus')?.value || 'draft',
        published_at: new Date().toISOString()
      };
    }
  };
})();
