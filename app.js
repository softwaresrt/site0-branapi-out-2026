/* Branapi / Interactive frontend. Zero dependencies; deploy as static site. */
(() => {
  'use strict';
  const cfg = window.BRANAPI_CONFIG || {};
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contactMessage = 'Olá, Branapi! Vim pelo novo site e quero conversar sobre um projeto.';
  const whatsUrl = (message = contactMessage) => {
    const phone = String(cfg.whatsappNumber || '').replace(/\D/g, '');
    return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : (cfg.currentContactPage || 'https://www.branapi.com/#contato');
  };
  const toast = $('#toast');
  let toastTimeout;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3600);
  }
  function safeSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {} }
  function safeRead(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } }
  
  // Loader appears only on the first view in the session.
  const boot = $('#bootScreen');
  let visited = false;
  try { visited = sessionStorage.getItem('branapi.boot') === '1'; sessionStorage.setItem('branapi.boot', '1'); } catch (_) {}
  if (boot) {
    if (visited || prefersReducedMotion.matches) boot.classList.add('done');
    else window.setTimeout(() => boot.classList.add('done'), 1370);
  }

  // Main nav and progress.
  const header = $('#siteHeader');
  const progress = $('#progress');
  let scrollY = window.scrollY;
  function updateScroll() {
    scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 42);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;
    }
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  const menuToggle = $('#menuToggle');
  const mobileMenu = $('#mobileMenu');
  function toggleMobile(open) {
    mobileMenu?.classList.toggle('open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    menuToggle?.classList.toggle('active', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  }
  menuToggle?.addEventListener('click', () => toggleMobile(!mobileMenu?.classList.contains('open')));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => toggleMobile(false)));

  // Menu de pesquisa removido nesta versão: navegação direta é mais clara.
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggleMobile(false);
  });

  // Fade elements into view (no scroll-trapping, mobile friendly).
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -55px 0px', threshold: 0.06 });
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('in-view'));

  // Spotlight cursor, throttled through rAF.
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches && !prefersReducedMotion.matches) {
    let sx = -1000, sy = -1000, pending = false;
    document.addEventListener('pointermove', (e) => {
      sx = e.clientX; sy = e.clientY;
      if (!pending) { pending = true; requestAnimationFrame(() => { glow.style.transform = `translate3d(${sx}px,${sy}px,0)`; glow.style.opacity = '1'; pending = false; }); }
    }, { passive: true });
    document.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }

  // A mathematical 3D scene in 2D canvas: real depth, perspective, dragging and pulsing nodes.
  // Uses no external CDN, shader or fake background image, so it runs even offline.
  function initSystemScene() {
    const canvas = $('#networkCanvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const host = canvas.parentElement;
    let width = 0, height = 0, dpr = 1;
    let dragging = false, dragX = 0, dragY = 0, rotY = 0.2, rotX = -0.17, targetY = 0.2, targetX = -0.17;
    let impulse = 0, visible = true, running = true, animationScheduled = false;
    const isSmall = () => window.innerWidth < 700;
    const count = isSmall() ? 92 : 154;
    const nodes = [];
    const edges = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const v = 1 - (i / (count - 1)) * 2;
      const circle = Math.sqrt(1 - v * v);
      const theta = golden * i;
      const r = 0.61 + 0.28 * Math.sin(i * 17.17) ** 2;
      nodes.push({ x: Math.cos(theta) * circle * r, y: v * r, z: Math.sin(theta) * circle * r, bright: i % 13 === 0, phase: i * 0.71 });
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      let near = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const o = nodes[j], distance = (n.x-o.x)**2+(n.y-o.y)**2+(n.z-o.z)**2;
        near.push({j,distance});
      }
      near.sort((a,b)=>a.distance-b.distance);
      for (const {j,distance} of near.slice(0,3)) { if (j > i && distance < .17) edges.push([i,j]); }
    }
    function resize() {
      const rect = host.getBoundingClientRect();
      width = Math.max(160, rect.width); height = Math.max(160, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    function project(n, yaw, pitch, t) {
      let x=n.x, y=n.y, z=n.z;
      const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
      const x1=x*cy-z*sy, z1=x*sy+z*cy, y1=y*cx-z1*sx, z2=y*sx+z1*cx;
      const wobble=1+.012*Math.sin(t*.8+n.phase);
      const p=2.9/(2.9-z2*.57);
      const scale=Math.min(width,height)*.445*p;
      return {x:width*.5+x1*scale*wobble,y:height*.5+y1*scale*wobble,z:z2,p};
    }
    function scheduleScene() {
      if (animationScheduled || !visible || document.hidden || prefersReducedMotion.matches) return;
      animationScheduled = true;
      requestAnimationFrame(time => { animationScheduled = false; draw(time); });
    }
    function draw(now) {
      if (!running) return;
      const seconds=now*.001;
      if (!dragging && !prefersReducedMotion.matches) targetY += .0018;
      rotY += (targetY-rotY)*.055;
      rotX += (targetX-rotX)*.055;
      impulse *= .968;
      ctx.clearRect(0,0,width,height);
      const pnodes=nodes.map(n=>project(n,rotY,rotX,seconds));
      const scale = Math.min(width,height);
      // rings and core.
      ctx.save();
      ctx.translate(width/2,height/2);
      ctx.rotate(rotY*.23);
      ctx.strokeStyle='rgba(197,255,65,.07)';ctx.lineWidth=1;
      for (const factor of [0.23,0.35]) {ctx.beginPath();ctx.ellipse(0,0,scale*factor,scale*factor*.35,.6,0,Math.PI*2);ctx.stroke();}
      const glowR=scale*.30;
      const coreGrad=ctx.createRadialGradient(0,0,0,0,0,glowR);
      coreGrad.addColorStop(0,`rgba(197,255,65,${.26+impulse*.2})`);
      coreGrad.addColorStop(.22,'rgba(136,210,36,.08)');coreGrad.addColorStop(1,'rgba(136,210,36,0)');
      ctx.fillStyle=coreGrad;ctx.beginPath();ctx.arc(0,0,glowR,0,Math.PI*2);ctx.fill();
      ctx.restore();
      const pulsePosition=(seconds*.22)%1;
      for(let k=0;k<edges.length;k++){
        const [a,b]=edges[k],p=pnodes[a],q=pnodes[b];
        const near=(p.z+q.z)/2;
        ctx.lineWidth=near>0?1.03:.7;
        ctx.strokeStyle=`rgba(183,255,117,${Math.max(.04,Math.min(.25,.14+near*.10))})`;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
        if(k%13===0){const t=(pulsePosition+k*.037)%1,x=p.x+(q.x-p.x)*t,y=p.y+(q.y-p.y)*t;ctx.fillStyle=`rgba(209,255,147,${Math.max(.4,.7+near*.17)})`;ctx.beginPath();ctx.arc(x,y,1.2+(impulse*1.3),0,Math.PI*2);ctx.fill();}
      }
      pnodes.forEach((p,i)=>{
        const n=nodes[i],r=(n.bright?2.7:1.5)*p.p;
        const light=Math.max(.3,Math.min(.95,.57+p.z*.25));
        ctx.fillStyle=n.bright?`rgba(207,255,132,${light})`:`rgba(197,255,90,${light*.85})`;
        ctx.beginPath();ctx.arc(p.x,p.y,r+(n.bright&&impulse?impulse*.9:0),0,Math.PI*2);ctx.fill();
        if(n.bright && i%3===0) {ctx.strokeStyle='rgba(197,255,65,.12)';ctx.beginPath();ctx.arc(p.x,p.y,r*3,0,Math.PI*2);ctx.stroke();}
      });
      ctx.strokeStyle='rgba(197,255,65,.45)';ctx.lineWidth=1;
      const inner=scale*(.17+impulse*.04);ctx.beginPath();ctx.arc(width/2,height/2,inner,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle='#c5ff41';ctx.beginPath();ctx.arc(width/2,height/2,4+impulse*4,0,Math.PI*2);ctx.fill();
      scheduleScene();
    }
    const pointerXY = e=>({x:e.clientX,y:e.clientY});
    canvas.addEventListener('pointerdown',e=>{dragging=true;const p=pointerXY(e);dragX=p.x;dragY=p.y;canvas.setPointerCapture?.(e.pointerId)});
    canvas.addEventListener('pointermove',e=>{if(!dragging)return;const p=pointerXY(e);targetY+=(p.x-dragX)*.006;targetX=Math.max(-1.3,Math.min(1.3,targetX+(p.y-dragY)*.005));dragX=p.x;dragY=p.y});
    canvas.addEventListener('pointerup',e=>{if(dragging){dragging=false;impulse=1.25}canvas.releasePointerCapture?.(e.pointerId)});
    canvas.addEventListener('pointercancel',()=>{dragging=false});
    canvas.addEventListener('click',()=>{impulse=1.3;if(prefersReducedMotion.matches)draw(performance.now())});
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries=>{ visible=entries[0].isIntersecting; if(visible) scheduleScene(); },{threshold:.01}).observe(host);
    }
    document.addEventListener('visibilitychange', () => { if(!document.hidden) scheduleScene(); });
    if (!prefersReducedMotion.matches) scheduleScene();
    else draw(0);
  }
  initSystemScene();

  // Customer brief builder, persists locally and exports as text (no fake quote).
  const fallback = { type:'Software sob medida', platforms:['Web / navegador'], features:[], stage:'Tenho uma ideia', notes:'' };
  const recovered = safeRead('branapi.builder');
  const state = { ...fallback, ...(recovered && typeof recovered==='object' ? recovered : {}) };
  if (!Array.isArray(state.platforms)) state.platforms=fallback.platforms;
  if (!Array.isArray(state.features)) state.features=[];
  let currentStep = 0;
  const fields = ['type','platforms','features','stage'];
  const steps = $$('.builder-step');
  function renderBuilder() {
    steps.forEach((step,i)=>step.classList.toggle('hidden',i!==currentStep));
    $$('#stepIndicators i').forEach((el,i)=>{el.classList.toggle('active',i===currentStep);el.classList.toggle('completed',i<currentStep)});
    $('#builderCount').textContent = `ETAPA 0${currentStep+1} / 04`;
    $('#builderBack').disabled = currentStep===0;
    const next=$('#builderNext');
    next.innerHTML = currentStep===3 ? 'Enviar meu briefing <span>↗</span>' : 'Próxima etapa <span>→</span>';
    $$('[data-field]').forEach(group => {
      const field=group.getAttribute('data-field');
      $$('.option-btn',group).forEach(btn=>{
        const value=btn.getAttribute('data-value');
        const selected=Array.isArray(state[field])?state[field].includes(value):state[field]===value;
        btn.classList.toggle('active',selected);
        btn.setAttribute('aria-pressed',String(selected));
      });
    });
    const notes=$('#builderNotes'); if(notes && notes.value!==state.notes)notes.value=state.notes;
    $('#summaryType').textContent=state.type;
    $('#summaryPlatform').textContent=state.platforms.length?state.platforms.join(' + '):'A definir';
    $('#summaryFeatures').textContent=state.features.length?state.features.join(', '):'A definir';
    $('#summaryStage').textContent=state.stage;
    $('#builderVisual')?.classList.toggle('advanced',state.features.length>=3);
    safeSave('branapi.builder',state);
  }
  $$('[data-field] .option-btn').forEach(btn=>btn.addEventListener('click',()=>{
    const group=btn.closest('[data-field]'), field=group.getAttribute('data-field'), value=btn.getAttribute('data-value');
    if(group.getAttribute('data-mode')==='multi') {
      const next=[...state[field]];
      const index=next.indexOf(value);
      if(index===-1)next.push(value);else next.splice(index,1);
      state[field]=next;
    } else state[field]=value;
    renderBuilder();
  }));
  $$('[data-service]').forEach(a=>a.addEventListener('click',()=>{
    const service=a.dataset.service;
    if(['Software sob medida','Construir Startup / MVP','Aplicativo mobile','Automação com IA','Integrações e APIs'].includes(service))state.type=service;
    else if(service==='Plataforma SaaS') state.type='Software sob medida';
    else if(service==='IA e automação') state.type='Automação com IA';
    else if(service==='Site ou loja') state.type='Site ou e-commerce';
    else state.type=service || 'Outro projeto';
    currentStep=0;renderBuilder();
  }));
  $('#builderNotes')?.addEventListener('input',e=>{state.notes=e.target.value;safeSave('branapi.builder',state)});
  $('#builderBack')?.addEventListener('click',()=>{currentStep=Math.max(0,currentStep-1);renderBuilder()});
  function briefText() {
    return [
      'BRANAPI — BRIEFING INICIAL',
      '',
      `Tipo: ${state.type}`,
      `Plataformas: ${state.platforms.join(', ') || 'A definir'}`,
      `Funcionalidades: ${state.features.join(', ') || 'A definir'}`,
      `Momento: ${state.stage}`,
      `Observações: ${state.notes.trim() || 'Não informadas'}`,
      '',
      'Quero conversar sobre a viabilidade, o escopo e o investimento desse projeto.'
    ].join('\n');
  }
  $('#builderNext')?.addEventListener('click',()=>{
    if(currentStep<3){currentStep+=1;renderBuilder();return;}
    if(!String(cfg.whatsappNumber||'').replace(/\D/g,'')) {
      navigator.clipboard?.writeText(briefText()).catch(() => {});
      window.open(cfg.currentContactPage || 'https://www.branapi.com/#contato','_blank','noopener,noreferrer');
      notify('Abrimos o contato no site oficial. Copie ou baixe seu briefing para enviar à equipe.');
      return;
    }
    const url=whatsUrl(briefText());
    window.open(url,'_blank','noopener,noreferrer');
  });
  $('#downloadBrief')?.addEventListener('click',()=>{
    const blob=new Blob([briefText()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='meu-briefing-branapi.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    notify('Briefing baixado. Você pode enviar o arquivo para a equipe Branapi.');
  });
  renderBuilder();

  // Contract-safe contact routing: no fabricated business phone. Fallback goes to current real website.
  $$('[data-contact="true"]').forEach(a=>{
    a.href=whatsUrl();
    if(!cfg.whatsappNumber)a.setAttribute('title','Contato pelo site oficial (configure o WhatsApp em config.js)');
  });
  if($('#whatsappFloat')) { $('#whatsappFloat').href=whatsUrl(); if(!cfg.whatsappNumber) $('#whatsappFloat').title='Abrir contato no site oficial'; }

  // Demonstration terminal is a visual animation, not a live deployment dashboard.
  const messages = [
    ['>','briefing recebido','Analisando o desafio.'],
    ['>','arquitetura definida','Estruturando os módulos.'],
    ['>','interface pronta','Validando a experiência.'],
    ['>','testes concluídos','Revisando fluxos principais.'],
    ['>','produto preparado','Próxima etapa: colocar em operação.']
  ];
  let terminalJobs=[];
  function replayTerminal(activePhase=4) {
    terminalJobs.forEach(id=>clearTimeout(id));terminalJobs=[];
    const lines=$('#terminalLines'),bar=$('#terminalProgress'),label=$('#terminalProgressLabel');
    if(!lines)return;
    lines.innerHTML='';bar.style.width='0%';label.textContent='0%';
    messages.forEach(([prompt,heading,desc],i)=>{
      terminalJobs.push(setTimeout(()=>{
        const line=document.createElement('div');line.className='terminal-line';
        const p=document.createElement('span');p.className='prompt';p.textContent=prompt+' ';
        const strong=document.createElement('span');strong.className='success';strong.textContent='✓ '+heading+' ';
        const muted=document.createElement('span');muted.className='dim';muted.textContent='// '+desc;
        line.append(p,strong,muted);lines.appendChild(line);
        bar.style.width=`${(i+1)*20}%`;label.textContent=`${(i+1)*20}%`;
      },prefersReducedMotion.matches?i*20:i*570));
    });
  }
  $('#terminalReplay')?.addEventListener('click',()=>replayTerminal());
  $$('.process-step').forEach(el=>{
    el.addEventListener('click',()=>{
      $$('.process-step').forEach(p=>p.classList.remove('active'));
      el.classList.add('active');
      replayTerminal(Number(el.getAttribute('data-phase')));
    });
  });
  if('IntersectionObserver' in window){
    const terminalObserver=new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){replayTerminal();terminalObserver.disconnect();}
    },{threshold:.2});
    terminalObserver.observe($('#processo'));
  }else replayTerminal();

  // FAQs: only one accordion expanded at a time.
  $$('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(!detail.open)return;
    $$('.faq-list details').forEach(other=>{if(other!==detail)other.open=false});
  }));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){ /* Canvas runs only while visible via visibility check. */ }});
  // Branapi 2.0: three real interactive software demonstrations.
  const demoCopy = {
    crm: 'Um CRM sob medida pode acompanhar seus clientes, propostas e negociações.',
    ops: 'Um painel próprio organiza indicadores, tarefas e processos da sua equipe.',
    ai: 'Uma automação conecta mensagens, decisões e ações nos seus sistemas.'
  };
  function selectDemo(kind) {
    if (!Object.hasOwn(demoCopy,kind)) return;
    $$('.demo-option').forEach(btn => {
      const selected = btn.dataset.demo === kind;
      btn.classList.toggle('active',selected);
      btn.setAttribute('aria-pressed',String(selected));
    });
    $$('.demo-screen').forEach(screen => {
      const selected = screen.dataset.screen === kind;
      screen.classList.toggle('is-active',selected);
      screen.setAttribute('aria-hidden',String(!selected));
    });
    if ($('#demoCaption')) $('#demoCaption').textContent=demoCopy[kind];
  }
  $$('.demo-option').forEach(button => button.addEventListener('click',() => selectDemo(button.dataset.demo)));

  // Project or ready-made product: contextual copy, CTA and direct product links.
  const decisionVariants = {
    custom: {
      label:'DESENVOLVIMENTO SOB MEDIDA',
      title:'A gente constrói a solução que ainda não existe.',
      description:'Sites, apps, sistemas e automações criados a partir das regras e necessidades da sua operação.',
      cta:'Começar meu projeto sob medida',
      url:'#configurador',
      diagram:[['SUA IDEIA','●'],['UX/UI & ARQUITETURA','✳'],['SEU SOFTWARE','↗']]
    },
    ready: {
      label:'4 PLATAFORMAS BRANAPI',
      title:'Quatro produtos desenvolvidos. Conheça o ideal para o seu mercado.',
      description:'BET, Gateway de Pagamento, Plataforma de Infoprodutos e BaaS: acesse cada site e veja a oferta disponível.',
      cta:'Explorar as 4 plataformas',
      url:'#produtos',
      diagram:[['BET','↗'],['GATEWAY','◈'],['INFOPRODUTOS','▦'],['BAAS','✳']]
    }
  };
  function selectDecision(kind) {
    const choice=decisionVariants[kind]; if(!choice)return;
    $$('.decision-choice').forEach(button=>{
      const active=button.dataset.choice===kind;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    $('#decisionLabel').textContent=choice.label;
    $('#decisionTitle').textContent=choice.title;
    $('#decisionDescription').textContent=choice.description;
    const button=$('#decisionCTA');button.href=choice.url;
    button.innerHTML='';button.append(document.createTextNode(choice.cta+' '));
    const arrow=document.createElement('span');arrow.textContent='↗';button.append(arrow);
    const diagram=$('#decisionIllustration');diagram.innerHTML='';
    choice.diagram.forEach(([label,symbol],i)=>{
      if(i){const join=document.createElement('div');join.className='decision-join';diagram.append(join);}
      const module=document.createElement('div');module.className='decision-module';
      module.style.animationDelay=`${i*90}ms`;
      const text=document.createTextNode(label+' ');
      const icon=document.createElement('i');icon.textContent=symbol;module.append(text,icon);diagram.append(module);
    });
    $('#decisionProducts').hidden=kind!=='ready';
    $('#decisionWorkspace').dataset.mode=kind;
  }
  $$('.decision-choice').forEach(button=>button.addEventListener('click',()=>selectDecision(button.dataset.choice)));

  // Scroll-based motion: scrubs position instead of running heavy perpetual timelines.
  $$('.route-grid .route-card, .products .product-card').forEach((el,i)=>el.classList.add(i%2?'reveal-slide-right':'reveal-slide-left'));
  $$('.services-grid .service-card, .demo-workspace, .decision-workspace').forEach(el=>el.classList.add('reveal-zoom'));
  const orbFrame=$('.hero-orb-frame');
  const demoWorkspace=$('.demo-workspace');
  const decisionWorkspace=$('.decision-workspace');
  let scrollRaf=0;
  const scrubMotion=()=>{
    scrollRaf=0;
    if(prefersReducedMotion.matches)return;
    const y=window.scrollY, view=window.innerHeight;
    document.documentElement.style.setProperty('--pattern-scroll', `${(y*.12).toFixed(1)}px`);
    if(orbFrame && y < view*1.5) {
      orbFrame.style.setProperty('--motion-depth',`${Math.min(80,y*.13).toFixed(1)}px`);
    }
    [demoWorkspace,decisionWorkspace].forEach(element=>{
      if(!element)return;
      const r=element.getBoundingClientRect();
      if(r.top>view || r.bottom<0)return;
      const p=Math.max(0,Math.min(1,(view-r.top)/(view+r.height)));
      element.style.setProperty('--scroll-completion',`${(p*100).toFixed(2)}%`);
      element.style.setProperty('--shimmer-position',`${(p*100).toFixed(2)}%`);
    });
  };
  function queueMotion(){if(!scrollRaf)scrollRaf=requestAnimationFrame(scrubMotion);}
  window.addEventListener('scroll',queueMotion,{passive:true});
  window.addEventListener('resize',queueMotion,{passive:true});
  queueMotion();

})();
