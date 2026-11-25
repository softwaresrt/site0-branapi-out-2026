-- ============================================================================
-- BRANAPI CLOUD — área do cliente (servidores contratados)
-- Rode inteiro no Supabase > SQL Editor. É idempotente (pode rodar de novo).
-- ============================================================================

-- 1. ADMINS ------------------------------------------------------------------
-- Só quem está aqui é admin da Branapi. Cliente que se cadastra NÃO entra aqui.
CREATE TABLE IF NOT EXISTS public.cloud_admins (
    user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_cloud_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.cloud_admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_cloud_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_cloud_admin() TO anon, authenticated;

ALTER TABLE public.cloud_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin le a propria linha" ON public.cloud_admins;
CREATE POLICY "admin le a propria linha" ON public.cloud_admins
    FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 2. PERFIL DO CLIENTE --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cloud_profiles (
    id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email      VARCHAR(255) NOT NULL,
    full_name  VARCHAR(160),
    phone      VARCHAR(40),
    company    VARCHAR(160),
    origin     VARCHAR(16) NOT NULL DEFAULT 'self' CHECK (origin IN ('self','admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cria o perfil sozinho quando alguém se cadastra (auto cadastro ou criado pelo admin)
CREATE OR REPLACE FUNCTION public.handle_new_cloud_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.cloud_profiles (id, email, full_name, phone, company, origin)
    VALUES (
        NEW.id,
        NEW.email,
        NULLIF(LEFT(NEW.raw_user_meta_data->>'full_name', 160), ''),
        NULLIF(LEFT(NEW.raw_user_meta_data->>'phone', 40), ''),
        NULLIF(LEFT(NEW.raw_user_meta_data->>'company', 160), ''),
        CASE WHEN NEW.raw_app_meta_data->>'created_by' = 'branapi_admin' THEN 'admin' ELSE 'self' END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_cloud ON auth.users;
CREATE TRIGGER on_auth_user_created_cloud
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_cloud_user();

DROP TRIGGER IF EXISTS trigger_cloud_profiles_updated_at ON public.cloud_profiles;
CREATE TRIGGER trigger_cloud_profiles_updated_at
BEFORE UPDATE ON public.cloud_profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. SERVIDORES DO CLIENTE (o que o cliente enxerga) -------------------------
CREATE TABLE IF NOT EXISTS public.cloud_servers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name           VARCHAR(120) NOT NULL,
    plan_name      VARCHAR(80)  NOT NULL DEFAULT 'Cloud Start',
    region_label   VARCHAR(80)  NOT NULL DEFAULT 'Brasil',
    os_label       VARCHAR(80)  NOT NULL DEFAULT 'Ubuntu 24.04 LTS',
    vcpu           INT          NOT NULL DEFAULT 1 CHECK (vcpu > 0),
    ram_gb         NUMERIC(6,1) NOT NULL DEFAULT 1 CHECK (ram_gb > 0),
    disk_gb        INT          NOT NULL DEFAULT 25 CHECK (disk_gb > 0),
    traffic_gb     INT          NOT NULL DEFAULT 1000 CHECK (traffic_gb >= 0),
    public_address VARCHAR(255),                  -- IP ou host que o cliente usa pra conectar
    status         VARCHAR(16)  NOT NULL DEFAULT 'active'
                   CHECK (status IN ('active','suspended','expired','provisioning')),
    starts_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at     TIMESTAMPTZ  NOT NULL,
    notes          TEXT,                          -- observação visível ao cliente
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cloud_servers_user    ON public.cloud_servers (user_id);
CREATE INDEX IF NOT EXISTS idx_cloud_servers_expires ON public.cloud_servers (expires_at);

DROP TRIGGER IF EXISTS trigger_cloud_servers_updated_at ON public.cloud_servers;
CREATE TRIGGER trigger_cloud_servers_updated_at
BEFORE UPDATE ON public.cloud_servers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. VÍNCULO COM O FORNECEDOR (NUNCA exposto ao cliente) ---------------------
-- Aqui fica o id da VPS no fornecedor. RLS ligado e SEM nenhuma policy:
-- só a service_role (edge functions) consegue ler/escrever.
CREATE TABLE IF NOT EXISTS public.cloud_server_backend (
    server_id    UUID PRIMARY KEY REFERENCES public.cloud_servers(id) ON DELETE CASCADE,
    provider_ref VARCHAR(255) NOT NULL,           -- id da instância no fornecedor
    internal_note TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.cloud_server_backend ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cloud_server_backend FROM anon, authenticated;

-- 5. HISTÓRICO DE AÇÕES -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cloud_events (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id  UUID REFERENCES public.cloud_servers(id) ON DELETE CASCADE,
    user_id    UUID,
    actor      VARCHAR(16) NOT NULL DEFAULT 'system' CHECK (actor IN ('client','admin','system')),
    action     VARCHAR(48) NOT NULL,
    detail     TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cloud_events_server ON public.cloud_events (server_id, created_at DESC);

-- 6. RLS ---------------------------------------------------------------------
ALTER TABLE public.cloud_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_servers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_events   ENABLE ROW LEVEL SECURITY;

-- Cliente: lê e edita só o próprio perfil (não consegue trocar e-mail/origem)
DROP POLICY IF EXISTS "cliente le proprio perfil" ON public.cloud_profiles;
CREATE POLICY "cliente le proprio perfil" ON public.cloud_profiles
    FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_cloud_admin());

DROP POLICY IF EXISTS "cliente edita proprio perfil" ON public.cloud_profiles;
CREATE POLICY "cliente edita proprio perfil" ON public.cloud_profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid()) WITH CHECK (id = auth.uid());

REVOKE UPDATE ON public.cloud_profiles FROM authenticated;
GRANT  UPDATE (full_name, phone, company) ON public.cloud_profiles TO authenticated;

-- Cliente: só LÊ os próprios servidores. Criar/alterar é só pelo admin (edge function).
DROP POLICY IF EXISTS "cliente le proprios servidores" ON public.cloud_servers;
CREATE POLICY "cliente le proprios servidores" ON public.cloud_servers
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_cloud_admin());

DROP POLICY IF EXISTS "cliente le proprios eventos" ON public.cloud_events;
CREATE POLICY "cliente le proprios eventos" ON public.cloud_events
    FOR SELECT TO authenticated
    USING (
        public.is_cloud_admin()
        OR server_id IN (SELECT id FROM public.cloud_servers WHERE user_id = auth.uid())
    );

REVOKE INSERT, UPDATE, DELETE ON public.cloud_servers FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.cloud_events  FROM anon, authenticated;

-- 7. CORREÇÃO IMPORTANTE NO BLOG / ADMIN EDITORIAL ----------------------------
-- As policies antigas diziam "qualquer usuário authenticated tem acesso total".
-- Com auto cadastro, TODO cliente vira "authenticated" e poderia editar o blog.
-- Aqui trocamos para "somente admin". Seus admins atuais precisam estar em
-- cloud_admins (veja o passo 8).
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('blog_posts','blog_categories','blog_authors','blog_redirects','ready_solutions')
      AND policyname LIKE 'Authenticated users have full access%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['blog_posts','blog_categories','blog_authors','blog_redirects','ready_solutions'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin gerencia %1$s" ON public.%1$I', t);
    EXECUTE format(
      'CREATE POLICY "admin gerencia %1$s" ON public.%1$I FOR ALL TO authenticated
       USING (public.is_cloud_admin()) WITH CHECK (public.is_cloud_admin())', t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON public.blog_audit_logs;
DROP POLICY IF EXISTS "admin le audit logs" ON public.blog_audit_logs;
CREATE POLICY "admin le audit logs" ON public.blog_audit_logs
    FOR SELECT TO authenticated USING (public.is_cloud_admin());

-- 8. TORNAR UM USUÁRIO ADMIN --------------------------------------------------
-- Crie o usuário em Authentication > Users (ou use o que já existe) e rode:
--
--   INSERT INTO public.cloud_admins (user_id)
--   SELECT id FROM auth.users WHERE email = 'SEU-EMAIL@branapi.com'
--   ON CONFLICT DO NOTHING;
--
-- 9. EXPIRAÇÃO AUTOMÁTICA (opcional, mas recomendado) -------------------------
-- Marca como 'expired' o que passou do prazo. Agende com pg_cron:
--   SELECT cron.schedule('cloud-expire', '*/30 * * * *', 'SELECT public.cloud_expire_servers()');
CREATE OR REPLACE FUNCTION public.cloud_expire_servers()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE n INTEGER;
BEGIN
    UPDATE public.cloud_servers
       SET status = 'expired'
     WHERE status = 'active' AND expires_at < NOW();
    GET DIAGNOSTICS n = ROW_COUNT;
    RETURN n;
END;
$$;
REVOKE ALL ON FUNCTION public.cloud_expire_servers() FROM PUBLIC, anon, authenticated;
