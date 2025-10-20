"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import Container from "../components/Container";

const onKeyActivate = (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.key === "Enter" || e.key === " ") {
    (e.currentTarget as HTMLElement).click();
    e.preventDefault();
  }
};

function useAOSFallback() {
  useEffect(() => {
    try {
      (window as any).AOS?.init?.({ duration: 700, once: true, offset: 100 });
    } catch {}
    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-aos]").forEach((el) => {
        if (!el.classList.contains("aos-animate")) el.style.opacity = "1";
      });
    }, 1200);
    return () => clearTimeout(t);
  }, []);
}

function useSwiperFallback() {
  useEffect(() => {
    const start = () => {
      const W = window as any;
      if (!W.Swiper) return;
      const container = document.querySelector<HTMLElement>(".testimonials-swiper");
      if (!container) return;
      if (container.classList.contains("swiper-initialized")) return;

      let cfg: any = { slidesPerView: 1 };
      const cfgScript = container.querySelector<HTMLScriptElement>(".swiper-config");
      if (cfgScript?.textContent) {
        try {
          cfg = JSON.parse(cfgScript.textContent);
        } catch (e) {
          console.warn("Config do Swiper inválida:", e);
        }
      }

      const paginationEl = container.querySelector(".swiper-pagination") ?? ".swiper-pagination";
      cfg.pagination = cfg.pagination || {};
      cfg.pagination.el = cfg.pagination.el || paginationEl;
      if (cfg.autoplay && typeof cfg.autoplay === "object" && !cfg.autoplay.delay) {
        cfg.autoplay.delay = 5000;
      }

      try {
        new W.Swiper(container, cfg);
      } catch (e) {
        console.warn("Falha ao inicializar Swiper (fallback):", e);
      }
    };

    if ((window as any).Swiper) {
      start();
    } else {
      const id = setInterval(() => {
        if ((window as any).Swiper) {
          clearInterval(id);
          start();
        }
      }, 100);
      return () => clearInterval(id);
    }
  }, []);
}

export default function HomePage() {
  useAOSFallback();
  useSwiperFallback();

  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>

      <CookieBanner />
      <Header />

      <main className="main" role="main" id="main">
        <section className="hero light-background" id="hero" aria-label="Seção principal">
          <div className="hero-image-wrapper">
            <img loading="lazy" alt="Imagem principal de estética" className="img-fluid hero-img" src="/assets/img/hero-imagem.webp" />
          </div>
          <Container xl className="position-relative">
            <div className="welcome position-relative" data-aos="fade-down" data-aos-delay={100}>
              <div className="mobile-slide-text">
                <h2>all4esthetic.<br />innovation.<br />results.</h2>
              </div>
            </div>
          </Container>
        </section>

        <section className="sobre sobre-section" data-aos="fade-up" id="sobre" aria-labelledby="sobre-title">
          <Container>
            <div className="row align-items-center gx-5">
              <div className="col-lg-6" data-aos="fade-right">
                <div className="content">
                  <h3 className="fw-semibold mb-3" id="sobre-title">Tecnologia em que Pode Confiar</h3>
                  <p>Oferecemos equipamentos de estética de última geração, projetados para garantir resultados seguros e precisos em cada tratamento.</p>
                  <ul>
                    <li><i className="bi bi-check-circle me-2" aria-hidden="true"></i>Performance excecional em cada aplicação.</li>
                    <li><i className="bi bi-check-circle me-2" aria-hidden="true"></i>Materiais de elevada durabilidade e design intuitivo.</li>
                    <li><i className="bi bi-check-circle me-2" aria-hidden="true"></i>Compatibilidade com as técnicas estéticas mais inovadoras.</li>
                  </ul>
                  <blockquote className="quote">“Precisão e inovação ao serviço da sua confiança.”</blockquote>
                </div>
              </div>
              <div className="col-lg-6 d-flex justify-content-center align-items-center" data-aos="fade-left">
                <div aria-hidden="true">
                  <img src="/assets/img/equipments/E169V4/E169V4-1.webp" alt="" className="img-sobre" role="presentation" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section
          className="parallax-section text-white d-flex align-items-center"
          style={{ backgroundImage: "url('/assets/img/parallax-imagem.webp')" }}
          aria-label="Seção parallax com destaque para equipamentos"
        >
          <Container className="position-relative">
            <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
              <div className="text-content-parallax text-start mb-lg-0">
                <h2 className="section-title mb-3">Confira os nossos Equipamentos</h2>
                <p className="section-description">
                  Conheça os nossos equipamentos de alta tecnologia que transformam a estética, proporcionando resultados excecionais e inovação para a sua prática. Descubra como os nossos produtos podem elevar os seus serviços e surpreender os seus clientes!
                </p>
                <Link className="btn-saiba-mais mt-4" href="/equipamentos" aria-label="Saiba mais sobre nossos equipamentos">Saiba mais</Link>

              </div>
            </div>
          </Container>
        </section>

        <section className="testimonials section" id="testimonials" aria-label="Depoimentos de clientes">
          <Container>
            <div className="row align-items-center">
              <div className="col-lg-7" data-aos="fade-up" data-aos-delay={200}>
                <div className="swiper init-swiper testimonials-swiper" role="region" aria-live="polite" aria-atomic="true" aria-relevant="additions" tabIndex={-1}>
                  <script
                    className="swiper-config"
                    type="application/json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        loop: true,
                        speed: 600,
                        autoplay: { delay: 5000 },
                        slidesPerView: 1,
                        pagination: { el: ".swiper-pagination", type: "bullets", clickable: true }
                      })
                    }}
                  />
                  <div className="swiper-wrapper">
                    <div className="swiper-slide" role="group" aria-label="Depoimento 1 de 5">
                      <div className="testimonial-item">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/img/depoimentos/manoelle_souza.webp"
                            alt="Foto de Manoelle Souza"
                            className="testimonial-img flex-shrink-0 rounded-circle"
                            width={60}
                            height={60}
                            loading="lazy"
                          />
                          <div className="ms-3">
                            <div className="testimonial-rating" aria-label="Avaliação com 5 estrelas">
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                            </div>
                            <h3>Manoelle Souza</h3>
                            <h4>Cliente</h4>
                          </div>
                        </div>
                        <p>
                          <i className="bi bi-quote quote-icon-left" aria-hidden="true"></i>
                            Tem sido uma experiência muito boa a parceria com a All4Esthetic. Estou muito satisfeita e feliz com os resultados obtidos com a tecnologia do laser. Quanto à equipa, é mesmo de excelência e está sempre pronta para nos atender e ajudar. Foi a Miriam quem me apresentou a empresa e sou mesmo grata a ela por tudo. Simpática e profissional.
                          <i className="bi bi-quote quote-icon-right" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>

                    <div className="swiper-slide" role="group" aria-label="Depoimento 2 de 5">
                      <div className="testimonial-item">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/img/depoimentos/rute_marques.webp"
                            alt="Foto de Rute Marques"
                            className="testimonial-img flex-shrink-0 rounded-circle"
                            width={60}
                            height={60}
                            loading="lazy"
                          />
                          <div className="ms-3">
                            <div className="testimonial-rating" aria-label="Avaliação com 5 estrelas">
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                            </div>
                            <h3>Rute Marques</h3>
                            <h4>Cliente</h4>
                          </div>
                        </div>
                        <p>
                          <i className="bi bi-quote quote-icon-left" aria-hidden="true"></i>
                            Sou parceira da All4Esthetic há mais de 4 anos e super recomendo, desde a qualidade dos equipamentos, ao conhecimento transmitido nas formações, até à simpatia e disponibilidade dos funcionários!
                          <i className="bi bi-quote quote-icon-right" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>

                    <div className="swiper-slide" role="group" aria-label="Depoimento 3 de 5">
                      <div className="testimonial-item">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/img/depoimentos/williane_cabral.webp"
                            alt="Foto de Williane Cabral"
                            className="testimonial-img flex-shrink-0 rounded-circle"
                            width={60}
                            height={60}
                            loading="lazy"
                          />
                          <div className="ms-3">
                            <div className="testimonial-rating" aria-label="Avaliação com 5 estrelas">
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                            </div>
                            <h3>Williane Cabral</h3>
                            <h4>Cliente</h4>
                          </div>
                        </div>
                        <p>
                          <i className="bi bi-quote quote-icon-left" aria-hidden="true"></i>
                            Estou muito satisfeita e feliz com os resultados obtidos com a tecnologia do laser. Quanto à equipa, é mesmo de excelência e está sempre pronta para nos atender e ajudar. Simpáticos e profissionais.
                          <i className="bi bi-quote quote-icon-right" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>

                    <div className="swiper-slide" role="group" aria-label="Depoimento 4 de 5">
                      <div className="testimonial-item">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/img/depoimentos/Daniela Maciel.webp"
                            alt="Foto de Daniela Maciel"
                            className="testimonial-img flex-shrink-0 rounded-circle"
                            width={60}
                            height={60}
                            loading="lazy"
                          />
                          <div className="ms-3">
                            <div className="testimonial-rating" aria-label="Avaliação com 5 estrelas">
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                            </div>
                            <h3>Daniela Maciel</h3>
                            <h4>Cliente</h4>
                          </div>
                        </div>
                        <p>
                          <i className="bi bi-quote quote-icon-left" aria-hidden="true"></i>
                            Sou extremamente grata à All4Esthetic, uma parceira que me acompanha com excelência e comprometimento. Sempre que preciso, sou atendida com agilidade, atenção e, principalmente, qualidade - pontos essenciais para quem, como eu, valoriza oferecer um atendimento de alto nível aos seus clientes.
                          <i className="bi bi-quote quote-icon-right" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>

                    <div className="swiper-slide" role="group" aria-label="Depoimento 5 de 5">
                      <div className="testimonial-item">
                        <div className="d-flex align-items-center mb-3">
                          <img
                            src="/assets/img/depoimentos/Talita.webp"
                            alt="Foto de Talita"
                            className="testimonial-img flex-shrink-0 rounded-circle"
                            width={60}
                            height={60}
                            loading="lazy"
                          />
                          <div className="ms-3">
                            <div className="testimonial-rating" aria-label="Avaliação com 5 estrelas">
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                              <i className="bi bi-star-fill" aria-hidden="true"></i>
                            </div>
                            <h3>Talita</h3>
                            <h4>Cliente</h4>
                          </div>
                        </div>
                        <p>
                          <i className="bi bi-quote quote-icon-left" aria-hidden="true"></i>
                            Gostaria de destacar a excelente qualidade dos produtos e serviços oferecidos pela All4Esthetic! Já sou cliente há 6 anos e só tenho a agradecer e dar os parabéns pelo trabalho excecional e pelo compromisso com a satisfação dos clientes!
                          <i className="bi bi-quote quote-icon-right" aria-hidden="true"></i>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="swiper-pagination mt-4" />
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
