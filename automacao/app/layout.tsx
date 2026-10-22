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
  metadataBase: new URL("https://automacao.branapi.com/"),
  title: "Automação de Processos com IA para Empresas | Branapi",
  description:
    "Automação de processos com IA e assistentes inteligentes no WhatsApp. Reduza custos operacionais com quem tem 830+ entregas. Fale conosco.",
  authors: [{ name: "Branapi", url: "https://branapi.com" }],
  creator: "Branapi",
  publisher: "Branapi",
  keywords: [
    "automação de processos",
    "inteligência artificial para empresas",
    "assistente virtual whatsapp",
    "automação de atendimento",
    "automação de vendas",
    "integração de sistemas com ia",
    "branapi automacao",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://automacao.branapi.com/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://automacao.branapi.com/",
    siteName: "Branapi Automação",
    title: "Automação de Processos com IA para Empresas | Branapi",
    description:
      "Automação de processos com IA e assistentes inteligentes no WhatsApp. Reduza custos operacionais com quem tem 830+ entregas. Fale conosco.",
    images: [
      {
        url: "https://automacao.branapi.com/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Automação de Processos com Inteligência Artificial | Branapi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automação de Processos com Inteligência Artificial | Branapi",
    description:
      "Automatize atendimento, vendas e tarefas repetitivas com IA. Assistentes virtuais e automações sob medida para a sua empresa.",
    images: ["https://automacao.branapi.com/og-branapi.png"],
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
        logo: "https://automacao.branapi.com/branapi-wordmark.png",
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
        "@id": "https://automacao.branapi.com/#website",
        url: "https://automacao.branapi.com/",
        name: "Automação com IA | Branapi",
        publisher: {
          "@id": "https://branapi.com/#organization",
        },
      },
      {
        "@type": "Service",
        name: "Automação de Processos com Inteligência Artificial",
        provider: {
          "@id": "https://branapi.com/#organization",
        },
        serviceType: "Automação Empresarial, Agentes de IA e Workflows Integrados",
        areaServed: "Brasil",
        description:
          "Automatize atendimento, vendas e tarefas repetitivas com IA. Assistentes virtuais e automações sob medida para a sua empresa.",
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
