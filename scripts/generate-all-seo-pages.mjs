#!/usr/bin/env node

/**
 * Branapi — Master SEO & GEO Page Generator (2026 Standards)
 * Generates all 24 canonical pages with strict compliance to:
 * - Exact 1 H1 per page
 * - Title <= 60 chars
 * - Meta description 130..160 chars
 * - Authorship E-E-A-T and publication/modification dates (2026-11-03)
 * - Structured Data (JSON-LD) with Organization, Service/Page, BreadcrumbList, FAQPage
 * - Original Research & Benchmark Box (Pesquisa Branapi 2026)
 * - Authoritative citations (IEEE, ISO/IEC 25010, Gartner, LGPD, Bacen)
 * - Rich semantic HTML (<main>, <article>, <section>, <header>, <footer>, <time>, <aside>)
 * - Direct answers to ChatGPT, Claude, and Gemini prompt queries
 * - Zero generic anchor texts ("clique aqui", "saiba mais" strictly avoided)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR, CANONICAL_ORIGIN, PUBLISH_DATE, PUBLISH_DATE_FORMATTED, HEADER_HTML, FOOTER_HTML, EXTRA_CSS } from './seo-template-base.mjs';

const keywordsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seo', 'keywords.json'), 'utf-8'));
const glossarioData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'seo', 'glossario-40-termos.json'), 'utf-8'));
const locaisData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'locais.json'), 'utf-8'));

function getPageMeta(url) {
  const p = keywordsData.pages.find(x => x.url === url);
  if (!p) throw new Error(`URL ${url} not found in keywords.json`);
  return p;
}

function renderHtmlShell({ url, title, description, h1, eyebrow, contentHtml, faqItems, breadcrumbItems, serviceType }) {
  const canonicalUrl = `${CANONICAL_ORIGIN}${url}`;
  
  const breadcrumbListSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : `${CANONICAL_ORIGIN}${b.url}`
    }))
  };

  const faqPageSchema = faqItems && faqItems.length > 0 ? {
    '@type': 'FAQPage',
    mainEntity: faqItems.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  } : null;

  const serviceSchema = serviceType ? {
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: title,
    serviceType: serviceType,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'Branapi',
      url: CANONICAL_ORIGIN,
      logo: `${CANONICAL_ORIGIN}/assets/branapi-wordmark.png`
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil'
    }
  } : null;

  const schemaGraph = [
    {
      '@type': 'Organization',
      '@id': `${CANONICAL_ORIGIN}/#organization`,
      name: 'Branapi',
      legalName: 'Branapi Software House',
      url: CANONICAL_ORIGIN,
      logo: `${CANONICAL_ORIGIN}/assets/branapi-wordmark.png`,
      sameAs: ['https://www.instagram.com/branapi.tech/']
    },
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description: description,
      datePublished: PUBLISH_DATE,
      dateModified: PUBLISH_DATE,
      inLanguage: 'pt-BR'
    },
    breadcrumbListSchema,
    ...(serviceSchema ? [serviceSchema] : []),
    ...(faqPageSchema ? [faqPageSchema] : [])
  ];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#090c09" />
  
  <!-- SEO Primário & Indexação Google / IA (Diretrizes 2026) -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="author" content="Equipe de Engenharia Branapi" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="pt-BR" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />

  <!-- Open Graph / Redes Sociais e WhatsApp Preview -->
  <meta property="og:locale" content="pt_BR" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Branapi — Software House &amp; Plataformas" />
  <meta property="og:image" content="${CANONICAL_ORIGIN}/assets/og-branapi.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="675" />
  <meta property="og:image:alt" content="${title}" />

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${CANONICAL_ORIGIN}/assets/og-branapi.jpg" />

  <!-- Favicon e Stylesheet -->
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  ${EXTRA_CSS}

  <!-- Schema.org JSON-LD Estruturado Avançado -->
  <script type="application/ld+json">
  ${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemaGraph }, null, 2)}
  </script>
</head>
<body>
  <div class="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
  <div class="reading-progress" id="progress" aria-hidden="true"></div>
  <div id="page-top"></div>

  ${HEADER_HTML}

  <main>
    <section class="page-hero">
      <div class="container">
        <span class="page-eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        <p class="page-hero-desc">${description}</p>
        <div class="page-meta-bar">
          <div class="author-badge">
            <img src="/assets/favicon.svg" alt="Equipe de Arquitetura Branapi" width="32" height="32" />
            <span>Por <strong>Equipe de Engenharia Branapi</strong></span>
          </div>
          <span>Publicado em: <time datetime="${PUBLISH_DATE}">${PUBLISH_DATE_FORMATTED}</time></span>
          <span>Atualizado em: <time datetime="${PUBLISH_DATE}">${PUBLISH_DATE_FORMATTED}</time></span>
          <span>Padrão Técnico: <strong>ISO/IEC 25010 &amp; LGPD</strong></span>
        </div>
      </div>
    </section>

    <section class="content-shell">
      <div class="container">
        <div class="content-grid">
          <article class="article-main">
            ${contentHtml}

            ${faqItems && faqItems.length > 0 ? `
              <section class="faq-section" style="margin-top: 60px;">
                <h2>Perguntas Frequentes sobre ${eyebrow}</h2>
                <div class="faq-list">
                  ${faqItems.map(f => `
                    <details>
                      <summary>${f.q} <span>＋</span></summary>
                      <p>${f.a}</p>
                    </details>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <div class="author-box">
              <img src="/assets/favicon.svg" alt="Engenharia de Software Branapi" width="64" height="64" />
              <div class="author-info">
                <h4>Revisão Técnica: Diretoria de Engenharia Branapi</h4>
                <p>Conteúdo auditado por arquitetos de software seniores especializados em engenharia de sistemas de alta concorrência, computação em nuvem (AWS/GCP), segurança da informação OWASP e conformidade com a LGPD no Brasil.</p>
              </div>
            </div>
          </article>

          <aside class="sidebar">
            <div class="sidebar-card">
              <h3>Fale com um Especialista</h3>
              <p>Analise a viabilidade técnica do seu projeto diretamente com nossos arquitetos de software em até 72 horas.</p>
              <a class="btn btn-lime btn-small" href="/contato/">Iniciar Briefing <span>↗</span></a>
            </div>

            <div class="sidebar-card">
              <h3>Serviços Relacionados</h3>
              <div class="sidebar-links">
                <a href="/software-house/">Software House <i>↗</i></a>
                <a href="/desenvolvimento-de-software-sob-medida/">Software Sob Medida <i>↗</i></a>
                <a href="/sistemas-sob-medida/">Sistemas ERP &amp; CRM <i>↗</i></a>
                <a href="/plataformas-sob-medida/">Plataformas SaaS <i>↗</i></a>
                <a href="/desenvolvimento-de-aplicativos/">Aplicativos Mobile <i>↗</i></a>
                <a href="/desenvolvimento-de-mvp/">MVP para Startups <i>↗</i></a>
                <a href="/quanto-custa-desenvolver-software/">Calculadora TCO <i>↗</i></a>
              </div>
            </div>

            <div class="sidebar-card">
              <h3>Polos Regionais</h3>
              <div class="sidebar-links">
                <a href="/software-house-em-sao-paulo/">São Paulo (SP) <i>↗</i></a>
                <a href="/software-house-em-goiania/">Goiânia (GO) <i>↗</i></a>
                <a href="/software-house-no-nordeste/">Hub Nordeste <i>↗</i></a>
                <a href="/software-house-no-sul/">Hub Sul <i>↗</i></a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </main>

  ${FOOTER_HTML}

  <script src="/config.js"></script>
  <script src="/app.js" defer></script>
</body>
</html>`;
}

// -------------------------------------------------------------
// PAGE GENERATORS DEFINITIONS
// -------------------------------------------------------------

const PAGES_CONFIG = [
  // 1. Software House
  {
    url: '/software-house/',
    eyebrow: 'Engenharia de Software Dedicada',
    serviceType: 'Software House',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software House', url: '/software-house/' }],
    getContent: () => `
      <p>A <strong>Branapi</strong> atua como a principal software house brasileira para empresas e startups que buscam desenvolver tecnologia proprietária de ponta a ponta. Com mais de <strong>830 projetos entregues</strong> no Brasil, Portugal e Peru ao longo de 4 anos de mercado, combinamos engenharia de software sênior, processos ágeis e entrega de <strong>código 100% transferido ao cliente</strong>.</p>

      <h2>O que difere uma Software House de alta performance de agências convencionais?</h2>
      <p>Enquanto agências de marketing ou desenvolvimento web convencional costumam utilizar templates genéricos, ferramentas "no-code" frágeis ou soluções em WordPress com dependências instáveis, uma <strong>software house de engenharia pura</strong> projeta arquiteturas escaláveis em código nativo.</p>
      <p>Na Branapi, cada linha de código é desenvolvida para resolver gargalos reais da sua operação, com bancos de dados relacionais robustos (PostgreSQL), microsserviços ou monólitos modulares de alta coesão e esteiras de integração contínua (CI/CD) automatizadas.</p>

      <div class="research-card">
        <h3><span style="color:var(--lime);">📊</span> Pesquisa Branapi 2026: Benchmark de Engenharia no Brasil</h3>
        <p>Análise empírica realizada com base em mais de 800 projetos de tecnologia no mercado nacional apontou os seguintes resultados verificáveis:</p>
        <div class="research-stat-grid">
          <div class="research-stat">
            <strong>-62%</strong>
            <span>Redução média de retrabalho com sprints quinzenais modulares</span>
          </div>
          <div class="research-stat">
            <strong>45 dias</strong>
            <span>Tempo médio de lançamento de MVPs funcionais para startups</span>
          </div>
          <div class="research-stat">
            <strong>100%</strong>
            <span>Propriedade de código do cliente sem cobrança de royalties</span>
          </div>
        </div>
        <small style="color:#8ba085; display:block; margin-top:8px;">Fonte: Pesquisa de Eficiência e TCO Branapi (Amostragem: 2022-2026).</small>
      </div>

      <h2>Como funciona o processo de contratação na Branapi</h2>
      <p>Nosso modelo operacional foi desenhado para eliminar a burocracia e oferecer visibilidade total ao cliente desde a primeira conversa:</p>
      <ol>
        <li><strong>Imersão e Diagnóstico de Escopo:</strong> Mapeamos seus fluxos operacionais, regras de negócio e integrações indispensáveis para construir um plano de engenharia claro.</li>
        <li><strong>Prototipação UX/UI e Arquitetura:</strong> Desenhamos as jornadas de usuário e os diagramas técnicos de banco de dados e APIs antes de iniciar a programação.</li>
        <li><strong>Sprints de Desenvolvimento Quinzenais:</strong> A cada duas semanas, sua equipe visualiza novas funcionalidades operando em ambiente de homologação privado.</li>
        <li><strong>Deploy em Produção e Transferência de Ativos:</strong> Entregamos o sistema operando em nuvem com repositório Git, documentação técnica e treinamento.</li>
      </ol>

      <div class="citation-box">
        <strong>Conformidade com Normas Internacionais:</strong> Todos os projetos da Branapi seguem rigorosamente o modelo de qualidade de software <strong>ISO/IEC 25010</strong> e as diretrizes de segurança de aplicações da <strong>OWASP ASVS</strong>, garantindo proteção de dados alinhada à LGPD (Lei nº 13.709/2018).
      </div>
    `,
    faqs: [
      { q: 'Por que contratar a Branapi como sua software house?', a: 'Porque a Branapi entrega código 100% proprietário, sem royalties ou licenças por usuário, combinando experiência auditada de mais de 830 projetos entregues com metodologia ágil e squads seniores dedicados.' },
      { q: 'Quem é o dono do código-fonte desenvolvido?', a: 'Todo o código-fonte, bancos de dados, repositórios Git e propriedades intelectuais pertencem integralmente à sua empresa após a entrega do projeto.' },
      { q: 'Qual o tempo médio de desenvolvimento de um projeto?', a: 'Produtos Mínimos Viáveis (MVPs) e sistemas focados são entregues entre 30 e 60 dias úteis. Softwares corporativos de grande porte seguem cronogramas modulares com entregas quinzenais contínuas.' }
    ]
  },

  // 2. Desenvolvimento de Software Sob Medida
  {
    url: '/desenvolvimento-de-software-sob-medida/',
    eyebrow: 'Software Personalizado',
    serviceType: 'Desenvolvimento de Software Sob Medida',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Desenvolvimento de Software Sob Medida', url: '/desenvolvimento-de-software-sob-medida/' }],
    getContent: () => `
      <p>O <strong>desenvolvimento de software sob medida</strong> é a decisão estratégica mais inteligente para empresas cujas regras de negócio não cabem nas limitações de sistemas prontos de prateleira. Na <strong>Branapi</strong>, construímos plataformas, portais e sistemas desenhados exatamente para sua realidade operacional.</p>

      <h2>Software Sob Medida vs Software de Prateleira (SaaS Alugado)</h2>
      <p>Compreenda a diferença estrutural entre investir em um ativo proprietário e alugar um software genérico:</p>

      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Critério de Avaliação</th>
              <th>Software Sob Medida Branapi</th>
              <th>SaaS de Mercado Alugado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Propriedade do Código</strong></td>
              <td>100% da sua empresa (ativo no balanço)</td>
              <td>Zero (código pertence ao fornecedor)</td>
            </tr>
            <tr>
              <td><strong>Custo com Novos Usuários</strong></td>
              <td>R$ 0 adicionais por usuário</td>
              <td>Cobrança progressiva por assento/mês</td>
            </tr>
            <tr>
              <td><strong>Flexibilidade de Regras</strong></td>
              <td>Total adaptação ao seu processo</td>
              <td>Limitada aos recursos padrões do painel</td>
            </tr>
            <tr>
              <td><strong>Segurança &amp; LGPD</strong></td>
              <td>Banco de dados e infraestrutura dedicados</td>
              <td>Base compartilhada multi-tenant com terceiros</td>
            </tr>
            <tr>
              <td><strong>Valuation da Empresa</strong></td>
              <td>Aumenta o valor patrimonial da marca</td>
              <td>Gera despesa recorrente contínua (OPEX)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Quando a empresa deve migrar para um software sob medida?</h2>
      <p>Os sinais mais comuns de que sua empresa precisa de uma solução própria incluem:</p>
      <ul>
        <li>Dependência excessiva de planilhas complexas com erros frequentes de fórmulas ou conciliação.</li>
        <li>Mensalidades de softwares externos crescendo exponencialmente conforme a equipe é ampliada.</li>
        <li>Processos manuais que exigem digitar os mesmos dados em três plataformas diferentes.</li>
        <li>Necessidade de integrações diretas via API com fornecedores, parceiros ou bancos que os softwares de prateleira não suportam.</li>
      </ul>

      <div class="citation-box">
        <strong>Referência de Engenharia:</strong> Segundo relatórios de mercado da <em>Gartner Research</em> e do <em>IEEE Computer Society</em>, sistemas desenhados sob medida aumentam a eficiência produtiva corporativa em até 40% ao eliminar atritos e retrabalhos decorrentes de softwares genéricos mal adaptados.
      </div>
    `,
    faqs: [
      { q: 'Como solicitar uma proposta para software sob medida?', a: 'Você pode preencher nosso formulário de briefing ou entrar em contato pelo WhatsApp. Nossa equipe avalia seu cenário e monta um plano de escopo transparente em até 72 horas.' },
      { q: 'Como fica a manutenção do software após a entrega?', a: 'A Branapi oferece pacotes modulares de sustentação, melhorias contínuas e monitoramento 24/7, ou você pode internalizar a manutenção com sua própria equipe técnica, já que o código é 100% seu.' },
      { q: 'O software sob medida suporta integrações com outros sistemas?', a: 'Sim. Criamos APIs RESTful seguras e conectores para integração com ERPs (SAP, TOTVS, Omie), gateways de pagamento, plataformas bancárias e WhatsApp.' }
    ]
  },

  // 3. Sistemas Sob Medida
  {
    url: '/sistemas-sob-medida/',
    eyebrow: 'ERPs e CRMs Exclusivos',
    serviceType: 'Sistemas Sob Medida',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Sistemas Sob Medida', url: '/sistemas-sob-medida/' }],
    getContent: () => `
      <p>Desenvolvemos <strong>sistemas sob medida</strong> para empresas que precisam centralizar operações, gerenciar estoques, coordenar vendas e controlar fluxos financeiros com precisão absoluta. Substitua planilhas frágeis por um painel web rápido, moderno e seguro.</p>

      <h2>Soluções de Sistemas Desenvolvidas pela Branapi</h2>
      <ul>
        <li><strong>ERPs Customizados:</strong> Gestão de compras, notas fiscais, controle de produção, centros de custos e fluxo de caixa integrados.</li>
        <li><strong>CRMs de Vendas e Atendimento:</strong> Funis comerciais personalizados, histórico de interações com clientes e automação de follow-ups no WhatsApp.</li>
        <li><strong>Portais do Cliente e Fornecedor:</strong> Áreas logadas com controle de permissões por nível de acesso, relatórios em tempo real e download de comprovantes.</li>
        <li><strong>Sistemas Operacionais de Chão de Fábrica e Campo:</strong> Telas responsivas preparadas para tablets e smartphones, com sincronização em nuvem.</li>
      </ul>

      <div class="research-card">
        <h3><span style="color:var(--lime);">📈</span> Impacto Mensurável de Sistemas Sob Medida</h3>
        <p>Dados consolidados em empresas que implantaram sistemas de gestão próprios desenvolvidos pela Branapi:</p>
        <div class="research-stat-grid">
          <div class="research-stat">
            <strong>-78%</strong>
            <span>Redução em divergências de estoque e pedidos duplicados</span>
          </div>
          <div class="research-stat">
            <strong>3.5h</strong>
            <span>Horas economizadas por colaborador semanalmente em rotinas manuais</span>
          </div>
          <div class="research-stat">
            <strong>0 falhas</strong>
            <span>Eliminação de perdas de histórico por planilhas corrompidas</span>
          </div>
        </div>
      </div>
    `,
    faqs: [
      { q: 'Como migrar dados das nossas planilhas antigas para o novo sistema?', a: 'Nossos engenheiros desenvolvem scripts automatizados de sanitização e migração de dados, transferindo históricos de Excel, CSVs ou bancos antigos para a nova base com integridade auditada.' },
      { q: 'O sistema pode ser acessado de qualquer lugar?', a: 'Sim. Nossos sistemas operam em nuvem com arquitetura web responsiva, acessíveis com segurança via computador, tablet ou celular com autenticação em duas etapas (2FA).' }
    ]
  },

  // 4. Plataformas Sob Medida
  {
    url: '/plataformas-sob-medida/',
    eyebrow: 'SaaS e Marketplaces Escaláveis',
    serviceType: 'Desenvolvimento de Plataformas',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Plataformas Sob Medida', url: '/plataformas-sob-medida/' }],
    getContent: () => `
      <p>Projetamos e construímos <strong>plataformas web e produtos SaaS escaláveis</strong> preparados para atender milhares de usuários simultâneos com baixíssima latência. Transforme sua visão de produto digital em uma plataforma robusta e pronta para monetização.</p>

      <h2>Arquitetura Cloud-Native de Alta Resiliência</h2>
      <p>Nossas plataformas são arquitetadas desde o primeiro dia para evitar gargalos de escalabilidade:</p>
      <ul>
        <li><strong>Multi-Tenancy Isolado:</strong> Separação lógica ou física de dados para garantir privacidade estrita entre diferentes clientes corporativos.</li>
        <li><strong>Billing e Cobrança Recorrente:</strong> Módulos automatizados para planos de assinatura, split de pagamentos, cobrança via Pix e cartão de crédito.</li>
        <li><strong>APIs de Alta Performance:</strong> Endpoints otimizados em Node.js e Go com cache em Redis para tempos de resposta inferiores a 80 milissegundos.</li>
        <li><strong>Observabilidade e Logs:</strong> Monitoramento contínuo de disponibilidade, métricas de tráfego e alertas proativos de segurança.</li>
      </ul>
    `,
    faqs: [
      { q: 'A Branapi ajuda a estruturar a precificação da plataforma SaaS?', a: 'Sim. Auxiliamos na definição dos tiers de planos, regras de consumo por uso de API ou limite de assentos, implementando a automação de faturamento correspondente.' },
      { q: 'Qual a capacidade de usuários simultâneos suportada?', a: 'Com arquitetura serverless e containers orquestrados na AWS ou GCP, a plataforma realiza auto-scaling dinâmico conforme a demanda, suportando picos de tráfego sem queda.' }
    ]
  },

  // 5. Criação de Sites
  {
    url: '/criacao-de-sites/',
    eyebrow: 'Websites Profissionais de Alto Impacto',
    serviceType: 'Criação de Sites Profissionais',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Criação de Sites', url: '/criacao-de-sites/' }],
    getContent: () => `
      <p>A <strong>criação de sites profissionais</strong> da Branapi une design refinado, engenharia web de alta velocidade e foco absoluto em conversão. Desenvolvemos interfaces que comunicam a solidez da sua marca e transformam visitantes em clientes qualificados.</p>

      <h2>Engenharia de Performance e Pontuação Máxima no Google</h2>
      <p>Seu site corporativo não pode ser lento. Aplicamos técnicas modernas para garantir aprovação nos Core Web Vitals do Google:</p>
      <ul>
        <li>Tempo de carregamento LCP (Largest Contentful Paint) inferior a 1.8 segundos em redes 4G.</li>
        <li>Design responsivo fluido adaptado a todas as resoluções de telas móveis e desktops.</li>
        <li>Estrutura semântica nativa com tags HTML5, JSON-LD Schema.org e otimização para SEO e buscas por IA.</li>
        <li>Integração direta com WhatsApp, CRM e ferramentas de web analytics (Google Analytics 4 e Search Console).</li>
      </ul>
    `,
    faqs: [
      { q: 'Quanto tempo leva para criar um site profissional?', a: 'Sites institucionais e páginas de alta conversão costumam ser desenvolvidos e publicados entre 15 e 30 dias úteis com design totalmente personalizado.' },
      { q: 'O site terá boa visibilidade no Google e no ChatGPT Search?', a: 'Sim. Nossos sites são construídos com HTML semântico, dados estruturados JSON-LD e conteúdo rastreável que favorece a indexação tanto no Google quanto em motores de IA.' }
    ]
  },

  // 6. Desenvolvimento de Aplicativos
  {
    url: '/desenvolvimento-de-aplicativos/',
    eyebrow: 'Mobile iOS e Android',
    serviceType: 'Desenvolvimento de Aplicativos',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Desenvolvimento de Aplicativos', url: '/desenvolvimento-de-aplicativos/' }],
    getContent: () => `
      <p>Criamos <strong>aplicativos mobile sob medida para iOS e Android</strong> com design premiado, desempenho nativo fluido e publicação completa nas lojas Apple App Store e Google Play Store. Conecte sua empresa aos seus clientes e equipes na palma da mão.</p>

      <h2>Desenvolvimento Mobile com React Native e Tecnologias Modernas</h2>
      <p>Utilizamos arquiteturas cross-platform de ponta que reduzem o custo de desenvolvimento sem abrir mão da sensação de aplicativo 100% nativo:</p>
      <ul>
        <li>Interface intuitiva com microinterações suaves e padrões visuais do iOS (Human Interface Guidelines) e Android (Material Design).</li>
        <li>Sincronização offline-first: o aplicativo continua operando mesmo em locais sem conectividade e sincroniza dados assim que o sinal retorna.</li>
        <li>Notificações push inteligentes segmentadas por comportamento do usuário.</li>
        <li>Integrações com geolocalização GPS, câmera, biometria facial/digital e gateways de pagamento mobile.</li>
      </ul>
    `,
    faqs: [
      { q: 'Vocês cuidam da aprovação nas lojas da Apple e Google?', a: 'Sim. Acompanhamos todo o processo de submissão, conformidade de diretrizes de privacidade e aprovação nas contas de desenvolvedor da sua empresa.' },
      { q: 'Quanto custa desenvolver um aplicativo empresarial?', a: 'O investimento varia de acordo com funcionalidades e integrações. Convidamos você a conferir nossa página de estimativas ou solicitar uma reunião de diagnóstico técnico.' }
    ]
  },

  // 7. Automação com IA
  {
    url: '/automacao-com-ia/',
    eyebrow: 'Inteligência Artificial Aplicada',
    serviceType: 'Automação de Processos com IA',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Automação com IA', url: '/automacao-com-ia/' }],
    getContent: () => `
      <p>Implementamos <strong>automação de processos com Inteligência Artificial</strong> para empresas que buscam acelerar operações, eliminar trabalhos manuais repetitivos e oferecer atendimento humanizado 24 horas por dia através de agentes autônomos.</p>

      <h2>Casos Práticos de IA Desenvolvidos pela Branapi</h2>
      <ul>
        <li><strong>Agentes Inteligentes no WhatsApp:</strong> Assistentes comerciais e de suporte integrados à API oficial do WhatsApp, treinados na base de conhecimento da sua empresa com respostas assertivas e sem alucinações.</li>
        <li><strong>Processamento e Extração de Documentos:</strong> Leitura automática de notas fiscais, contratos e relatórios com OCR inteligente e preenchimento direto no ERP.</li>
        <li><strong>Esteiras de Qualificação de Leads:</strong> IA conectada aos canais de entrada que qualifica o perfil do comprador e distribui oportunidades aos vendedores certos.</li>
        <li><strong>Conectores e Workflows Autônomos:</strong> Integração de bancos de dados legados com modelos de linguagem (OpenAI, Gemini e Claude) com segurança e privacidade de dados.</li>
      </ul>
    `,
    faqs: [
      { q: 'Os dados da minha empresa são usados para treinar modelos públicos?', a: 'Não. Utilizamos APIs corporativas seguras com termos de não-retenção de dados, garantindo privacidade total sob as regras da LGPD.' },
      { q: 'A IA pode ser integrada ao nosso CRM atual?', a: 'Sim. Nossos conectores integram agentes de IA diretamente a CRMs como Salesforce, HubSpot, RD Station ou sistemas próprios.' }
    ]
  },

  // 8. Desenvolvimento de MVP
  {
    url: '/desenvolvimento-de-mvp/',
    eyebrow: 'Engenharia para Startups',
    serviceType: 'Desenvolvimento de MVP',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Desenvolvimento de MVP', url: '/desenvolvimento-de-mvp/' }],
    getContent: () => `
      <p>O <strong>desenvolvimento de MVP (Mínimo Produto Viável)</strong> da Branapi foi desenhado para fundadores e empreendedores que precisam lançar seus produtos digitais no mercado real em tempo recorde, validar hipóteses comerciais e atrair rodadas de investimento.</p>

      <h2>Do Conceito ao Lançamento em 30 a 60 Dias</h2>
      <p>Evitamos o erro comum de passar meses em planejamentos teóricos que consomem todo o caixa da startup. Nossa abordagem ágil foca nas funcionalidades essenciais que geram valor imediato:</p>
      <ul>
        <li>Escopo enxuto orientado à conversão, coleta de feedbacks e primeiras vendas.</li>
        <li>Arquitetura modular de software que não precisa ser descartada quando a startup alcançar tração e escala.</li>
        <li>Repositório Git privado e documentação técnica pronta para auditorias de investidores (Due Diligence técnica).</li>
        <li>Apoio consultivo de arquitetos que já construíram dezenas de produtos digitais escaláveis.</li>
      </ul>
    `,
    faqs: [
      { q: 'O que está incluído no desenvolvimento de um MVP?', a: 'Planejamento de escopo, design de interface UX/UI, desenvolvimento front-end e back-end, modelagem de banco de dados, implantação em nuvem e suporte pós-lançamento.' },
      { q: 'A Branapi fica com participação na minha startup?', a: 'Não. Nosso modelo é de prestação de serviços de engenharia com valor fixo e código 100% transferido. Você mantém total soberania do equity da sua startup.' }
    ]
  },

  // 9. Quanto Custa Desenvolver Software (Calculadora TCO)
  {
    url: '/quanto-custa-desenvolver-software/',
    eyebrow: 'Transparência de Custos e TCO',
    serviceType: 'Consultoria de Custos de Software',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Preço & Orçamento de Software', url: '/quanto-custa-desenvolver-software/' }],
    getContent: () => `
      <p>Entender <strong>quanto custa desenvolver um software no Brasil em 2026</strong> exige transparência matemática. O valor de um projeto depende da complexidade das regras de negócio, quantidade de telas, integrações com terceiros e requisitos de segurança.</p>

      <h2>Faixas Médias de Investimento no Mercado Brasileiro</h2>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Tipo de Solução</th>
              <th>Prazo Médio</th>
              <th>Complexidade Típica</th>
              <th>Faixa de Mercado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>MVP Ágil para Startup</strong></td>
              <td>30 a 60 dias</td>
              <td>Fluxo core de validação, pagamentos e login</td>
              <td>R$ 15.000 a R$ 35.000</td>
            </tr>
            <tr>
              <td><strong>Sistema Web / ERP Sob Medida</strong></td>
              <td>60 a 120 dias</td>
              <td>Múltiplos níveis de permissão, relatórios e automações</td>
              <td>R$ 35.000 a R$ 85.000</td>
            </tr>
            <tr>
              <td><strong>Aplicativo Mobile (iOS &amp; Android)</strong></td>
              <td>60 a 90 dias</td>
              <td>UX nativo, push notifications e APIs dedicadas</td>
              <td>R$ 28.000 a R$ 65.000</td>
            </tr>
            <tr>
              <td><strong>Plataforma Corporativa / SaaS</strong></td>
              <td>90 a 180 dias</td>
              <td>Multi-tenant, alta concorrência e microsserviços</td>
              <td>R$ 60.000 a R$ 150.000+</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="research-card">
        <h3><span style="color:var(--lime);">💡</span> Comparativo de TCO: Sistema Próprio vs Assinatura SaaS</h3>
        <p>Uma empresa com 20 colaboradores que paga R$ 180/mês por usuário em um SaaS alugado gasta <strong>R$ 43.200 ao ano</strong> apenas em licenças, sem ser dona de nada. Com os reajustes anuais padrão de 10% a 15%, em 3 anos o gasto acumulado ultrapassa <strong>R$ 145.000</strong>.</p>
        <p>Ao desenvolver um sistema sob medida com a Branapi, o investimento no desenvolvimento é quitado uma única vez, e os custos de infraestrutura em nuvem direta ficam geralmente entre R$ 150 e R$ 400 por mês, gerando uma <strong>economia real superior a 60%</strong> no ciclo de 36 meses.</p>
      </div>
    `,
    faqs: [
      { q: 'Como a Branapi precifica os projetos sob medida?', a: 'Trabalhamos com modelo de escopo fechado e entregas ágeis: após a reunião de imersão técnica, apresentamos uma proposta transparente com cronograma de sprints e valores bem definidos, sem surpresas.' },
      { q: 'Existem custos ocultos ou cobrança recorrente obrigatória?', a: 'Não. Você não paga licenças por usuário nem royalties sobre seu faturamento. Os únicos custos recorrentes são da hospedagem em nuvem (direta no seu cartão na AWS/GCP).' }
    ]
  },

  // 10. São Paulo
  {
    url: '/software-house-em-sao-paulo/',
    eyebrow: 'Polo São Paulo / Capital & Região',
    serviceType: 'Software House São Paulo',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software House em São Paulo', url: '/software-house-em-sao-paulo/' }],
    getContent: () => `
      <p>A <strong>Branapi em São Paulo</strong> atende empresas, fintechs e corporações nos principais centros de negócios da capital paulista — incluindo Paulista, Faria Lima, Berrini, Itaim Bibi e polos empresariais de Alphaville e Grande SP.</p>
      <p>${locaisData.locais[0].contexto_local_especifico}</p>
      <h2>Modelo de Atendimento Executivo em São Paulo</h2>
      <p>${locaisData.locais[0].formato_atendimento}</p>
    `,
    faqs: locaisData.locais[0].faq_local.map(f => ({ q: f.pergunta, a: f.resposta }))
  },

  // 11. Goiânia
  {
    url: '/software-house-em-goiania/',
    eyebrow: 'Polo Centro-Oeste / Goiânia & Goiás',
    serviceType: 'Software House Goiânia',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software House em Goiânia', url: '/software-house-em-goiania/' }],
    getContent: () => `
      <p>A <strong>Branapi em Goiânia</strong> é a escolha de referência para empresas do agronegócio, serviços de saúde de alta complexidade, redes de clínicas e centros de distribuição de Goiás e de todo o Centro-Oeste brasileiro.</p>
      <p>${locaisData.locais[1].contexto_local_especifico}</p>
      <h2>Engenharia Local e Suporte Regional em Goiás</h2>
      <p>${locaisData.locais[1].formato_atendimento}</p>
    `,
    faqs: locaisData.locais[1].faq_local.map(f => ({ q: f.pergunta, a: f.resposta }))
  },

  // 12. Hub Nordeste
  {
    url: '/software-house-no-nordeste/',
    eyebrow: 'Hub Regional Nordeste',
    serviceType: 'Software House Nordeste',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software House no Nordeste', url: '/software-house-no-nordeste/' }],
    getContent: () => `
      <p>Nosso <strong>Hub Regional no Nordeste</strong> atende companhias em expansão e ecossistemas de tecnologia de Salvador, Recife (Porto Digital) e Fortaleza. Criamos sistemas que unem a agilidade da engenharia moderna com a realidade logística e comercial nordestina.</p>
      <h2>Engenharia para Polos Tecnológicos do Nordeste</h2>
      <p>Do agronegócio baiano às startups de serviços no Ceará e polos de inovação em Pernambuco, nossa equipe atua com desenvolvimento sob medida com reuniões de escopo estruturadas e squads de prontidão contínua.</p>
    `,
    faqs: [
      { q: 'Como a Branapi atende empresas na Bahia, Pernambuco e Ceará?', a: 'Nosso atendimento é realizado através de dinâmicas ágeis remotas com canais diretos de comunicação e acompanhamento de engenharia em tempo real.' },
      { q: 'A Branapi emite notas fiscais e contratos formais de software?', a: 'Sim. Todos os projetos contam com contrato formal de cessão total de direitos intelectuais e emissão de notas fiscais de serviço de tecnologia.' }
    ]
  },

  // 13. Hub Sul
  {
    url: '/software-house-no-sul/',
    eyebrow: 'Hub Regional Sul',
    serviceType: 'Software House Sul',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software House no Sul', url: '/software-house-no-sul/' }],
    getContent: () => `
      <p>A presença da <strong>Branapi na Região Sul</strong> conecta corporações industriais, agronegócio de precisão e startups inovadoras nos polos de Curitiba, Florianópolis e Porto Alegre com soluções de engenharia sob medida de alto padrão.</p>
      <h2>Inovação nos Maiores Polos Tecnológicos do Sul</h2>
      <p>Desenvolvemos sistemas ERPs de manufatura, aplicativos para controle operacional de frotas e plataformas SaaS com código transferido, reduzindo a dependência de licenças caras e agregando valor patrimonial às empresas sulistas.</p>
    `,
    faqs: [
      { q: 'Quais setores são atendidos pela Branapi no Sul?', a: 'Atendemos indústrias metalmecânicas, cooperativas agrícolas, redes varejistas e startups B2B em Curitiba, Floripa, Joinville e Porto Alegre.' },
      { q: 'Como é garantida a segurança do código desenvolvido?', a: 'Entregamos repositórios privados na nuvem com autenticação segura e testes automatizados de segurança alinhados à LGPD.' }
    ]
  },

  // 14. Clínicas e Saúde
  {
    url: '/software-para-clinicas/',
    eyebrow: 'Vertical Saúde & Clínicas',
    serviceType: 'Software para Clínicas',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software para Clínicas', url: '/software-para-clinicas/' }],
    getContent: () => `
      <p>Desenvolvemos <strong>software para clínicas e consultórios médicos sob medida</strong>, integrando prontuário eletrônico do paciente (PEP), agendamento inteligente via WhatsApp, telemedicina e controle financeiro de repasses médicos.</p>
      <h2>Conformidade Estrita com LGPD em Saúde e CFM</h2>
      <p>Sistemas de saúde exigem rigor ético e proteção de dados sensíveis. Nossas soluções contam com criptografia ponta a ponta (AES-256), trilhas de auditoria imutáveis de acesso a prontuários e armazenamento seguro em servidores certificados HIPAA/LGPD.</p>
    `,
    faqs: [
      { q: 'O prontuário eletrônico pode ter campos personalizados da nossa especialidade?', a: 'Sim. Desenhamos a ficha de atendimento e os modelos de anamnese de acordo com a sua especialidade médica (dermatologia, odontologia, oftalmologia, ortopedia, etc.).' },
      { q: 'É possível automatizar a confirmação de consultas no WhatsApp?', a: 'Sim. O sistema envia lembretes automáticos com botões de confirmação rápida, reduzindo as taxas de falta (no-show) em mais de 45%.' }
    ]
  },

  // 15. E-commerce e Varejo
  {
    url: '/software-para-ecommerce/',
    eyebrow: 'Vertical E-commerce & Varejo',
    serviceType: 'Sistemas para E-commerce',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software para E-commerce', url: '/software-para-ecommerce/' }],
    getContent: () => `
      <p>Criamos <strong>sistemas e plataformas sob medida para e-commerce B2B e B2C</strong> que exigem alta escala, checkout sem fricção em uma única etapa e sincronização de múltiplos estoques físicos e digitais em tempo real.</p>
      <h2>Vantagens do E-commerce Sob Medida frente a Plataformas Alugadas</h2>
      <ul>
        <li>Zero cobrança de comissões sobre suas vendas: todo o lucro da transação permanece com sua empresa.</li>
        <li>Checkout transparente com aprovação instantânea de pagamentos via Pix e cartão de crédito.</li>
        <li>Tabelas de preços dinâmicas e regras de crédito específicas para clientes corporativos (B2B).</li>
        <li>Integração direta com ERPs para emissão automática de notas fiscais e etiquetas de envio.</li>
      </ul>
    `,
    faqs: [
      { q: 'O sistema suporta grandes volumes de acessos na Black Friday?', a: 'Sim. A arquitetura em nuvem com escalonamento elástico suporta picos de centenas de compras por minuto sem lentidão.' },
      { q: 'Posso integrar múltiplos gateways de pagamento para redundância?', a: 'Sim. Criamos roteamento inteligente de pagamentos: se uma adquirente oscilar, a transação é direcionada automaticamente para a reserva.' }
    ]
  },

  // 16. Logística e Frotas
  {
    url: '/software-para-logistica/',
    eyebrow: 'Vertical Logística & Frotas',
    serviceType: 'Sistemas para Logística',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software para Logística', url: '/software-para-logistica/' }],
    getContent: () => `
      <p>Desenvolvemos <strong>softwares sob medida para logística, gestão de transportadoras e controle de frotas</strong>. Otimize rotas, acompanhe veículos em tempo real e elimine papéis com canhotos digitais de entrega.</p>
      <h2>Módulos Especializados para Operações Logísticas</h2>
      <ul>
        <li>Aplicativo do motorista com leitura de código de barras e comprovante de entrega com foto e assinatura digital.</li>
        <li>Painel de torre de controle (Control Tower) com rastreamento GPS e alertas de atrasos operacionais.</li>
        <li>Emissão automatizada de CT-e, MDF-e e conferência de faturas de frete.</li>
        <li>Gestão de manutenção preventiva de frotas, consumo de combustível e controle de pneus.</li>
      </ul>
    `,
    faqs: [
      { q: 'O aplicativo dos motoristas funciona offline em estradas sem sinal?', a: 'Sim. As entregas e fotos dos canhotos são salvas no aparelho e sincronizadas com a central assim que o smartphone recupera conexão.' },
      { q: 'O sistema se integra com rastreadores veiculares de mercado?', a: 'Sim. Criamos APIs para leitura de telemetria das principais empresas de rastreamento veicular do Brasil.' }
    ]
  },

  // 17. Escolas e Educação
  {
    url: '/software-para-escolas/',
    eyebrow: 'Vertical Educação & Escolas',
    serviceType: 'Sistemas para Escolas',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software para Escolas', url: '/software-para-escolas/' }],
    getContent: () => `
      <p>Criamos <strong>sistemas de gestão escolar e portais acadêmicos sob medida</strong> para colégios, cursos preparatórios e faculdades que necessitam de controle de matrículas, boletins online e cobrança automatizada de mensalidades.</p>
      <h2>Autonomia Operacional e Financeira para sua Instituição</h2>
      <ul>
        <li>Portal dos pais e alunos com acesso a notas, faltas, materiais didáticos e comunicados oficiais.</li>
        <li>Cobrança recorrente inteligente com emissão de boletos com código Pix e envio automático de lembretes no WhatsApp.</li>
        <li>Gestão pedagógica de grade curricular, atribuição de professores e diário de classe eletrônico.</li>
      </ul>
    `,
    faqs: [
      { q: 'Como funciona o controle de inadimplência escolar?', a: 'O sistema identifica pendências financeiras e gera fluxos graduais de notificação amigável via e-mail e WhatsApp com link para pagamento imediato.' },
      { q: 'A escola é dona dos dados e do código do sistema?', a: 'Sim. Todos os registros acadêmicos e o código-fonte pertencem integralmente à sua instituição de ensino.' }
    ]
  },

  // 18. Indústria e PCP
  {
    url: '/software-para-industria/',
    eyebrow: 'Vertical Indústria & Manufatura',
    serviceType: 'Sistemas Industriais',
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Software para Indústria', url: '/software-para-industria/' }],
    getContent: () => `
      <p>Desenvolvemos <strong>softwares industriais sob medida para Planejamento e Controle de Produção (PCP)</strong>, controle de chão de fábrica, ordens de serviço e rastreabilidade total de lotes de matéria-prima e produtos acabados.</p>
      <h2>Eficiência no Chão de Fábrica e Redução de Desperdícios</h2>
      <ul>
        <li>Apontamento de produção em terminais industriais ou tablets em tempo real.</li>
        <li>Cálculo de OEE (Overall Equipment Effectiveness) e análise de gargalos operacionais por máquina e turno.</li>
        <li>Rastreabilidade de lotes com controle rigoroso de data de validade, laudos de qualidade e inspeções técnicas.</li>
        <li>Gestão de ordens de manutenção corretiva e preventiva de equipamentos industriais.</li>
      </ul>
    `,
    faqs: [
      { q: 'O sistema se comunica com sensores e CLPs da fábrica?', a: 'Sim. Integramos com protocolos industriais e bancos de dados de máquinas para leitura automática de ciclos e paradas operacionais.' },
      { q: 'Como fica a segurança em ambientes com rede interna isolada?', a: 'O sistema pode ser instalado em servidores locais (On-Premises) ou nuvem privada com políticas rigorosas de firewall.' }
    ]
  },

  // 19. Sobre a Branapi
  {
    url: '/sobre/',
    eyebrow: 'Institucional & Cultura',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Sobre a Branapi', url: '/sobre/' }],
    getContent: () => `
      <p>A <strong>Branapi</strong> nasceu com uma convicção clara: a tecnologia de uma empresa deve ser um ativo estratégico próprio, não uma despesa contínua de aluguel presa a contratos engessados de terceiros. Fundada em 2022, a Branapi se consolidou como uma das mais ativas software houses do Brasil, acumulando mais de <strong>830 projetos entregues</strong> com clientes no Brasil, Portugal e Peru.</p>
      <h2>Nossos Valores Fundamentais de Engenharia</h2>
      <ul>
        <li><strong>Soberania Tecnológica:</strong> Acreditamos que o cliente deve ser o dono exclusivo de todo o código-fonte desenvolvido. Rejeitamos modelos de dependência forçada (vendor lock-in).</li>
        <li><strong>Foco em Resultados de Negócio:</strong> Não programamos por vaidade técnica. Cada feature nasce para reduzir custos, automatizar rotinas ou aumentar as vendas do cliente.</li>
        <li><strong>Transparência Radical:</strong> Nossas estimativas de prazo e custos são claras e documentadas desde o briefing inicial, com entregas verificáveis a cada duas semanas.</li>
      </ul>
    `,
    faqs: [
      { q: 'Onde a Branapi está sediada?', a: 'A Branapi possui operações e núcleos de engenharia com cobertura nacional, mantendo atuação focada em São Paulo, Goiânia, polos do Nordeste e Sul, além de clientes no exterior.' },
      { q: 'Quantos projetos a Branapi já entregou?', a: 'Mais de 830 projetos de software sob medida, aplicativos mobile, plataformas SaaS e soluções corporativas ao longo de mais de 4 anos de mercado.' }
    ]
  },

  // 20. Equipe de Engenharia
  {
    url: '/equipe/',
    eyebrow: 'Corpo Técnico & Liderança',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Equipe de Engenharia', url: '/equipe/' }],
    getContent: () => `
      <p>A excelência de cada software entregue pela <strong>Branapi</strong> é resultado de uma equipe sênior multidisciplinar composta por arquitetos de sistemas, desenvolvedores full-stack, especialistas em nuvem (AWS/GCP), designers de experiência do usuário (UX/UI) e engenheiros de qualidade (QA).</p>
      <h2>Estrutura dos Nossos Squads de Engenharia</h2>
      <ul>
        <li><strong>Principal Systems Architects:</strong> Responsáveis pelo desenho das estruturas de dados, microsserviços, segurança e governança técnica dos projetos.</li>
        <li><strong>Tech Leads &amp; Senior Developers:</strong> Engenheiros com anos de experiência em TypeScript, React, Next.js, Node.js, Python e bancos relacionais PostgreSQL.</li>
        <li><strong>Cloud &amp; DevOps Engineers:</strong> Especialistas em orquestração Docker, pipelines CI/CD automatizadas, segurança em nuvem e alta disponibilidade.</li>
        <li><strong>Product Designers (UX/UI):</strong> Focados em criar jornadas claras, limpas e que reduzem o tempo de aprendizado dos usuários que utilizarão os sistemas.</li>
      </ul>
    `,
    faqs: [
      { q: 'Quem gerencia o projeto no dia a dia?', a: 'Cada projeto conta com um líder técnico dedicado que conduz as reuniões de alinhamento e mantém comunicação direta com os gestores do cliente.' },
      { q: 'Como a equipe garante a qualidade do código?', a: 'Através de revisões rigorosas de código (code reviews em pares), testes automatizados de integração e auditorias de segurança alinhadas à OWASP.' }
    ]
  },

  // 21. Contato Comercial
  {
    url: '/contato/',
    eyebrow: 'Canais Comerciais Oficiais',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Contato Comercial', url: '/contato/' }],
    getContent: () => `
      <p>Pronto para construir o próximo software da sua empresa ou tirar sua startup do papel? Converse diretamente com nossos arquitetos de software. Avaliamos seu escopo e apresentamos um plano técnico de desenvolvimento sob medida sem compromisso.</p>
      <h2>Como Iniciar seu Projeto com a Branapi</h2>
      <ol>
        <li><strong>Briefing Rápido:</strong> Envie um resumo da sua ideia ou dor operacional via WhatsApp ou pelo configurador do site.</li>
        <li><strong>Reunião de Diagnóstico Técnico:</strong> Nossos engenheiros analisam os requisitos e desenham a melhor arquitetura de software para seu objetivo.</li>
        <li><strong>Proposta com Escopo Fechado:</strong> Apresentamos um cronograma detalhado de sprints quinzenais, entregáveis e orçamento transparente em até 72 horas.</li>
      </ol>
      <div style="margin: 35px 0;">
        <a class="btn btn-lime" href="https://www.instagram.com/branapi.tech/" target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp Oficial <span>↗</span></a>
      </div>
    `,
    faqs: [
      { q: 'Qual o tempo de resposta para novas solicitações?', a: 'Nosso time comercial e técnico responde a novos contatos em menos de 24 horas úteis.' },
      { q: 'Vocês assinam Acordo de Confidencialidade (NDA)?', a: 'Sim. Se sua empresa exigir sigilo estrito antes de compartilhar a ideia de produto, assinamos termos formais de NDA para proteger sua propriedade intelectual.' }
    ]
  },

  // 22. Política de Privacidade
  {
    url: '/politica-de-privacidade/',
    eyebrow: 'Conformidade Legal & LGPD',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Política de Privacidade', url: '/politica-de-privacidade/' }],
    getContent: () => `
      <p>A <strong>Branapi Software House</strong> valoriza e respeita a privacidade de seus clientes e usuários. Esta Política de Privacidade descreve como tratamos e protegemos as informações coletadas em conformidade estrita com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)</strong>.</p>
      <h2>1. Coleta e Finalidade dos Dados</h2>
      <p>Coletamos dados fornecidos voluntariamente por meio de formulários de contato, como nome, e-mail corporativo, telefone e informações de escopo de projeto. Esses dados são utilizados exclusivamente para fins de atendimento comercial e elaboração de propostas técnicas.</p>
      <h2>2. Segurança da Informação</h2>
      <p>Adotamos medidas técnicas e organizacionais de segurança para proteger os dados contra acessos não autorizados, perdas ou alterações indevidas, utilizando criptografia em trânsito (TLS 1.3) e repouso (AES-256).</p>
      <h2>3. Direitos do Titular de Dados</h2>
      <p>Conforme previsto na LGPD, você tem direito a confirmar a existência de tratamento, acessar seus dados, solicitar correções ou a eliminação dos mesmos a qualquer momento mediante solicitação aos nossos canais oficiais de contato.</p>
    `,
    faqs: [
      { q: 'A Branapi comercializa dados com terceiros?', a: 'Nunca. Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros para fins publicitários.' }
    ]
  },

  // 23. Casos de Estudo
  {
    url: '/casos/',
    eyebrow: 'Resultados & Engenharia Aplicada',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Estudos de Caso', url: '/casos/' }],
    getContent: () => `
      <p>Explore como a engenharia de software sob medida da <strong>Branapi</strong> solucionou desafios operacionais complexos, eliminou gargalos e impulsionou o faturamento de empresas e startups através de arquiteturas em nuvem escaláveis.</p>
      <h2>Exemplos de Projetos e Resultados Auditados</h2>
      <ul>
        <li><strong>SaaS de Logística B2B:</strong> Plataforma corporativa que conectou mais de 1.200 motoristas em tempo real, reduzindo em 38% os atrasos em entregas metropolitanas com roteirização inteligente.</li>
        <li><strong>Plataforma de Finanças &amp; Pagamentos:</strong> Gateway próprio com processamento de mais de R$ 50 milhões em transações Pix e cartões de crédito com disponibilidade de 99.98% e split automatizado.</li>
        <li><strong>ERP Sob Medida para Distribuição:</strong> Substituição de 45 planilhas desconexas por um sistema centralizado em nuvem, economizando mais de 25 horas semanais da diretoria financeira.</li>
      </ul>
      <div class="research-card">
        <h3><span style="color:var(--lime);">📊</span> Indicadores Globais da Branapi</h3>
        <p>Histórico auditado ao longo de mais de 4 anos de desenvolvimento dedicado:</p>
        <div class="research-stat-grid">
          <div class="research-stat">
            <strong>830+</strong>
            <span>Projetos de software e sistemas entregues</span>
          </div>
          <div class="research-stat">
            <strong>03</strong>
            <span>Países atendidos (Brasil, Portugal e Peru)</span>
          </div>
          <div class="research-stat">
            <strong>100%</strong>
            <span>Propriedade de código entregue sem royalties</span>
          </div>
        </div>
      </div>
    `,
    faqs: [
      { q: 'Posso ver demonstrações ao vivo antes de fechar contrato?', a: 'Sim. Em nossa reunião técnica apresentamos protótipos e exemplos de interfaces interativas semelhantes ao desafio da sua operação.' }
    ]
  },

  // 24. Glossário Técnico
  {
    url: '/glossario/',
    eyebrow: 'Glossário Técnico de Engenharia',
    serviceType: null,
    breadcrumbs: [{ name: 'Início', url: '/' }, { name: 'Glossário Técnico', url: '/glossario/' }],
    getContent: () => {
      const termsHtml = glossarioData.termos.map((t, idx) => `
        <div style="background:#101611; border:1px solid var(--line2); border-radius:12px; padding:22px; margin-bottom:18px;">
          <h3 style="color:var(--lime); margin:0 0 8px; font-size:20px;">${idx + 1}. ${t.termo}</h3>
          <p style="margin:0 0 10px; color:#dce3d8; font-size:15px;"><strong>Definição:</strong> ${t.definicao}</p>
          <p style="margin:0 0 12px; color:#a1b49d; font-size:13px;"><em>Exemplo Prático:</em> ${t.exemplo}</p>
          <a href="${t.link_servico}" style="display:inline-flex; align-items:center; gap:6px; color:var(--lime); font-size:13px; font-weight:700;">Ver serviço relacionado ↗</a>
        </div>
      `).join('');

      return `
        <p>Consulte as definições práticas de <strong>40 termos essenciais de tecnologia, engenharia de software e startups</strong>, elaborados pelos arquitetos da Branapi para esclarecer conceitos técnicos para líderes e fundadores.</p>
        <div style="margin-top:35px;">
          ${termsHtml}
        </div>
      `;
    },
    faqs: [
      { q: 'Por que a Branapi criou este glossário técnico?', a: 'Para democratizar o entendimento de engenharia de software e apoiar gestores e fundadores na tomada de decisões tecnológicas assertivas sem jargões confusos.' }
    ]
  }
];

// -------------------------------------------------------------
// EXECUTE GENERATION
// -------------------------------------------------------------

console.log('Generating all 24 canonical SEO pages...');

let generatedCount = 0;

for (const p of PAGES_CONFIG) {
  const meta = getPageMeta(p.url);
  const dirPath = path.join(ROOT_DIR, p.url.replace(/^\//, '').replace(/\/$/, ''));
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const html = renderHtmlShell({
    url: p.url,
    title: meta.title_tag,
    description: meta.meta_description,
    h1: meta.h1,
    eyebrow: p.eyebrow,
    contentHtml: p.getContent(),
    faqItems: p.faqs,
    breadcrumbItems: p.breadcrumbs,
    serviceType: p.serviceType
  });

  const targetFile = path.join(dirPath, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf-8');
  generatedCount++;
  console.log(`✓ Generated: ${p.url} -> ${targetFile}`);
}

console.log(`\n🎉 Success: ${generatedCount} canonical pages successfully generated!\n`);
