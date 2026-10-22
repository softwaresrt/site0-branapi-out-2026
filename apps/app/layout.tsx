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
  metadataBase: new URL("https://apps.branapi.com"),
  title: "Desenvolvimento de Aplicativos iOS e Android | Branapi",
  description:
    "Desenvolvimento de aplicativos sob medida para iOS e Android. Mais de 830 projetos entregues com design premiado. Peça seu orçamento grátis.",
  keywords: [
    "desenvolvimento de aplicativos",
    "criar aplicativo para empresa",
    "app ios e android",
    "software house aplicativos",
    "aplicativo sob medida",
    "desenvolvimento mobile",
    "branapi apps",
  ],
  authors: [{ name: "Branapi" }],
  creator: "Branapi",
  publisher: "Branapi",
  alternates: {
    canonical: "https://apps.branapi.com/",
  },
  openGraph: {
    title: "Desenvolvimento de Aplicativos iOS e Android | Branapi",
    description:
      "Desenvolvimento de aplicativos sob medida para iOS e Android. Mais de 830 projetos entregues com design premiado. Peça seu orçamento grátis.",
    url: "https://apps.branapi.com/",
    siteName: "Branapi Aplicativos",
    images: [
      {
        url: "/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Desenvolvimento de Aplicativos para Empresas | Branapi",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desenvolvimento de Aplicativos para Empresas | iOS e Android | Branapi",
    description:
      "Criamos aplicativos sob medida para iOS e Android, do design à publicação nas lojas. Fale com a Branapi e receba um escopo grátis.",
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
      logo: "https://apps.branapi.com/branapi-wordmark.png",
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
      "@id": "https://apps.branapi.com/#website",
      url: "https://apps.branapi.com/",
      name: "Desenvolvimento de Aplicativos | Branapi",
      publisher: { "@id": "https://branapi.com/#organization" },
    },
    {
      "@type": "Service",
      name: "Desenvolvimento de Aplicativos para Empresas | iOS e Android",
      provider: { "@id": "https://branapi.com/#organization" },
      serviceType: "Desenvolvimento de Aplicativos Móveis (iOS & Android)",
      areaServed: "Brasil",
      description:
        "Criamos aplicativos sob medida para iOS e Android, do design à publicação nas lojas. Fale com a Branapi e receba um escopo grátis.",
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
