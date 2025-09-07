"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSReady from "@/components/AOSReady";
import Container from "@/components/Container";
import { AnimatePresence, motion } from "framer-motion";

type RentalKey = "diario" | "bidiario" | "semanal" | "mensal";

type Equipment = {
  id: string;
  ref?: string; // <<--- NOVO: referência vinda do JSON
  name: string;
  image: string;
  category: string;
  designação?: string;
  detalhe?: string;
  sale?: boolean;
  rental?: Partial<Record<RentalKey, boolean>>;
};

const CATEGORIES = [
  "Electroestimulação",
  "Emsculpt",
  "Microdermoabrasão",
  "Pressoterapia",
  "Multifunções",
  "Criolipólise",
  "Radiofrequência",
  "Luz pulsada",
  "Endermologia",
  "Laser",
  "Hifu e Liposonix",
];

const RENT_LABEL: Record<RentalKey, string> = {
  diario: "Diário",
  bidiario: "Bidiário",
  semanal: "Semanal",
  mensal: "Mensal",
};

const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export default function Page() {
  const [all, setAll] = useState<Equipment[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [availability, setAvailability] = useState<"Venda" | "Aluguer" | null>(null);
  const [rental, setRental] = useState<RentalKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const perPage = 6;
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;
    fetch("/assets/data/equipamentos.json")
      .then((r) => r.json())
      .then((data: Equipment[]) => {
        if (active) setAll(data || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("noscroll", mobileOpen);
    return () => document.documentElement.classList.remove("noscroll");
  }, [mobileOpen]);

  const filtered = useMemo(() => {
    const hasCats = selectedCats.length > 0;
    return all.filter((e) => {
      if (hasCats && !selectedCats.some((c) => normalize(c) === normalize(e.category))) {
        return false;
      }
      if (availability === "Venda") return !!e.sale;
      if (availability === "Aluguer") {
        if (!e.rental) return false;
        if (rental) return !!e.rental[rental];
        return Object.values(e.rental).some(Boolean);
      }
      return true;
    });
  }, [all, selectedCats, availability, rental]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => setPage(1), [selectedCats, availability, rental]);

  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleCat = (cat: string, checked: boolean) =>
    setSelectedCats((prev) =>
      checked ? [...new Set([...prev, cat])] : prev.filter((c) => c !== cat)
    );

  const clearTag = (tag: string) => {
    if (tag === "Venda" || tag === "Aluguer") {
      setAvailability(null);
      setRental(null);
    } else if ((Object.keys(RENT_LABEL) as RentalKey[]).includes(tag as RentalKey)) {
      setRental(null);
    } else {
      setSelectedCats((prev) => prev.filter((c) => c !== tag));
    }
  };

  return (
    <>
      <a href="#main" className="skip-link">
        Ir para o conteúdo
      </a>

      <CookieBanner />
      <Header />

      <main id="main" role="main" className="main">
        <AOSReady />

        <div className="pd-page-title pd-light-bg">
          <div className="container-xl pd-breadcrumbs pd-container">
            <h1 className="pd-title-text" id="main-heading">
              Equipamentos
            </h1>
            <nav className="pd-nav-breadcrumbs" aria-label="Caminho de navegação">
              <ol>
                <li>
                  <Link href="/" className="inicio-link">
                    Início
                  </Link>
                </li>
                <li className="current" aria-current="page">
                  Equipamentos
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <section className="about section" aria-labelledby="about-heading">
          <Container>
            <div className="about" data-aos="fade-up" data-aos-delay={100}>
              <div className="row align-items-center">
                <div>
                  <h2 id="about-heading" className="about-title">
                    Realçando a sua beleza com equipamentos de excelência
                  </h2>
                  <p className="about-description">
                    A nossa missão é fornecer soluções seguras, eficazes e adaptadas às
                    necessidades de cada cliente ou clínica, promovendo bem-estar e
                    confiança.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="row">
                <aside className="col-lg-3 sidebar d-none d-md-block" aria-label="Filtros de equipamentos">
                  <div className="filter-section">
                    <h3 className="filter-title">Tecnologia</h3>
                    <ul className="list-unstyled">
                      {CATEGORIES.map((cat) => (
                        <li className="form-check" key={cat}>
                          <input
                            type="checkbox"
                            className="form-check-input desktop-cat"
                            id={`cat-${normalize(cat)}`}
                            checked={selectedCats.includes(cat)}
                            onChange={(e) => toggleCat(cat, e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor={`cat-${normalize(cat)}`}>
                            {cat}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="filter-section">
                    <h3 className="filter-title">Disponibilidade</h3>
                    <ul className="list-unstyled">
                      <li className="form-check">
                        <input
                          type="radio"
                          className="form-check-input desktop-avail"
                          name="availability"
                          id="filter-venda"
                          checked={availability === "Venda"}
                          onChange={() => {
                            setAvailability("Venda");
                            setRental(null);
                          }}
                        />
                        <label className="form-check-label" htmlFor="filter-venda">
                          Venda
                        </label>
                      </li>
                      <li className="form-check">
                        <input
                          type="radio"
                          className="form-check-input desktop-avail"
                          name="availability"
                          id="filter-aluguer"
                          checked={availability === "Aluguer"}
                          onChange={() => setAvailability("Aluguer")}
                        />
                        <label className="form-check-label" htmlFor="filter-aluguer">
                          Aluguer
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div className="filter-section" id="aluguer-periodos" hidden={availability !== "Aluguer"}>
                    <h3 className="filter-title">Períodos de Aluguer</h3>
                    <ul className="list-unstyled">
                      {(Object.keys(RENT_LABEL) as RentalKey[]).map((key) => (
                        <li className="form-check" key={key}>
                          <input
                            type="radio"
                            className="form-check-input desktop-rent"
                            name="rental-period"
                            id={`rent-${key}`}
                            checked={rental === key}
                            onChange={() => setRental(key)}
                          />
                          <label className="form-check-label" htmlFor={`rent-${key}`}>
                            {RENT_LABEL[key]}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <div className="col-12 d-md-none mb-3">
                  <button
                    id="filtro-btn"
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center mb-3"
                    aria-haspopup="true"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-filters"
                    onClick={() => setMobileOpen(true)}
                  >
                    Filtro
                  </button>

                  {mobileOpen && (
                    <div
                      id="mobile-filters"
                      role="dialog"
                      aria-labelledby="mobile-filters-title"
                      aria-modal="true"
                      aria-hidden="false"
                      tabIndex={-1}
                      className="open"
                    >
                      <div className="mobile-filters-content">
                        <h2 id="mobile-filters-title" className="visually-hidden">
                          Filtros
                        </h2>

                        <div className="filter-section">
                          <h4 className="filter-title">Tecnologia</h4>
                          <ul className="list-unstyled">
                            {CATEGORIES.map((cat) => (
                              <li className="form-check" key={`mob-${cat}`}>
                                <input
                                  type="checkbox"
                                  className="form-check-input mobile-cat"
                                  id={`mob-cat-${normalize(cat)}`}
                                  checked={selectedCats.includes(cat)}
                                  onChange={(e) => toggleCat(cat, e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor={`mob-cat-${normalize(cat)}`}>
                                  {cat}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="filter-section">
                          <h4 className="filter-title">Disponibilidade</h4>
                          <ul className="list-unstyled">
                            <li className="form-check">
                              <input
                                type="radio"
                                className="form-check-input mobile-avail"
                                name="availability-mob"
                                id="filter-venda-mob"
                                checked={availability === "Venda"}
                                onChange={() => {
                                  setAvailability("Venda");
                                  setRental(null);
                                }}
                              />
                              <label className="form-check-label" htmlFor="filter-venda-mob">
                                Venda
                              </label>
                            </li>
                            <li className="form-check">
                              <input
                                type="radio"
                                className="form-check-input mobile-avail"
                                name="availability-mob"
                                id="filter-aluguer-mob"
                                checked={availability === "Aluguer"}
                                onChange={() => setAvailability("Aluguer")}
                              />
                              <label className="form-check-label" htmlFor="filter-aluguer-mob">
                                Aluguer
                              </label>
                            </li>
                          </ul>
                        </div>

                        <div className="filter-section" id="aluguer-periodos-mob" hidden={availability !== "Aluguer"}>
                          <h4 className="filter-title">Períodos de Aluguer</h4>
                          <ul className="list-unstyled">
                            {(Object.keys(RENT_LABEL) as RentalKey[]).map((key) => (
                              <li className="form-check" key={`mob-${key}`}>
                                <input
                                  type="radio"
                                  className="form-check-input mobile-rent"
                                  name="rental-period-mob"
                                  id={`filter-${key}-mob`}
                                  checked={rental === key}
                                  onChange={() => setRental(key)}
                                />
                                <label className="form-check-label" htmlFor={`filter-${key}-mob`}>
                                  {RENT_LABEL[key]}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          id="pesquisar-btn"
                          className="btn btn-primary w-100"
                          onClick={() => setMobileOpen(false)}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-lg-9">
                  <div
                    id="selected-tags-container"
                    className={`selected-tags-bar d-md-none ${
                      !selectedCats.length && !availability ? "d-none" : ""
                    }`}
                  >
                    {selectedCats.map((c) => (
                      <span key={`tag-${c}`} className="selected-tag">
                        {c}
                        <button className="close-btn" onClick={() => clearTag(c)} aria-label={`Remover ${c}`}>
                          X
                        </button>
                      </span>
                    ))}

                    {availability && (
                      <span className="selected-tag">
                        {availability}
                        <button className="close-btn" onClick={() => clearTag(availability)} aria-label="Remover disponibilidade">
                          X
                        </button>
                      </span>
                    )}

                    {availability === "Aluguer" && rental && (
                      <span className="selected-tag">
                        {RENT_LABEL[rental]}
                        <button className="close-btn" onClick={() => clearTag(rental)} aria-label="Remover período">
                          X
                        </button>
                      </span>
                    )}
                  </div>

                  <div id="equipamentos-container" className="row g-4">
                    <AnimatePresence mode="popLayout">
                      {slice.map((e) => (
                        <motion.div
                          key={e.id}
                          layout
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 12, scale: 0.98 }}
                          transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
                          className="col-12 col-md-6 col-lg-4"
                        >
                          <div className="card equipamento-card h-100">
                            <div className="card-category-top">{e.category}</div>

                            <div className="card-img-wrap">
                              <img src={e.image} alt={e.name} className="card-img-top" />
                            </div>

                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title">{e.name}</h5>
                              <p className="card-designacao mb-2">{e.designação}</p>
                              <span className="card-details">
                              {e.detalhe && <p className="card-detalhe mb-2">{e.detalhe}</p>}

                              {/* <<< ALTERADO: mostra REF do JSON (com fallback para id) >>> */}
                              <p className="card-ref text-muted small mb-2 mt-auto">REF: {e.ref ?? e.id}</p>
                              </span>

                              <Link href={`/detalhes?id=${e.id}`} className="btn btn-primary mt-auto">
                                Mais detalhes
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {!slice.length && (
                      <div className="col-12">
                        <p className="text-center text-muted">
                          Nenhum equipamento encontrado com os filtros selecionados.
                        </p>
                      </div>
                    )}
                  </div>

                  <nav aria-label="Page navigation" className="mt-4">
                    <ul id="pagination" className="pagination justify-content-center custom-pagination">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) setPage((p) => p - 1);
                          }}
                        >
                          «
                        </a>
                      </li>

                      {Array.from({ length: pageCount }).map((_, i) => (
                        <li className={`page-item ${page === i + 1 ? "active" : ""}`} key={`p${i}`}>
                          <a
                            className="page-link"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </a>
                        </li>
                      ))}

                      <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
                        <a
                          className="page-link"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (page < pageCount) setPage((p) => p + 1);
                          }}
                        >
                          »
                        </a>
                      </li>
                    </ul>
                  </nav>
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
