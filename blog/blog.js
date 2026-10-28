/**
 * BRANAPI BLOG EDITORIAL CONTROLLER & INTERACTIONS
 * Zero dependencies, ultra-fast, accessible.
 * Handles dynamic live articles syncing with Supabase / Admin,
 * interactive media carousels (images/videos), category filtering and search.
 */

(function () {
  'use strict';

  // 1. CAROUSEL ENGINE (Interactive multi-image & multi-video carousel)
  function initCarousels(root = document) {
    const carousels = root.querySelectorAll('.article-carousel');

    carousels.forEach((carousel) => {
      // Prevent multiple bindings
      if (carousel.dataset.initialized === 'true') return;
      carousel.dataset.initialized = 'true';

      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-dot');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      const curSlideLabel = carousel.querySelector('.cur-slide');
      const totalSlides = slides.length;

      if (totalSlides <= 1) return;

      let currentIndex = 0;

      function goToSlide(index) {
        if (index < 0) {
          currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
          currentIndex = 0;
        } else {
          currentIndex = index;
        }

        // Pause any currently playing video on leaving slide
        slides.forEach((slide, idx) => {
          if (idx !== currentIndex) {
            slide.classList.remove('active');
            const video = slide.querySelector('video');
            if (video && !video.paused) video.pause();
            const iframe = slide.querySelector('iframe');
            if (iframe) {
              // Pause YouTube / Vimeo iframe by reloading source if needed
              const src = iframe.src;
              if (src.includes('autoplay=1')) {
                iframe.src = src.replace('autoplay=1', 'autoplay=0');
              }
            }
          }
        });

        slides[currentIndex].classList.add('active');

        // Update Dots
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });

        // Update Counter
        if (curSlideLabel) {
          curSlideLabel.textContent = currentIndex + 1;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(currentIndex - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(currentIndex + 1);
        });
      }

      dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          const targetIndex = parseInt(dot.getAttribute('data-goto'), 10);
          if (!isNaN(targetIndex)) goToSlide(targetIndex);
        });
      });

      // Touch / Swipe Navigation
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });

      function handleSwipe() {
        const threshold = 40;
        if (touchEndX < touchStartX - threshold) {
          goToSlide(currentIndex + 1); // Swipe left -> next
        }
        if (touchEndX > touchStartX + threshold) {
          goToSlide(currentIndex - 1); // Swipe right -> prev
        }
      }
    });
  }

  // 2. DYNAMIC LIVE ARTICLES SYNCHRONIZATION WITH SUPABASE / ADMIN
  async function syncArticlesFromAdmin() {
    const articlesGrid = document.getElementById('articlesGrid');
    const featuredSection = document.querySelector('.blog-featured-card');
    const countLabel = document.getElementById('articlesCount');
    if (!articlesGrid) return; // Not on blog index page

    const config = window.BRANAPI_CONFIG?.supabase || {
      url: 'https://pvpksepdbvkvzwsfqhbu.supabase.co',
      anonKey: 'sb_publishable_O7mBemDDfQzE3aL2_E3DsA_Saj6RPDB'
    };

    let posts = [];

    // Attempt Supabase Fetch
    try {
      const res = await fetch(`${config.url}/rest/v1/blog_posts?status=eq.published&order=published_at.desc`, {
        headers: {
          'apikey': config.anonKey,
          'Authorization': `Bearer ${config.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          posts = data;
        }
      }
    } catch (e) {
      console.warn('Erro ao conectar ao Supabase, tentando cache local:', e);
    }

    // Fallback to local admin storage if Supabase returned empty/offline
    if (posts.length === 0) {
      try {
        const local = localStorage.getItem('branapi_posts');
        if (local) {
          const parsed = JSON.parse(local);
          posts = parsed.filter(p => p.status === 'published');
        }
      } catch (e) {}
    }

    // If still no registered articles from admin, keep existing static fallback
    if (!posts || posts.length === 0) return;

    // Render ONLY registered articles from admin/Supabase
    if (countLabel) {
      countLabel.textContent = `${posts.length} ${posts.length === 1 ? 'artigo' : 'artigos'}`;
    }

    // Category slug mapper helper
    const categorySlugs = {
      'c1111111-1111-1111-1111-111111111111': 'sob-medida',
      'c2222222-2222-2222-2222-222222222222': 'custos',
      'c3333333-3333-3333-3333-333333333333': 'apps',
      'c4444444-4444-4444-4444-444444444444': 'arquitetura'
    };

    const firstPost = posts[0];

    // Update Featured Card with the official 1st post
    if (featuredSection && firstPost) {
      const featuredImg = featuredSection.querySelector('.featured-media img');
      const featuredTitleLink = featuredSection.querySelector('h2 a');
      const featuredExcerpt = featuredSection.querySelector('p');
      const featuredCta = featuredSection.querySelector('.featured-cta-link');
      const featuredCategory = featuredSection.querySelector('.featured-meta span:nth-child(3)');
      const featuredReadTime = featuredSection.querySelector('.featured-meta span:nth-child(5)');

      const postCover = firstPost.cover_image_url || '/assets/blog/software-sob-medida-cover.jpg';
      const postUrl = `/blog/${firstPost.slug}/`;

      if (featuredImg) {
        featuredImg.src = postCover;
        featuredImg.alt = firstPost.cover_image_alt || firstPost.title;
      }
      if (featuredTitleLink) {
        featuredTitleLink.textContent = firstPost.title;
        featuredTitleLink.href = postUrl;
      }
      if (featuredExcerpt) {
        featuredExcerpt.textContent = firstPost.subtitle || firstPost.excerpt;
      }
      if (featuredCta) {
        featuredCta.href = postUrl;
      }
      if (featuredCategory) {
        featuredCategory.textContent = (firstPost.category_name || 'Sistemas Sob Medida').toUpperCase();
      }
      if (featuredReadTime) {
        featuredReadTime.textContent = `${firstPost.reading_time_minutes || 7} MIN DE LEITURA`;
      }
    }

    // Render remaining articles in the grid (or all if more than 1)
    const gridPosts = posts.length > 1 ? posts.slice(1) : [];

    articlesGrid.innerHTML = '';

    if (gridPosts.length === 0) {
      // If only 1 article exists (like currently), render it also in the grid for clarity
      const p = firstPost;
      const catSlug = categorySlugs[p.category_id] || 'sob-medida';
      const cover = p.cover_image_url || '/assets/blog/software-sob-medida-cover.jpg';

      articlesGrid.innerHTML = `
        <article class="article-card" data-category="${catSlug}">
          <div>
            <div class="article-card-thumb">
              <img src="${cover}" alt="${p.cover_image_alt || p.title}" loading="lazy" />
            </div>
            <div class="article-card-meta">
              <span class="category">${(p.category_name || 'Sistemas Sob Medida').toUpperCase()}</span>
              <span>${p.reading_time_minutes || 7} MIN DE LEITURA</span>
            </div>
            <h3>
              <a href="/blog/${p.slug}/">${p.title}</a>
            </h3>
            <p>${p.excerpt}</p>
          </div>
          <div class="article-card-footer">
            <span class="author-name">${p.author_name || 'Engenharia Branapi'}</span>
            <a href="/blog/${p.slug}/" class="read-link">
              Consultar análise <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      `;
    } else {
      gridPosts.forEach((p) => {
        const catSlug = categorySlugs[p.category_id] || 'sob-medida';
        const cover = p.cover_image_url || '/assets/blog/software-sob-medida-cover.jpg';

        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-category', catSlug);
        card.innerHTML = `
          <div>
            <div class="article-card-thumb">
              <img src="${cover}" alt="${p.cover_image_alt || p.title}" loading="lazy" />
            </div>
            <div class="article-card-meta">
              <span class="category">${(p.category_name || 'Engenharia').toUpperCase()}</span>
              <span>${p.reading_time_minutes || 6} MIN DE LEITURA</span>
            </div>
            <h3>
              <a href="/blog/${p.slug}/">${p.title}</a>
            </h3>
            <p>${p.excerpt}</p>
          </div>
          <div class="article-card-footer">
            <span class="author-name">${p.author_name || 'Engenharia Branapi'}</span>
            <a href="/blog/${p.slug}/" class="read-link">
              Consultar análise <span aria-hidden="true">↗</span>
            </a>
          </div>
        `;
        articlesGrid.appendChild(card);
      });
    }

    // Re-bind topic filtering and search on the newly generated cards
    setupFilteringAndSearch();
  }

  // 3. LIVE TOPIC FILTERING & CLIENT SEARCH
  function setupFilteringAndSearch() {
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
      btn.onclick = () => {
        topicButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-topic') || 'all';
        filterArticles();
      };
    });

    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterArticles();
      };

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
  }

  // 4. CODE BLOCK COPY
  function setupCodeCopy() {
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
  }

  // 5. SOCIAL SHARING & LINK COPY
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

  // 6. READING PROGRESS INDICATOR
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

  // Public exports
  window.BranapiBlog = {
    initCarousels,
    syncArticlesFromAdmin
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCarousels();
      syncArticlesFromAdmin();
      setupCodeCopy();
    });
  } else {
    initCarousels();
    syncArticlesFromAdmin();
    setupCodeCopy();
  }
})();
