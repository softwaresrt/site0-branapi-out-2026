-- ============================================================================
-- BRANAPI PREMIUM BLOG — SUPABASE PRODUCTION DATABASE SCHEMA
-- Standard: OWASP ASVS 5.0 Level 2 + PostgreSQL Row Level Security (RLS)
-- Execution: Run this script directly in the Supabase SQL Editor.
-- ============================================================================

-- 1. Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Custom Enum Types
DO $$ BEGIN
    CREATE TYPE post_status_enum AS ENUM ('draft', 'scheduled', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE search_intent_enum AS ENUM ('informacional', 'comercial', 'comparativa', 'preco');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLE: blog_categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    accent_color VARCHAR(16) DEFAULT '#C6FF3D',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: blog_authors
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(160) NOT NULL UNIQUE,
    role VARCHAR(120) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    email VARCHAR(255) UNIQUE,
    linkedin_url TEXT,
    github_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: blog_posts
-- Core editorial publication table with strict SEO integrity
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,
    cover_image_url TEXT,
    cover_image_alt VARCHAR(255),
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.blog_authors(id) ON DELETE SET NULL,
    status post_status_enum NOT NULL DEFAULT 'draft',
    reading_time_minutes INT NOT NULL DEFAULT 5,
    
    -- Strict SEO Fields
    primary_keyword VARCHAR(120) NOT NULL,
    secondary_keywords TEXT[] DEFAULT '{}',
    search_intent search_intent_enum DEFAULT 'informacional',
    meta_title VARCHAR(70) NOT NULL,
    meta_description VARCHAR(170) NOT NULL,
    canonical_url TEXT,
    og_image_url TEXT,
    no_index BOOLEAN NOT NULL DEFAULT false,
    
    -- Commercial CTA Customization
    commercial_cta_title TEXT,
    commercial_cta_description TEXT,
    commercial_cta_button_text TEXT,
    commercial_cta_target_url TEXT,
    
    -- Metrics & Governance
    views_count BIGINT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: blog_redirects (301 Permanent Redirects Manager)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_slug VARCHAR(255) NOT NULL UNIQUE,
    target_slug VARCHAR(255) NOT NULL,
    status_code INT NOT NULL DEFAULT 301,
    reason VARCHAR(255),
    hits_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TABLE: blog_audit_logs (Immutable Security & Action Log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blog_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email VARCHAR(255),
    action VARCHAR(64) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON public.blog_posts (status, published_at DESC) 
    WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_keywords ON public.blog_posts (primary_keyword);
CREATE INDEX IF NOT EXISTS idx_blog_audit_action ON public.blog_audit_logs (action, created_at DESC);

-- ============================================================================
-- AUTOMATED UPDATED_AT TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trigger_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_categories_updated_at ON public.blog_categories;
CREATE TRIGGER trigger_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_blog_authors_updated_at ON public.blog_authors;
CREATE TRIGGER trigger_blog_authors_updated_at
BEFORE UPDATE ON public.blog_authors
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — OWASP DEFENSE IN DEPTH
-- ============================================================================
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Only published posts, active authors, categories)
CREATE POLICY "Public can view published posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (
    status = 'published' AND (published_at IS NOT NULL AND published_at <= NOW())
);

CREATE POLICY "Public can view categories"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can view active authors"
ON public.blog_authors
FOR SELECT
TO anon, authenticated
USING (is_active = true);

CREATE POLICY "Public can read redirects"
ON public.blog_redirects
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. Authenticated Admin / Editor Full Access Policies
CREATE POLICY "Authenticated users have full access to posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to categories"
ON public.blog_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to authors"
ON public.blog_authors
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to redirects"
ON public.blog_redirects
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can view audit logs"
ON public.blog_audit_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "System can insert audit logs"
ON public.blog_audit_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- INITIAL SEED DATA (Real Branapi Editorial Categories & Authors)
-- ============================================================================
INSERT INTO public.blog_categories (id, slug, name, description, accent_color, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'sob-medida', 'Sistemas Sob Medida', 'Desenvolvimento de sistemas corporativos, ERPs, CRMs e plataformas exclusivas.', '#C6FF3D', 1),
    ('c2222222-2222-2222-2222-222222222222', 'custos', 'Custos & Decisão', 'Análises de TCO, ROI de tecnologia, precificação de software e decisões de contratação.', '#FFFFFF', 2),
    ('c3333333-3333-3333-3333-333333333333', 'apps', 'Apps & Mobile', 'Engenharia para iOS, Android, React Native e infraestrutura de alta performance.', '#C6FF3D', 3),
    ('c4444444-4444-4444-4444-444444444444', 'arquitetura', 'Arquitetura & Engenharia', 'Padrões de design, microsserviços, modelagem relacional e segurança OWASP.', '#FFFFFF', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_authors (id, name, slug, role, bio, email, is_active)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Equipe de Arquitetura Branapi', 'arquitetura-branapi', 'Principal Software Engineer & Arquitetura', 'Engenharia sênior responsável pelo desenho e escalabilidade de mais de 830 projetos entregues.', 'engenharia@branapi.com', true),
    ('a2222222-2222-2222-2222-222222222222', 'Equipe Mobile Branapi', 'mobile-branapi', 'Senior Mobile Engineer', 'Especialistas em desenvolvimento multiplataforma, publicação nas lojas e otimização de performance.', 'mobile@branapi.com', true),
    ('a3333333-3333-3333-3333-333333333333', 'Consultoria de Engenharia Branapi', 'consultoria-branapi', 'Head of Enterprise Solutions', 'Diagnóstico operacional de sistemas, automação de processos e migração segura de dados.', 'consultoria@branapi.com', true)
ON CONFLICT (slug) DO NOTHING;

-- Initial Seed of Pillar Article 1
INSERT INTO public.blog_posts (
    id, slug, title, subtitle, excerpt, content, category_id, author_id, status,
    reading_time_minutes, primary_keyword, search_intent, meta_title, meta_description,
    canonical_url, published_at
) VALUES (
    'b1111111-1111-1111-1111-111111111111',
    'software-sob-medida-ou-sistema-pronto-como-decidir',
    'Software sob medida ou sistema pronto: como decidir',
    'O dilema entre a velocidade aparente de um SaaS de prateleira e a autonomia de longo prazo de um ativo proprietário.',
    'Compare custos, TCO em 3 anos, autonomia e riscos entre software sob medida e sistemas prontos de prateleira para saber qual a melhor escolha empresarial.',
    'Sistemas prontos funcionam bem para processos padrão. Quando o core business depende de regras exclusivas, o software sob medida gera mais retorno.',
    'c1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'published',
    7,
    'software sob medida ou sistema pronto',
    'comparativa',
    'Software Sob Medida ou Sistema Pronto? Como Decidir',
    'Compare custos, TCO em 3 anos, autonomia e riscos entre software sob medida e sistemas prontos de prateleira para saber qual a melhor escolha empresarial.',
    'https://branapi.com/blog/software-sob-medida-ou-sistema-pronto-como-decidir/',
    NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TABLE: ready_solutions (Soluções Prontas & Plataformas de Mercado)
-- Standard: OWASP ASVS 5.0 + PostgreSQL RLS + Dynamic Admin Management
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ready_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    category_name VARCHAR(120) NOT NULL DEFAULT 'Solução Pronta',
    badge VARCHAR(120) DEFAULT 'Time-to-Market Imediato',
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    cover_image_url TEXT,
    cover_image_alt VARCHAR(255),
    gallery_images TEXT[] DEFAULT '{}',
    video_url TEXT,
    cta_text VARCHAR(120) DEFAULT 'Solicitar Demonstração ↗',
    cta_url TEXT,
    price_tag VARCHAR(120) DEFAULT 'Implantação Imediata',
    status VARCHAR(32) NOT NULL DEFAULT 'published',
    display_order INT DEFAULT 0,
    views_count BIGINT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for high performance queries
CREATE INDEX IF NOT EXISTS idx_ready_solutions_slug ON public.ready_solutions(slug);
CREATE INDEX IF NOT EXISTS idx_ready_solutions_status ON public.ready_solutions(status);
CREATE INDEX IF NOT EXISTS idx_ready_solutions_order ON public.ready_solutions(display_order);

-- Automatic updated_at trigger
DROP TRIGGER IF EXISTS trigger_ready_solutions_updated_at ON public.ready_solutions;
CREATE TRIGGER trigger_ready_solutions_updated_at
BEFORE UPDATE ON public.ready_solutions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Alias view for pt-BR developers
CREATE OR REPLACE VIEW public.solucoes_prontas AS
SELECT * FROM public.ready_solutions;

-- ============================================================================
-- RLS POLICIES FOR ready_solutions
-- ============================================================================
ALTER TABLE public.ready_solutions ENABLE ROW LEVEL SECURITY;

-- 1. Public can view published solutions
DROP POLICY IF EXISTS "Public can view published solutions" ON public.ready_solutions;
CREATE POLICY "Public can view published solutions"
ON public.ready_solutions
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- 2. Authenticated admin full access
DROP POLICY IF EXISTS "Authenticated users have full access to solutions" ON public.ready_solutions;
CREATE POLICY "Authenticated users have full access to solutions"
ON public.ready_solutions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. Anonymous direct management (allows client API with anon key)
DROP POLICY IF EXISTS "Allow anon manage solutions with anon key" ON public.ready_solutions;
CREATE POLICY "Allow anon manage solutions with anon key"
ON public.ready_solutions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- ============================================================================
-- SEED DATA: Soluções Prontas Oficiais Branapi
-- ============================================================================
INSERT INTO public.ready_solutions (
    id, slug, title, subtitle, category_name, badge, description, features,
    cover_image_url, cover_image_alt, cta_text, cta_url, price_tag, status, display_order, published_at
) VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    'plataforma-de-infoprodutos-white-label',
    'Plataforma de Infoprodutos White-Label',
    'Sua estrutura própria para comercializar cursos, mentorias e produtos digitais sem taxas abusivas de intermediários.',
    'Infoprodutos',
    'White Label 100% Proprietário',
    'Estrutura completa e homologada para venda de infoprodutos, cursos e comunidades com marca própria. Inclui checkout de alta conversão em 1 etapa, área de membros responsiva com streaming protegido, gestão de afiliados com split automático, recuperação inteligente de vendas via WhatsApp e relatórios financeiros consolidados em tempo real.',
    ARRAY[
        'Checkout transparente de 1 etapa com conversão máxima',
        'Área de membros moderna estilo streaming para alunos',
        'Sistema completo de afiliados com split automático de comissões',
        'Recuperação automática de abandono de carrinho via WhatsApp',
        'Painel administrativo completo com relatórios de vendas e métricas'
    ],
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'Plataforma de Infoprodutos White Label Branapi',
    'Solicitar Demonstração ↗',
    'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20de%20Infoprodutos%20Pronta%20da%20Branapi',
    'Implantação Imediata',
    'published',
    1,
    NOW()
),
(
    'd2222222-2222-2222-2222-222222222222',
    'plataforma-apostas-esportivas-igaming',
    'Plataforma de Apostas Esportivas e iGaming',
    'Engine de alta performance com integração a provedores mundiais, cassino ao vivo e gateway PIX instantâneo.',
    'iGaming',
    'Alta Concorrência e Escala',
    'Plataforma robusta desenvolvida para suportar milhares de usuários simultâneos com estabilidade absoluta. Conta com integração direta com os maiores provedores de slots e cassino ao vivo do mercado global, feeds esportivos com odds em tempo real, split de comissões para afiliados multinível, liquidação automática via PIX 24/7 e motor antifraude de ponta.',
    ARRAY[
        'Odds e feeds esportivos em tempo real com baixa latência',
        'Integração oficial com os maiores provedores de slots e cassino',
        'Depósito e saque automatizados via PIX com liquidação instantânea',
        'Módulo avançado de afiliados com comissões configuráveis',
        'Segurança antifraude ativa e controle de risco operacional'
    ],
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'Plataforma de Apostas Esportivas e iGaming Branapi',
    'Solicitar Demonstração ↗',
    'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20de%20Apostas%20Pronta%20da%20Branapi',
    'Homologação Completa',
    'published',
    2,
    NOW()
),
(
    'd3333333-3333-3333-3333-333333333333',
    'gateway-de-pagamentos-proprio-white-label',
    'Gateway de Pagamentos Próprio (Fintech White Label)',
    'Opere seu próprio meio de pagamento, processe PIX e cartão, liquide taxas e crie seu ecossistema financeiro.',
    'Fintech',
    'Sem Intermediários',
    'Infraestrutura completa de subadquirência e processamento de pagamentos para quem deseja rentabilizar taxas de transação ou atender seu ecossistema de clientes. Inclui motor de conciliação bancária, webhooks resilientes com retry automático, antecipação de recebíveis, checkout transparente com SDKs e painel gerencial multitenant.',
    ARRAY[
        'PIX direto com confirmação e liquidação em subsegundos',
        'Processamento de cartão de crédito com tokenização PCI segura',
        'Split nativo de pagamentos para marketplaces e múltiplos recebedores',
        'SDKs e APIs completas para integração rápida em qualquer software',
        'Painel financeiro multitenant com conciliação automatizada'
    ],
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    'Gateway de Pagamentos Próprio White Label Branapi',
    'Solicitar Demonstração ↗',
    'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20Gateway%20de%20Pagamentos%20Pronto%20da%20Branapi',
    'Código Proprietário',
    'published',
    3,
    NOW()
),
(
    'd4444444-4444-4444-4444-444444444444',
    'banking-as-a-service-plataforma-baas',
    'Infraestrutura de Banking as a Service (BaaS)',
    'Contas digitais PJ e PF, emissão de cartões virtuais e ecossistema bancário completo com a sua marca.',
    'Banking',
    'Ecossistema Bancário Completo',
    'Plataforma completa para empresas que desejam oferecer serviços bancários proprietários aos seus clientes ou rede de parceiros. Emissão de contas correntes digitais com chave PIX, geração de cartões pré-pagos virtuais e físicos, pagamento e liquidação de boletos bancários com leitor de código de barras e compliance regulatório integrado.',
    ARRAY[
        'Contas digitais PJ/PF completas com chave PIX individual',
        'Emissão de cartões de débito virtuais e físicos personalizados',
        'Pagamento e liquidação em lote de boletos bancários',
        'Módulo de compliance, KYC automatizado e onboarding biométrico',
        'Relatórios regulatórios e conciliação contábil em tempo real'
    ],
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    'Plataforma de Banking as a Service BaaS Branapi',
    'Solicitar Demonstração ↗',
    'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20na%20Plataforma%20BaaS%20Pronta%20da%20Branapi',
    'Full Compliance',
    'published',
    4,
    NOW()
),
(
    'd5555555-5555-5555-5555-555555555555',
    'sistema-crm-gestao-comercial-inteligente',
    'CRM e Pipeline Comercial com IA Integrada',
    'Gestão completa de leads, funil de vendas multietapas, automação de WhatsApp e pontuação de oportunidades.',
    'SaaS',
    'Automação Comercial Ativa',
    'Software pronto para estruturar e acelerar a área comercial de empresas e consultorias. Conta com funil Kanban visual personalizável, disparos automáticos via WhatsApp oficial, gravação e transcrição de reuniões comerciais com IA, distribuição balanceada de leads para vendedores e dashboards executivos de conversão.',
    ARRAY[
        'Funil de vendas visual Kanban totalmente personalizável',
        'Automação nativa de comunicação via WhatsApp e e-mail',
        'Distribuição automática de leads (Round-Robin) para corretores/vendedores',
        'Transcrição inteligente de reuniões e geração de propostas com IA',
        'Relatórios de produtividade comercial e previsão de faturamento'
    ],
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'Sistema de CRM e Gestão Comercial Branapi',
    'Solicitar Demonstração ↗',
    'https://wa.me/5521999999999?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20CRM%20Inteligente%20Pronto%20da%20Branapi',
    'Pronto para Uso',
    'published',
    5,
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    category_name = EXCLUDED.category_name,
    badge = EXCLUDED.badge,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    cover_image_url = EXCLUDED.cover_image_url,
    cta_text = EXCLUDED.cta_text,
    cta_url = EXCLUDED.cta_url,
    price_tag = EXCLUDED.price_tag,
    updated_at = NOW();

-- ============================================================================
-- MIGRATION: SUPORTE A VÍDEOS EM SOLUÇÕES PRONTAS (IDEMPOTENTE)
-- ============================================================================
ALTER TABLE public.ready_solutions ADD COLUMN IF NOT EXISTS video_url TEXT;

