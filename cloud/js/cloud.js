/* BRANAPI CLOUD — núcleo: sessão, API, helpers e casca do console. Sem dependências. */
(function () {
  'use strict';
  const KEY = 'branapi_cloud_session';
  const C = (window.BRANAPI_CONFIG && window.BRANAPI_CONFIG.supabase) || {};
  const URL_ = (C.url || '').replace(/\/+$/, '');
  const ANON = C.anonKey || '';

  const ICON = {
    server: '<path d="M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
    power: '<path d="M12 3v9M6.3 6.8a8 8 0 1011.4 0"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 6M20 4v7h-7"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17h.01"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chat: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/>',
  };
  const icon = (n) => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + '</svg>';

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- sessão ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} adminCache = null; }
  function pack(d) {
    return {
      access_token: d.access_token, refresh_token: d.refresh_token,
      expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
      user: { id: d.user && d.user.id, email: d.user && d.user.email, meta: (d.user && d.user.user_metadata) || {} },
    };
  }

  const MSG = [
    [/invalid login credentials/i, 'E-mail ou senha incorretos.'],
    [/email not confirmed/i, 'Confirme seu e-mail pelo link que enviamos antes de entrar.'],
    [/already registered|already been registered|user_already_exists/i, 'Este e-mail já tem cadastro. Entre ou recupere a senha.'],
    [/password.*(short|least|weak)|weak_password/i, 'Use uma senha mais forte (mínimo de 10 caracteres).'],
    [/rate limit|too many|over_email_send_rate_limit|429/i, 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'],
    [/invalid.*email|email.*invalid/i, 'Informe um e-mail válido.'],
    [/signups? (not allowed|disabled)/i, 'Cadastros estão temporariamente desativados.'],
    [/same password|different from the old/i, 'A nova senha precisa ser diferente da atual.'],
    [/jwt|expired|session/i, 'Sua sessão expirou. Entre novamente.'],
  ];
  function friendly(raw) {
    const t = String(raw || '');
    for (const [re, m] of MSG) if (re.test(t)) return m;
    return 'Não foi possível concluir. Tente novamente.';
  }

  async function authReq(path, body, method, token) {
    let res;
    try {
      res = await fetch(URL_ + '/auth/v1' + path, {
        method: method || 'POST',
        headers: { apikey: ANON, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token || ANON) },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) { throw new Error('Sem conexão. Verifique sua internet e tente de novo.'); }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(friendly(data.msg || data.error_description || data.message || data.error_code || res.status));
    return data;
  }

  let refreshing = null;
  async function session() {
    const s = load();
    if (!s) return null;
    if (s.expires_at - 60 > Date.now() / 1000) return s;
    if (!refreshing) {
      refreshing = authReq('/token?grant_type=refresh_token', { refresh_token: s.refresh_token })
        .then((d) => { const n = pack(d); save(n); return n; })
        .catch(() => { clear(); return null; })
        .finally(() => { refreshing = null; });
    }
    return refreshing;
  }

  const Auth = {
    async signIn(email, password) {
      const d = await authReq('/token?grant_type=password', { email: email.trim().toLowerCase(), password });
      const s = pack(d); save(s); return s;
    },
    async signUp(email, password, meta) {
      const d = await authReq('/signup', { email: email.trim().toLowerCase(), password, data: meta || {} });
      if (d.access_token) { const s = pack(d); save(s); return { session: s }; }
      return { needsConfirmation: true };
    },
    async signOut() {
      const s = load();
      clear();
      if (s) { try { await authReq('/logout', null, 'POST', s.access_token); } catch (e) {} }
    },
    recover(email) {
      const back = encodeURIComponent(location.origin + '/cloud/login/');
      return authReq('/recover?redirect_to=' + back, { email: email.trim().toLowerCase() });
    },
    updatePassword(token, password) { return authReq('/user', { password }, 'PUT', token); },
  };

  /* ---------- dados ---------- */
  async function rest(path, opts) {
    const s = await session();
    if (!s) { goLogin(); throw new Error('Sessão expirada.'); }
    const res = await fetch(URL_ + '/rest/v1/' + path, {
      method: (opts && opts.method) || 'GET',
      headers: Object.assign({ apikey: ANON, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' }, (opts && opts.headers) || {}),
      body: opts && opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (res.status === 401) { clear(); goLogin(); throw new Error('Sessão expirada.'); }
    if (!res.ok) throw new Error('Não foi possível carregar os dados.');
    const t = await res.text();
    return t ? JSON.parse(t) : null;
  }

  async function invoke(fn, body) {
    const s = await session();
    if (!s) { goLogin(); throw new Error('Sessão expirada.'); }
    let res;
    try {
      res = await fetch(URL_ + '/functions/v1/' + fn, {
        method: 'POST',
        headers: { apikey: ANON, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) { throw new Error('Sem conexão. Tente novamente.'); }
    const d = await res.json().catch(() => ({}));
    if (res.status === 401) { clear(); goLogin(); }
    if (!res.ok || d.ok === false) throw new Error(d.error || 'Não foi possível concluir.');
    return d;
  }

  let adminCache = null;
  async function isAdmin() {
    if (adminCache !== null) return adminCache;
    try { adminCache = (await rest('rpc/is_cloud_admin', { method: 'POST', body: {} })) === true; } catch (e) { adminCache = false; }
    return adminCache;
  }

  function safeNext(n) { return typeof n === 'string' && /^\/cloud\/[A-Za-z0-9\/_\-?=&.%]*$/.test(n) && !n.includes('//') ? n : '/cloud/'; }
  function goLogin() {
    const next = location.pathname + location.search;
    location.replace('/cloud/login/?next=' + encodeURIComponent(next));
  }
  async function requireAuth() {
    const s = await session();
    if (!s) { goLogin(); return new Promise(() => {}); }
    return s;
  }

  /* ---------- formatação ---------- */
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const fmtDateTime = (d) => d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  const daysLeft = (d) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  function fmtUptime(s) {
    if (s == null) return '—';
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    return d > 0 ? d + ' d ' + h + ' h' : h > 0 ? h + ' h ' + m + ' min' : m + ' min';
  }
  const nf = (n, d) => n == null ? '—' : Number(n).toLocaleString('pt-BR', { maximumFractionDigits: d == null ? 1 : d });

  /** Situação exibida ao cliente (considera o prazo). */
  function situation(s) {
    const left = daysLeft(s.expires_at);
    if (s.status === 'provisioning') return { cls: 'b-info', label: 'Em preparação', key: 'provisioning' };
    if (s.status === 'suspended') return { cls: 'b-bad', label: 'Suspenso', key: 'suspended' };
    if (s.status === 'expired' || left < 0) return { cls: 'b-bad', label: 'Vencido', key: 'expired' };
    if (left <= 7) return { cls: 'b-warn', label: 'Vence em ' + Math.max(left, 0) + (left === 1 ? ' dia' : ' dias'), key: 'soon' };
    return { cls: 'b-ok', label: 'Ativo', key: 'active' };
  }
  const badge = (s) => { const x = situation(s); return '<span class="badge ' + x.cls + '">' + esc(x.label) + '</span>'; };

  function whatsapp(msg) {
    const n = (window.BRANAPI_CONFIG && window.BRANAPI_CONFIG.whatsappNumber) || '';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(msg);
  }

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Copiado'); }
    catch (e) { const i = document.createElement('input'); i.value = text; document.body.appendChild(i); i.select(); try { document.execCommand('copy'); toast('Copiado'); } catch (_) {} i.remove(); }
  }

  /* ---------- casca do console ---------- */
  async function mountShell(opts) {
    const s = await requireAuth();
    const admin = await isAdmin();
    const initial = (s.user.meta.full_name || s.user.email || '?').trim().charAt(0).toUpperCase();
    const name = s.user.meta.full_name || s.user.email;
    document.body.insertAdjacentHTML('afterbegin',
      '<header class="top">' +
        '<button class="menu-btn" id="navBtn" aria-label="Abrir menu" aria-expanded="false">' + icon('menu') + '</button>' +
        '<a href="/cloud/" aria-label="Branapi Cloud"><img src="/assets/branapi-wordmark.png" alt="Branapi" width="108" height="30"></a>' +
        '<strong style="font-size:13px;color:var(--muted)">Cloud</strong><span class="sp"></span>' +
        '<div class="acct"><button id="acctBtn" aria-haspopup="true" aria-expanded="false"><span class="t">' + esc(name) + '</span><span class="avatar">' + esc(initial) + '</span></button>' +
        '<div class="menu" id="acctMenu" hidden><div class="who">' + esc(s.user.email) + '</div>' +
        '<a href="/cloud/conta/">Minha conta</a>' +
        '<a href="/cloud/suporte/">Suporte / Chamados</a>' +
        (admin ? '<a href="/cloud/admin/">Administração Cloud</a><a href="/admin/">Painel Blog</a>' : '') +
        '<button id="logout">Sair</button></div></div>' +
      '</header>' +
      '<div class="shell"><nav class="side" aria-label="Principal">' +
        '<a href="/cloud/"' + (opts.active === 'servers' ? ' aria-current="page"' : '') + '>' + icon('server') + 'Servidores</a>' +
        '<a href="/cloud/conta/"' + (opts.active === 'account' ? ' aria-current="page"' : '') + '>' + icon('user') + 'Minha conta</a>' +
        '<a href="/cloud/suporte/"' + (opts.active === 'support' ? ' aria-current="page"' : '') + '>' + icon('chat') + 'Suporte / Chamados</a>' +
        (admin ? '<div class="grp">Equipe</div><a href="/cloud/admin/"' + (opts.active === 'admin' ? ' aria-current="page"' : '') + '>' + icon('shield') + 'Administração Cloud</a><a href="/admin/">' + icon('menu') + 'Painel Blog</a>' : '') +
      '</nav><main class="page" id="main"></main></div><div class="scrim" id="scrim"></div>');

    const btn = $('#acctBtn'), menu = $('#acctMenu');
    btn.addEventListener('click', (e) => { e.stopPropagation(); const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { menu.hidden = true; document.body.classList.remove('nav-open'); } });
    $('#navBtn').addEventListener('click', () => { const o = document.body.classList.toggle('nav-open'); $('#navBtn').setAttribute('aria-expanded', String(o)); });
    $('#scrim').addEventListener('click', () => document.body.classList.remove('nav-open'));
    $('#logout').addEventListener('click', async () => { await Auth.signOut(); location.replace('/cloud/login/'); });
    return { session: s, admin, main: $('#main') };
  }

  window.Cloud = { Auth, session, rest, invoke, isAdmin, requireAuth, mountShell, safeNext, esc, $, $$, icon, fmtDate, fmtDateTime, fmtUptime, daysLeft, nf, situation, badge, whatsapp, toast, copy, friendly };
})();
