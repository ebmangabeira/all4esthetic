import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Política de Privacidade | all4esthetic",
  description:
    "Saiba como a all4esthetic recolhe, usa e protege dados. Informações sobre cookies, finalidades, base legal, direitos do titular e contacto da CNPD.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/politica-privacidade" },
  openGraph: {
    title: "Política de Privacidade | all4esthetic",
    description:
      "Informações sobre recolha e uso de dados, cookies, direitos do titular e contacto da CNPD.",
    type: "article",
    url: "/politica-privacidade",
    siteName: "all4esthetic",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidade | all4esthetic",
    description:
      "Informações sobre recolha e uso de dados, cookies, direitos do titular e contacto da CNPD.",
  },
};

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <Header />
      <main id="main" className="privacy-page">
        <CookieBanner />
        <section>
          <div className="container">
            <div className="pp-card">
              <h1 className="mb-4">Política de Privacidade</h1>
              <p className="text-muted">
                <em>Última revisão: 07 de Agosto de 2025</em>
              </p>
              <h2>1. Responsável pelo Tratamento</h2>
              <p>
                All4esthetic<br />
                2870-607, Alto Estanqueiro-Jardia, Montijo, Portugal<br />
                Email:{" "}
                <a href="mailto:geral@all4esthetic.com">geral@all4esthetic.com</a>
              </p>
              <h2>2. Dados que Recolhemos</h2>
              <p>
                O nosso website funciona como um catálogo informativo e{" "}
                <strong>não</strong> solicita nem processa dados pessoais através
                de formulários. Apenas recolhemos:
              </p>
              <ul>
                <li>Dados técnicos anónimos (logs de acesso, tipo de navegador, páginas visitadas).</li>
                <li>Cookies estritamente necessários para funcionamento e análise de tráfego.</li>
              </ul>
              <h2>3. Finalidades do Tratamento</h2>
              <ul>
                <li>Garantir o funcionamento seguro e eficiente do site.</li>
                <li>Personalizar conteúdos e anúncios com base em dados agregados.</li>
                <li>Analisar estatísticas de utilização.</li>
                <li>Permitir contactos via email ou telefone quando voluntariamente fornecidos.</li>
              </ul>
              <h2>4. Base Legal</h2>
              <p>
                O tratamento de dados anónimos apoia-se no nosso legítimo interesse em
                optimizar o serviço (Art.º 6.º (1)(f) do RGPD). Para dados pessoais
                facultados em contacto, fundamenta-se no consentimento (Art.º 6.º
                (1)(a) do RGPD).
              </p>
              <h2>5. Destinatários</h2>
              <p>
                Os dados podem ser partilhados com fornecedores de serviços técnicos e
                parceiros de marketing (hospedagem, análises, anúncio online). Todos
                sob contratos que garantem a confidencialidade.
              </p>
              <h2>6. Período de Conservação</h2>
              <p>
                Mantemos os dados apenas pelo tempo necessário para as finalidades
                indicadas e em conformidade com a legislação aplicável.
              </p>
              <h2>7. Direitos dos Titulares</h2>
              <p>Tem o direito de solicitar:</p>
              <ul>
                <li>Acesso, retificação ou eliminação dos seus dados;</li>
                <li>Limitação ou oposição ao tratamento;</li>
                <li>Portabilidade dos dados;</li>
                <li>Retirada do consentimento a qualquer momento.</li>
              </ul>
              <p>
                Para exercer estes direitos, contacte-nos em{" "}
                <a href="mailto:geral@all4esthetic.com">geral@all4esthetic.com</a>.
              </p>
              <h2>8. Segurança</h2>
              <p>
                Implementamos medidas técnicas e organizativas (criptografia, backups,
                controlo de acessos) para proteger os seus dados contra acesso não
                autorizado, alteração ou destruição.
              </p>
              <h2>9. Alterações a Esta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. A data da última
                revisão será sempre indicada no topo desta página.
              </p>
              <h2>10. Contacto da CNPD</h2>
              <p>
                Caso considere que os seus direitos não foram respeitados, pode
                apresentar reclamação junto da Comissão Nacional de Proteção de Dados:{" "}
                <a href="https://www.cnpd.pt" target="_blank" rel="noopener">
                  www.cnpd.pt
                </a>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
