import Link from "next/link";
import React from "react";
import Container from "./Container";

export default function Footer() {
  const addressDisplay = 'R. dos Tractores 506 Armazém AE 2870-607, Montijo';
  const mapsNavigateUrl =
    "https://www.google.com/maps/dir//All4esthetic,+R.+dos+Tractores+506+Armaz%C3%A9m+AE,+2870-607/@38.6727318,-8.9367493,18.5z/data=!4m9!4m8!1m0!1m5!1m1!1s0xd1939275241cce3:0x8900811c1b00a947!2m2!1d-8.9360726!2d38.6728933!3e0?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D";

  return (
    <footer className="footer" id="footer" role="contentinfo">
      <div className="footer-main">
        <Container>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-12">
              <div className="footer-about">
                <Link className="logo" href="/" aria-label="Página inicial">
                  <img
                    alt="Logo all4esthetic"
                    src="/assets/img/logo-footer.png"
                  />
                </Link>
                <p className="footer-infor">
                  Conectando inovação e estética: um catálogo completo de
                  equipamentos e produtos que elevam a beleza e promovem o
                  bem-estar com tecnologia.
                </p>
                <div className="social-links mt-4" aria-label="Redes sociais">
                  <h5>Siga-nos:</h5>
                  <div className="social-icons">
                    <a
                      aria-label="Facebook"
                      href="https://www.facebook.com/all4esthetic/?locale=pt_PT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-facebook" aria-hidden="true"></i>
                    </a>
                    <a
                      aria-label="Instagram"
                      href="https://www.instagram.com/all4esthetic/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-instagram" aria-hidden="true"></i>
                    </a>
                    <a
                      aria-label="Whatsapp"
                      href="https://wa.me/351936623907"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-whatsapp" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg col-md-6 col-sm-6">
              <div className="footer-widget">
                <h4>Quem Somos</h4>
                <ul className="footer-links">
                  <li>
                    <Link
                      href="/quem-somos#modalHistoria"
                      aria-label="Abrir modal História"
                    >
                      História
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/quem-somos#modalEquipa"
                      aria-label="Abrir modal Equipa"
                    >
                      Equipa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/quem-somos#modalVisao"
                      aria-label="Abrir modal Visão"
                    >
                      Visão
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg col-md-6 col-sm-6">
              <div className="footer-widget">
                <h4>Informações</h4>
                <ul className="footer-links">
                  <li>
                    <Link href="/termos">Termos de Uso</Link>
                  </li>
                  <li>
                    <Link href="/aviso-legal">Aviso Legal</Link>
                  </li>
                  <li>
                    <Link href="/politica-privacidade">
                      Política de Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg col-md-6 col-sm-6">
              <div className="footer-widget">
                <h4>Contacto</h4>
                <div className="footer-contact mt-4">
                  <div className="contact-item">
                    <i className="bi bi-geo-alt" aria-hidden="true"></i>
                    <span>
                      <a
                        href={mapsNavigateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Abrir a localização no mapa e iniciar a navegação"
                      >
                        {addressDisplay}
                      </a>
                    </span>
                  </div>

                  <div className="contact-item">
                    <i className="bi bi-telephone" aria-hidden="true"></i>
                    <span>
                      <a href="tel:+351936623907"
                        aria-label="Ligar para +351 936 623 907 ">
                        (+351) 936 623 907
                      </a>
                    </span>
                  </div>

                  <div className="contact-item">
                    <i className="bi bi-envelope" aria-hidden="true"></i>
                    <span>
                      <a href="mailto:geral@all4esthetic.com">
                        geral@all4esthetic.com
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="footer-bottom">
        <div>
          <div className="copyright text-center mt-4">
            <p className="footer-p">
              © <span>Copyright 2025</span>{" "}
              <strong className="px-1 sitename">all4esthetic.</strong>{" "}
              <span>Todos os Direitos Reservados.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
