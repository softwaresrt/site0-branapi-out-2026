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
  metadataBase: new URL("https://mvp.branapi.com/"),
  title: "Desenvolvimento de MVP e SaaS para Startups | Branapi",
  description:
    "Desenvolvimento de MVP em tempo recorde para validar sua ideia e captar. Mais de 830 projetos entregues no Brasil e exterior. Inicie seu MVP.",
  authors: [{ name: "Branapi", url: "https://branapi.com" }],
  creator: "Branapi",
  publisher: "Branapi",
  keywords: [
    "desenvolvimento de mvp",
    "saas para startups",
    "software house para startups",
    "validar ideia de startup",
    "desenvolvimento de plataforma saas",
    "construir mvp rápido",
    "branapi mvp",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mvp.branapi.com/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://mvp.branapi.com/",
    siteName: "Branapi MVP",
    title: "Desenvolvimento de MVP e SaaS para Startups | Branapi",
    description:
      "Desenvolvimento de MVP em tempo recorde para validar sua ideia e captar. Mais de 830 projetos entregues no Brasil e exterior. Inicie seu MVP.",
    images: [
      {
        url: "https://mvp.branapi.com/og-branapi.png",
        width: 1200,
        height: 630,
        alt: "Desenvolvimento de MVP e SaaS para Startups | Branapi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desenvolvimento de MVP e SaaS para Startups | Branapi",
    description:
      "Tire sua ideia do papel com um MVP funcional. Desenvolvimento de SaaS e plataformas para startups, com evolução mensal. Fale com a Branapi.",
    images: ["https://mvp.branapi.com/og-branapi.png"],
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
        logo: "https://mvp.branapi.com/branapi-wordmark.png",
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
        "@id": "https://mvp.branapi.com/#website",
        url: "https://mvp.branapi.com/",
        name: "Desenvolvimento de MVP | Branapi",
        publisher: {
          "@id": "https://branapi.com/#organization",
        },
      },
      {
        "@type": "Service",
        name: "Desenvolvimento de MVP e SaaS para Startups",
        provider: {
          "@id": "https://branapi.com/#organization",
        },
        serviceType: "Desenvolvimento Ágil de Software, Validação de MVP & SaaS",
        areaServed: "Brasil",
        description:
          "Tire sua ideia do papel com um MVP funcional. Desenvolvimento de SaaS e plataformas para startups, com evolução mensal. Fale com a Branapi.",
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
