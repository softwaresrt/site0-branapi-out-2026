# Checklist de Pendências Reais da Branapi (Google Brasil 2026)

> **Regra Inegociável Google 2026:** Proibido inventar dados. Todas as informações abaixo não puderam ser verificadas publicamente de forma documental e permanecem como `[PENDENTE]`. Nenhuma página com campo obrigatório pendente é liberada na trava de build.
> 
> Preencha os campos abaixo para que as respectivas páginas locais, de autoria e de casos de estudo sejam liberadas na esteira de produção.

---

## 1. Cadastro Institucional, Contato & NAP (Consistência Google Meu Negócio / Footer / Schema)

- [ ] **CNPJ Oficial:** Número do CNPJ ativo da Branapi para constar em `/sobre/`, `/politica-de-privacidade/` e no Schema `Organization` (`legalName` e `taxID`).
- [ ] **Endereço Físico Completo (Sede SP / GO):** Logradouro, número, complemento, bairro, cidade, CEP (para exibir no rodapé, página `/contato/` e alimentar `PostalAddress` no JSON-LD do Perfil da Empresa no Google).
- [ ] **Telefone Comercial / WhatsApp Oficial:** Número com DDI + DDD (ex: `55629...` ou `55119...`) para substituir em `config.js` (`whatsappNumber`), no botão flutuante e no Schema `ContactPoint`.
- [ ] **E-mail Corporativo de Contato:** Ex: `contato@branapi.com` ou `comercial@branapi.com`.
- [ ] **Data / Ano de Fundação:** Confirmar se é 2022 (para o atributo `foundingDate`).
- [ ] **Links de Perfis Corporativos Verificados (sameAs):**
  - LinkedIn da Branapi (URL oficial da Company Page):
  - Clutch / GoodFirms / Trustpilot (se houver perfil ativo):
  - GitHub Institucional:

---

## 2. Equipe Executiva & Autoria E-E-A-T (`/equipe/` e Autores do Blog)

Para cumprir as diretrizes de E-E-A-T do Google, artigos técnicos e páginas institucionais exigem autoria nominal humana com credenciais auditáveis (Schema `Person`):

- [ ] **Fundador / CEO / Diretor de Engenharia:**
  - Nome completo:
  - Cargo executivo:
  - Mini-bio técnica (3 a 5 linhas destacando tempo de mercado e especialidade):
  - Foto de perfil profissional em alta resolução (1:1):
  - Link do perfil do LinkedIn:
- [ ] **Tech Lead / Especialista de Produto (se houver segundo autor para o blog):**
  - Nome completo:
  - Cargo:
  - Mini-bio:
  - Link do LinkedIn:

---

## 3. Trava de Build para Páginas Locais (`/data/locais.json`)

Para que as páginas `/software-house-em-[cidade]/` saiam da condição de rascunho bloqueado e sejam geradas sem risco de punição por doorway pages, cada cidade precisa de **pelo menos 4 dos 5 critérios preenchidos com dados reais**:

### A) Salvador - BA (`/software-house-em-salvador/`)
- [ ] Nome de cliente ou projeto real com autorização para citação:
- [ ] Depoimento real de cliente local (com nome, cargo e empresa):
- [ ] Formato de atendimento acordado para clientes da Bahia (remoto / visitas executivas):

### B) Recife - PE (`/software-house-em-recife/`)
- [ ] Nome de cliente ou projeto real em Pernambuco / Porto Digital:
- [ ] Depoimento real de cliente:
- [ ] Formato de atendimento regional:

### C) Fortaleza - CE (`/software-house-em-fortaleza/`)
- [ ] Nome de cliente ou projeto real no Ceará:
- [ ] Depoimento real de cliente:
- [ ] Formato de atendimento:

### D) Curitiba - PR (`/software-house-em-curitiba/`)
- [ ] Nome de cliente ou projeto real no Paraná:
- [ ] Depoimento real de cliente:
- [ ] Formato de atendimento:

### E) Belo Horizonte - MG (`/software-house-em-belo-horizonte/`)
- [ ] Nome de cliente ou projeto real em Minas Gerais:
- [ ] Depoimento real:
- [ ] Formato de atendimento:

### F) Porto Alegre - RS & Florianópolis - SC
- [ ] Nome de cliente ou projeto real no RS e SC:
- [ ] Depoimentos reais:

---

## 4. Estudos de Caso Reais (`/casos/` e `/casos/[slug]/`)

Estudos de caso reais são o ativo de SEO e conversão mais valioso de uma software house. Precisamos de **3 a 5 casos de clientes reais** que autorizaram publicação:

Para cada caso preencher:
1. **Nome da Empresa Cliente:**
2. **Setor / Segmento:** (Ex: Logística, Agronegócio, Fintech, Saúde)
3. **Desafio Inicial:** (Qual era a dor anterior ao projeto?)
4. **Solução Desenvolvida:** (Sistema, app, automação com IA ou MVP?)
5. **Tecnologias Utilizadas:**
6. **Métrica de Resultado Real Auditável:** (Ex: 'redução de 35% no tempo de faturamento', 'mais de 100 mil transações processadas')
7. **Depoimento do Cliente:** (Texto com autorização expressa)
8. **Screenshots das Telas:** (Prints limpos e autorizados)

---

## 5. Ferramentas, Gateways & Agendamento

- [ ] **Link de Agendamento Automático de Reunião:** URL do Calendly, Cal.com ou Google Calendar (campo `meetingUrl` em `config.js`).
- [ ] **ID da Propriedade do Google Analytics 4 (GA4):** Código `G-XXXXXXXXXX` para inserir no container de medição.
- [ ] **Token de Verificação do Google Search Console:** Tag HTML ou registro TXT de DNS para confirmar propriedade canônica de domínio no GSC.
