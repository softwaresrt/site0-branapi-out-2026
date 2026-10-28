/**
 * BRANAPI BLOG EDITORIAL CONTROLLER & INTERACTIONS
 * Fast, lightweight, zero dependencies, accessible.
 */

(function () {
  'use strict';

  // 1. Live Topic Filtering & Client Search
  const topicButtons = document.querySelectorAll('.blog-topic-btn');
  const searchInput = document.getElementById('blogSearchInput');
  const articleCards = document.querySelectorAll('.article-card');
  const countLabel = document.getElementById('articlesCount');
  const emptyState = document.getElementById('emptyState');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterArticles() {
    let visibleCount = 0;

    articleCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const cardExcerpt = (card.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch =
        searchQuery === '' || cardTitle.includes(searchQuery) || cardExcerpt.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countLabel) {
      countLabel.textContent = `${visibleCount} ${visibleCount === 1 ? 'artigo' : 'artigos'}`;
    }

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  topicButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      topicButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-topic') || 'all';
      filterArticles();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterArticles();
    });

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
      }
    });
  }

  // 2. Table of Contents ScrollSpy (for article reading view)
  const tocLinks = document.querySelectorAll('.toc-list a');
  const contentHeadings = document.querySelectorAll('.article-content h2[id]');

  if (tocLinks.length > 0 && contentHeadings.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -65% 0px',
      threshold: 0
    };

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    contentHeadings.forEach((h2) => headingObserver.observe(h2));
  }

  // 3. Code Block Copy to Clipboard
  document.querySelectorAll('.code-copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const codeBlock = btn.closest('.article-code-block')?.querySelector('pre');
      if (!codeBlock) return;

      try {
        await navigator.clipboard.writeText(codeBlock.textContent || '');
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';
        btn.style.color = 'var(--blog-lime)';
        btn.style.borderColor = 'var(--blog-lime)';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    });
  });

  // 4. Social Sharing & Link Copy
  const copyShareBtn = document.getElementById('copyShareBtn');
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalText = copyShareBtn.textContent;
        copyShareBtn.textContent = 'Link copiado!';
        setTimeout(() => {
          copyShareBtn.textContent = originalText;
        }, 2500);
      } catch (err) {
        console.error('Erro ao copiar URL:', err);
      }
    });
  }

  // 5. Reading Progress Indicator
  const progressBar = document.getElementById('progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
      }
    }, { passive: true });
  }
})();
