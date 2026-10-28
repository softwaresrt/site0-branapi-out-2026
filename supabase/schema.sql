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
