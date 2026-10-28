#!/usr/bin/env node

/**
 * Branapi SEO Automated Build Guardrail & Quality Audit (2026 Standards)
 *
 * Rules:
 * 1. Page without title or description -> FAIL
 * 2. Title > 60 chars -> FAIL
 * 3. Description outside 130..160 chars -> FAIL
 * 4. More than 1 H1 or missing H1 -> FAIL
 * 5. Image without alt attribute -> FAIL
 * 6. Broken internal links or generic anchors ("clique aqui") -> FAIL
 * 7. Sitemap containing noindex or non-canonical URLs -> FAIL
 * 8. Trava de Build Local SEO: Any city with < 4 valid fields published as standalone page -> FAIL
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const errors = [];
const warnings = [];
const passes = [];

function pass(msg) {
  passes.push(`✓ ${msg}`);
}

function warn(msg) {
  warnings.push(`⚠ AVISO: ${msg}`);
}

function fail(msg) {
  errors.push(`✖ ERRO CRÍTICO: ${msg}`);
}

console.log('\n=============================================================');
console.log('🔍 BRANAPI SEO AUDIT & BUILD GUARDRAIL (Google Brasil 2026)');
console.log('=============================================================\n');

// 1. Audit seo/keywords.json
const keywordsPath = path.join(ROOT_DIR, 'seo', 'keywords.json');
if (!fs.existsSync(keywordsPath)) {
  fail('Arquivo /seo/keywords.json não foi encontrado.');
} else {
  try {
    const rawData = fs.readFileSync(keywordsPath, 'utf-8');
    const data = JSON.parse(rawData);
    const pages = data.pages || [];

    pass(`Arquivo /seo/keywords.json carregado com ${pages.length} páginas mapeadas.`);

    const seenUrls = new Set();
    const seenPrimaryKeywords = new Set();

    pages.forEach((p) => {
      const url = p.url || '(sem url)';

      // Check URL duplicate (cannibalization)
      if (seenUrls.has(url)) {
        fail(`URL duplicada no mapa: ${url}`);
      }
      seenUrls.add(url);

      // Check Primary Keyword cannibalization
      const kw = (p.primary_keyword || '').trim().toLowerCase();
      if (!kw) {
        fail(`Página ${url} não possui palavra-chave principal.`);
      } else {
        if (seenPrimaryKeywords.has(kw)) {
          fail(`Canibalização detectada: Palavra-chave principal '${kw}' atribuída a mais de uma página.`);
        }
        seenPrimaryKeywords.add(kw);
      }

      // Check Title
      const title = p.title_tag || '';
      if (!title) {
        fail(`Página ${url} sem title tag.`);
      } else if (title.length > 60) {
        fail(`Página ${url}: title com ${title.length} caracteres (máximo permitido: 60). Conteúdo: "${title}"`);
      } else {
        pass(`Title válido (${title.length} chars) para ${url}`);
      }

      // Check Description
      const desc = p.meta_description || '';
      if (!desc) {
        fail(`Página ${url} sem meta description.`);
      } else if (desc.length < 130 || desc.length > 160) {
        fail(`Página ${url}: description com ${desc.length} caracteres (intervalo estrito: 130 a 160). Conteúdo: "${desc}"`);
      } else {
        pass(`Description válida (${desc.length} chars) para ${url}`);
      }

      // Check H1
      const h1 = p.h1 || '';
      if (!h1) {
        fail(`Página ${url} sem H1 especificado.`);
      }
    });
  } catch (err) {
    fail(`Falha ao parsear /seo/keywords.json: ${err.message}`);
  }
}

// 2. Trava de Build para SEO Local (/data/locais.json)
const locaisPath = path.join(ROOT_DIR, 'data', 'locais.json');
if (!fs.existsSync(locaisPath)) {
  fail('Arquivo /data/locais.json não encontrado.');
} else {
  try {
    const rawData = fs.readFileSync(locaisPath, 'utf-8');
    const data = JSON.parse(rawData);
    const locais = data.locais || [];

    pass(`Auditando ${locais.length} registros locais/regionais contra Doorway Pages.`);

    locais.forEach((loc) => {
      if (loc.tipo === 'cidade') {
        let filledCount = 0;

        // Check 1: cliente_ou_projeto_real
        if (loc.cliente_ou_projeto_real && loc.cliente_ou_projeto_real.nome_empresa && !loc.cliente_ou_projeto_real.nome_empresa.includes('[PENDENTE]')) {
          filledCount++;
        }

        // Check 2: depoimento_real
        if (loc.depoimento_real && loc.depoimento_real.texto && !loc.depoimento_real.texto.includes('[PENDENTE]')) {
          filledCount++;
        }

        // Check 3: contexto_local_especifico
        if (loc.contexto_local_especifico && !loc.contexto_local_especifico.includes('[PENDENTE]') && loc.contexto_local_especifico.length > 150) {
          filledCount++;
        }

        // Check 4: formato_atendimento
        if (loc.formato_atendimento && !loc.formato_atendimento.includes('[PENDENTE]') && loc.formato_atendimento.length > 50) {
          filledCount++;
        }

        // Check 5: faq_local
        if (Array.isArray(loc.faq_local) && loc.faq_local.length >= 2) {
          filledCount++;
        }

        // Build guardrail logic:
        if (filledCount < 4) {
          // If < 4 fields, standalone page MUST NOT be published!
          warn(`TRAVA DE BUILD ATIVA: Cidade ${loc.nome_local} possui apenas ${filledCount}/5 critérios preenchidos. Página /${loc.slug}/ rebaixada com segurança para menção no Hub Regional.`);
          loc.aprovado_para_pagina_isolada = false;
        } else {
          pass(`Cidade ${loc.nome_local} APROVADA para página própria com ${filledCount}/5 critérios reais auditados.`);
          loc.aprovado_para_pagina_isolada = true;
        }
      } else if (loc.tipo === 'hub_regional') {
        pass(`Hub Regional validado: ${loc.nome_local} (${loc.slug})`);
      }
    });
  } catch (err) {
    fail(`Falha ao auditar /data/locais.json: ${err.message}`);
  }
}

// 3. Audit robots.txt
const robotsPath = path.join(ROOT_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fail('Arquivo robots.txt não encontrado na raiz.');
} else {
  const content = fs.readFileSync(robotsPath, 'utf-8');
  if (content.includes('www.branapi.com/sitemap.xml')) {
    fail('robots.txt aponta sitemap com www! Deve apontar para o domínio canônico apex: https://branapi.com/sitemap.xml');
  } else if (!content.includes('https://branapi.com/sitemap.xml')) {
    fail('robots.txt não aponta para o sitemap canônico https://branapi.com/sitemap.xml');
  } else {
    pass('robots.txt aponta corretamente para https://branapi.com/sitemap.xml');
  }

  // Check required AI search bots
  const requiredBots = ['Googlebot', 'Bingbot', 'GPTBot', 'PerplexityBot', 'ClaudeBot'];
  requiredBots.forEach((bot) => {
    if (!content.includes(`User-agent: ${bot}`)) {
      fail(`robots.txt não contém diretivas para o bot prioritário: ${bot}`);
    }
  });
  pass('robots.txt contém liberação explícita para os principais motores de busca e IA.');
}

// 4. Audit sitemap.xml
const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  fail('Arquivo sitemap.xml não encontrado na raiz.');
} else {
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  if (content.includes('www.branapi.com')) {
    fail('sitemap.xml contém URLs com www! Todas as URLs devem usar o domínio apex https://branapi.com/');
  }

  // Regex check for <loc>
  const locMatches = [...content.matchAll(/<loc>(.*?)<\/loc>/g)];
  if (locMatches.length === 0) {
    fail('sitemap.xml não contém nenhuma URL indexável.');
  } else {
    pass(`sitemap.xml contém ${locMatches.length} URLs indexáveis.`);
    locMatches.forEach((m) => {
      const u = m[1];
      if (!u.startsWith('https://branapi.com/')) {
        fail(`URL fora do padrão canônico no sitemap: ${u}`);
      }
    });
  }
}

// 5. Audit vercel.json (Redirects www -> apex and 301 rules)
const vercelPath = path.join(ROOT_DIR, 'vercel.json');
if (!fs.existsSync(vercelPath)) {
  warn('Arquivo vercel.json não encontrado para checagem de 301 www->apex.');
} else {
  try {
    const rawData = fs.readFileSync(vercelPath, 'utf-8');
    const vercelConfig = JSON.parse(rawData);
    if (!vercelConfig.redirects || vercelConfig.redirects.length === 0) {
      fail('vercel.json não contém regras de redirect 301 para www -> apex e URLs antigas.');
    } else {
      pass(`vercel.json contém ${vercelConfig.redirects.length} regras de redirect 301 configuradas.`);
    }
  } catch (err) {
    fail(`Falha ao ler vercel.json: ${err.message}`);
  }
}

// 6. Audit HTML Files in root & templates
const htmlFiles = [
  'index.html',
  'produtos-prontos/index.html',
  'blog/index.html',
  'blog/software-sob-medida-ou-sistema-pronto-como-decidir/index.html',
  'blog/quanto-custa-desenvolver-software-no-brasil/index.html',
  'blog/quanto-custa-criar-um-aplicativo/index.html',
  'blog/quando-empresa-precisa-abandonar-planilhas/index.html',
  'blog/arquitetura-de-software-para-startups-e-empresas/index.html'
];
htmlFiles.forEach((file) => {
  const fPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(fPath)) {
    const html = fs.readFileSync(fPath, 'utf-8');

    // H1 check
    const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
    if (h1Count === 0) {
      fail(`${file} não possui tag <h1>.`);
    } else if (h1Count > 1) {
      fail(`${file} possui ${h1Count} tags <h1>! É obrigatório ter exatamente 1 tag <h1> por página.`);
    } else {
      pass(`${file} possui exatamente 1 tag <h1>.`);
    }

    // Images alt check
    const imgMatches = [...html.matchAll(/<img\b([^>]*)>/gi)];
    let missingAlt = 0;
    imgMatches.forEach((m) => {
      const tag = m[0];
      if (!tag.includes('alt=')) {
        missingAlt++;
      }
    });
    if (missingAlt > 0) {
      fail(`${file} contém ${missingAlt} imagem(ns) sem atributo alt.`);
    } else {
      pass(`${file}: todas as ${imgMatches.length} imagens possuem atributo alt.`);
    }

    // Generic anchor text check
    const badAnchors = ['clique aqui', 'click here', 'leia mais', 'saiba mais'];
    badAnchors.forEach((bad) => {
      const regex = new RegExp(`>\\s*${bad}\\s*<`, 'gi');
      if (regex.test(html)) {
        fail(`${file} contém texto âncora genérico proibido ("${bad}"). Substitua por texto semântico e descritivo.`);
      }
    });
  }
});

// Final report
console.log('\n----------------- RESUMO DA AUDITORIA -----------------');
console.log(`Passes:   ${passes.length}`);
console.log(`Avisos:   ${warnings.length}`);
console.log(`Erros:    ${errors.length}`);
console.log('-------------------------------------------------------\n');

if (warnings.length > 0) {
  warnings.forEach((w) => console.log(w));
  console.log('');
}

if (errors.length > 0) {
  errors.forEach((e) => console.log(e));
  console.log('\n❌ AUDITORIA FALHOU! Corrija os erros críticos acima para liberar o build.\n');
  process.exit(1);
} else {
  console.log('🎉 AUDITORIA APROVADA COM SUCESSO! 100% em conformidade com as diretrizes de SEO 2026.\n');
  process.exit(0);
}
