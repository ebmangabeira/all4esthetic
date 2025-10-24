import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Aviso Legal | all4esthetic",
  description:
    "Aviso legal do site all4esthetic (Portugal): informações gerais, direitos de propriedade intelectual, limitação de responsabilidade e contactos.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/aviso-legal" },
  openGraph: {
    title: "Aviso Legal | all4esthetic",
    description: "Informações legais sobre o website all4esthetic, direitos e responsabilidades.",
    type: "article",
    url: "/aviso-legal",
    siteName: "all4esthetic",
  },
  twitter: {
    card: "summary",
    title: "Aviso Legal | all4esthetic",
    description: "Informações legais sobre o website all4esthetic, direitos e responsabilidades.",
  },
};

export default function AvisoLegalPage() {
  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <Header />
      <main id="main" className="privacy-page">
        <CookieBanner />
        <section>
          <div className="container">
            <div className="pp-card">
              <h1 className="mb-4">Aviso Geral</h1>
              <p className="text-muted pp-meta"><em>Última revisão: 07 de Agosto de 2025</em></p>

              <h2>1. Informações Gerais</h2>
              <p>Todos os conteúdos, textos, imagens, gráficos e informações presentes neste website são de responsabilidade da all4esthetic e destinam-se exclusivamente a fornecer informações sobre os produtos e serviços oferecidos.</p>

              <h2>2. Direitos de Propriedade Intelectual</h2>
              <p>Todos os direitos de propriedade intelectual, incluindo marcas, logotipos, imagens, textos e design gráfico, são propriedade exclusiva da all4esthetic ou dos seus licenciadores, estando protegidos por legislação nacional e internacional.</p>

              <h2>3. Limitação de Responsabilidade</h2>
              <p>A all4esthetic não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso deste website, incluindo erros ou omissões nas informações apresentadas.</p>

              <h2>4. Conteúdos de Terceiros</h2>
              <p>Este website pode conter links para sites de terceiros, sobre os quais a all4esthetic não exerce controle e não assume responsabilidade pelo conteúdo, políticas de privacidade ou práticas desses sites.</p>

              <h2>5. Alterações ao Website</h2>
              <p>A all4esthetic reserva-se o direito de modificar, atualizar ou remover qualquer conteúdo do website a qualquer momento, sem aviso prévio.</p>

              <h2>6. Lei Aplicável e Jurisdição</h2>
              <p>Este aviso legal é regido pela legislação portuguesa. Quaisquer litígios relacionados com o uso do website serão submetidos aos tribunais competentes de Lisboa, Portugal.</p>

              <h2>7. Contactos</h2>
              <p>Para quaisquer dúvidas ou questões legais, por favor contacte-nos através do email <a href="mailto:geral@all4esthetic.com" className="termos">geral@all4esthetic.com</a>.</p>

              <p className="mt-4">
                Consulte também a nossa{" "}
                <Link href="/politica-privacidade" className="termos">Política de Privacidade</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
