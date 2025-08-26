import type { Metadata } from "next";
import Script from "next/script";
import ScrollTop from "@/components/ScrollTop";
import Preloader from "@/components/Preloader";

export const metadata: Metadata = {
  title: "all4esthetic",
  description: "Equipamentos e soluções estéticas profissionais em Portugal.",
  icons: {
    icon: "/assets/img/favicon.png",
    apple: "/assets/img/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3.2.0/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/drift-zoom@1.3.0/dist/drift-basic.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8.0.0/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/custom.css" />
      </head>
      <body className="index-page" suppressHydrationWarning>
        {/* Preloader: logo + pontinhos; use `always` em dev se quiser forçar */}
        <Preloader minDurationMs={600} timeoutMs={7000} />
        {/* <Preloader always minDurationMs={600} timeoutMs={7000} /> */}

        {/* Wrapper para entrada suave do conteúdo */}
        <div className="a4e-page">
          {children}
        </div>

        <ScrollTop />

        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/swiper@8.0.0/swiper-bundle.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/glightbox@3.3.1/dist/js/glightbox.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/drift-zoom@1.5.1/dist/Drift.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/imagesloaded@5/imagesloaded.pkgd.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/isotope-layout@3/dist/isotope.pkgd.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/purecounterjs@1/dist/purecounter_vanilla.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
