import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Software House no Brasil: Sistemas Sob Medida | Branapi",
  description:
    "Software house com 830+ projetos entregues. Criamos sistemas, sites, apps e automações sob medida, com código-fonte seu. Peça seu orçamento grátis.",
  metadataBase: new URL("https://software.branapi.com"),
  alternates: {
    canonical: "https://software.branapi.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Software House no Brasil: Sistemas Sob Medida | Branapi",
    description:
      "Software house com 830+ projetos entregues. Criamos sistemas, sites, apps e automações sob medida, com código-fonte seu. Peça seu orçamento grátis.",
    url: "https://software.branapi.com",
    siteName: "Branapi",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Branapi Software House - Sistemas Sob Medida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software House no Brasil: Sistemas Sob Medida | Branapi",
    description:
      "Software house com 830+ projetos entregues. Criamos sistemas, sites, apps e automações sob medida, com código-fonte seu. Peça seu orçamento grátis.",
    images: ["/og-branapi.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://branapi.com/#organization",
        name: "Branapi",
        url: "https://branapi.com",
        logo: {
          "@type": "ImageObject",
          url: "https://software.branapi.com/branapi-wordmark.png",
        },
        sameAs: ["https://www.instagram.com/branapi.tech/"],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+55-62-98158-0707",
          contactType: "sales",
          availableLanguage: ["Portuguese"],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://software.branapi.com/#website",
        url: "https://software.branapi.com",
        name: "Branapi Software House",
        publisher: {
          "@id": "https://branapi.com/#organization",
        },
      },
      {
        "@type": "Service",
        "@id": "https://software.branapi.com/#service",
        name: "Desenvolvimento de Software Sob Medida",
        provider: {
          "@id": "https://branapi.com/#organization",
        },
        serviceType: "Software Engineering & Custom Development",
        description:
          "Desenvolvimento de sistemas web sob medida, aplicativos iOS e Android, sites de alta performance, automações com inteligência artificial e integrações customizadas.",
        areaServed: {
          "@type": "Country",
          name: "Brazil",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://software.branapi.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quanto custa um software sob medida?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Depende do escopo. Por isso o orçamento é feito depois de entender o seu processo, e se estourar seu budget a gente propõe um MVP com evolução mensal.",
            },
          },
          {
            "@type": "Question",
            name: "O código fica comigo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, entregue após a quitação.",
            },
          },
          {
            "@type": "Question",
            name: "E se eu precisar de mudança depois?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Existe plano de suporte mensal opcional.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} bg-black text-white antialiased selection:bg-[#C5FF41] selection:text-black`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#000000] text-white font-body selection:bg-[#C5FF41] selection:text-black overflow-x-hidden relative">
        {children}
      </body>
    </html>
  );
}
