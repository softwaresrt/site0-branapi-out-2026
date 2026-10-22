import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sistemas.branapi.com/"),
  title: "Sistema Sob Medida para Empresas: ERP e CRM | Branapi",
  description:
    "Troque planilhas e gargalos por um sistema sob medida pro seu negócio. 830+ projetos entregues com código 100% seu. Peça uma proposta grátis.",
  authors: [{ name: "Branapi", url: "https://branapi.com" }],
  creator: "Branapi",
  publisher: "Branapi",
  keywords: [
    "sistema sob medida",
    "erp sob medida",
    "crm personalizado",
    "sistema de gestão empresarial",
    "substituir planilhas",
    "desenvolvimento de sistemas",
    "software house sistemas",
    "branapi sistemas",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://sistemas.branapi.com/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://sistemas.branapi.com/",
    siteName: "Branapi Sistemas",
    title: "Sistema Sob Medida para Empresas: ERP e CRM | Branapi",
    description:
      "Troque planilhas e gargalos por um sistema sob medida pro seu negócio. 830+ projetos entregues com código 100% seu. Peça uma proposta grátis.",
    images: [
      {
        url: "https://sistemas.branapi.com/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Sistema Sob Medida para Empresas | Branapi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sistema Sob Medida para Empresas: ERP, CRM e Gestão | Branapi",
    description:
      "Troque planilhas e sistemas alugados por um sistema feito pro seu processo. ERP, CRM e gestão sob medida, com o código sendo seu.",
    images: ["https://sistemas.branapi.com/og-branapi.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://branapi.com/#organization",
        name: "Branapi",
        url: "https://branapi.com",
        logo: "https://sistemas.branapi.com/branapi-wordmark.png",
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
        "@id": "https://sistemas.branapi.com/#website",
        url: "https://sistemas.branapi.com/",
        name: "Sistema Sob Medida | Branapi",
        publisher: {
          "@id": "https://branapi.com/#organization",
        },
      },
      {
        "@type": "Service",
        name: "Sistema Sob Medida para Empresas: ERP, CRM e Gestão",
        provider: {
          "@id": "https://branapi.com/#organization",
        },
        serviceType: "Desenvolvimento de Sistemas Web, ERP & CRM Sob Medida",
        areaServed: "Brasil",
        description:
          "Troque planilhas e sistemas alugados por um sistema feito pro seu processo. ERP, CRM e gestão sob medida, com o código sendo seu.",
      },
    ],
  };

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
