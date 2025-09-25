import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSReady from "@/components/AOSReady";
import ScrollTop from "@/components/ScrollTop";
import HashModalOpener from "@/components/HashModalOpener";

export const metadata: Metadata = {
  title: "Contacto | all4esthetic",
  description: "Contacte a all4esthetic em Portugal para informações e orçamentos.",
};

export default function ContactoPage() {
  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>

      <CookieBanner />
      <Header />

      <main className="main" role="main" id="main">
        <AOSReady />

        <div className="pd-page-title pd-light-bg">
          <div className="container-xl pd-breadcrumbs pd-container">
            <h1 className="pd-title-text" id="main-heading">Contacto</h1>
            <nav className="pd-nav-breadcrumbs" aria-label="Caminho de navegação">
              <ol>
                <li><Link href="/" className="inicio-link">Início</Link></li>
                <li className="current" aria-current="page">Contacto</li>
              </ol>
            </nav>
          </div>
        </div>

        <section className="about section" aria-labelledby="about-heading">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="about">
              <div className="row align-items-center">
                <div>
                  <h2 id="about-heading" className="about-title">Ligando-o à Tecnologia e Beleza</h2>
                  <p className="about-description">
                    A nossa equipa está preparada para prestar apoio especializado e soluções personalizadas,
                    elevando a sua experiência em estética a um novo patamar.
                  </p>
                </div>
              </div>
            </div>

            <div className="contact-cards-row" role="list">
              <div className="contact-card" role="listitem">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=38.6795648,-8.917624"
                  className="contact-link-wrapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Endereço: 2870-607 Alto Estanqueiro-Jardia, Montijo, Portugal — abre em nova aba"
                >
                  <div className="contact-icon" aria-hidden="true">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <h3 className="contact-title">Endereço</h3>
                  <p className="contact-text">
                    2870-607 Alto Estanqueiro-Jardia,<br />
                    Montijo, Portugal
                  </p>
                </a>
              </div>

              <div className="contact-card" role="listitem">
                <a
                  href="tel:+351936623907"
                  className="contact-link-wrapper"
                  aria-label="Contacto telefónico: +351 21 409 5469"
                >
                  <div className="contact-icon" aria-hidden="true">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <h3 className="contact-title">Contacto</h3>
                  <p className="contact-text">(+351) 936 623 907</p>
                </a>
              </div>

              <div className="contact-card" role="listitem">
                <a
                  href="mailto:geral@all4esthetic.com"
                  className="contact-link-wrapper"
                  aria-label="Enviar email para geral@all4esthetic.com"
                >
                  <div className="contact-icon" aria-hidden="true">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <h3 className="contact-title">Email</h3>
                  <p className="contact-text">geral@all4esthetic.com</p>
                </a>
              </div>
            </div>
          </div>

          <HashModalOpener />
        </section>
      </main>

      <Footer />
      <ScrollTop />
    </>
  );
}
