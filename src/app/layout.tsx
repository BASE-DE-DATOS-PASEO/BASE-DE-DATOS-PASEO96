import type { Metadata, Viewport } from "next";
import "./globals.css";
import StoreInit from "@/components/StoreInit";

const BASE_URL = "https://paseo96.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Paseo 96 — Tu vidriera digital en la feria",
    template: "%s | Paseo 96",
  },
  description:
    "Descubrí todos los locales y productos de Paseo 96 en La Plata. Ropa, calzado, accesorios y más. Contactá directo al vendedor por WhatsApp.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "Paseo 96",
    title: "Paseo 96 — Tu vidriera digital en la feria",
    description:
      "Descubrí todos los locales y productos de Paseo 96 en La Plata. Ropa, calzado, accesorios y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paseo 96 — Tu vidriera digital en la feria",
    description:
      "Descubrí todos los locales y productos de Paseo 96 en La Plata.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Paseo 96",
  description:
    "Vidriera digital de la feria Paseo Del Compra Del Sur en La Plata. Ropa, calzado, accesorios y más.",
  url: BASE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Paseo Del Compra Del Sur",
    addressLocality: "La Plata",
    addressRegion: "Buenos Aires",
    addressCountry: "AR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Thursday", "Saturday", "Sunday"],
      opens: "10:30",
      closes: "20:30",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cómo compro un producto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La compra no se realiza dentro del sitio. Tocás el botón de WhatsApp y te comunicás directamente con el vendedor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Los precios están actualizados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los precios son actualizados por el equipo de Paseo 96 en base a la información de cada puesto. Confirmá precio y stock con el vendedor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Hacen envíos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de cada puesto. Algunos realizan envíos y otros solo venden de forma presencial. Consultá con el vendedor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es Paseo 96?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paseo 96 es una plataforma digital que funciona como vidriera virtual de la feria, donde los puestos exhiben sus productos.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo puedo tener mi puesto en Paseo 96?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si tenés un puesto en la feria, escribinos por WhatsApp. Tenemos tres planes: Bronce, Plata y Oro.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <StoreInit />
        {children}
      </body>
    </html>
  );
}
