/**
 * Branapi — Structured Data (JSON-LD) Generator Suite (Google 2026 Standards)
 *
 * Strict Compliance:
 * - Real verified entities only (Organization, ProfessionalService, Service, BreadcrumbList, Article, FAQPage).
 * - No fake ratings or invented AggregateRating.
 * - [PENDENTE] placeholders are safely omitted from live schemas or sanitized.
 */

export const CANONICAL_ORIGIN = 'https://branapi.com';

/**
 * Entidade Canônica Organization
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${CANONICAL_ORIGIN}/#organization`,
    name: 'Branapi',
    legalName: 'Branapi Software House',
    alternateName: ['Branapi Tech', 'Branapi Tecnologia'],
    url: CANONICAL_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: `${CANONICAL_ORIGIN}/assets/branapi-wordmark.png`,
      width: 512,
      height: 128
    },
    image: `${CANONICAL_ORIGIN}/assets/og-branapi.jpg`,
    description: 'Software house especialista em desenvolvimento de software sob medida, sistemas web exclusivos, MVPs para startups, aplicativos mobile e automação de processos com inteligência artificial.',
    foundingDate: '2022',
    sameAs: [
      'https://www.instagram.com/branapi.tech/'
      // [PENDENTE: Adicionar LinkedIn, Clutch e GitHub oficiais quando informados pela diretoria]
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales and commercial inquiries',
      url: `${CANONICAL_ORIGIN}/contato/`,
      availableLanguage: ['Portuguese', 'English', 'Spanish']
      // [PENDENTE: Inserir telefone comercial fixo/WhatsApp definitivo quando disponibilizado]
    }
  };
}

/**
 * Entidade ProfessionalService / LocalBusiness
 */
export function getProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${CANONICAL_ORIGIN}/#localbusiness`,
    name: 'Branapi — Software House & Engenharia de Software',
    url: CANONICAL_ORIGIN,
    parentOrganization: {
      '@id': `${CANONICAL_ORIGIN}/#organization`
    },
    priceRange: '$$$$',
    image: `${CANONICAL_ORIGIN}/assets/og-branapi.jpg`,
    areaServed: [
      { '@type': 'Country', name: 'Brasil' },
      { '@type': 'AdministrativeArea', name: 'São Paulo' },
      { '@type': 'AdministrativeArea', name: 'Goiás' },
      { '@type': 'AdministrativeArea', name: 'Região Nordeste' },
      { '@type': 'AdministrativeArea', name: 'Região Sul' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Peru' }
    ],
    knowsAbout: [
      'Desenvolvimento de Software Sob Medida',
      'Sistemas Web e ERPs Customizados',
      'Construção de Startups e MVPs',
      'Plataformas SaaS Escaláveis',
      'Aplicativos Mobile iOS e Android',
      'Automação de Processos com Inteligência Artificial'
    ]
    // [PENDENTE: Endereço físico e CNPJ da sede de SP/GO serão preenchidos pelo cliente antes de expor PostalAddress]
  };
}

/**
 * Schema de Serviço para cada página de serviço
 */
export function getServiceSchema({ name, description, serviceUrl, serviceType }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${serviceUrl}#service`,
    name,
    serviceType: serviceType || name,
    description,
    provider: {
      '@id': `${CANONICAL_ORIGIN}/#organization`
    },
    url: serviceUrl,
    areaServed: {
      '@type': 'Country',
      name: 'Brasil'
    },
    termsOfService: `${CANONICAL_ORIGIN}/politica-de-privacidade/`
  };
}

/**
 * BreadcrumbList para páginas internas
 * @param {Array<{ name: string, url: string }>} crumbs
 */
export function getBreadcrumbListSchema(crumbs) {
  const itemListElement = crumbs.map((crumb, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: crumb.name,
    item: crumb.url.startsWith('http') ? crumb.url : `${CANONICAL_ORIGIN}${crumb.url}`
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  };
}

/**
 * Article / BlogPosting para artigos com E-E-A-T
 */
export function getArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'Equipe de Engenharia Branapi',
  authorUrl = `${CANONICAL_ORIGIN}/equipe/`,
  imageUrl = `${CANONICAL_ORIGIN}/assets/og-branapi.jpg`
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: title,
    description,
    image: imageUrl,
    datePublished: datePublished || '2026-10-22',
    dateModified: dateModified || datePublished || '2026-10-22',
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl
    },
    publisher: {
      '@id': `${CANONICAL_ORIGIN}/#organization`
    },
    inLanguage: 'pt-BR'
  };
}

/**
 * FAQPage Schema
 * @param {Array<{ pergunta: string, resposta: string }>} items
 */
export function getFaqPageSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pergunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.resposta
      }
    }))
  };
}
