# BRANAPI — Novo site institucional / versão premium

Site completo, responsivo e navegável para a Branapi, com copy comercial **100% reescrita**, marca original e dois percursos de compra: **desenvolvimento sob medida** e **produtos prontos**. Esta entrega é uma implementação estática sem dependências externas (HTML, CSS e JavaScript), preparada para publicação direta na Vercel, Netlify ou hospedagem tradicional.

## COMO ABRIR AGORA

1. Extraia o ZIP.
2. Abra `index.html` no navegador.
3. Faça scroll, teste os links dos quatro produtos e o configurador de projeto.

É possível publicar a pasta inteira em uma hospedagem estática. Você também pode executar `python3 -m http.server 8000` dentro da pasta e acessar `http://localhost:8000`.

## AJUSTE OBRIGATÓRIO ANTES DE PUBLICAR

**Insira o WhatsApp comercial REAL da Branapi em `config.js`.**

```
whatsappNumber: '55DDDNUMERO'
```

Exemplo acima é apenas o formato, **não é um telefone**. Informe DDI + DDD + número, tudo junto, apenas dígitos. Esse valor cria links oficiais `wa.me` nos botões de contato e no botão flutuante no canto inferior direito. **Sem esse número**, por segurança, o site não inventa um destinatário: os botões de contato encaminham para a área de contato do site atual `www.branapi.com/#contato` e o configurador oferece o briefing para copiar/baixar.

Se quiser botão de reunião, preencha `meetingUrl` com o link verdadeiro de agenda e implemente a exibição no cabeçalho ou seção de contato. Não foi incluído um botão de agendar sem URL válida.

## PRODUTOS E LINKS REAIS

| Produto | Destino |
|---|---|
| Plataforma de infoprodutos | https://www.suakiwify.online/ |
| Plataforma BET | https://www.donodebet.online/ |
| Gateway de pagamentos | https://www.meugateway.com.br/ |
| Código-fonte BaaS | https://www.plataformabaas.online/ |

Os links já estão aplicados nos cards em `index.html`. As imagens das interfaces dentro desses cards são **ilustrações produzidas em CSS**; não são capturas reais nem provam funcionalidades ou resultados. Confirme condições de licenciamento, integrações, implantação e funcionalidades em cada página de produto antes de qualquer compromisso comercial.

Importante: BaaS significa SOFTWARE e licenciamento de código-fonte, **não** a autorização para operar serviços financeiros como instituição regulamentada. A plataforma BET deve ser ofertada respeitando as regras e permissões legais aplicáveis aos operadores.

## ONDE TROCAR TUDO

- `config.js` — telefone comercial, Instagram, links, números institucionais de referência.
- `index.html` — todos os textos e seções, SEO, links, conteúdo de cards e FAQ.
- `styles.css` — cores (variáveis no topo), tamanhos, tipografia, animações e responsividade.
- `app.js` — menu mobile, scroll, rede espacial animada por projeção matemática em Canvas 2D, terminal demonstrativo, configurador e novos blocos interativos.
- `assets/branapi-wordmark.png` — **logo original enviada**, com transparência, sem alterações.
- `COPY_COMPLETA_BRANAPI.md` — a copy editorial organizada fora do HTML.

## MELHORIAS DESTA VERSÃO

- Copy da hero deixa explícito: **software sob medida** + **4 plataformas prontas**.
- Removidos índices decorativos pequenos (01/02/03 etc.), texto "Feito para evoluir" e pesquisa da navegação.
- Tipografia ampliada nos títulos de apoio, descrições, botões e labels, incluindo em mobile.
- Motion extra: cards entrando por lados diferentes, blur e scale no scroll, paralaxe leve da hero, faixa de texto animada, transições dos elementos dos painéis.
- Seção 7 transformada num laboratório visual de 3 demonstrações clicáveis.
- Seção 8 transformada num seletor entre serviço sob medida e quatro produtos com links oficiais, mantendo apenas três perguntas rápidas.
- Respeito à preferência de reduzir animações do sistema operacional.

## INTERAÇÕES QUE FUNCIONAM

- Menu responsivo e cabeçalho flutuante; botão de pesquisa/atalhos removido conforme solicitado.
- Navegação por âncoras e barra de progresso de leitura.
- Preloader curto que não reaparece na mesma sessão.
- Cena em Canvas com projeção espacial tridimensional, conexões, pulsos, rotação por arrasto e toque, resposta a clique; fallback de redução de movimento.
- Entrada animada e variada de conteúdo por viewport (movimentos laterais, escala e blur), profundidade na hero, barra de progresso por rolagem e faixa tipográfica em movimento, sem travar o scroll.
- Cards dos quatro produtos apontando para os quatro URLs fornecidos.
- Configurador de briefing em quatro passos com escolhas simples e múltiplas; resumo ao vivo, persistência local e exportação `.txt`.
- Preparação do contato com mensagem já estruturada no WhatsApp quando o número for informado.
- Terminal de etapas animadas **claramente apresentado como demonstração**, sem fingir deploy real.
- Nova seção de demonstrações clicáveis (CRM, operações, IA), novo seletor de contratação (sob medida ou 4 produtos prontos), FAQ compacto, animações de rolagem e layout para desktop/mobile.

## PUBLICAR NA VERCEL

1. Crie um repositório Git e envie **todos os arquivos da pasta** para a raiz do repositório.
2. Na Vercel, selecione **New Project → Import Git Repository**.
3. Framework preset: **Other**. Sem build command obrigatório; output directory `.`, ou deixar em branco conforme a interface.
4. Faça o deploy. Depois associe `branapi.com` no painel de Domains somente quando desejar substituir o site atual.
5. Teste: iPhone, Android, desktop, formulário e WhatsApp com número já configurado.

**Alternativa:** Netlify Drop para subir a pasta estática rapidamente (não é necessária instalação de dependências).

## CHECKLIST PRÉ-LANÇAMENTO

- [ ] Confirmar o número comercial do WhatsApp e preencher `config.js`.
- [ ] Aprovar a copy e os números institucionais `830+`, `4+` e `03`.
- [ ] Validar detalhes e condições de cada plataforma pronta.
- [ ] Adicionar prints oficiais de produtos, se quiser substituir as ilustrações.
- [ ] Acrescentar portfólio/cases e logotipos de clientes **somente com autorização e provas reais**.
- [ ] Adicionar política de privacidade e dados empresariais oficiais, caso se aplique ao lançamento.
- [ ] Testar redirecionamentos, mobile, acessibilidade e domínio definitivo.

## NOTA TÉCNICA SOBRE O BRIEF ORIGINAL

O briefing anexado previa também uma versão React/Vite/TypeScript/React Three Fiber com páginas internas, models 3D GLB, métricas e cases, áreas de time, i18n e chat com API futura. **Esta entrega é uma implementação estática funcional, com mais interatividade e uma copy mais objetiva**, não uma implementação de todas as 17 seções nem dessa stack. Preferi não inventar imagens do time, marcas clientes, métricas operacionais ou cases que não foram enviados. Ela pode ser migrada para React/R3F numa próxima versão, preservando conteúdo e visual.

---

BRANAPI © 2026 — arquivo de trabalho para apresentação e publicação após revisão comercial.
