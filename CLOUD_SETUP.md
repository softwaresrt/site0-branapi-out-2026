# Branapi Cloud — configuração (10 minutos)

Telas: `/cloud/login/` · `/cloud/cadastro/` · `/cloud/` · `/cloud/servidor/?id=…` · `/cloud/conta/` · `/cloud/admin/`

## 1. Banco
Supabase > SQL Editor > rode `supabase/cloud.sql` inteiro.
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
Admin entra em `/cloud/admin/` > Novo cliente (e-mail + senha) > Atribuir servidor (plano, prazo, ID da VPS).
Cliente que se cadastra sozinho aparece em Clientes com origem "Auto cadastro"; o admin atribui o servidor depois.

## Sigilo do fornecedor
O ID e qualquer dado da VPS real ficam em `cloud_server_backend` (sem acesso para clientes) e só as edge
functions falam com o fornecedor. O navegador do cliente recebe apenas números normalizados.
