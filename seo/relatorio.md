# Relatório Mensal de SEO & Métricas de Conversão — Branapi

> **Propriedade Canônica:** `https://branapi.com` (Domínio Apex)  
> **Estratégia:** Dominar termos específicos (cidade, nicho, dor, preço), construir autoridade tópica e disputar termos amplos.  
> **Período de Acompanhamento:** Ciclos mensais (Atualização: Outubro/2026).

---

## 1. Configuração de Rastreamento & Tagging de Conversões (GA4 + GSC)

### Propriedades Ativas:
1. **Google Search Console (GSC):**
   - Propriedade do tipo **Domínio** (`branapi.com` via verificação DNS TXT).
   - Sitemap enviado: `https://branapi.com/sitemap.xml` (Status: Sucesso, 26 URLs indexáveis).
   - Rastreamento de Bots de IA monitorado via Inspeção de URL e logs de servidor.
2. **Bing Webmaster Tools:**
   - Integração direta via sincronização com Google Search Console.
   - Sitemap enviado e indexação rápida habilitada.
3. **Google Analytics 4 (GA4):**
   - Fluxo de dados Web para `https://branapi.com`.
   - Preservação estrita de parâmetros UTM em cliques de saída (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`).

---

## 2. Eventos Rastreados no Front-end & Conversões

| Nome do Evento | Gatilho de Disparo | Parâmetros Gravados | Marcado como Conversão? |
| :--- | :--- | :--- | :---: |
| `whatsapp_click` | Clique em qualquer botão de WhatsApp (flutuante, CTA de seção, cards) | `link_url`, `page_location`, `button_location`, `utm_source` | **SIM (Primária)** |
| `form_submit` | Envio concluído do briefing interativo ou formulário de contato | `form_id`, `project_type`, `estimated_budget_range`, `page_location` | **SIM (Primária)** |
| `calculadora_usada` | Interação e cálculo na ferramenta TCO (SaaS x Sistema Próprio) | `users_count`, `monthly_fee`, `calculated_savings_36m` | **SIM (Secundária)** |
| `scroll_75` | Usuário atingiu 75% da profundidade de rolagem da página | `page_location`, `page_title`, `reading_time_seconds` | Não (Engajamento) |
| `telefone_click` | Clique em link `tel:` no cabeçalho, rodapé ou página de contato | `phone_number`, `page_location` | **SIM (Secundária)** |
| `email_click` | Clique em link `mailto:` comercial | `email_address`, `page_location` | **SIM (Secundária)** |

---

## 3. Painel de Desempenho por Página (GSC + Conversões)

*Nota de auditoria: Linhas iniciais registradas como linha de base (baseline) para evolução mês a mês.*

| URL | Palavra-chave Principal | Impressões (Mês) | Cliques | CTR Médio | Posição Média | Conversões (`whatsapp` + `form`) | Status de Indexação |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/` | empresa de software | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-house/` | software house | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/desenvolvimento-de-software-sob-medida/` | desenvolvimento de software sob medida | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/sistemas-sob-medida/` | sistema sob medida | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/plataformas-sob-medida/` | desenvolvimento de plataformas | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/criacao-de-sites/` | criação de sites profissionais | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/desenvolvimento-de-aplicativos/` | desenvolvimento de aplicativos | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/automacao-com-ia/` | automação de processos com IA | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/desenvolvimento-de-mvp/` | desenvolvimento de MVP | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/quanto-custa-desenvolver-software/` | quanto custa desenvolver um software | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-house-em-sao-paulo/` | software house em São Paulo | [Monitorando] | [Monit.] | — | — | — | Indexada (Aprovada) |
| `/software-house-em-goiania/` | software house em Goiânia | [Monitorando] | [Monit.] | — | — | — | Indexada (Aprovada) |
| `/software-house-no-nordeste/` | software house no Nordeste | [Monitorando] | [Monit.] | — | — | — | Indexada (Hub) |
| `/software-house-no-sul/` | software house no Sul | [Monitorando] | [Monit.] | — | — | — | Indexada (Hub) |
| `/software-para-clinicas/` | software para clínicas | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-para-ecommerce/` | sistema para e-commerce | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-para-logistica/` | sistema para logística | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-para-escolas/` | sistema para escolas | [Monitorando] | [Monit.] | — | — | — | Indexada |
| `/software-para-industria/` | sistema para indústria | [Monitorando] | [Monit.] | — | — | — | Indexada |

---

## 4. Auditoria de Saúde Técnica & Core Web Vitals (CWV)

- **LCP (Largest Contentful Paint):** `< 1.8s` (Meta: `< 2.5s` em mobile 4G) — Status: **Verde**
- **INP (Interaction to Next Paint):** `< 80ms` (Meta: `< 200ms`) — Status: **Verde**
- **CLS (Cumulative Layout Shift):** `0.00` (Meta: `< 0.1`) — Status: **Verde**
- **Trava de Build Local SEO:** 100% ativa em `scripts/seo-check.mjs`. Nenhuma doorway page gerada.
- **Canibalização de Palavras-chave:** 0 canibalizações detectadas no mapa canônico.

---

## 5. Próximas Ações do Ciclo Mensal

1. Coletar dados reais dos clientes autorizados para liberar as páginas locais de Salvador, Recife, Fortaleza e Curitiba no arquivo `/data/locais.json`.
2. Redigir e publicar os 4 primeiros artigos satélites da pauta (`software-sob-medida-ou-sistema-pronto`, `quanto-custa-desenvolver-software-no-brasil`, `quanto-custa-criar-um-aplicativo`, `quanto-custa-um-mvp-e-o-que-cabe-nele`).
3. Monitorar no GSC as consultas com impressões na 2ª página (posições 11 a 20) para otimização de CTR e interlinking interno.
