# Branapi Cloud — configuração (10 minutos)

Telas: `/cloud/login/` · `/cloud/cadastro/` · `/cloud/` · `/cloud/servidor/?id=…` · `/cloud/conta/` · `/cloud/suporte/` · `/cloud/admin/`

## 1. Banco
Supabase > SQL Editor > rode `supabase/cloud.sql` inteiro (é idempotente).
Depois torne você admin (troque o e-mail):

    INSERT INTO public.cloud_admins (user_id)
    SELECT id FROM auth.users WHERE email = 'SEU-EMAIL@branapi.com' ON CONFLICT DO NOTHING;

O usuário precisa existir antes em Authentication > Users.

## 2. Edge Functions
    supabase functions deploy cloud-admin
    supabase functions deploy cloud-server

Secrets (Edge Functions > Secrets):
- `ALLOWED_ORIGINS` = `https://branapi.com,https://www.branapi.com`
- `PROVIDER_API_URL` e `PROVIDER_API_TOKEN` = API da VPS por trás (só quando tiver)
- `CLOUD_DEMO_METRICS` = `true` apenas para testar as telas sem fornecedor

Ajuste as rotas do fornecedor em `supabase/functions/_shared/provider.ts` (funções marcadas "AJUSTE AQUI").

## 3. Auth
Authentication > URL Configuration: em Redirect URLs adicione `https://branapi.com/cloud/login/`.
Em Providers > Email decida se exige confirmação de e-mail (o cadastro funciona nos dois casos).
Recomendado: senha mínima 10 e proteção contra senhas vazadas.

## 4. Uso
- **Servidores e Planos**: Admin entra em `/cloud/admin/` > Novo cliente (e-mail + senha) > Atribuir servidor (escolha o plano pré-configurado da Branapi, domínio do cliente, DNS, prazo, conta e ID da VPS).
- **Apontamento de Domínio**: O cliente vê na tela do servidor os registros DNS (Tipo A e CNAME) para apontar no seu provedor de domínio.
- **Suporte interno**: O cliente abre chamados em `/cloud/suporte/`. O admin atende em tempo real na aba "Chamados" do painel de administração, com chat interativo e controle de status (Aberto, Em atendimento, Resolvido, Encerrado).
- **Regra de Chamados**: O cliente só pode abrir 1 chamado por vez enquanto houver chamado ativo (aberto ou em atendimento). Ao encerrar, um novo chamado pode ser aberto.

## Sigilo do fornecedor
O ID e qualquer dado da VPS real ficam em `cloud_server_backend` (sem acesso para clientes) e só as edge functions falam com o fornecedor. O navegador do cliente recebe apenas números normalizados.
