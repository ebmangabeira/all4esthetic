"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import AOSReady from "@/components/AOSReady";
import Container from "@/components/Container";

type RentalKey = "diario" | "bidiario" | "semanal" | "mensal";
const RENT_LABEL: Record<RentalKey, string> = {
  diario: "Diário",
  bidiario: "Bidiário",
  semanal: "Semanal",
  mensal: "Mensal",
};

type FuncItem =
  | string
  | {
      nome?: string;
      descricao?: string;
      ["descrição"]?: string;
      name?: string;
      description?: string;
    };

type RowObj = {
  k?: string;
  v?: string;
  key?: string;
  value?: string;
  nome?: string;
  valor?: string;
  label?: string;
  descricao?: string;
  ["descrição"]?: string;
  description?: string;
};
type RowTuple = [string, string];
type KV = Record<string, unknown> | Array<RowObj | RowTuple>;

const isPlainObject = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const isTuple = (x: unknown): x is RowTuple =>
  Array.isArray(x) && x.length >= 2 && typeof x[0] === "string" && typeof x[1] === "string";
const isPrimitive = (v: unknown) => ["string", "number", "boolean"].includes(typeof v);
const asString = (v: unknown) => (v == null ? "" : String(v));

const fmtKey = (k: string) =>
  k
    .split("›")
    .map((p) => p.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim())
    .join(" › ");

function toRows(data?: KV): Array<[string, string]> {
  const out: Array<[string, string]> = [];

  const push = (k: string, v: unknown) => {
    if (isPrimitive(v)) out.push([fmtKey(k), asString(v)]);
    else if (Array.isArray(v)) {
      if (v.every(isPrimitive)) out.push([fmtKey(k), (v as any[]).map(asString).join(" · ")]);
      else {
        v.forEach((item, idx) => {
          if (isTuple(item)) out.push([fmtKey(k || `Item ${idx + 1}`), `${item[0]}: ${item[1]}`]);
          else if (isPlainObject(item)) {
            const o = item as any;
            const kk = o.k ?? o.key ?? o.nome ?? o.label ?? `Item ${idx + 1}`;
            const vv =
              o.v ??
              o.value ??
              o.valor ??
              o.descricao ??
              o["descrição"] ??
              o.description;
            if (isPrimitive(vv) && typeof kk === "string") out.push([fmtKey(kk), asString(vv)]);
            else flatten(o, k);
          }
        });
      }
    } else if (isPlainObject(v)) {
      flatten(v, k);
    }
  };

  const flatten = (obj: Record<string, unknown>, parent?: string) => {
    const k1 =
      (obj as any).k ??
      (obj as any).key ??
      (obj as any).nome ??
      (obj as any).label;
    const v1 =
      (obj as any).v ??
      (obj as any).value ??
      (obj as any).valor ??
      (obj as any).descricao ??
      (obj as any)["descrição"] ??
      (obj as any).description;

    if (typeof k1 === "string" && isPrimitive(v1)) {
      out.push([fmtKey(k1), asString(v1)]);
      return;
    }

    let added = false;
    for (const [kk, vv] of Object.entries(obj)) {
      const key = parent ? `${parent} › ${kk}` : kk;
      if (isPrimitive(vv)) {
        out.push([fmtKey(key), asString(vv)]);
        added = true;
      } else {
        push(key, vv);
        added = true;
      }
    }
    if (!added && parent) out.push([fmtKey(parent), "—"]);
  };

  if (!data) return out;

  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      if (isTuple(item)) out.push([fmtKey(item[0]), item[1]]);
      else if (isPlainObject(item)) flatten(item);
      else if (isPrimitive(item)) out.push([fmtKey(`Item ${i + 1}`), asString(item)]);
    });
  } else if (isPlainObject(data)) {
    flatten(data);
  }

  return out;
}

function normalizeFunctions(
  raw?: FuncItem[]
): Array<{ title: string; sub?: string; titleKey?: string; subKey?: string }> {
  if (!raw || !Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return { title: item, titleKey: "string" };
      if (item && typeof item === "object") {
        const o = item as Record<string, any>;
        const pickFirst = (entries: Array<[string, any]>): { val: string; key?: string } => {
          for (const [k, v] of entries) {
            if (typeof v === "string" && v.trim()) return { val: v, key: String(k) };
          }
          return { val: "", key: undefined };
        };
        const tPick = pickFirst([
          ["nome", o.nome],
          ["name", o.name],
        ]);
        const sPick = pickFirst([
          ["descricao", o.descricao],
          ["descrição", o["descrição"]],
          ["description", o.description],
        ]);
        const title = tPick.val || "";
        const sub = sPick.val || undefined;
        if (title || sub) return { title, sub, titleKey: tPick.key, subKey: sPick.key };
      }
      return null;
    })
    .filter(Boolean) as Array<{ title: string; sub?: string; titleKey?: string; subKey?: string }>;
}

function findTechnicalBlock(tree?: Record<string, unknown>): KV | undefined {
  if (!tree) return undefined;
  const want = [
    "technicaldata",
    "fichatecnica",
    "ficha_tecnica",
    "tecnica",
    "technical",
    "dadostecnicos",
    "dados_tecnicos",
    "especificacoes",
    "especificacoestecnicas",
    "caracteristicastecnicas",
    "dadostecnico",
  ];
  const normKey = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\s_-]+/g, "").toLowerCase();

  for (const [k, v] of Object.entries(tree)) {
    const nk = normKey(k);
    if (want.some((w) => nk.includes(w)) || nk.includes("tecnic")) return v as KV;
  }
  for (const v of Object.values(tree)) {
    if (isPlainObject(v)) {
      const found = findTechnicalBlock(v);
      if (found) return found;
    }
  }
  return undefined;
}

function normalizeLegislation(src: unknown): { list: string[]; rows: Array<[string, string]> } {
  if (typeof src === "string" && src.trim()) return { list: [src.trim()], rows: [] };
  if (Array.isArray(src)) {
    const prims = src.filter((x) => isPrimitive(x)).map(asString).filter(Boolean);
    const nonPrims = src.filter((x) => !isPrimitive(x));
    if (nonPrims.length === 0) return { list: prims, rows: [] };
    return { list: [], rows: toRows(nonPrims as any) };
  }
  if (isPlainObject(src)) return { list: [], rows: toRows(src as any) };
  return { list: [], rows: [] };
}

type EquipmentDetails = {
  id: string;
  name?: string;
  nome?: string;
  image?: string;
  images?: string[];
  category?: string;
  ["designação"]?: string;
  designacao?: string;
  sale?: boolean;
  rental?: Partial<Record<RentalKey, boolean>>;
  funcoes?: FuncItem[];
  functions?: FuncItem[];
  technical_data?: KV;
  fichaTecnica?: KV;
  ficha_tecnica?: KV;
  tecnica?: KV;
  technical?: KV;
  dadosTecnicos?: KV;
  dados_tecnicos?: KV;
  especificacoes?: KV;
  especificacoesTecnicas?: KV;
  caracteristicasTecnicas?: KV;
  logistica?: KV;
  logistics?: KV;
  legislation?: unknown;
  legislacao?: unknown;
  ["legislação"]?: unknown;
  aplicacao?: string;
  application?: string;
};

export default function Page() {
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";

  const [all, setAll] = useState<EquipmentDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const FADE_MS = 220;

  const [tab, setTab] = useState<"funcao" | "tecnica">("funcao");

  const [printAll, setPrintAll] = useState(false);
  useEffect(() => {
    const before = () => setPrintAll(true);
    const after = () => setPrintAll(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    const mql = window.matchMedia?.("print");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setPrintAll(matches);
    };
    if (mql) {
      mql.addEventListener ? mql.addEventListener("change", onChange) : mql.addListener(onChange);
    }
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
      if (mql) {
        mql.removeEventListener ? mql.removeEventListener("change", onChange) : mql.removeListener(onChange);
      }
    };
  }, []);

  const activeThumbRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/assets/data/equipamentos.json")
      .then((r) => r.json())
      .then((data: EquipmentDetails[]) => {
        if (!alive) return;
        setAll(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!alive) return;
        setAll([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const eq = useMemo(() => all.find((e) => String(e.id) === String(id)), [all, id]);

  const title = eq?.name ?? eq?.nome ?? "Detalhes";
  const designation = (eq as any)?.["designação"] ?? (eq as any)?.designacao ?? "";
  const category = eq?.category ?? "";
  const mainImage = eq?.image ? [eq.image] : [];
  const images = (eq?.images && eq.images.length ? eq.images : mainImage).filter(Boolean);

  const funcItems = normalizeFunctions(eq?.funcoes ?? eq?.functions);

  const techSource: KV | undefined =
    (eq?.technical_data as KV | undefined) ?? findTechnicalBlock(eq as any);
  const techRows = toRows(techSource);
  const logRows = toRows(eq?.logistica ?? eq?.logistics);
  const rawLegislation =
    (eq?.legislation as unknown) ?? (eq?.legislacao as unknown) ?? (eq as any)?.["legislação"];
  const { list: legisList, rows: legisRows } = normalizeLegislation(rawLegislation);

  const application = (eq?.aplicacao ?? eq?.application ?? "") as string;

  const sale = !!eq?.sale;
  const rental = eq?.rental ?? {};

  useEffect(() => {
    setCurrent(0);
    setTab("funcao");
    setIsSwitching(false);
  }, [id]);

  useEffect(() => {
    const el = activeThumbRef.current;
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [current]);

  const goTo = (target: number) => {
    if (!images.length) return;
    if (target === current || isSwitching) return;
    setIsSwitching(true);
    setTimeout(() => {
      setCurrent(target);
      setTimeout(() => setIsSwitching(false), 30);
    }, FADE_MS);
  };

  const hasPrev = current > 0;
  const hasNext = current < Math.max(0, images.length - 1);
  const prev = () => hasPrev && goTo(current - 1);
  const next = () => hasNext && goTo(current + 1);

  const handlePrint = () => {
    setPrintAll(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintAll(false), 300);
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="main" id="main" role="main">
          <Container>
            <p className="text-center text-muted" style={{ padding: "120px 0 60px" }}>
              Carregando…
            </p>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  if (!eq) {
    return (
      <>
        <Header />
        <main className="main" id="main" role="main">
          <Container>
            <div className="pd-page-title pd-light-bg">
              <div className="container-xl pd-breadcrumbs pd-container">
                <h1 className="pd-title-text" id="main-heading">Detalhes</h1>
                <nav className="pd-nav-breadcrumbs" aria-label="Caminho de navegação">
                  <ol>
                    <li><Link href="/" className="inicio-link">Início</Link></li>
                    <li><Link href="/equipamentos" className="inicio-link">Equipamentos</Link></li>
                    <li className="current" aria-current="page">Detalhes</li>
                  </ol>
                </nav>
              </div>
            </div>
            <section className="section">
              <p className="text-center text-muted">Equipamento não encontrado.</p>
            </section>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  const availabilityItems: string[] = [];
  if (sale) availabilityItems.push("Para venda");
  (Object.keys(RENT_LABEL) as RentalKey[]).forEach((k) => {
    if (rental[k]) availabilityItems.push(`Para aluguer ${RENT_LABEL[k]}`);
  });

  return (
    <>
      <a href="#main" className="skip-link">Ir para o conteúdo</a>
      <CookieBanner />
      <Header />
      <main className="main" id="main" role="main">
        <AOSReady />
        <div className="pd-page-title pd-light-bg">
          <div className="container-xl pd-breadcrumbs pd-container">
            <h1 className="pd-title-text" id="main-heading-pdf">Detalhes</h1>
            <nav className="pd-nav-breadcrumbs" aria-label="Caminho de navegação">
              <ol>
                <li><Link href="/" className="inicio-link">Início</Link></li>
                <li><Link href="/equipamentos" className="inicio-link">Equipamentos</Link></li>
                <li className="current" aria-current="page">Detalhes</li>
              </ol>
            </nav>
          </div>
        </div>

        <section
          id="pd-product-section"
          className="pd-details-section pd-container section"
          aria-labelledby="pd-title-text"
        >
          <div className="pdf-wrapper">
            <div id="pdf-logo-container" aria-hidden="true">
              <img src="/assets/img/logo-header.png" alt="Logo all4esthetic" id="pdf-logo" />
            </div>
            <Container>
              <div className="row">
                <div className="grid-product">
                  <div className="image-column">
                    <div className={`pd-img-container pd-img-fade ${isSwitching ? "switching" : ""}`}>
                      <span id="pd-category-text" className="pd-category-label" aria-live="polite">
                        {category}
                      </span>
                      <img
                        key={current}
                        id="pd-main-img"
                        className="pd-main-image"
                        src={images[current] ?? "/assets/img/placeholder.png"}
                        alt={title || "Imagem do produto"}
                        loading="lazy"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="thumbs-wrapper">
                        <button
                          className="thumb-btn prev"
                          aria-label="Imagem anterior"
                          type="button"
                          onClick={prev}
                          disabled={!hasPrev}
                        >
                          &lt;
                        </button>
                        <div className="thumbs-viewport" role="list" aria-label="Miniaturas do produto">
                          <ul className="thumbs-track" role="list">
                            {images.map((src, i) => {
                              const active = i === current;
                              return (
                                <li
                                  key={src + i}
                                  className={`thumb-slide ${active ? "active" : ""}`}
                                  role="listitem"
                                  aria-current={active ? "true" : undefined}
                                  ref={active ? activeThumbRef : null}
                                >
                                  <button
                                    type="button"
                                    onClick={() => goTo(i)}
                                    aria-label={`Ver imagem ${i + 1}`}
                                    style={{ all: "unset", cursor: "pointer", display: "block" }}
                                  >
                                    <img src={src} alt={`Miniatura ${i + 1}`} />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <button
                          className="thumb-btn next"
                          aria-label="Próxima imagem"
                          type="button"
                          onClick={next}
                          disabled={!hasNext}
                        >
                          &gt;
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="info-column">
                    <div className="pd-title-row">
                      <h2 id="pd-title-text" className="pd-product-title">
                        {title}
                      </h2>
                      {designation ? (
                        <span className="pd-designacao" style={{ margin: 0 }}>
                          {designation}
                        </span>
                      ) : null}
                    </div>

                    {!printAll && (
                      <>
                        <div className="tab-buttons" role="tablist" aria-label="Seções do produto">
                          <button
                            id="btn-funcao"
                            className={`pd-btn-funcao ${tab === "funcao" ? "active" : ""}`}
                            role="tab"
                            aria-selected={tab === "funcao"}
                            aria-controls="content-funcao"
                            type="button"
                            onClick={() => setTab("funcao")}
                          >
                            Função
                          </button>
                          <button
                            id="btn-tecnica"
                            className={`pd-btn-tecnica ${tab === "tecnica" ? "active" : ""}`}
                            role="tab"
                            aria-selected={tab === "tecnica"}
                            aria-controls="content-tecnica"
                            type="button"
                            onClick={() => setTab("tecnica")}
                          >
                            Ficha Técnica
                          </button>
                        </div>

                        <div id="tab-content">
                          <div
                            id="content-funcao"
                            className={`tab-panel ${tab === "funcao" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="btn-funcao"
                            hidden={tab !== "funcao"}
                          >
                            <div id="pd-functions-list">
                              {funcItems.length ? (
                                <ul className="list-unstyled" style={{ marginBottom: 0 }}>
                                  {funcItems.map((f, i) => {
                                    const titleIsNome = f.titleKey === "nome" || f.titleKey === "name";
                                    const subIsDescricao =
                                      f.subKey === "descricao" || f.subKey === "descrição" || f.subKey === "description";
                                    return (
                                      <li
                                        key={i}
                                        className="pd-func-item"
                                        data-title-source={f.titleKey || ""}
                                        data-sub-source={f.subKey || ""}
                                        style={{ marginBottom: "10px", color: "var(--heading-color)" }}
                                      >
                                        {f.title ? (
                                          <div
                                            className={[
                                              "pd-func-title",
                                              titleIsNome ? "pd-func-nome" : "",
                                            ].join(" ").trim()}
                                          >
                                            {f.title}
                                          </div>
                                        ) : null}
                                        {f.sub ? (
                                          <div
                                            className={[
                                              "pd-func-sub",
                                              subIsDescricao ? "pd-func-descricao" : "",
                                            ].join(" ").trim()}
                                            style={{ fontSize: "0.95rem", opacity: 0.9 }}
                                          >
                                            {f.sub}
                                          </div>
                                        ) : null}
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : (
                                <p className="pd-funcao-descricao">Sem descrição de funções.</p>
                              )}
                            </div>
                          </div>

                          <div
                            id="content-tecnica"
                            className={`tab-panel ${tab === "tecnica" ? "active" : ""}`}
                            role="tabpanel"
                            aria-labelledby="btn-tecnica"
                            hidden={tab !== "tecnica"}
                          >
                            <div className="pd-box">
                              <h5>Dados Técnicos</h5>
                              {techRows.length ? (
                                <table id="pd-tech-table" className="table" summary="Tabela com dados técnicos do produto">
                                  <tbody>
                                    {techRows.map(([k, v], idx) => (
                                      <tr key={k + idx}>
                                        <th scope="row">{k}</th>
                                        <td>{v}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>—</p>
                              )}
                            </div>

                            <div className="pd-box">
                              <h5>Logística</h5>
                              {logRows.length ? (
                                <table id="pd-logistics-table" className="table" summary="Tabela com informações logísticas do produto">
                                  <tbody>
                                    {logRows.map(([k, v], idx) => (
                                      <tr key={k + idx}>
                                        <th scope="row">{k}</th>
                                        <td>{v}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>—</p>
                              )}
                            </div>

                            <div className="pd-box">
                              <h5>Legislação</h5>
                              {legisList.length ? (
                                <ul className="pd-legislation-list">
                                  {legisList.map((txt, i) => (
                                    <li key={i} className="pd-legislation-item">
                                      <i className="bi bi-file-earmark-text" aria-hidden="true" />
                                      <span className="pd-legislation-text">{txt}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : legisRows.length ? (
                                <table id="pd-legislation-table" className="table pd-legislation-table" summary="Tabela com legislação aplicável ao produto">
                                  <tbody>
                                    {legisRows.map(([k, v], idx) => (
                                      <tr key={k + idx}>
                                        <th scope="row">{k}</th>
                                        <td>{v}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>—</p>
                              )}
                            </div>

                            <div className="pd-box">
                              <h5>Aplicação</h5>
                              <p id="pd-application-text">{application || "—"}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {printAll && (
                      <div id="pdf-static-content">
                        <div className="pd-box">
                          {funcItems.length ? (
                            <ul className="list-unstyled" style={{ marginBottom: 0 }}>
                              {funcItems.map((f, i) => {
                                const titleIsNome = f.titleKey === "nome" || f.titleKey === "name";
                                const subIsDescricao =
                                  f.subKey === "descricao" || f.subKey === "descrição" || f.subKey === "description";
                                return (
                                  <li
                                    key={i}
                                    className="pd-func-item"
                                    data-title-source={f.titleKey || ""}
                                    data-sub-source={f.subKey || ""}
                                    style={{ marginBottom: "10px", color: "var(--heading-color)" }}
                                  >
                                    {f.title ? (
                                      <div
                                        className={[
                                          "pd-func-title",
                                          titleIsNome ? "pd-func-nome" : "",
                                        ].join(" ").trim()}
                                      >
                                        {f.title}
                                      </div>
                                    ) : null}
                                    {f.sub ? (
                                      <div
                                        className={[
                                          "pd-func-sub",
                                          subIsDescricao ? "pd-func-descricao" : "",
                                        ].join(" ").trim()}
                                        style={{ fontSize: "0.95rem", opacity: 0.9 }}
                                      >
                                        {f.sub}
                                      </div>
                                    ) : null}
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p>—</p>
                          )}
                        </div>

                        <div className="pd-box">
                          <h5>Ficha Técnica</h5>
                          {techRows.length ? (
                            <table id="pd-tech-table-pdf" className="table" summary="Tabela com dados técnicos do produto">
                              <tbody>
                                {techRows.map(([k, v], idx) => (
                                  <tr key={k + idx}>
                                    <th scope="row">{k}</th>
                                    <td>{v}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>—</p>
                          )}
                        </div>

                        <div className="pd-box">
                          <h5>Logística</h5>
                          {logRows.length ? (
                            <table id="pd-logistics-table-pdf" className="table" summary="Tabela com informações logísticas do produto">
                              <tbody>
                                {logRows.map(([k, v], idx) => (
                                  <tr key={k + idx}>
                                    <th scope="row">{k}</th>
                                    <td>{v}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>—</p>
                          )}
                        </div>

                        <div className="pd-box">
                          <h5>Legislação</h5>
                          {legisList.length ? (
                            <ul className="pd-legislation-list">
                              {legisList.map((txt, i) => (
                                <li key={i} className="pd-legislation-item">
                                  <i className="bi bi-file-earmark-text" aria-hidden="true" />
                                  <span className="pd-legislation-text">{txt}</span>
                                </li>
                              ))}
                            </ul>
                          ) : legisRows.length ? (
                            <table id="pd-legislation-table-pdf" className="table pd-legislation-table" summary="Tabela com legislação aplicável ao produto">
                              <tbody>
                                {legisRows.map(([k, v], idx) => (
                                  <tr key={k + idx}>
                                    <th scope="row">{k}</th>
                                    <td>{v}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>—</p>
                          )}
                        </div>
                      </div>
                    )}

                    {availabilityItems.length > 0 && (
                      <div className="pd-box pd-availability-box mt-4">
                        <h5>Disponibilidade</h5>
                        <ul id="pd-availability-list" className="list-unstyled" role="list" style={{ marginBottom: 0 }}>
                          {availabilityItems.map((text, i) => (
                            <li key={i} className="d-flex align-items-center" style={{ gap: 8 }}>
                              <i className="bi bi-check-circle-fill" aria-hidden="true" style={{ color: "var(--accent-color)" }} />
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div id="pdf-contact-info" className="pd-box" aria-hidden="true">
                      <h5>All4Esthetic — innovating beauty</h5>
                      <p><strong>Morada:</strong> Rua dos Tratores nº 506, Armazém AE, 2870-607 Alto Estanqueiro/Jardia</p>
                      <p><strong>Contactos:</strong> +351 214 095 469 | +351 936 623 907</p>
                      <p><strong>E-mail:</strong> geral@all4esthetic.com</p>
                      <p>
                        <strong>Site:</strong>{" "}
                        <a href="https://www.all4esthetic.com" target="_blank" rel="noopener noreferrer">
                          www.all4esthetic.com
                        </a>
                      </p>
                    </div>

                    <div className="pd-actions">
                      <button
                        id="btn-pdf"
                        className="pd-btn pd-btn-outline-pdf"
                        type="button"
                        aria-label="Gerar PDF do produto"
                        onClick={handlePrint}
                      >
                        Gerar PDF
                      </button>
                      <Link
                        href={`/contacto?produto=${encodeURIComponent(eq.id)}`}
                        className="pd-btn pd-btn-outline"
                        aria-label="Solicitar orçamento do produto"
                      >
                        Solicitar Orçamento
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </section>
      </main>
      <Footer />
      <div id="preloader" aria-hidden="true" />
    </>
  );
}
