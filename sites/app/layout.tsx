import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sites.branapi.com"),
  title: "Criação de Sites Profissionais de Alto Impacto | Branapi",
  description:
    "Criação de sites profissionais rápidos, responsivos e focados em vendas. Mais de 830 projetos entregues. Fale com a Branapi e receba proposta.",
  keywords: [
    "criação de sites",
    "site profissional",
    "landing page que vende",
    "e-commerce",
    "loja virtual",
    "site institucional",
    "desenvolvimento web",
    "branapi",
  ],
  authors: [{ name: "Branapi" }],
  creator: "Branapi",
  publisher: "Branapi",
  alternates: {
    canonical: "https://sites.branapi.com/",
  },
  openGraph: {
    title: "Criação de Sites Profissionais de Alto Impacto | Branapi",
    description:
      "Criação de sites profissionais rápidos, responsivos e focados em vendas. Mais de 830 projetos entregues. Fale com a Branapi e receba proposta.",
    url: "https://sites.branapi.com/",
    siteName: "Branapi Sites",
    images: [
      {
        url: "/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Criação de Sites Profissionais que Vendem | Branapi",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Criação de Sites Profissionais que Vendem | Branapi",
    description:
      "Criação de sites rápidos, bonitos e feitos para converter. Institucional, landing page e e-commerce. Orçamento grátis com a Branapi.",
    images: ["/og-branapi.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://branapi.com/#organization",
      name: "Branapi",
      url: "https://branapi.com",
      logo: "https://sites.branapi.com/branapi-wordmark.png",
      sameAs: [
        "https://www.instagram.com/branapioficial",
        "https://www.linkedin.com/company/branapi",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+55-62-98158-0707",
        contactType: "sales",
        areaServed: ["BR", "PT", "PE"],
        availableLanguage: ["Portuguese", "English", "Spanish"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://sites.branapi.com/#website",
      url: "https://sites.branapi.com/",
      name: "Criação de Sites Profissionais | Branapi",
      publisher: { "@id": "https://branapi.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Criação de Sites Profissionais que Vendem",
      provider: { "@id": "https://branapi.com/#organization" },
      serviceType: "Desenvolvimento Web & Landing Pages",
      areaServed: "Brasil",
      description:
        "Criação de sites rápidos, bonitos e feitos para converter. Institucional, landing page e e-commerce. Orçamento grátis com a Branapi.",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-black text-white antialiased selection:bg-[#C5FF41] selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
