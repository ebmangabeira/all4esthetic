import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSReady from "@/components/AOSReady";
import ScrollTop from "@/components/ScrollTop";
import HashModalOpener from "@/components/HashModalOpener";

export const metadata = {
  title: "Quem Somos | all4esthetic",
  description: "Conheça a história, equipa e visão da all4esthetic.",
};

export default function QuemSomosPage() {
  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <CookieBanner />
      <Header />

      <main className="main" role="main" id="main">
        <AOSReady />

        <div className="pd-page-title pd-light-bg">
          <div className="container-xl pd-breadcrumbs pd-container">
            <h1 className="pd-title-text" id="main-heading">
              Quem<span className="detalhes-title">_</span>Somos
            </h1>
            <nav className="pd-nav-breadcrumbs" aria-label="Caminho de navegação">
              <ol>
                <li>
                  <Link href="/" className="inicio-link">Início</Link>
                </li>
                <li className="current" aria-current="page">Quem Somos</li>
              </ol>
            </nav>
          </div>
        </div>

        <section className="about section" aria-labelledby="about-heading">
          <div className="container" data-aos="fade-up" data-aos-delay={100}>
            <div className="about">
              <div className="row align-items-center">
                <div>
                  <h2 className="about-title" id="about-heading">
                    Inovação e qualidade para transformar a estética
                  </h2>
                  <p className="about-description">
                    Comprometidos em oferecer tecnologias avançadas e serviços personalizados, trabalhamos para elevar o padrão de beleza e cuidado, sempre com segurança e confiança.
                  </p>
                </div>
              </div>
            </div>

            <div className="row-box features-boxes gy-4 gx-4">
              <div className="col-lg-4" data-aos="fade-up" data-aos-delay={200}>
                <button
                  type="button"
                  className="feature-box p-4 h-100 w-100 position-relative"
                  data-bs-toggle="modal"
                  data-bs-target="#modalHistoria"
                  aria-describedby="feature-historia"
                  aria-label="Abrir modal sobre a História da All4esthetic"
                  aria-haspopup="dialog"
                  aria-controls="modalHistoria"
                >
                  <div className="icon-box mb-3" aria-hidden="true">
                    <i className="bi bi-book-half"></i>
                  </div>
                  <h3 id="feature-historia" className="mb-2">História</h3>
                  <p className="mb-0">A All4esthetic nasce de um sonho que iniciou em 2006 e evoluiu até hoje.</p>
                </button>
              </div>

              <div className="col-lg-4" data-aos="fade-up" data-aos-delay={300}>
                <button
                  type="button"
                  className="feature-box p-4 h-100 w-100 text-start position-relative"
                  data-bs-toggle="modal"
                  data-bs-target="#modalEquipa"
                  aria-describedby="feature-equipa"
                  aria-label="Abrir modal sobre a Equipa da All4esthetic"
                  aria-haspopup="dialog"
                  aria-controls="modalEquipa"
                >
                  <div className="icon-box mb-3" aria-hidden="true">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <h3 id="feature-equipa" className="mb-2">Equipa</h3>
                  <p className="mb-0">Conheça os especialistas que garantem qualidade em cada equipamento.</p>
                </button>
              </div>

              <div className="col-lg-4" data-aos="fade-up" data-aos-delay={400}>
                <button
                  type="button"
                  className="feature-box p-4 h-100 w-100 text-start position-relative"
                  data-bs-toggle="modal"
                  data-bs-target="#modalVisao"
                  aria-describedby="feature-visao"
                  aria-label="Abrir modal sobre a Visão da All4esthetic"
                  aria-haspopup="dialog"
                  aria-controls="modalVisao"
                >
                  <div className="icon-box mb-3" aria-hidden="true">
                    <i className="bi bi-eye-fill"></i>
                  </div>
                  <h3 id="feature-visao" className="mb-2">Visão</h3>
                  <p className="mb-0">Descubra para onde caminhamos no futuro da estética.</p>
                </button>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="modalHistoria"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="modalHistoriaLabel"
            aria-modal="true"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content history-modal">
                <div className="modal-body p-0">
                  <div className="history-card">
                    <div className="history-quote mb-4">
                      <i className="bi bi-quote" aria-hidden="true"></i>
                      <p id="modalHistoriaLabel">
                        “A All4esthetic nasce de um sonho que começou em 2006 com apenas dois equipamentos. Após sete anos de aprendizagem, em 2013 criámos a marca All4esthetic e, desde então, não parámos na busca da excelência, inovação e compromisso, pois acreditamos que essas são as bases para transformar ideias em resultados.”
                      </p>
                    </div>
                    <div className="history-client mb-3">
                      <div className="history-info">
                        <h5 className="history-name mb-1">Nuno Jorge</h5>
                        <span className="history-role">CEO da All4esthetic</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close-history"
                      data-bs-dismiss="modal"
                      aria-label="Fechar modal sobre a História"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="modalEquipa"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="modalEquipaLabel"
            aria-modal="true"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content history-modal">
                <div className="modal-body p-0">
                  <div className="history-card">
                    <div className="history-image mb-4">
                      <img
                        src="/assets/img/equipa/equipa.webp"
                        alt="Foto da equipa All4esthetic"
                        className="history-image__img"
                        width={600}
                        height={400}
                        loading="lazy"
                      />
                    </div>
                    <div className="history-quote mb-4">
                      <i className="bi bi-quote" aria-hidden="true"></i>
                      <p id="modalEquipaLabel">
                        Na All4esthetic, somos uma equipa dedicada à inovação e à excelência no mercado da estética. Com vasta experiência na comercialização de produtos e equipamentos, formação especializada e assistência técnica de ponta, trabalhamos diariamente para oferecer soluções completas e personalizadas aos nossos clientes.
                      </p>
                    </div>
                    <div className="history-client mb-3">
                      <div className="history-info">
                        <h5 className="history-name mb-1">Equipa All4esthetic</h5>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close-history"
                      data-bs-dismiss="modal"
                      aria-label="Fechar modal sobre a Equipa"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="modalVisao"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="modalVisaoLabel"
            aria-modal="true"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content history-modal">
                <div className="modal-body p-0">
                  <div className="history-card">
                    <div className="history-quote mb-4">
                      <i className="bi bi-quote" aria-hidden="true"></i>
                      <p id="modalVisaoLabel">
                        Na All4esthetic, a nossa visão é liderar a estética com inovação sustentável e confiança. Ambicionamos elevar padrões, unindo tecnologia, formação e serviço próximo, para criar valor duradouro. Queremos ser a primeira escolha de profissionais e clientes, inspirando bem-estar e resultados em cada projeto hoje.
                      </p>
                    </div>
                    <div className="history-client mb-3">
                      <div className="history-info">
                        <h5 className="history-name mb-1">Visão All4esthetic</h5>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-close-history"
                      data-bs-dismiss="modal"
                      aria-label="Fechar modal sobre a Visão"
                    >
                      &times;
                    </button>
                  </div>
                </div>
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
